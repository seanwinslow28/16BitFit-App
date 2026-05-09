# **Coding Standards**

## **Critical Fullstack Rules**

* **Type Sharing:** Use packages/shared-types exclusively.  
* **API Calls (FE):** Use apps/mobile-shell/src/services/ layer.  
* **Env Vars:** Access via config modules only.  
* **Error Handling:** Follow defined strategy.  
* **State Updates (FE):** Immutable updates only.  
* **DB Access (BE):** Use Supabase client via service/repo layer; prefer PG funcs for logic.  
* **Security Context:** No sensitive data in logs.  
* **Bridge Comm:** Use packages/bridge-interface protocol exclusively.  
* **Pixel Perfection (FE):** Adhere to UI Spec (Palettes, Fonts, Grid, Skia).

## **Naming Conventions**

| Element | Frontend (apps/mobile-shell) | Backend (apps/supabase-functions, DB) | Example |
| :---- | :---- | :---- | :---- |
| Components (React) | PascalCase | N/A | UserProfileCard.tsx |
| Hooks (React) | camelCase (usePrefix) | N/A | useFitnessData.ts |
| Service Files | camelCase | camelCase | userService.ts |
| State Stores | camelCase (useSuffix) | N/A | userStore.ts |
| Edge Functions (Dir) | kebab-case | kebab-case | avatar-generator/ |
| PG Functions | N/A | snake\_case | calculate\_epp\_from\_steps() |
| Database Tables | N/A | snake\_case (plural) | user\_profiles, workout\_logs |
| Database Columns | N/A | snake\_case | selected\_archetype, step\_count |
| Variables/Functions | camelCase | camelCase (TS), snake\_case (SQL) | getUserProfile, totalSteps |
| Types/Interfaces | PascalCase | PascalCase | UserProfile, DailySteps |
