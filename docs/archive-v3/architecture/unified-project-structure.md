# **Unified Project Structure**

Monorepo structure managed by Nx, separating apps (mobile-shell, game-engine, supabase-functions) and packages (shared-types, bridge-interface, ui-components). Database migrations and PG functions reside in supabase/migrations/.

Plaintext  
16bitfit-v3-mono/  
├── apps/  
│   ├── mobile-shell/      \# React Native  
│   ├── game-engine/       \# Phaser config/build  
│   └── supabase-functions/\# Edge Functions  
├── packages/  
│   ├── shared-types/      \# TS Interfaces  
│   ├── bridge-interface/  \# Bridge Protocol Defs  
│   └── ui-components/     \# RN UI Components  
├── supabase/  
│   ├── migrations/        \# DB Schema & PG Functions  
│   └── config.toml        \# Supabase local config  
├── docs/                  \# Documentation  
├── tools/                 \# Scripts  
├── nx.json                \# Nx Config  
├── package.json           \# Root Deps  
├── tsconfig.base.json     \# Base TS Config  
└── README.md
