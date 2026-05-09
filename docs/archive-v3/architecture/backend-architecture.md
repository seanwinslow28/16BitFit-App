# **Backend Architecture**

## **Service Architecture**

Hybrid logic placement: Use **Supabase Edge Functions** for API ingress, validation, orchestration, external calls. Use **PostgreSQL Functions** for data-intensive, transactional logic triggered by DB events or called by Edge Functions.

### **Serverless Architecture (Edge Functions)**

#### **Function Organization**

Organized by feature within apps/supabase-functions/.

Plaintext  
apps/supabase-functions/  
├── avatar-generator/ \# Example  
│   └── index.ts  
├── record-workout/   \# Example  
│   └── index.ts  
├── shared/  
└── deno.json

#### **Function Template**

Deno/TypeScript template handling CORS, initializing Supabase Admin client, validating requests (JWT, payload), calling PG Functions or external APIs, handling errors, and returning standard JSON responses (ApiErrorResponse on failure).

TypeScript  
// apps/supabase-functions/avatar-generator/index.ts  
import { serve } from '\[https://deno.land/std@0.177.0/http/server.ts\](https://deno.land/std@0.177.0/http/server.ts)';  
import { createClient } from '\[https://esm.sh/@supabase/supabase-js@2\](https://esm.sh/@supabase/supabase-js@2)';  
// ... env var loading ...

serve(async (req) \=\> {  
  // ... CORS handling ...  
  try {  
    // ... Init Supabase Admin Client ...  
    // ... Auth validation (extract user from JWT) ...  
    // ... Request payload validation (Zod recommended) ...

    // ... Call Runware API (AI Avatar Generation) ...  
    // ... Perform Post-processing (CLAHE, Dithering, Quantization) ...

    // ... Update DB via Supabase Admin Client ...  
    // await supabaseAdmin.from('user\_profiles')...

    // ... Return success response ...  
  } catch (error) {  
    // ... Log detailed error ...  
    // ... Return standard ApiErrorResponse ...  
  }  
});

### **PostgreSQL Functions (PL/pgSQL)**

#### **Logic Placement**

Implement core data logic (EPP calculations, stat updates) as PL/pgSQL functions within Supabase migrations (supabase/migrations/). Trigger these functions from DB events (INSERT/UPDATE on daily\_steps, workout\_logs).

#### **Example Concept**

SQL  
\-- supabase/migrations/xxxx\_create\_epp\_functions.sql

\-- Function to calculate EPP from steps (Asymptotic)  
CREATE OR REPLACE FUNCTION calculate\_epp\_from\_steps(steps INTEGER)  
RETURNS REAL AS $$  
DECLARE  
  max\_daily\_epp REAL := 100.0; \-- Configurable  
  k REAL := 0.00016; \-- Configurable  
BEGIN  
  RETURN max\_daily\_epp \* (1.0 \- exp(-k \* steps));  
END;  
$$ LANGUAGE plpgsql IMMUTABLE;

\-- Trigger Function to update profile and broadcast after step update  
CREATE OR REPLACE FUNCTION handle\_steps\_update()  
RETURNS TRIGGER AS $$  
DECLARE  
  calculated\_epp REAL;  
BEGIN  
  calculated\_epp := calculate\_epp\_from\_steps(NEW.step\_count);  
  \-- Update evolution\_progress in user\_profiles table  
  UPDATE public.user\_profiles  
  SET evolution\_progress \= evolution\_progress \+ (calculated\_epp \- COALESCE(OLD.evolution\_points\_gained, 0.0)), \-- Adjust progress based on change  
      updated\_at \= now() \-- Also update timestamp  
  WHERE id \= NEW.user\_id;

  \-- Update the calculated EPP on the daily\_steps row itself  
  NEW.evolution\_points\_gained \= calculated\_epp;

  \-- Trigger Realtime Broadcast  
  PERFORM supabase\_functions.http\_request( \-- Or use pg\_notify \+ Supabase Realtime Function Hook  
    'POST',  
    '\<SUPABASE\_URL\>/realtime/v1/broadcast',  
    '{"event": "profile\_update", "type": "broadcast", "payload": {"user\_id": "' || NEW.user\_id || '"}}', \-- Minimal payload  
    '{"Authorization": "Bearer \<SERVICE\_ROLE\_KEY\>", "Content-Type": "application/json", "apikey": "\<ANON\_KEY\>"}'  
     \-- Ideally use pg\_net extension or Supabase realtime.broadcast() if available in PG funcs  
  );

  RETURN NEW; \-- Return NEW for INSERT/UPDATE triggers  
END;  
$$ LANGUAGE plpgsql SECURITY DEFINER; \-- Use SECURITY DEFINER carefully

\-- Trigger Definition  
CREATE TRIGGER steps\_updated\_trigger  
  AFTER INSERT OR UPDATE ON public.daily\_steps  
  FOR EACH ROW  
  EXECUTE FUNCTION handle\_steps\_update();

## **Database Architecture**

### **Schema Design**

Defined previously using SQL DDL, including user\_profiles, workout\_logs, daily\_steps tables with RLS enabled.

### **Data Access Layer**

Use Supabase client library directly within service files (RN) or Edge Functions. Conceptual Repository pattern for organization. Core calculations handled by PG Functions triggered automatically.

TypeScript  
// Example: Edge function inserts raw data, triggering PG function  
// apps/supabase-functions/record-workout/index.ts  
// ... inside try block ...  
const { error: insertError } \= await supabaseAdmin  
  .from('workout\_logs')  
  .insert({  
    user\_id: user.id,  
    workout\_type: payload.type,  
    duration\_minutes: payload.duration,  
    start\_time: payload.start,  
    end\_time: payload.end,  
    // evolution\_points\_gained will be calculated by PG trigger function  
  });  
if (insertError) throw insertError;  
// PG function handles EPP calculation, profile update, and broadcast  
// ... return success ...

## **Auth Architecture**

### **Auth Flow**

Use Supabase Anonymous Sign-Ins \+ Linking Identity. React Native Shell acts as Secure Proxy for WebView actions. No tokens exposed to WebView.

Code snippet  
sequenceDiagram  
    participant User  
    participant RNShell as React Native Shell  
    participant SupabaseClient as Supabase JS Client  
    participant SupabaseAuth as Supabase Auth Service  
    participant EdgeFunction

    User-\>\>RNShell: Launch App  
    RNShell-\>\>SupabaseClient: signInAnonymously()  
    SupabaseClient-\>\>SupabaseAuth: Request Anon Session  
    SupabaseAuth--\>\>SupabaseClient: Return Anon Session  
    SupabaseClient--\>\>RNShell: Store Anon Session Securely

    %% User decides to sign up/in later  
    User-\>\>RNShell: Initiate Signup/Login  
    RNShell-\>\>SupabaseClient: updateUser() / linkIdentity()  
    SupabaseClient-\>\>SupabaseAuth: Link Identity Request  
    SupabaseAuth--\>\>SupabaseClient: Return Full Session  
    SupabaseClient--\>\>RNShell: Store Full Session Securely

    %% Authenticated Action from WebView (Secure Proxy)  
    User-\>\>Phaser(WebView): Trigger Save Action  
    Phaser(WebView)-\>\>Bridge: Send 'SAVE\_DATA' intent (Payload)  
    Bridge-\>\>RNShell: Deliver Intent  
    RNShell-\>\>RNShell: Validate Intent  
    RNShell-\>\>SupabaseClient: Retrieve Auth Token  
    SupabaseClient--\>\>RNShell: Return JWT  
    RNShell-\>\>EdgeFunction: Call Function with JWT \+ Payload  
    EdgeFunction-\>\>SupabaseAuth: Verify JWT  
    EdgeFunction-\>\>EdgeFunction: Perform Action (e.g., DB write)  
    EdgeFunction--\>\>RNShell: Return Result  
    RNShell-\>\>Bridge: Send Result back to Phaser  
    Bridge-\>\>Phaser(WebView): Deliver Result

### **Middleware/Guards**

* **React Native Shell:** Navigation guards based on Zustand auth state.  
* **Supabase Edge Functions:** Validate JWT passed in Authorization header using Supabase Admin client auth.getUser(token).
