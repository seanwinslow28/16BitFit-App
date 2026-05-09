# Technical Assumptions

**Version:** 1.1 (Party Mode Aligned)
**Last Updated:** 2026-01-02

---

* **Repository Structure:** Monorepo likely favored based on V2 experience, potentially using Nx or Turborepo (Decision to be finalized by Architect).  
* **Service Architecture:** Hybrid - React Native shell + Phaser 3 WebView + Supabase BaaS. Potential for serverless functions (Supabase Edge Functions) for specific backend logic.  
* **Frontend (Shell):** React Native (latest stable version compatible with dependencies, e.g., 0.71.8+). Styling via NativeWind/StyleSheet. Will utilize **Reanimated 4** for animations and potentially **react-native-skia** for custom pixel rendering/effects. Requires specific pixel fonts ("Press Start 2P", etc.).  
* **Game Engine (WebView):** Phaser 3 (latest stable compatible version, e.g., 3.70.0+) running within a dedicated WebView.  
* **Backend:** Supabase (PostgreSQL + Real-time + Edge Functions).  
* **Asset Generation (AI):** 
  - **Home Avatar:** Runware API using "Smooth-to-Pixel" architecture (DreamShaper XL Lightning + ControlNet + IP-Adapter) with server-side CLAHE + Bayer dithering for DMG compliance.
  - **Combat/Boss Sprites:** Gemini API (Image Gen/Edit) + potentially Veo/Midjourney keyframes.
* **Platform Targets:** iOS (iPhone 12+) and Android (10+).  
* **Core Integration:** High-performance "Hybrid Velocity Bridge" (binary protocol via MessagePack, <50ms latency target) between React Native and Phaser WebView is a critical requirement and assumed feasible based on V2.  
* **Fitness Data Integration:** Apple HealthKit and Google Fit (via Health Connect API) are the required sources for fitness data.  
* **Testing Requirements:** Standard mobile app testing practices. Specific focus on performance testing (FPS, latency, memory) for combat and integration testing for the RN-WebView bridge and fitness data sync. Automated testing frameworks appropriate for React Native (using specified testing libraries) and potentially Phaser to be determined by Architect.

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-23 | 1.0 | Initial technical assumptions | Winston (Architect) |
| 2026-01-02 | 1.1 | **Party Mode Alignment:** Updated Asset Generation section—replaced "DALL-E 3 for Home Avatar face integration" with Runware API reference (Smooth-to-Pixel architecture). Added MessagePack reference for Hybrid Velocity Bridge. | Winston (Architect) |
