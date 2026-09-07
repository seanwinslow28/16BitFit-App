# Issue tracker: GitHub

Repository: [seanwinslow28/16BitFit-App](https://github.com/seanwinslow28/16BitFit-App).

Sean created this private repository and explicitly requested publication of project files and migration of the local decision tickets on September 7, 2026. GitHub is now canonical. The original `.scratch/16bitfit-mvp/` files remain local migration snapshots and are ignored by Git; do not maintain a competing tracker there.

## Current effort

Continue [Find the route to the 16BitFit private iPhone MVP](https://github.com/seanwinslow28/16BitFit-App/issues/1). Its native sub-issues hold the decisions and research. The [agreed scope](../2026-UPDATE/16BitFit-MVP-Agreed-Scope.md) captures Sean's standing choices. Do not manufacture resolved tickets for decisions made before the map.

When a skill says to publish, fetch, claim, comment on, or resolve a ticket, use this repository's GitHub Issues API or `gh` with the explicit repository. Check for an existing matching issue before creating one. Do not use `.scratch/` as the active publication destination.

## Wayfinding operations

- **Map:** one GitHub issue labelled `wayfinder:map`, with Destination, Notes, Decisions so far, Not yet specified, and Out of scope. It is an index, not a duplicate store of answers or an open-ticket checklist.
- **Children:** one precise decision question per native sub-issue. Label each `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`. Keep the body focused on the question. A research recommendation is not Sean's product decision.
- **Create, then wire:** create all newly specified issues before adding parent and blocking relationships. Use native GitHub sub-issues and issue dependencies, not Markdown task lists as substitutes.
- **Claim:** an open, unassigned issue is unclaimed. Assign to the driving developer before work; Sean's GitHub login is `seanwinslow28`. A delegated researcher can work under that developer's claim, with branch/worktree context in a comment. Recheck claims to avoid taking active work.
- **Blocking:** use native `blocked_by` dependencies. An issue is unblocked only when all blockers are closed. Closed factual investigations may unblock human choices without resolving those choices.
- **Frontier:** list the map's children; select open, unassigned issues with no open blockers, in ascending issue-number order. Query live state, not local snapshots or cached README text.
- **Resolution:** post a dated resolution comment with the answer, evidence, limitations, and any branch/commit context; close the issue; append one linked gist to the map's Decisions so far. For an out-of-scope disposition, link from Out of scope instead.
- **Concurrency:** reread the map before appending a resolution gist, preserve other changes, and serialize shared map edits. New comments and evidence belong to the issue being worked.
- **Human involvement:** charting closes no human decision tickets. Later work-through sessions resolve at most one non-research ticket. Ask unresolved product/design questions one at a time with recommendations.

Use issue titles in human-facing links. Database IDs and issue numbers are for API operations, not substitutes for readable names.

## Native API operations

Use `gh api` with the explicit `repos/seanwinslow28/16BitFit-App` prefix:

| Operation | Method and endpoint suffix | JSON body |
| --- | --- | --- |
| List children | `GET /issues/{map_number}/sub_issues` | — |
| Attach a child | `POST /issues/{map_number}/sub_issues` | `{"sub_issue_id": <child database id>}` |
| List blockers | `GET /issues/{number}/dependencies/blocked_by` | — |
| Add a blocker | `POST /issues/{number}/dependencies/blocked_by` | `{"issue_id": <blocker database id>}` |

These relationship endpoints use numeric **database IDs**, not issue numbers. Fetch the issue first. Paginate list endpoints when needed. For bodies/comments, prefer structured JSON input or an exact temporary body file; preserve real newlines.

References: [GitHub sub-issue API](https://docs.github.com/en/rest/issues/sub-issues), [GitHub issue-dependency API](https://docs.github.com/en/rest/issues/issue-dependencies).

## Research, specs, and implementation

Research findings live in `docs/research/`, with sources and dates. Throwaway `research/<name>` branches preserve original evidence; link a published file or immutable commit from the resolution. A developer's absolute worktree path is not a usable GitHub evidence link.

Later implementation planning is a separate effort with its own build issues and dependency order. Approved specs and verification/pilot checklists belong in durable repository docs, linked from the relevant effort. Do not turn a decision ticket into an implementation task without an explicit scope change.

Triage labels remain the five roles in [triage-labels.md](triage-labels.md). They are separate from Wayfinder type labels, open/closed state, and assignee claims.
