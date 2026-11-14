# Next session prompt (Space Trader, as of 0.14.2)

Paste this to start the next session:

---

Continue Space Trader (repo SeanEricKnight/SpaceTrader, clone at /home/claude/spacetrader-iphone, main deploys docs/ to https://seanericknight.github.io/SpaceTrader/). Read README.md, GAMEPLAY.md, BACKLOG.md and CHANGELOG.md first. Current version is 0.14.2. Rotary Dogfight (/home/claude/canvas-aces) is separate and unchanged.

**How we work:** be concise, decide rather than ask, and keep every gameplay change reflected in GAMEPLAY.md, CHANGELOG.md, and the README and BACKLOG version lines. After each change: `node scripts/sync-pages.cjs`, regenerate `browser-preview/review-after.json` (`node browser-preview/sim-review.cjs SpaceTrader-browser.html browser-preview/review-after.json`) and SHA256SUMS.txt, run check-warp/events/crew/logic/solar, screenshot with Playwright (`python3 -I`, /usr/bin/google-chrome --no-sandbox), commit with the attribution lines, push to main, then tell Sean to Pull origin and reload. Sean's core rule: **the game must explain itself; he should never have to ask.** No package installs and no image generation are available here.

**Sean should first check (0.14.0 to 0.14.2):** credit count-up and pops, arrival banner, click-to-activate solar chart zoom with planet detail text, mid-flight view when a pirate or incident stops a trip, Buy/Rent switch and Outfit-your-ship placement on the Ship tab, auto-fill fuel on docking, three crew for hire, Reach backstory popups, "vs usual" price ranges, pirate card explanations. Ask for feedback on anything that felt wrong. Real iPhone testing and `npm test` on his PC are still pending (canvas-dependent checks have known failures: Avg. paid, Needs tech 6 to buy, Three Reaches explained, planets count).

**Agreed next steps, in order:**
1. DONE in 0.14.2: procedural planets, vector placeholder portraits, ship bob/glow. Review with Sean and refine (planet brightness, portrait style) before moving on.
2. Commander page rebuilt as a career record: visited-planets map (lit vs dim, last ~10 jumps), rank title with ship picture (see DESIGN_IDEAS.md rank ladder), records (deliveries, pirates beaten, best sale, biggest haul, days, net worth vs the 500,000 goal), milestone badges. Open question for Sean: unvisited planets as dim dots or hidden.
3. Painted portraits are Sean's job (PORTRAITS.md, 24 files; the game loads them by file name over the drawn placeholders).
4. Travel as a moment (ship trail, jump flash), first-visit Reach story popup, then one cohesive visual style (cockpit console proposed).
5. Backlog: redo sounds (disabled; `SOUND_ENABLED=false`), police cutter and marauder art, customs inspection in flight, reputation, label the orange per-unit profit pill, fuel price tuning if gas still feels costly, optional hangar of multiple ships (design decision for Sean; today you fly one ship at a time).

Sean's diagnosis that drives the above: the game still feels like a 2000-era spreadsheet because it has little feedback, little sense of place, and flat visual hierarchy. Juice only helps on top of real decisions and story, so keep adding writing and consequences too.
