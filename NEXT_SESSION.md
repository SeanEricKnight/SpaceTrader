# Next session prompt (Space Trader, as of 0.16.0)

Paste this to start the next session:

---

Continue Space Trader (repo SeanEricKnight/SpaceTrader, clone at /home/claude/spacetrader-iphone, main deploys docs/ to https://seanericknight.github.io/SpaceTrader/). Read README.md, GAMEPLAY.md, BACKLOG.md and CHANGELOG.md first. Current version is 0.16.0. Rotary Dogfight (/home/claude/canvas-aces) is separate and unchanged.

**How we work:** be concise, decide rather than ask, and keep every gameplay change reflected in GAMEPLAY.md, CHANGELOG.md, and the README and BACKLOG version lines. After each change: `node scripts/sync-pages.cjs`, regenerate `browser-preview/review-after.json` (`node browser-preview/sim-review.cjs SpaceTrader-browser.html browser-preview/review-after.json`) and SHA256SUMS.txt, run check-warp/events/crew/logic/solar, screenshot with Playwright (`python3 -I`, /usr/bin/google-chrome --no-sandbox), commit with the attribution lines, push to main, then tell Sean to Pull origin and reload. Sean's core rule: **the game must explain itself; he should never have to ask.** No package installs and no image generation are available here.

**Sean should first check (0.14.0 to 0.14.2):** credit count-up and pops, arrival banner, click-to-activate solar chart zoom with planet detail text, mid-flight view when a pirate or incident stops a trip, Buy/Rent switch and Outfit-your-ship placement on the Ship tab, auto-fill fuel on docking, three crew for hire, Reach backstory popups, "vs usual" price ranges, pirate card explanations. Ask for feedback on anything that felt wrong. Real iPhone testing and `npm test` on his PC are still pending (canvas-dependent checks have known failures: Avg. paid, Needs tech 6 to buy, Three Reaches explained, planets count).

**Agreed next steps, in order:**
1. DONE in 0.14.2: procedural planets, vector placeholder portraits, ship bob/glow. Review with Sean and refine (planet brightness, portrait style) before moving on.
2. Commander page rebuilt as a career record: visited-planets map (lit vs dim, last ~10 jumps), rank title with ship picture (see DESIGN_IDEAS.md rank ladder), records (deliveries, pirates beaten, best sale, biggest haul, days, net worth vs the 500,000 goal), milestone badges. Open question for Sean: unvisited planets as dim dots or hidden.
3. Painted portraits are Sean's job (PORTRAITS.md, 24 files; the game loads them by file name over the drawn placeholders).
4. Route planning and the quest celebration shipped in 0.14.2; ask Sean how they feel. Travel as a moment (ship trail, jump flash), first-visit Reach story popup, then one cohesive visual style (cockpit console proposed).
5. Backlog: redo sounds (disabled; `SOUND_ENABLED=false`), police cutter and marauder art, customs inspection in flight, reputation, label the orange per-unit profit pill, fuel price tuning if gas still feels costly, optional hangar of multiple ships (design decision for Sean; today you fly one ship at a time).

Sean's diagnosis that drives the above: the game still feels like a 2000-era spreadsheet because it has little feedback, little sense of place, and flat visual hierarchy. Juice only helps on top of real decisions and story, so keep adding writing and consequences too.

## Keep it cheap (Sean's allowance)

- Default model: Sonnet at Medium effort; Haiku or Low effort for tiny edits; Opus/Fable only for big refactors (for example splitting the HTML into source files plus a build script).
- Screenshots only for big visual changes. Batch small fixes, then run the full release routine (docs, sync, hashes, checks, commit, push) once per batch.
- Short replies, no recaps, no option lists for small things: decide and build. Take several requests per message.
- Writing work (lore, rumors, headlines) can come from Sean's local model; just integrate what he pastes.

## State as of 2026-11-14 (0.16.0)

Shipped after 0.14.3 (see CHANGELOG): 0.15.0 (planet label audit, escort ratings/traits, career-scaled pirates, Dock services bar replaced by a Needs-attention strip, moon-rise and kill/laser feedback, crew abilities, News headlines), 0.15.1 (Market "Done trading · Open map", per-tab accent colors), 0.16.0 (leaderboard and optional race against a rival AI; Gold Seal Deed), plus PROMPTS.md (AI review, player-test and writing prompts). Sean should play-test 0.15.0 to 0.16.0 and report what feels wrong.

### Earlier: 0.14.3

0.14.3: planet screens no longer show parenthetical crisis causes; the planet finder is a drop-down of all planets; Best runs is easiest on Beginner/Easy and progressively harder (Normal: pay only, no cr per fuel; Hard: this port only, unranked; Impossible: hidden). Ask Sean if the tiers feel right.


Shipped in 0.14.2 this session, all on main:
- Route planning (ringed stops, Route card; job boards at stops need the newspaper subscription), Best runs (jobs by pay per fuel), DELIVERED stamp card with floating "cr" chips, toasts for sales/buys/new ports, floating +profit numbers from the tapped button.
- Home port (Acamar default, about 20% off repairs/fuel, move for 500 cr) and a 20-unit warehouse (1 cr/unit/day).
- My ports (pins with tags, live status) and planet finder; rounded/pill style pass with color-coded tabs, stats and job types; tabular digits.
- Size test cap raised to 2 MB (file about 684 KB). Restore point before Best runs/Home/My ports/style: branch `before-best-runs` (c1784c6).

Open / next, in rough priority:
1. Sean to play-test the new features and report what feels wrong (celebration card, Best runs, warehouse fee, home discount).
2. Split the HTML into source files plus a build script that emits the same single HTML (do with a strong model, as one careful refactor).
3. iPhone layout pass (bottom tab bar, larger tap targets) and optional installable-app support (manifest + offline cache with an update prompt).
4. Gemini review ideas not yet done: moon-purchase "deed certificate" ending, travel moment (warp-line flash), warehouse cost scaling or spoilage if hoarding becomes dominant, tap/long-press explanations for stats.
5. Writing pack from Sean's local model (port rumors, local color, headlines for 24 planets); integrate when pasted.
6. Older backlog: Commander page career record, first-visit Reach story popup, police/marauder art, customs in flight, sound redo (disabled behind SOUND_ENABLED=false), 24 painted portraits (PORTRAITS.md), real iPhone test, `npm test` on Sean's PC.
