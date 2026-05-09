# **Development Workflow**

## **Local Development Setup**

### **Prerequisites**

Node.js, yarn/npm, Nx CLI, React Native Environment (Xcode/Android Studio), Supabase CLI, Deno, Docker (for local Supabase).

Bash  
\# Example prerequisite installations (macOS with Homebrew)  
brew install node yarn nx deno supabase/tap/supabase-cli docker \# Docker Desktop separate install  
\# Follow React Native CLI Quickstart guide

### **Initial Setup**

Clone repo, install deps, link/start local Supabase, setup .env, install mobile deps, run pods.

Bash  
git clone \<repo\> && cd \<repo\>  
yarn install  
supabase link \--project-ref \<ref\>  
supabase start  
cp .env.example .env && \# EDIT .env with local keys  
cd apps/mobile-shell && yarn install && cd ../../  
cd apps/mobile-shell/ios && pod install && cd ../../..  
supabase db reset \# Apply initial migrations

### **Development Commands**

Use Nx commands from root for serving apps, testing, linting, building. Run supabase start and supabase functions serve separately or via custom Nx target.

Bash  
\# Start local Supabase (run once)  
supabase start  
\# Start local Edge Functions  
supabase functions serve \--env-file .env  
\# Start RN Metro bundler & app  
nx serve mobile-shell  
\# Run tests  
nx run-many \--target=test \--all  
\# Lint  
nx run-many \--target=lint \--all

## **Environment Configuration**

### **Required Environment Variables**

Managed via .env files (root for backend/functions, apps/mobile-shell/.env for client-safe vars). Includes Supabase URLs/keys (local vs prod), external API keys.

Bash  
\# .env.example (Root)  
SUPABASE\_URL="http://localhost:54321"  
SUPABASE\_ANON\_KEY="local-anon-key"  
SUPABASE\_SERVICE\_ROLE\_KEY="local-service-role-key"  
OPENAI\_API\_KEY="your-key" \# Actually Stable Diffusion Key  
\# ... Production keys commented out ...

\# apps/mobile-shell/.env (Example client-safe vars)  
EXPO\_PUBLIC\_SUPABASE\_URL=${SUPABASE\_URL} \# Use EXPO\_PUBLIC\_ prefix if using Expo conventions  
EXPO\_PUBLIC\_SUPABASE\_ANON\_KEY=${SUPABASE\_ANON\_KEY}
