# Response to the 2026-11-14 ChatGPT review [Claude]

Fixes in 0.16.1 for `reviews/2026-11-14-chatgpt-browser-review.md`. Source: Sean approved "do all the things above" on 2026-11-14. Verification: Node regression checks and a real Chrome click test run by Claude on 2026-11-14; not independently verified by anyone else. The base was main at the commit that added the review.

| Review # | Result | Check |
| --- | --- | --- |
| 1 Travel blocked | Fixed: `#screen` used `data-tab`; now `data-screen`. | `check-clicks.cjs` (real Chrome) |
| 2 Corrupt crew save | Fixed: crew, escorts, custody, rental, beat, offer validated. | `check-review-fixes.cjs` |
| 3 Stranding | Fixed: reachability from fuel, affordable fuel, sellable cargo, warp. Dump always offered. | `check-review-fixes.cjs` |
| 4 Crew ability ids | Fixed: string id passed through the click handler. | `check-clicks.cjs` |
| 5 Kidnapping rescue | Fixed: new action `crew-rescue`. | `check-review-fixes.cjs` |
| 6 Auto-fuel reset | Fixed: default off, saved; legacy saves load off. | `check-review-fixes.cjs` |
| 7 Auto-route quote | Fixed: per-stop rate. | `check-review-fixes.cjs` |
| 8 Rental refuel exploit | Fixed: original fuel restored on return. | `check-review-fixes.cjs` |
| 9 Per-day charges | Fixed in code (balance change for Quiet ride). Wages stay per jump, as advertised. | `check-review-fixes.cjs` |
| 10 Customs after pirates | Fixed: `dockOrInspect()`. | `check-review-fixes.cjs` |
| 11 Surrender text | Fixed: boarding chance shown when above 0. | `check-review-fixes.cjs` |
| 12 Help control | Fixed: How to play always in the dock bar. | `check-review-fixes.cjs` |
| Gameplay rank 1 | Done: Travel / Open Market button on the first-haul card. | `check-review-fixes.cjs` |
| Gameplay rank 3 | Partly done: deadline, bays and an Accept button on Best runs. Reserved-bay and sort changes not made. | `check-clicks.cjs` |
| Gameplay ranks 2, 4, 5 | Not done. The review says to wait for human playtests. | none |

Also from Sean (not in the review): chart beside a travel column on desktop, and Accept from Best runs. Both done.

**Still failing, same as before these changes:** `check-community`, `check-world-bank` and `check-review` fail on the untouched code because their assertions are stale (old market text, a Bank button that moved). They need updating separately.

**Not verified:** a full 20-jump human cold-start playtest, phone layouts on real hardware, and `check-clicks` under any browser other than Chrome on Linux.
