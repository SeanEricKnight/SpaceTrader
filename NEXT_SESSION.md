# Next session prompt (Space Trader)

The prompt below is current. The "State as of" sections further down are dated history, newest last. Live status is in shared-mind `CURRENT.md` and `HANDOFF.md`.

Paste this to start the next session:

---

Continue Space Trader (repo SeanEricKnight/SpaceTrader, clone at /home/claude/SpaceTrader, main deploys docs/ to https://seanericknight.github.io/SpaceTrader/). Read README.md, GAMEPLAY.md, BACKLOG.md and CHANGELOG.md first. The current version is in `package.json` and the README. Rotary Dogfight (repo SeanEricKnight/rotary-dogfight) is a separate project.

**Research and decisions:** before designing, follow shared-mind `memory/game-research-method.md` (research what successful games do), and record each decision in `DECISIONS.md`.

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

## State as of 2026-11-14 (0.14.3)

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


## State as of 2026-11-15 (0.16.3)

0.16.3 answers the first outside-player feedback (`reviews/2026-11-15-player-feedback.md`): battle pop-outs, always-on help button, newspaper chip, working Show route / Plan route (cross-Reach), arrival toast and Trip report, cargo-reserve wording, Best runs wording, market coach line, downloadable Activity log, side-by-side chart from 900 px.

Open: ask the player what the cut-off "After where it says goal…" note said; decide whether remote jobs may be accepted from afar (today only at the posting port); chart positions still do not reflect real distance (consider a to-scale mode); travel animation / jump flash; real iPhone test. Sean should Pull origin and reload, then try: Best runs "Plan route to…", a pirate fight, the ? button, Log download.

## State as of 2026-11-16 (0.25.4)

Events: 39 in `INCIDENTS` (tiers 1 to 3), drawn from a shuffled bag (`pickIncident`, saved as `incBag`), with chains through `game.incFlags` (ghost signal, reactor payback). Append new events so old saved offer ids stay valid; keep titles unique (`incByTitle` finds the first match). `check-incidents.cjs` runs every choice. Not built (checked 2026-11-16): landing-port news events, a rare chance tier (tiers follow progression only), events that react to cargo held or reputation, recurring named characters beyond the two chains. Sean should play a few Excitement trips and say which events feel good or bad.

## Prompt for the next session: state-reactive events (written 2026-11-16)
Start: read shared-mind AGENTS.md and memory/standing-instructions.md, then the "Reusable rules" digest and the 2026-11-16 "event variety, redone properly (71 sources)" entry in memory/game-design-references.md, and this repo's DECISIONS.md top entry. Sources: shared-mind memory/research/event-variety-2026-11-16.md.
Task: build state-reactive travel events in SpaceTrader-browser.html (sync docs/ with scripts/sync-pages.cjs). Event text and options change with cargo, reputation, crew and fuel (same title, different situation); then a small rare tier of memorable events. Keep the shuffled bag, tiers and when() gates; do not touch landing news or recurring characters. Rules: certain costs and payoff size up front, story after the click; greyed options show the reason on the button; no back-to-back repeats.
Check: extend browser-preview/check-incidents.cjs to run every choice under each state variant; run scripts/run-checks.cjs; playtest 10 trips if a browser is available.
Finish: bump version, CHANGELOG/GAMEPLAY/BACKLOG/NEXT_SESSION, SHA256SUMS, DECISIONS.md entry (mark approved), research-log line if anything new, push with git -c push.negotiate=true push origin HEAD:main.
Open question to ask Sean first: which button was greyed in the saved-choice complaint?
