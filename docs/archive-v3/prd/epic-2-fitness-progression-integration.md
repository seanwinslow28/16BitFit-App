# Epic 2: Fitness Progression Integration

**Epic Goal:** Implement the visual evolution of the user's personalized Home Avatar from Stage 1 to Stage 2 based on accumulated fitness activity (steps, manual workouts). Link this fitness progression to tangible increases in the selected Champion's statistics (HP, damage). Display updated fitness and character stats on the Home Screen and add basic reactive animations to the Home Avatar following the "Celebration Without Punishment" philosophy.

**Integration Requirements:** Requires reading synced fitness data (steps) from user state/profile, accessing workout logs, updating user profile with evolution stage and champion stats, and potentially calling the AI service again if the user opts for a new photo at Stage 2. Builds directly on the Home Screen and Champion systems established in Epic 1.

## Story 2.1: Implement Fitness-to-Evolution Progress Calculation
**As a** Developer,
**I want** to implement the logic that converts synced steps and manually logged workouts into a quantifiable "Evolution Progress" metric for the Home Avatar,
**so that** fitness activity directly drives character progression.

### Acceptance Criteria
1.  A defined algorithm converts daily steps (from Story 1.3) into evolution progress points.
2.  A defined algorithm converts manually logged workouts (from FR8) into evolution progress points (potentially weighted by type/duration).
3.  Evolution progress points accumulate over time and are stored persistently (e.g., in Supabase profile).
4.  A specific progress point threshold is defined for triggering the evolution from Stage 1 to Stage 2.
5.  The calculation handles historical data correctly (e.g., progress accumulates even if the app isn't opened daily).

## Story 2.2: Implement Home Avatar Visual Evolution (Stage 1 to 2)
**As a** User,
**I want** my personalized Home Avatar's appearance to automatically change from the Stage 1 body to the Stage 2 body when I reach the required fitness progress threshold, with an option to update my photo,
**so that** I can visually see my fitness achievements reflected in my character.

### Acceptance Criteria
1.  When the user's Evolution Progress (from Story 2.1) crosses the Stage 2 threshold, the system flags the user for evolution.
2.  Upon next app launch or relevant event, the user is presented with a celebratory **Evolution Ceremony** (Pokemon Red/Blue-style animation with blinking old→new sprite sequence).
3.  User is given the option to upload a new headshot photo for Stage 2 integration (FR11). If chosen, the AI generation process (from Story 1.5) is triggered using the Stage 2 archetype body image.
4.  If the user declines a new photo or if generation fails, the existing face is merged with the Stage 2 archetype body image.
5.  The user's profile is updated with the new Stage 2 avatar image URL and evolution stage status.
6.  The Home Screen subsequently displays the new Stage 2 Home Avatar.
7.  Evolution Ceremony includes "Tap to skip" option and respects Reduce Motion accessibility setting.

## Story 2.3: Implement Stat Scaling for Champions
**As a** Developer,
**I want** to implement logic that increases the base stats (e.g., HP, base damage) of all Champions based on the user's Home Avatar evolution stage (Stage 1 vs. Stage 2),
**so that** fitness progression provides a tangible benefit in combat.

### Acceptance Criteria
1.  Base stats (HP, damage multipliers, etc.) are defined for Champions at Stage 1.
2.  Increased base stats or stat modifiers are defined for Champions upon reaching Stage 2 evolution.
3.  The system correctly calculates the Champion's current effective stats based on the user's current Home Avatar evolution stage.
4.  These calculated stats are stored persistently or derived dynamically when needed for combat.
5.  The stat scaling provides a noticeable but balanced advantage in combat (balancing TBD).
6.  **Note:** All 6 Champions share identical stats—Champions are purely cosmetic (Mario Party model). Stat scaling from evolution applies equally to all Champions.

## Story 2.4: Update Home Screen with Live Stats
**As a** User,
**I want** the Home Screen shell area to display my actual current fitness stats (Steps, Calories - **if calculated**, Workout Duration - **if tracked**) and the Profile Tab to show my selected Champion's current, scaled stats,
**so that** I have an up-to-date overview of my progress.

### Acceptance Criteria
1.  The Home Screen shell area correctly fetches and displays the user's current daily step count synced from HealthKit/Connect (Story 1.3).
2.  The Home Screen shell area displays workout duration (based on manual logs from FR8 or potentially synced data if available).
3.  The Home Screen shell area displays an estimated calorie burn based on synced/logged activity. Calculation derives from steps (using standard MET formula) and logged workout duration/type.
4.  The Profile Tab displays the selected Champion's stats (HP, etc.) reflecting the current scaling based on evolution stage (Story 2.3).
5.  The displayed stats update appropriately when new fitness data is synced or when evolution occurs.

## Story 2.5: Implement Reactive Home Avatar Animations & Momentum System
**As a** User,
**I want** my Home Avatar on the Home Screen to show simple positive animations when I've been active recently and neutral/resting animations during rest periods,
**so that** I get immediate, ambient feedback celebrating my fitness achievements without guilt or shame for rest days.

### Acceptance Criteria

#### Animation States (Celebration Without Punishment)
1.  Criteria for "recently active" (e.g., met step goal yesterday, logged workout today) and "resting" (e.g., rest day logged, recovery period) are defined. **Inactivity is framed as "resting" rather than "failing."**
2.  Simple, distinct positive animation(s) (e.g., subtle smile, sparkle effect, energetic idle variation) are created for the Home Avatar.
3.  Simple, distinct **neutral/resting animation(s)** (e.g., idle blink, gentle breathing, peaceful stance) are created for the Home Avatar to display during rest periods. **No negative, sad, disappointed, or guilt-inducing animations shall be implemented.** The avatar never expresses disappointment in the user.
4.  The Home Screen logic checks the user's recent activity status against the defined criteria.
5.  The corresponding positive or neutral animation plays periodically or on app load based on the user's status.
6.  A neutral/default state animation (e.g., idle blink) exists and is the baseline—never a "disappointed" state.

#### Graceful Momentum Decay (FR20)
7.  The system implements a **graceful momentum decay** system rather than binary streak breaks.
8.  A 100-day momentum shall NOT reset to zero from one missed day—instead decay by a defined percentage (e.g., 5% per missed day).
9.  Recovery mechanics allow users to restore decayed momentum (e.g., 2 active days restore 50% of decay).

#### Rest Day Support (FR21)
10. The system supports explicit **Rest Day logging** that maintains momentum.
11. Logging a rest day applies NO decay to momentum.
12. Rest days are recognized as part of fitness (recovery bonuses may apply).
13. No punishment for planned rest, illness, or injury.

#### Celebration-Only Feedback (FR22)
14. All reactive feedback (avatar animations, notifications, UI messaging) follows a **"celebration only" pattern**.
15. Positive reinforcement for activity without negative feedback for inactivity.
16. No guilt messaging, shame mechanics, or anxiety-inducing notifications.

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-23 | 1.0 | Initial Epic 2 definition | John (PM) |
| 2025-12-31 | 1.1 | **Party Mode Updates:** (1) Replaced "Combat Character" with "Champion" throughout; (2) Story 2.3 updated to note Champions are cosmetic-only with shared stats; (3) Story 2.5 completely rewritten to align with "Celebration Without Punishment" philosophy—removed all negative animation references, added graceful momentum decay (FR20), rest day support (FR21), and celebration-only feedback (FR22); (4) Story 2.2 updated with Evolution Ceremony details | John (PM) |
