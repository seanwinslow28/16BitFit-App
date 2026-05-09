# **Deployment Architecture**

## **Deployment Strategy**

* **Frontend (Mobile Shell):** Native app bundles (.ipa, .aab) built via CI/CD (e.g., EAS Build, Codemagic) and distributed via App Store / Google Play.  
* **Backend (Supabase):** DB migrations applied via Supabase CLI (db push). Edge Functions deployed via Supabase CLI (functions deploy). PostgreSQL Functions deployed as part of migrations.

## **CI/CD Pipeline**

Conceptual GitHub Actions workflow: Trigger on main push/PR. Jobs for linting, testing (RN, Edge, PG via pgTAP), deploying backend (migrations, functions), and building/deploying mobile app (using service like EAS Build). Secrets management crucial.

YAML  
\# .github/workflows/ci-deploy.yaml (Conceptual)  
name: CI & Deploy  
on: \[push, pull\_request\] \# Simplified triggers

jobs:  
  test\_lint: \# Lints and runs tests across monorepo  
    \# ... steps for checkout, node setup, install, lint, test (RN, Edge, PG) ...  
  deploy\_backend: \# Deploys DB migrations, PG funcs, Edge funcs  
    needs: test\_lint  
    if: github.ref \== 'refs/heads/main'  
    \# ... steps for checkout, Supabase CLI setup, db push, functions deploy ...  
  deploy\_mobile: \# Builds and deploys mobile apps (e.g., via EAS)  
    needs: deploy\_backend  
    if: github.ref \== 'refs/heads/main'  
    \# ... steps for checkout, node setup, mobile build service setup (EAS), build, submit ...

## **Environments**

| Environment | Frontend URL | Backend URL (Supabase Project) | Purpose |
| :---- | :---- | :---- | :---- |
| Development | Local Emulator/Device | Local Supabase (localhost:54321) | Local development & testing |
| Staging | Internal Distribution (TF/GPlay Beta) | Staging Supabase Project | Pre-production testing, QA |
| Production | App Store / Google Play | Production Supabase Project | Live environment |
