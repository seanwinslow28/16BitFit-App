# 16BitFit MVP — agreed direction

Recorded September 7, 2026 from Sean's planning conversation. This document captures existing user decisions; it is not a completed specification or a record of new decisions made by an agent.

## Purpose and audience

Build a small, shareable iPhone pilot for regular gym-goers who enjoy Pokémon-style, turn-based games. The initial problem hypothesis is: make exercise they already do feel more rewarding. Friends and family have expressed willingness to test; no participant commitment or retention outcome is established yet. Less consistent exercisers may participate, but interpret their motivations and behavior separately.

Real users and a completed feedback-and-iteration loop are the priority. The previous project stalled because animated fighting assets took too much time. The 2026 direction uses static sprites, turn-based battles, and a richer 8-/16-bit aesthetic without returning to a strict four-green palette or a dual aesthetic system.

During Wayfinder charting on September 7, Sean confirmed the planning destination: a decision-complete route to this private pilot, including the minimum build, distribution, verification, and pilot acceptance criteria for subsequent implementation planning. The primary learning goal is whether workout-earned character progress and battles feel rewarding enough for people to return voluntarily. Image personalization is a secondary experiment; it does not establish that the core app is worth using.

## Confirmed boundaries

- iPhone only for the first pilot.
- One activity-to-character-progression loop.
- One repeatable turn-based boss encounter.
- Automatically capture recorded workouts; manual workout entry is not the primary MVP path. Sean considers automatic capture essential to repeat use and wants reward-source trust evaluated because self-reported workouts could be fabricated.
- Apple Watch is the main device Sean and likely testers use. Other Apple workout apps and WHOOP are candidate sources to investigate, not promised integrations. The exact integration and source-eligibility rules remain open.
- Reward recorded workouts only. Steps and everyday activity are deferred to V2/V3.
- Let players challenge the single boss anytime, including rest days, with recorded workouts growing character strength. Workouts do not grant a limited allowance of battle attempts, and replaying battles does not substitute for workout-earned progression. This supports testing game mechanics and enjoyment in the MVP; exact combat and reward rules remain open.
- A preset avatar option; a controlled personalized sprite-generation experiment with a usable fallback.
- Start the two observed tests with preset avatars. Introduce optional personalization only after the core app works and there is evidence that people want to return; it is not an automatic prerequisite for the larger cohort. Sean confirmed this sequencing during charting. The evidence threshold and the experiment's exact placement, photo handling, and limits remain to be defined.
- Persistent progress and basic usage measurement.
- No sign-up for the private MVP; save game progress in the app's local storage on the tester's current iPhone. Progress must survive closing the app and restarting the phone. Sean accepts that deleting the app or replacing the phone could lose game progress; cross-device sync and recovery are not promised. This decides game-save persistence, not whether generation or measurement requires a separate service. The exact saved-state schema and reset/import behavior remain open.
- Static artwork and simple effects.
- Respect rest days and preserve earned progress; no guilt messages or streak-break punishment.
- Sean reviews whether the private build is comfortable to share.
- Staged pilot rollout: begin with two trusted people in observed sessions, address the main problems, then expand to roughly 5–8 people for two weeks to observe return use across workouts and rest days. Sean confirmed this plan during charting; individual participants, dates, and invitations are not yet arranged or authorized.
- Keep the existing repository, artwork references, and user work safe while deciding reuse. The audit recommends selective reuse, not indiscriminate deletion.

## Proposed acceptance criteria to refine with Sean

A participant can choose an avatar, have an eligible recorded workout captured automatically, understand the character reward, complete a boss encounter, close/reopen without losing progress, and report a problem. The first generation failure must not prevent play. Display actual participant data rather than hardcoded sample metrics. Agree on photo handling before collecting images.

Use the confirmed staged rollout above. Proposed evidence to refine with Sean: activation, return use, assistance/reminders, confusion, generation acceptance/retries/cost, and the decision made after feedback. These small samples support learning, not claims of statistically established retention lift or improved fitness.

## Still undecided

Automatic workout integration, eligible sources and workout types, source trust, import timing, duplicate/edit handling, and permission or unavailable-data behavior; stats/rewards and combat rules within the freely replayable encounter; visual palette/fonts; provider and generation placement; local saved-state schema, reset/import behavior, and any separate service or anonymous measurement identity needs; analytics/feedback collection; distribution, developer-account needs, and SDK; dates, budget limits, and final release criteria.

Do not silently turn existing interface fields, old mock numbers, or historical V3 design choices into decisions.

## Outside the first pilot

Android, multiplayer, world exploration, subscriptions, a growing boss catalogue, extensive animation, complex workout coaching, and an enterprise-scale backend. Steps and everyday-activity rewards are deferred to V2/V3. Automatic recorded-workout capture is now required; its integration route remains a decision to investigate. Long-term motivation and habit-change claims require later evidence.

Player sign-up, backend-hosted game saves, cross-device game-progress sync, and guaranteed game-progress recovery after deletion or phone replacement are outside the private MVP.

Sean's later-version direction is a training dummy followed by new bosses unlocked as workouts strengthen the character. Progressive encounter unlocks and their additional assets are outside this MVP; retain the idea for a separate V2/V3 effort rather than expanding the current decision map.

## Source order

Latest explicit user decisions take precedence. This scope captures them; the [existing-app audit](../audits/2026-09-07-existing-app-audit.md) captures dated implementation facts. The [2026 pitch](16BitFit-Updated-Pitch-2026.md) remains valuable product/design context, but its competitive fighting-game audience, unsupported statistics, no-competitor claim, and momentum-decay wording need revision. Archived V3 material is history.
