# **Security and Performance**

## **Security Requirements**

* **Frontend:** Secure Storage (react-native-keychain), Deep Link validation, Dependency Audits, Code Obfuscation.  
* **Backend:** RLS on all tables, Input Validation (Edge Functions), API Key Mgmt (Secrets \+ Edge Functions only), Rate Limiting (TBD), CORS (Prod restrictive), Least Privilege (Service Role in functions only).  
* **Authentication:** Supabase Auth, Secure JWT Handling (RN only via Secure Proxy), Strong Passwords, Session Mgmt.  
* **Data Protection:** Strict Health Data adherence, Secure Photo handling, Encryption (at-rest, in-transit via HTTPS).  
* **Bridge/WebView:** Validate Bridge message origin/structure in RN, Harden WebView config (originWhitelist, mixedContentMode, disable debug).

## **Performance Optimization**

* **Frontend (RN Shell):** Bundle Size (Metro), Optimize Re-renders (memo, hooks), Reanimated 4 Worklets, Skia for graphics, Optimize Startup Time (\<3s).  
* **Backend (Supabase):** DB Query Optimization (Indexes), Edge/PG Function efficiency (cold starts, lean logic), Targeted Realtime subscriptions.  
* **Game Engine (Phaser/WebView):** **Local WebSocket \+ MessagePack Bridge** (\<10ms target), Object Pooling, Texture Atlasing, Progressive Asset Loading, Fixed Timestep Physics, **Quality Tier System**, Rendering Optimization, Strict Memory Management (\<150MB target), touchstart events.  
* **Reliability:** Implement **Fetch-on-Reconnect** pattern for Realtime client.
