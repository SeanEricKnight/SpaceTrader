# Navigation tab length audit (0.23.6)

Author: Claude, 2026-11-16. Trigger: Sean could see no reason to scroll this much on the Navigation tab. Status: recommendations only, nothing built. Research and sources: `memory/game-design-references.md` in shared-mind (entry "Navigation tab scrolls too much").

## Measured (Playwright, `docs/SpaceTrader-browser.html`, default new game)

| | 1440x900 | 390x844 |
| --- | --- | --- |
| Page height | 3,801 px (4.2 screens) | 5,349 px (6.3 screens) |
| Chart stage | 736 | 660 |
| Right column (`.side-column`) | 2,037 | 2,303 |
| Best runs (3 jobs) | 708 | 827 |
| Selected destination | 683 | 711 |
| Route card | 263 | 306 |
| Your vessel | 250 | 250 |
| My ports | 229 | 291 |
| Footer | 128 | 236 |

Cause: the right column is 2.8x taller than the chart, so the sticky chart (`.orbital-stage`) sits beside a long scroll. Four panels are fat and four facts repeat.

## Duplicates (delete first)

1. Route banner (`routeBanner()`) and Route card (`routeCard()`) both say "Route to X, N jump, fuel, days". Keep one.
2. Selection bar (`mapSelectionBar()`) and Selected destination card both show name, distance, fuel, tech level, within-range. Keep one.
3. Crisis note appears on the job card, the destination card, and the Route card chip. Show it once per port, as a chip.
4. Map instructions appear twice (toolbar, three lines; note under the map). Keep one, behind a small "?".
5. Intro text appears twice at the top (summary line plus a "To reach another Reach..." paragraph).

## Recommended changes, in order

1. Remove the duplicates above (about 400 px).
2. Best runs: one row per job (icon, destination, pay, fuel, deadline, Accept); "Show route" on the row's second tap or a small icon; show the top 3, "more" for the rest. Target about 300 px (from 708).
3. Destination card: name and kind, distance and fuel with the within-range badge, the crisis chip, travel style as a compact 3-way control beside Travel. Move tech, resources, water price, rotation, tilt, pirate note and "Port history" into one labelled fold ("Port details: tech, resources, water 54 cr"). Target about 250 px (from 683). Keep Travel visible without scrolling at 1440x900.
4. Vessel card: remove from this tab (it is on the Ship tab). Add ship name, hull and cargo as a chip in the stats bar (-250 px).
5. My ports: one chip row; Distances stays a fold.
6. Default panel order (most people never use "Move cards"): selected port with Travel, Best runs, Route steps, then the rest.
7. Phone: put Travel for the selected planet in the sticky bottom bar (thumb zone, above the iOS home indicator, per the digest), keep the first screen to the chart plus one next action.
8. Add `browser-preview/check-layout.cjs`: fail if the Navigation tab is taller than 1.6 screens at 1440x900 or 3.5 screens at 390x844, and if Travel is not inside the first screen at 1440x900. Budgets are proposals; Sean can change them.

Estimated result (not built): side column about 900 px, page about 1,900 px at 1440x900 (about 2.1 screens), about 3,000 px on the phone. Estimates from the numbers above.

## Do not do

- Do not hide everything behind tabs or accordions. Elite Dangerous Odyssey drew heavy complaints for extra clicks and information spread across panels. Hide only secondary detail, and label each fold with its key fact.
- Do not apply "7 items per screen". Working memory is nearer 4 chunks (Cowan 2001); group, do not count.

## Open decisions for Sean

- Remove the vessel card from Navigation (recommended)?
- Keep "Move cards (drag)"? It matters less once the default order is right; keep, low priority.
- Approve the height budgets in item 8?

## Sources

- https://www.wyliecomm.com/2023/05/above-the-fold-statistics (secondary report of NN/g first-screen viewing time)
- https://uxmatters.com/mt/archives/2020/11/debunking-the-myth-of-the-fold.php
- https://memory.psych.missouri.edu/assets/doc/articles/2001/cowan-bbs-2001.pdf (Cowan 2001, about 4 chunks)
- https://stephaniewalter.design/blog/your-menu-doesnt-need-millers-7±2-rule/
- https://www.nngroup.com/articles/accordions-on-desktop/ (hidden content is found less)
- https://forums.frontier.co.uk/threads/odyssey-optimisation-performance-and-ui-galaxy-system-map-feedback.578093/page-5 (anecdotal)
- https://pcgamer.com/slay-the-spire-review
- https://www.greenmangaming.com/blog/how-slay-the-spire-became-the-gold-standard-for-all-card-battler-games/
- https://www.gamedeveloper.com/design/understanding-smart-ui-design
- https://spronck.net/spacetrader/STTips.html (original Space Trader screen shortcuts)

Caveat: mostly secondary summaries and forum posts; judgment, not proof.
