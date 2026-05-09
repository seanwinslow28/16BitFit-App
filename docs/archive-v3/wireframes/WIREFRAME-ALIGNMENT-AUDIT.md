# Wireframe Alignment Audit Report

**Audit Date:** 2025-12-31 (Updated 2026-01-05)
**Auditor:** Sally (UX Designer), BMad Master (2026-01-05 verification)
**Reference Decisions:** Party Mode Session (2025-12-29), Deep Think Updates (2025-12-31), FTUE Video Update (2026-01-05)
**Implementation Status:** ✅ **COMPLETE** (2026-01-05)

---

## Implementation Summary

> **All wireframes have been aligned with Party Mode decisions.**

| Status | Count | Percentage | Notes |
|--------|-------|------------|-------|
| ✅ Aligned | 19 | 86% | Updated during 2025-12-31, 2026-01-02, 2026-01-05 sessions |
| ✅ NEW | 2 | 9% | avatar-boot-sequence-screen.md, avatar-draft-pick-screen.md |
| 🚫 DEPRECATED (Archived) | 3 | ~5% | Including avatar-generation-result-screen.md |
| ⚠️ Needs Update | 0 | 0% | All updates completed |
| **Total** | **22** | 100% | Includes new Story 1.5 wireframes |

### Actions Completed (2025-12-31)

1. **Deprecated Screens Archived:**
   - `combat-character-selection-screen-enhanced.md` → `/docs/archive/deprecated-wireframes/`
   - `victory-ceremony-screen.md` → `/docs/archive/deprecated-wireframes/`

2. **Major Rewrites:**
   - `user-flow-diagram.md` → v3.0 (Party Mode aligned)
   - `cartridge-load-transition.md` → v3.1 (usage restriction banner)
   - `home-dashboard-screen-enhanced.md` → v2.1 (post-battle states)

3. **Renamed and Updated:**
   - `tutorial-quest-assignment-screen.md` → `tutorial-workout-assignment-screen.md` (v3.0)
   - `daily-quest-assignment-screen.md` → `daily-workout-assignment-screen.md` (v3.0)
   - `quest-selection-screen.md` → `training-selection-screen.md` (v3.0)

4. **Terminology Updates:**
   - `workout-tracker-screen.md` → v3.0
   - `workout-complete-ceremony-screen.md` → v3.0
   - `battle-screen-hud-controls.md` → v3.0
   - `settings-screen.md` → Quest→Workout references updated

### Actions Completed (2026-01-02)

5. **Tutorial Battle Screen Party Mode Alignment:**
   - `tutorial-battle-screen.md` → v3.0 (Party Mode aligned)

### Actions Completed (2026-01-05 - Morning Session)

6. **Story 1.5 Avatar Generation UX Redesign:**
   - DEPRECATED: `avatar-generation-result-screen.md` (single-screen was insufficient)
   - NEW: `avatar-boot-sequence-screen.md` (4-phase loading experience)
   - NEW: `avatar-draft-pick-screen.md` (two-variant selection)
   - Created: `docs/design-system/magicpath-prompts-story-1.5.md` (9 MagicPath.ai prompts)
   - Updated: `WIREFRAME-ALIGNMENT-AUDIT.md` (this document)

7. **UX Validation Audit:**
   - Validated `photo-upload-screen.md` - PASS
   - Validated `avatar-generation-result-screen.md` - GAPS FOUND → Replaced
   - Validated `home-dashboard-screen-enhanced.md` - PASS
   - Created: `docs/ux-validation-report-stories-1.5-1.6.md`

8. **Tutorial Battle Screen Party Mode Alignment:**
   - `tutorial-battle-screen.md` → v3.0 (Party Mode aligned)
     - Added Party Mode alignment section
     - Default champion (Sean) for tutorial - no selection in FTUE
     - GUARANTEED VICTORY emphasized
     - Victory Ceremony DEPRECATED → avatar pose on Home Dashboard
     - Updated navigation flow (Battle Mode Transition Video)
     - Updated FTUE position (Screen 6 of 8)

### Actions Completed (2026-01-05 - FTUE Video Update Verification)

9. **FTUE Video Update Alignment:**
   - `user-flow-diagram.md` → v3.2 (FTUE Video Update aligned)
     - Screen 4 changed from "Simulated Workout" to "FTUE Workout Video (8-12s)"
     - Passive video clip replaces interactive workout tracker
     - Video bundled in app (offline-capable)
     - Skip button after 2 seconds
   - `tutorial-workout-assignment-screen.md` → v3.1 (FTUE Video Update aligned)
     - Navigation updated to FTUEWorkoutVideo screen
     - Notes that video is passive, not interactive
   - `workout-tracker-screen.md` → v3.1 (FTUE Video Update aligned)
     - Added FTUE Video Update section clarifying this screen is NOT used in FTUE
     - Updated FTUE Position to "N/A - FTUE uses passive video"
   - `workout-complete-ceremony-screen.md` → v3.1 (FTUE Video Update aligned)
     - Added FTUE Video Update section clarifying this screen is NOT used in FTUE
     - FTUE Version state marked as DEPRECATED
     - Updated navigation to reflect FTUE skips this screen

### Key Changes Applied

1. **Terminology**: "Quest" → "Training/Workout", "Fighter" → "Champion"
2. **Character Model**: 6-Champion SF2 grid in Battle Mode (post-FTUE)
3. **Momentum System**: Graceful decay (5%/day) replaces binary streak
4. **No-Defeat Philosophy**: "continue_training" replaces "defeat/loss"
5. **Transition Architecture**: Cartridge Load for workouts only, Battle Mode Transition Video for battles
6. **FTUE Video Update (2026-01-05)**: Simulated Workout → FTUE Workout Video (8-12s passive clip)

---

## Original Audit (Reference)

### Key Alignment Issues Identified (NOW RESOLVED)

1. ~~**Terminology**: 8 wireframes still use "Quest" instead of "Training/Workout"~~ ✅ FIXED
2. ~~**Character Model**: 3 wireframes reference old "Sean/Mary only" model~~ ✅ FIXED
3. ~~**Streak vs Momentum**: 2 wireframes use "Streak" instead of "Momentum"~~ ✅ FIXED
4. ~~**Transition Architecture**: 2 wireframes have incorrect transition specifications~~ ✅ FIXED
5. ~~**FTUE Flow**: User flow diagram needs major rewrite~~ ✅ FIXED

---

## Priority Classification

### 🔴 CRITICAL (Deprecated Screens)
Must mark with deprecation notice immediately:
- `combat-character-selection-screen-enhanced.md`
- `victory-ceremony-screen.md`

### 🟠 HIGH (User Flow + New Screens)
Major structural changes required:
- `user-flow-diagram.md` - Complete rewrite needed
- `champion-select-screen.md` - Minor terminology updates
- `battle-mode-menu.md` - Minor updates

### 🟡 MEDIUM (Terminology Updates)
Update "Quest" → "Training/Workout" and other terms:
- `tutorial-quest-assignment-screen.md`
- `daily-quest-assignment-screen.md`
- `quest-selection-screen.md`
- `workout-tracker-screen.md`
- `workout-complete-ceremony-screen.md`
- `home-dashboard-screen-enhanced.md`

### 🟢 LOWER (Minor Updates)
Settings, Profile, Stats screens:
- `settings-screen.md`
- `profile-avatar-screen.md`
- `stats-panel-overlay.md`
- `stats-panel-screen.md`

---

## Detailed Audit by Wireframe

---

## 1. user-flow-diagram.md

**File:** `docs/wireframes/user-flow-diagram.md`
**Status:** ⚠️ Needs Update (HIGH PRIORITY)
**Last Updated:** 2025-12-05 (OUTDATED)

### Issues Found:

1. **FTUE Phase 1 Flow Incorrect** - Shows "Combat Character Selection" as Screen 3 in onboarding
   - Party Mode Decision: Champion selection happens in Battle Mode (Phaser), NOT during onboarding

2. **Only 2 Characters Referenced** - Flow shows "[Sean] or [Mary]"
   - Should reference 6-Champion SF2 grid in Battle Mode

3. **"CHOOSE YOUR FIGHTER" Terminology** - Uses old "Fighter" term
   - Should be "CHOOSE YOUR CHAMPION"

4. **"Quest" Terminology Throughout** - Uses "Tutorial Quest", "Daily Quest"
   - Should be "Training" (mode) or "Workout" (action)

5. **Cartridge Load Animation Misuse** - Shows during FTUE simulated workout
   - Party Mode Decision: Simple fade for FTUE, Cartridge Load ONLY for post-onboarding workout entry

6. **Victory Ceremony in Flow** - Shows standalone Victory Ceremony screen
   - DEPRECATED: Victory ceremony merged into Home Dashboard avatar reactions

7. **Missing Battle Mode Transition Video** - Not shown in flow
   - Party Mode Decision: Battle Mode Transition Video plays when entering/exiting Battle Mode

### Required Changes:

- [ ] Remove "Combat Character Selection" from FTUE Phase 1 flow
- [ ] Update Phase 1 to: Welcome → Archetype Selection → Tutorial Training Assignment → Simulated Workout (fade) → Tutorial Battle vs Training Dummy → Home Dashboard
- [ ] Add note: Champion selection happens in Battle Mode (post-FTUE)
- [ ] Replace all "Quest" → "Training" or "Workout" appropriately
- [ ] Replace "Fighter" → "Champion"
- [ ] Add Battle Mode Transition Video to flow (for entering Battle Mode)
- [ ] Remove standalone Victory Ceremony from flow
- [ ] Add note about avatar reactions on Home Dashboard post-battle
- [ ] Update timing estimates
- [ ] Update version to 3.0

---

## 2. combat-character-selection-screen-enhanced.md

**File:** `docs/wireframes/combat-character-selection-screen-enhanced.md`
**Status:** 🚫 DEPRECATED

### Deprecation Notice:

> ⚠️ **DEPRECATED (Party Mode 2025-12-29)**
>
> This screen has been deprecated and replaced by the **Champion Select Screen** in Phaser Battle Mode.
>
> **Key Changes:**
> - Champion selection moved from onboarding to Battle Mode (landscape, Phaser)
> - Expanded from 2 characters (Sean/Mary) to 6 champions in SF2-style 2×3 grid
> - All champions are purely cosmetic (Mario Party model) - no stat differences
> - Terminology changed from "Combat Character" / "Fighter" to "Champion"
>
> **Replacement:** See [champion-select-screen.md](./champion-select-screen.md)
>
> **Do not implement this screen.** This document is retained for historical reference only.

### Issues Found:

1. Only 2 characters (Sean/Mary) - should be 6 champions
2. Characters have stat differences - should be purely cosmetic
3. Shows in onboarding flow - should be in Battle Mode
4. Portrait orientation - should be landscape (Phaser)
5. Uses "Fighter" terminology - should be "Champion"
6. Shows character stats (STR, SPD, END) - should have NO stat differences

### Required Changes:

- [ ] Add deprecation notice banner at top of document
- [ ] Update status to "⛔ DEPRECATED"
- [ ] Add pointer to `champion-select-screen.md` as replacement
- [ ] Archive but do not delete (historical reference)

---

## 3. victory-ceremony-screen.md

**File:** `docs/wireframes/victory-ceremony-screen.md`
**Status:** ✅ Already Marked DEPRECATED

### Deprecation Notice (Already Present):

The file already contains a proper deprecation notice dated 2025-12-29.

### Issues Found:

1. None - deprecation notice is complete and accurate

### Required Changes:

- [ ] No changes needed - already properly deprecated

---

## 4. champion-select-screen.md

**File:** `docs/wireframes/champion-select-screen.md`
**Status:** ⚠️ Needs Update (Minor)
**Last Updated:** 2025-12-29

### Issues Found:

1. **Champion Taglines Need Update** - Current taglines focus on fighting style
   - Should emphasize cosmetic/identity nature

2. **"Powered by YOUR workouts!" Present** - Good, but could be more prominent

### Required Changes:

- [ ] Update champion taglines to emphasize identity over fighting style
- [ ] Consider adding "All champions have identical abilities" note in preview panel
- [ ] Update spec version to 1.1

---

## 5. battle-mode-menu.md

**File:** `docs/wireframes/battle-mode-menu.md`
**Status:** ⚠️ Needs Update (Minor)
**Last Updated:** 2025-12-29

### Issues Found:

1. **Player Stats Display** - Shows HP, ATK, DEF, SPD
   - These are correct BUT need clarification that they come from user's fitness, not champion choice

2. **Missing "Continue Training" State** - No mention of non-victory outcome handling
   - Should reference that battles result in "victory" or "continue_training"

### Required Changes:

- [ ] Add note that player stats are derived from fitness activity, not champion
- [ ] Add state variation for "Continue Training" outcome
- [ ] Add avatar reaction states (victory pose vs determined pose)
- [ ] Update spec version to 1.1

---

## 6. home-dashboard-screen-enhanced.md

**File:** `docs/wireframes/home-dashboard-screen-enhanced.md`
**Status:** ⚠️ Needs Update (Medium)
**Last Updated:** 2025-12-05 (OUTDATED)

### Issues Found:

1. **Missing Post-Battle Avatar Reactions** - No mention of avatar poses after battle
   - Party Mode Decision: Avatar shows victory pose OR determined pose based on outcome

2. **Missing Evolution Overlay Integration** - Doesn't mention evolution ceremony as overlay
   - Should specify that Evolution Ceremony triggers as overlay on Home Dashboard

3. **"Quest Cartridge" Terminology** - Uses "Quest" throughout
   - Should be "Training Cartridge" or "Workout Cartridge"

4. **Momentum System Present** - Good! Already uses graceful decay model
   - Minor: Ensure "MOMENTUM" label is consistent everywhere

### Required Changes:

- [ ] Add "Post-Battle Avatar States" section with victory pose and determined pose
- [ ] Add "Evolution Overlay Integration" section describing Pokemon-style animation
- [ ] Replace "Quest Cartridge" → "Training Cartridge" or "Workout Cartridge"
- [ ] Replace "Daily Quest Ready!" → "Daily Workout Ready!" or "Training Ready!"
- [ ] Replace "Change Quest" → "Change Workout" or "Change Training"
- [ ] Add reference to `evolution-ceremony-screen.md` for overlay behavior
- [ ] Update version to 2.1

---

## 7. evolution-ceremony-screen.md

**File:** `docs/wireframes/evolution-ceremony-screen.md`
**Status:** ⚠️ Needs Update (Minor)
**Last Updated:** 2025-12-29

### Issues Found:

1. **Good Alignment** - Already describes Pokemon-style blinking animation
2. **"Tap to skip" Present** - Good
3. **Reduce Motion Support** - Crossfade mentioned, good
4. **Overlay Behavior** - Need to verify it specifies Home Dashboard as base

### Required Changes:

- [ ] Verify document specifies evolution triggers as overlay on Home Dashboard
- [ ] Confirm "Reduce Motion" crossfade is clearly documented
- [ ] Update version if any changes made

---

## 8. cartridge-load-transition.md

**File:** `docs/wireframes/cartridge-load-transition.md`
**Status:** ⚠️ Needs Update (High)

### Issues Found:

1. **Usage Scope Unclear** - May not clearly state "workout-only" restriction
   - Party Mode Decision: Cartridge Load Animation is for post-onboarding WORKOUT entry ONLY
   - FTUE simulated workout uses simple fade
   - Battle Mode uses separate Transition Video

### Required Changes:

- [ ] Add clear "USAGE RESTRICTION" section stating this is for workout entry only
- [ ] Add note: "NOT for FTUE simulated workout (use simple fade)"
- [ ] Add note: "NOT for Battle Mode entry (use Battle Mode Transition Video)"
- [ ] Reference transition architecture table from CLAUDE.md
- [ ] Update version

---

## 9. tutorial-quest-assignment-screen.md

**File:** `docs/wireframes/tutorial-quest-assignment-screen.md`
**Status:** ⚠️ Needs Update (Medium)

### Issues Found:

1. **"Quest" in Title and Throughout** - Should be "Training" or "Workout"
2. **May Reference Character Selection** - Check for references to Sean/Mary

### Required Changes:

- [ ] Rename to `tutorial-training-assignment-screen.md` (or workout)
- [ ] Replace all "Quest" → "Training" or "Workout"
- [ ] Replace "Quest Assignment" → "Training Assignment" or "Workout Assignment"
- [ ] Update file header
- [ ] Remove any references to character selection (happens in Battle Mode)

---

## 10. daily-quest-assignment-screen.md

**File:** `docs/wireframes/daily-quest-assignment-screen.md`
**Status:** ⚠️ Needs Update (Medium)

### Issues Found:

1. **"Quest" Terminology** - Throughout document
2. **Should Use "Workout" or "Training"** - Per Party Mode terminology

### Required Changes:

- [ ] Rename to `daily-training-assignment-screen.md` or `daily-workout-screen.md`
- [ ] Replace all "Quest" → "Training" or "Workout"
- [ ] Replace "Daily Quest" → "Daily Training" or "Daily Workout"
- [ ] Update header and references

---

## 11. quest-selection-screen.md

**File:** `docs/wireframes/quest-selection-screen.md`
**Status:** ⚠️ Needs Update (Medium)

### Issues Found:

1. **Filename Uses "Quest"** - Should be "Training" or "Workout"
2. **Content Likely Uses "Quest" Throughout**

### Required Changes:

- [ ] Rename to `training-selection-screen.md` or `workout-selection-screen.md`
- [ ] Replace all "Quest" → "Training" or "Workout"
- [ ] Update all internal references
- [ ] Update any cross-references in other documents

---

## 12. workout-tracker-screen.md

**File:** `docs/wireframes/workout-tracker-screen.md`
**Status:** ⚠️ Needs Update (Minor)

### Issues Found:

1. **Filename is Good** - Uses "Workout"
2. **Check Internal Content** - May still reference "Quest" internally

### Required Changes:

- [ ] Audit for any "Quest" references and replace with "Training" or "Workout"
- [ ] Verify terminology consistency

---

## 13. workout-complete-ceremony-screen.md

**File:** `docs/wireframes/workout-complete-ceremony-screen.md`
**Status:** ⚠️ Needs Update (Minor)

### Issues Found:

1. **Check for "Quest" References** - May still use old terminology
2. **Verify No Defeat/Loss States** - Should only show positive outcomes

### Required Changes:

- [ ] Replace any "Quest" references
- [ ] Ensure only positive messaging (no defeat states)
- [ ] Verify alignment with no-defeat philosophy

---

## 14. tutorial-battle-screen.md

**File:** `docs/wireframes/tutorial-battle-screen.md`
**Status:** ✅ **ALIGNED** (Updated 2026-01-02, v3.0)

### Updates Applied (2026-01-02):

1. ✅ **Default Champion (Sean)** - Tutorial uses Sean automatically, no selection
2. ✅ **GUARANTEED VICTORY** - Clearly documented, dummy has 3HP (easy defeat)
3. ✅ **No-Defeat Philosophy** - Tutorial always ends in victory
4. ✅ **Victory Ceremony DEPRECATED** - Results applied silently, avatar shows victory pose on Home
5. ✅ **Battle Mode Transition Video** - Entry/exit via video, not Cartridge Load
6. ✅ **FTUE Position** - Updated to Screen 6 of 8 (was Screen 6 of 9)
7. ✅ **Navigation Updated** - Exit goes to Home Dashboard directly

### Issues Found (RESOLVED):

- ~~"Fighter" Terminology~~ ✅ Updated to "Champion"
- ~~Guaranteed Victory~~ ✅ Documented prominently
- ~~No-Defeat Philosophy~~ ✅ Aligned with Party Mode

### Required Changes:

- [x] Replace any "Fighter" → "Champion"
- [x] Verify guaranteed victory is documented
- [x] Ensure no defeat/loss messaging exists
- [x] Update navigation (Victory Ceremony → Home Dashboard)
- [x] Add Party Mode alignment section

---

## 15. battle-screen-hud-controls.md

**File:** `docs/wireframes/battle-screen-hud-controls.md`
**Status:** ⚠️ Needs Update (Minor)

### Issues Found:

1. **Battle Outcome States** - Check for defeat/loss terminology
2. **Should Only Have Victory or Continue Training**

### Required Changes:

- [ ] Replace any "defeat" / "loss" references with "continue_training"
- [ ] Update outcome messaging per no-defeat philosophy
- [ ] Add determined pose reference for continue_training state

---

## 16. photo-upload-screen.md

**File:** `docs/wireframes/photo-upload-screen.md`
**Status:** ✅ Aligned

### Issues Found:

1. None identified - avatar generation flow is separate from Party Mode changes

### Required Changes:

- [ ] No changes needed

---

## 17. avatar-generation-result-screen.md

**File:** `docs/wireframes/avatar-generation-result-screen.md`
**Status:** 🚫 DEPRECATED (Replaced 2026-01-05)

### Deprecation Notice:

> ⚠️ **DEPRECATED (UX Validation Audit 2026-01-05)**
>
> This single-screen wireframe has been **replaced by a two-phase UX flow**:
>
> **Replacement Screens:**
> 1. **[avatar-boot-sequence-screen.md](./avatar-boot-sequence-screen.md)** - 4-phase loading experience
> 2. **[avatar-draft-pick-screen.md](./avatar-draft-pick-screen.md)** - Two-variant selection
>
> **Reason:** The original wireframe described a simple single-avatar result, but `animations-consolidated.md` v2.1 specifies a richer UX with Boot Sequence (Initializing → Scanning → Quantizing → Reveal) and Draft Pick (Accuracy vs Retro variant selection).
>
> **Do not implement this screen.** Use the two replacement wireframes instead.

### Required Changes:

- [x] Deprecate and replace with Boot Sequence + Draft Pick (2026-01-05)

---

## 17a. avatar-boot-sequence-screen.md (NEW)

**File:** `docs/wireframes/avatar-boot-sequence-screen.md`
**Status:** ✅ NEW - Spec Complete
**Created:** 2026-01-05

### Description:

4-phase loading experience during avatar generation:
- Phase 1: Initializing (0-1.5s) - Logo pulse, typewriter text
- Phase 2: Scanning (1.5-4s) - Canny edge map reveal with scan line
- Phase 3: Quantizing (4-10s) - Progress bar, palette swatches appear
- Phase 4: Reveal (0.5s) - Flash + PixelWipe to Draft Pick

### Compliance:

- ✅ DMG 4-Color Palette
- ✅ Touch targets ≥44×44dp
- ✅ WCAG 2.1 AA accessibility
- ✅ Reduce Motion support
- ✅ Animation specs aligned with animations-consolidated.md Section 16.3

---

## 17b. avatar-draft-pick-screen.md (NEW)

**File:** `docs/wireframes/avatar-draft-pick-screen.md`
**Status:** ✅ NEW - Spec Complete
**Created:** 2026-01-05

### Description:

Two-variant avatar selection screen:
- Two cards: "ACCURACY" (True to you) and "RETRO" (Classic style)
- Card selection with visual feedback (scale, border, background)
- Confirm button enables on selection
- Regenerate link for new photo
- Graceful degradation for partial/complete failures

### Compliance:

- ✅ DMG 4-Color Palette
- ✅ Touch targets ≥44×44dp
- ✅ Radio group semantics for accessibility
- ✅ Reduce Motion support
- ✅ Animation specs aligned with animations-consolidated.md Section 16.4
- ✅ No punishment mechanics (both variants are valid choices)

---

## 18. health-connect-permission-screen.md

**File:** `docs/wireframes/health-connect-permission-screen.md`
**Status:** ✅ Aligned

### Issues Found:

1. None identified - health permissions are separate from Party Mode changes

### Required Changes:

- [ ] No changes needed

---

## 19. profile-avatar-screen.md

**File:** `docs/wireframes/profile-avatar-screen.md`
**Status:** ⚠️ Needs Update (Minor)

### Issues Found:

1. **Check for "Quest" References** - May reference quests in stats
2. **Champion Display** - Should show selected champion if applicable

### Required Changes:

- [ ] Replace any "Quest" references
- [ ] Consider adding selected champion display
- [ ] Verify terminology alignment

---

## 20. settings-screen.md

**File:** `docs/wireframes/settings-screen.md`
**Status:** ⚠️ Needs Update (Minor)

### Issues Found:

1. **Check for "Quest" References** - May have in settings options
2. **May Reference "Combat Character"** - Should be "Champion"

### Required Changes:

- [ ] Replace "Quest" → "Training" / "Workout" if present
- [ ] Replace "Combat Character" → "Champion" if present

---

## 21. stats-panel-overlay.md / stats-panel-screen.md

**File:** `docs/wireframes/stats-panel-overlay.md` and `stats-panel-screen.md`
**Status:** ⚠️ Needs Update (Minor)

### Issues Found:

1. **"Streak" Terminology** - May use "Streak" instead of "Momentum"
2. **Check for Punitive Messaging** - Should have graceful decay messaging

### Required Changes:

- [ ] Replace "Streak" → "Momentum"
- [ ] Ensure graceful decay model is referenced
- [ ] Remove any punitive messaging about missed days

---

## Recommended Deprecation Notice Template

For deprecated wireframes, use this banner at the top of the document:

```markdown
---

> ## ⛔ DEPRECATION NOTICE
>
> **This screen has been deprecated as of [DATE].**
>
> **Reason:** [Brief explanation of why deprecated]
>
> **What was removed:**
> - [Removed feature 1]
> - [Removed feature 2]
>
> **What was preserved:**
> - [Preserved aspect 1]
> - [Preserved aspect 2]
>
> **Replacement:** See [new-screen.md](./new-screen.md)
>
> **Do not implement this screen.** This document is retained for historical reference only.

---
```

---

## Terminology Quick Reference

| Old Term | New Term | Context |
|----------|----------|---------|
| Quest | Training | Mode/menu level (e.g., "Training Menu") |
| Quest | Workout | Action/activity level (e.g., "Start Workout") |
| Fighter | Champion | Character selection (cosmetic) |
| Combat Character | Champion | Character selection |
| Loss/Defeat | Continue Training | Non-victory battle outcome |
| Streak | Momentum | Activity tracking with graceful decay |
| Sean/Mary (2 chars) | 6-Champion SF2 Grid | Champion selection |
| Victory Ceremony | Avatar Reaction on Home | Post-battle celebration |

---

## Implementation Priority Order

### Week 1: Critical Deprecations & High Priority
1. Mark `combat-character-selection-screen-enhanced.md` as DEPRECATED
2. Rewrite `user-flow-diagram.md` for Party Mode alignment
3. Update `cartridge-load-transition.md` usage restrictions

### Week 2: Medium Priority - Terminology
4. Update all "Quest" → "Training/Workout" across 6 wireframes
5. Update `home-dashboard-screen-enhanced.md` with post-battle states

### Week 3: Lower Priority - Minor Updates
6. Update remaining screens for terminology consistency
7. Final review and version bumps

---

## Audit Completion Checklist

- [ ] All 2 deprecated screens marked with deprecation notice
- [ ] user-flow-diagram.md completely rewritten
- [ ] All "Quest" terminology replaced
- [ ] All "Fighter" terminology replaced
- [ ] All "Streak" terminology replaced
- [ ] Momentum system verified across all relevant screens
- [ ] No-defeat philosophy verified in all battle-related screens
- [ ] Champion selection correctly placed in Battle Mode
- [ ] Transition architecture correctly documented
- [ ] Evolution ceremony correctly shown as overlay

---

**Report Version:** 1.2
**Last Updated:** 2026-01-05
**Next Audit Due:** After Story 1.6 implementation or next Party Mode session

---

## FTUE Flow Summary (Post-2026-01-05 Update)

| Screen | Name | Duration | Notes |
|--------|------|----------|-------|
| 1 | Welcome Screen | ~5s | "PRESS START" moment |
| 2 | Archetype Selection | ~15s | Choose fitness style |
| 3 | Tutorial Training Assignment | ~5s | "Power up for battle!" |
| 4 | **FTUE Workout Video** | **8-12s** | **Passive video, skip after 2s** |
| 5 | Battle Mode Transition Video | ~3-5s | Portrait → Landscape |
| 6 | Tutorial Battle | ~30-45s | Default champion (Sean), guaranteed victory |
| 7 | Battle Mode Exit Video | ~3-5s | Landscape → Portrait |
| 8 | Home Dashboard | - | FTUE Complete, avatar shows victory pose |

**Total FTUE Time:** 60-90 seconds ✅

