# Fresh-session kickoff: continue the 16BitFit MVP with Wayfinder

Work in `/Users/seanwinslow/Code-Brain/16BitFit-App`, or the checked-out root on another machine.

Use Matt Pocock's Wayfinder skill at `/Users/seanwinslow/.claude/plugins/marketplaces/mattpocock/skills/engineering/wayfinder/SKILL.md`. Read it from disk; locate the matching installed skill if the path differs. This remains planning, not an instruction to implement the app.

## Current state

The existing-app audit and initial charting are complete. Sean subsequently created the private [GitHub repository](https://github.com/seanwinslow28/16BitFit-App) and explicitly authorized publication of project files and migration of the map and tickets. Continue [Find the route to the 16BitFit private iPhone MVP](https://github.com/seanwinslow28/16BitFit-App/issues/1) using GitHub's live issue state, sub-issues, assignees, and dependencies. Do not recreate the map or use the old `.scratch/16bitfit-mvp/` migration snapshots as an active tracker.

## Read first

1. `AGENTS.md` and `CLAUDE.md`.
2. `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and `docs/agents/triage-labels.md`.
3. `docs/2026-UPDATE/16BitFit-MVP-Agreed-Scope.md`.
4. The canonical GitHub map, then only the selected ticket and relevant resolved evidence. Check current claims before starting.
5. `docs/audits/2026-09-07-existing-app-audit.md`; read its check transcript only as needed. Research findings are in `docs/research/` and linked from research resolutions.
6. Current Git status before writing. Preserve existing changes and artwork. Use selected visual references when a visual decision needs them; the agreed scope supersedes conflicting pitch/V3 assumptions.

For live decisions, read `/Users/seanwinslow/.claude/plugins/marketplaces/mattpocock/skills/productivity/grilling/SKILL.md` and the adjacent engineering `domain-modeling/SKILL.md`. Use engineering `research/SKILL.md` and `prototype/SKILL.md` when their ticket types apply. Locate installed equivalents if paths differ.

## Confirmed destination and boundaries

Find a decision-complete route to a privately shareable iPhone MVP: regular gym-goers automatically receive understandable character progress from recorded workouts, play one freely repeatable boss encounter, and return with saved progress. Specify the minimum build, distribution, verification, and pilot learning criteria for subsequent implementation planning. A bounded personalized-avatar experiment follows evidence that the core app works and people want to return.

Carry forward the agreed iPhone-only audience, automatic recorded-workout input, workout-earned strength, battles available on rest days, no-sign-up local saves, static-art direction, and preset-first staged pilot. Sean uses Apple Watch; other workout apps and WHOOP are candidate sources to evaluate. Steps/everyday activity and progressive boss unlocks are later-version scope. Do not ask Sean to reconfirm these choices.

The pilot begins with two observed testers, then roughly 5–8 people over two weeks after the main problems are addressed. Dates, costs, exact eligibility/reward rules, visuals, device/build combinations, evidence thresholds, and sharing criteria remain decisions to resolve. Research recommendations do not select them on Sean's behalf.

## Established implementation facts

The audit recommends keeping the Expo/React Native/TypeScript foundation and selectively reusing primitives inside this repo. The connected app is a placeholder. Dated checks passed type checking, 210 tests, and iOS bundle export; lint is unconfigured, packages need compatibility work, 23 tests are skipped, five referenced fonts are missing, and native iPhone behavior has not been tested.

The backend and sprite providers are stubs; copied screens use mock data and nonexistent routes. Publishing the repository and research did not implement any features or update dependencies. Use the audit as evidence, not as permission to restore V3 scope. Repeat checks only when relevant files/environment change or a finding needs reproduction.

## Work through the map

1. Load the map and query its open, unassigned children whose native blockers are closed, in ascending issue-number order. If Sean names a ticket, use that instead.
2. Claim the chosen issue by assigning the driving developer before work. Do not take over an active claim. Use the question and relevant evidence to conduct a live conversation, one unresolved question at a time with a recommendation.
3. Resolve at most one non-research ticket per work-through session. Human product/design tickets require Sean's involvement; do not fabricate his answers. A prototype is a later throwaway decision aid, not a production implementation.
4. Record the answer as a dated resolution comment, close the issue, and add one linked gist to the map. Keep details in the issue. Out-of-scope dispositions belong in the map's Out of scope section.
5. Create newly precise child questions, then wire native dependencies in a second pass. Keep only genuinely unformulatable in-scope questions in Not yet specified. Use titles in human-facing links and avoid duplicating open-ticket state in the map body.
6. For new research tickets, claim and dispatch Research subagents with isolated throwaway `research/<name>` branches/worktrees and durable evidence pointers. Preserve user work; do not commit unrelated files or overwrite the working tree to prepare isolation. Coordinate shared map edits.

When no unresolved in-scope decisions remain, hand off the approved spec, verification criteria, private-pilot checklist, and dependency-ordered build issues in a separate implementation effort. Do not silently turn the decision map into a build project.

## Working preferences

Prioritize a usable experience and feedback over architecture or asset perfection. Keep one encounter, static art, and a usable preset fallback. Automatic workout capture is required; manual rewarded entry is not the primary path. Local saves and no player sign-up are agreed. Do not add Android, multiplayer, subscriptions, an expanding boss library, or unrelated backend infrastructure. Sean owns final palette approval.

Use current primary sources for external technical facts, and be candid about mocks and unverified native behavior. No tester invitations, personal-photo uploads, purchases, or public app deployments are authorized by this kickoff. Repository publication and tracker migration were explicitly authorized separately. Avoid health-improvement or statistically established retention claims from this pilot.

Start with the current frontier ticket and its unresolved decision; do not repeat the entire audit or charting interview.
