# Player feedback, 2026-11-15 (first outside players)

Qualitative notes, not representative polling. Raw notes as Sean relayed them, with status in 0.16.3.

| # | Feedback | Status in 0.16.3 |
| --- | --- | --- |
| 1 | Map and travel column should sit side by side in the HTML game | Fixed: side-by-side from 900 px (was 1180 px). |
| 2 | Best runs: pick a run from there, not just show a route | Partly: **Accept** on local jobs; remote jobs now have **Plan route to <port>**. Accepting a job from afar is not allowed (terms are local by design). Owner decision if wanted. |
| 3 | Keep help open and easy to find | Fixed: always-visible **?** button, Help and Log in the dock bar. |
| 4 | How to play should be simple | Fixed: short four-step list plus quick answers. |
| 5 | Battles should be pop-outs | Fixed: centered pop-out with dimmed backdrop. |
| 6 | Do you have to go to another planet to sell? | Fixed: Market coach line and Help say you can sell at any port that buys it. |
| 7 | How do I tell if I have a newspaper subscription? | Fixed: dock-bar chip and Help line. |
| 8 | "After where it says goal it says…" | Unknown: the note was cut off. Ask the player. |
| 9 | Adonbrax-type planets look equally far on the chart but fuel/days differ | Explained: orbit rings are scenery; cards show "N pc · N fuel · 1 day"; routes show jumps = days. A route of 5 jumps is 5 days. Open: chart positions still do not reflect real distance. |
| 10 | Outer Reach: could not find Bretel on the map from Best runs | Fixed: Show/Plan route switches to the right Reach, draws the legs, and the route banner lists each stop with its Reach. |
| 11 | Show route only opened a planet pop-up | Fixed: it no longer opens the pop-up; draws and scrolls to the route. |
| 12 | Nothing happens after you travel | Fixed: toast, scroll to arrival card, Trip report. Still open: a travel animation or jump flash (BACKLOG). |
| 13 | Unclear whether they had to sell something | Fixed with coach line (see 6). |
| 14 | Did not understand why cargo was full | Fixed: "(N on jobs)", "FULL · N reserved for jobs". |
| 15 | Sold on Alexa, got credits, hold still full | Explained and messaged: reserved job bays count as used. Not reproduced as a bug; the Log now makes any real case traceable. |
| 16 | Only clicked Travel, unsure where credits came from | Fixed: Trip report lists deliveries and other costs. |
| 17 | Need a log or way to track and troubleshoot gameplay | Fixed: **Log** viewer with `.txt` download. |
| 18 | Best runs: "no cargo bays" vs "reserved"; due days unclear | Fixed: "no cargo space needed" / "uses N of your bays until delivered"; "deliver by day X (N days left)". |

Verification: real-Chrome screenshots at 1000 px for the route banner, arrival report and battle pop-out; `check-clicks` and the other package checks pass except the three known pre-existing failures (Avg. paid, Needs tech 6 to buy, bank button), identical to the 0.16.2 baseline.
