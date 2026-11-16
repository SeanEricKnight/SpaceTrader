# Space Trader decisions

One entry per decision, newest first. Research method: shared-mind `memory/game-research-method.md` (find what loved games do, grade the evidence, then decide). Research log: shared-mind `memory/game-design-references.md`. Do not edit old entries to hide a reversal; add a new entry that supersedes it.

Entry format: **Date · Decision.** Decided by. Why (research link). Rejected. Status. How it is checked.

## 2026-11-16 · Artwork direction (OPEN, awaiting Sean)
Proposal in [ART_DIRECTION.md](ART_DIRECTION.md): crew portraits first with per-person accent colors, then ships with a design language per shipyard and silhouette tests. Why: Endless Sky and Starsector art guides, TF2/Overwatch readability, Nittono 2012 (see shared-mind research log). Rejected so far: cute baby-schema faces (tone mismatch). Status: open; no art built. Check: grayscale ship silhouette sheet, 48 px crew row.
## 2026-11-16 · Event messages are sticky and stack at the top; routine confirmations time out
Decided by Sean ("they may need to stay until you click them ... a bubble showed up top and was gone before I could read it"), after ~58 sources. Why: players of GalCiv, Crate games, Dwarf Fortress and itch.io titles report vanishing popups as a bug and ask for a log; RimWorld letters stay until clicked and a Messages history keeps 200; IGDA accessibility guidance (configurable time, plus a log); WCAG 2.2.1 and Primer/GitHub on timed toasts; Lightning and ServiceTitan design systems keep toasts sticky except plain success; Material keeps snackbars short and low-priority. Contrary: Stellaris, CK3 and RimWorld players install mods to mass-dismiss notifications, so sticky is limited to event results, capped at four, with Dismiss all and Esc. Rejected: all toasts sticky; bottom placement (covered the buttons). Status: shipped 0.24.4. Checked by check-layout.cjs.

## 2026-11-16 · Locked ship cards lead with "Show me where", not a disabled Buy
Decided by Sean's question ("might need a button to go to the place this ship is available - don't just agree"), after ~60 sources. Why: NN/g and Baymard on dead ends (a disabled button with no next step; 30% leave when told only "out of stock"); Elite Dangerous players leave the game for Inara to find a shipyard and report an hour of wandering; X4 and Starfield put "buy ship" at the yard itself; implementation-intention meta-analysis (94 tests, d about 0.65) says naming where to act helps follow-through; Fogg: raise ability before motivation; card guidance: one primary action, at most two CTAs. Contrary: quest-marker critiques (Witcher 3, Cyberpunk) say too much guidance erodes exploration, so the button opens the map and does not travel or teleport; travel still costs fuel and days. Rejected: auto-travel, a second dead button pair, hiding Buy. Status: shipped 0.24.4. Checked by check-layout.cjs.

## 2026-11-16 · Reserved cargo bays are announced at accept and droppable in the hold card
Decided by Sean ("10 bays reserved was a surprise"). Why: Elite Dangerous mission cargo (can't be sold, abandon has a penalty; players ask for free-bay counts), Nielsen heuristic 3 (visible emergency exit), Tim Cain on telegraphing consequences. Rejected: auto-unloading, hidden reservation. Status: shipped 0.24.3. Checked: check-layout (hold card rows, Drop job frees bays, Accept text).

## 2026-11-16 · Refuel in the Inspect card keeps the card open
Decided by Sean ("it closed and dumped me out"). Why: actions should confirm in place (Nielsen heuristic 1, visibility of status). Rejected: closing the card and relying on the map. Status: shipped 0.24.3. Checked: check-layout.

## 2026-11-16 · Celebrations scale with the win; no spinning rays
Decided by Sean ("splash card is lame"). Why: Yu-kai Chou (not every win gets the same celebration), juice-overload and habituation articles. Rejected: one big card for every reward. Status: shipped 0.24.3. Checked: check-layout (strip height, big card only for First haul/Ship goal).

## 2026-11-16 · Escort pilot cards open a profile with Hire
Decided by Sean ("pilots for hire don't open a card"). Why: match crew cards, which are already tappable; Hick-Hyman (hire where you read the ratings). Status: shipped 0.24.3. Checked: check-layout.

## 2026-11-16 · Warp scene does not shake as a whole
Decided from Sean's report of a red flash with the card flickering. Cause: the shake moved the opaque scene and exposed the event card behind it. Status: shipped 0.24.3; not reproduced in headless runs, so confirm in Firefox. Use the new log diagnostics if it recurs.

## 2026-11-16 · Reward cards give one next step; overlays never cover a main button
Decided by Sean's report ("this is messy"; toasts covering Continue). Why: shared-mind research log 2026-11-16 (first major win, progressive disclosure, Hick-Hyman). Rejected: keeping the 4-bullet feature list; a delay-only toast fix (toasts made before the scene still sat on top). Status: built in 0.24.2. Checked by: `check-layout.cjs` (First haul card shape; no toast over the travel Continue button).

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
