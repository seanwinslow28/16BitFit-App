# Goals and Background Context

**Version:** 1.0 (Party Mode Aligned)
**Last Updated:** 2026-01-02

---

## Goals

* Achieve **8,000 downloads** within the first month post-launch.  
* Establish an initial daily revenue stream of **$30/day** within the first month post-launch.  
* Validate the **SBFG category concept** by achieving a **Day-30 retention rate of 25%**.  
* Secure an average **4.5+ star rating** on app stores within 3 months post-launch.  
* Successfully demonstrate the core SBFG loop: Fitness Activity -> Data Sync -> Avatar Evolution + Stat Increase -> Skill-Based Combat -> Feedback.  
* Meet technical performance targets: **60fps combat** (90% consistency), **<50ms input latency**, **<150MB peak memory**.

## Background Context

16BitFit-V3 pioneers the **SBFG (Strength-Based Fighting Game)** category, addressing a gap where existing fitness apps lack deep, skill-based engagement and mobile fighting games lack real-world health integration. It targets the "Skill-Focused Fitness Gamer" by transforming validated fitness data (steps, workouts via HealthKit/Health Connect) into core power mechanics for an authentic, retro (Street Fighter 2 inspired) mobile fighting game. The core problem is the high churn in fitness apps (>70% in 3 months) due to superficial gamification and the sedentary nature of engaging mobile games.

16BitFit-V3 proposes a unique solution: a hybrid React Native (shell) + Phaser 3 (WebView combat engine) architecture using the high-performance "Hybrid Velocity Bridge". Key differentiators include the dual progression system (fitness-driven visual avatar evolution + skill-based combat rank), authentic 60fps fighting mechanics powered by real fitness, AI-driven personalization (avatar face integration via Runware), and a distinct retro aesthetic. 

The MVP focuses on establishing this core loop with **6 playable Champions** (cosmetic-only, Mario Party model) vs. 1 AI boss (Training Dummy), basic fitness sync, and avatar evolution (Stages 1-2). Champions are selected in Battle Mode via an SF2-style 2×3 grid—user's fitness activity powers ALL champions equally.

### Party Mode Design Philosophy (2025-12-29)

The product follows a **"Celebration Without Punishment"** philosophy:
- **No-Defeat Philosophy:** Battles result in "victory" or "continue_training" (never defeat/loss)
- **Graceful Momentum Decay:** Activity streaks decay gradually (5%/day) rather than resetting to zero
- **Rest Day Support:** Planned rest is recognized as part of fitness (no momentum penalty)
- **Positive Feedback Only:** Avatar animations are positive (active) or neutral (resting)—never disappointed

## Change Log

| Date       | Version | Description                                | Author    |  
| :--------- | :------ | :----------------------------------------- | :-------- |  
| 2025-10-23 | 0.1     | Initial PRD draft started                  | John (PM) |  
| 2025-10-23 | 0.2     | Updated FR/NFR based on UI Prototypes      | John (PM) |  
| 2025-10-23 | 0.3     | Aligned PRD with front-end-spec.md details | John (PM) |
| 2026-01-02 | 1.0     | **Party Mode Alignment:** Updated MVP description from "2 playable characters" to "6 playable Champions (cosmetic-only)". Added Party Mode Design Philosophy section covering No-Defeat Philosophy, graceful momentum decay, rest day support, and positive feedback patterns. Updated AI reference to Runware. | John (PM) |

---
