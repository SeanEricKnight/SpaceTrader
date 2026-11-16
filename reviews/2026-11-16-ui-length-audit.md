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

## Recommended changes, in order (second pass, 2026-11-16)

Revised after a second round of research; changes from the first pass are marked.

1. Delete the duplicates above (about 400 px).
2. Jobs: one compact row each, show all up to 5 (CHANGED: no "top 3" cut; choice-overload evidence is weak, the real cost is row height). Highlight only the best pay-per-fuel run; make other Accept buttons secondary (CHANGED, new: one distinct item per list).
3. One "Trip" panel (CHANGED: merge, not just trim): selected port, distance and fuel with the in-range badge, crisis chip, travel style, route steps, and a single filled Travel button. Port details (tech, resources, water price, rotation, tilt, history) go in one fold whose label states the key fact. Target about 250 px for the card (from 683) and the Route card gone.
4. Vessel (CHANGED): replace the 250 px card with a small ship thumbnail plus name, hull and cargo chip in the stats bar. Keeps the ship identity Sean wants without the height.
5. Put signals on the map (new): crisis flame and job-count marker on planets, so fewer panels are needed to scan. Optional phase 2: tap callout on the map with Travel.
6. Phone (CHANGED): do not add a new sticky bar; the bottom zone already holds the dock, hint pill and toasts. Reuse the existing `#dock-hint` slot: with a planet selected it reads "Travel to Adahn · 9 fuel".
7. Layout check `browser-preview/check-layout.cjs` (CHANGED budgets): hard rule, Travel is inside the first screen at 1440x900 and reachable without scrolling on 390x844 with a planet selected. Soft cap on total height: 2.2 screens desktop, 4 screens phone. The first pass said 1.6, which contradicted my own 2.1-screen estimate; both caps are judgment and can tighten after the build.

Estimated result (not built): side column about 900 px, page about 1,900 px at 1440x900 (about 2.1 screens), about 3,000 px on the phone (about 3.6 screens).

## Do not do

- Do not hide everything behind tabs or accordions. Elite Dangerous Odyssey drew heavy complaints for extra clicks and information spread across panels. Hide only secondary detail, and label each fold with its key fact.
- Do not apply "7 items per screen". Working memory is nearer 4 chunks (Cowan 2001); group, do not count.

## Open decisions for Sean

- Swap the vessel card for a thumbnail plus chip (recommended)?
- Keep "Move cards (drag)"? It matters less once the default order is right; keep, low priority.
- Approve the first-screen rule and the 2.2 / 4 screen soft caps in item 7?

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
- Second pass: https://archive-ouverte.unige.ch/unige:76440 (choice overload meta-analysis, mean effect near zero) · https://alistapart.com/1-9-tablet-zones-jpg/ (Hoober thumb grips) · https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/ · https://www.saasframe.io/patterns/sticky-call-to-action · https://www.renascence.io/behavioral-biases/von-restorff-effect · https://fractalsoftworks.com/tag/intel/ · https://fractalsoftworks.com/2016/11/25/cartography · https://www.gamespot.com/articles/offworld-trading-company-early-access-review/1100-6426402/ · https://www.pcgamer.com/why-i-love-stellaris-slick-interface · https://madegooddesigns.com/?p=5485

Caveat: mostly secondary summaries and forum posts; judgment, not proof.
