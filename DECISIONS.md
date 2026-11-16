# Space Trader decisions

One entry per decision, newest first. Research method: shared-mind `memory/game-research-method.md` (find what loved games do, grade the evidence, then decide). Research log: shared-mind `memory/game-design-references.md`. Do not edit old entries to hide a reversal; add a new entry that supersedes it.

Entry format: **Date · Decision.** Decided by. Why (research link). Rejected. Status. How it is checked.

## 2026-11-16 · Show crisis flames and job counts on map planets
Decided by Sean ("make all the changes"). Why: audit item 5; Stellaris-style on-map status lets players scan without opening panels. Rejected: separate list panel. Status: built in 0.24.1. Open risk: crises are common (about 4 of 9 ports on day 1), so flames may stop standing out (Von Restorff effect). Next option if so: flame only when the crisis good is in range or in the hold. Checked by: `check-layout.cjs` (flame and count appear exactly where a crisis or delivery job exists).

## 2026-11-16 · Phone Travel lives in the bottom pill (`#dock-hint`)
Decided by Sean. Why: audit item 6; Travel was 1,373 px down on a phone. Reused the existing pill instead of adding a new sticky bar (the bottom zone already holds dock, hint pill and toasts). While the guide is on, the guide's "Show me" pill keeps the slot. Desktop hides it (Travel is in the map bar). Status: built in 0.24.1. Checked by: `check-layout.cjs` (phone pill in view, tap starts the trip; hidden on desktop).

## 2026-11-16 · Navigation tab: first-screen rule and height caps
Decided by Sean ("go"). Rule: Travel is inside the first screen on desktop; soft caps 2.2 screens desktop, 4 screens phone. Why: reviews/2026-11-16-ui-length-audit.md (NN/g first-screen attention, working memory about 4 chunks, Elite Odyssey click-count backlash). Rejected: hiding more behind accordions (hurts discoverability); a top-3 jobs cut (choice-overload evidence is weak, the real cost was row height). Status: built in 0.24.0. Checked by: `check-layout.cjs`.

## 2026-11-16 · Vessel card replaced by a HULL tile with ship thumbnail
Decided by Sean. Why: the 250 px card showed little that changes; the stats bar keeps ship identity. Status: built in 0.24.0.

## 2026-11-16 · Duplicate panels removed; one compact destination panel; jobs as one-row list (best highlighted)
Decided by Sean. Why: audit duplicates list; Von Restorff (one distinct item per list). Status: built in 0.24.0.

## 2026-11-15 · Use "Space Trader" naming everywhere
Decided by Sean. The old "-iPhone" project and repo name is invalid. Status: standing rule.

## Open
- `check-review.cjs` Beetle-vs-Gnat profit assertion fails on the committed baseline (353,367 vs 1.3 x 298,346). Needs a balance decision: loosen the 1.3 ratio, or retune the Beetle. Owner: Sean.
