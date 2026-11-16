# Backlog and idea tracker

One place for every idea Sean has raised, with status. Update this file whenever an idea is built, changed, or deferred. Details and open questions live in [DESIGN_IDEAS.md](DESIGN_IDEAS.md); what shipped lives in [CHANGELOG.md](CHANGELOG.md).

Last updated: November 16, 2026 (version 0.24.9).

## Built

| Idea | Version | Notes |
| --- | --- | --- |
| Test button for unlimited money | 0.6.2 | Footer "Test tools" opens the cheat console. |
| Market screen without sideways scrolling | 0.7.0 | Compact rows; tap a row to trade. |
| Smaller chart with a travel column beside it (desktop) | 0.16.1 | 1180 px and wider; phones stay stacked. |
| Pick a job from Best runs | 0.16.1 | Accept button on local rows; deadline and bays shown. |
| Price age on logged markets | 0.7.0 | Shows days old; "≈" at 3+ days. |
| Every good can have a big payoff (events start and end) | 0.7.0 | Timed events; water and food triple. |
| Paid newspaper | 0.7.0 | Full edition lists all crises; price scales with difficulty. |
| Multiple escorts that level up and cost more | 0.7.0 | Up to three, wages per jump. |
| Difficulty-based help | 0.7.0 (started) | Days-left shown only at Beginner and Easy; price gauge hidden at Hard and Impossible. |
| Dismiss-escort confirmation popup | 0.7.1 | In-game dialog. |
| No game over; captured or boarded instead | 0.8.0 | Lost fights cost cargo; boarding only at higher wealth. |
| Crew with roles, backstories, loyalty, story moments | 0.8.0 | Six characters; initials as portraits for now. |
| Jail, bail, kidnapping with ways out | 0.8.0 | Wait, bail, breakout, crew rescue. |
| Marauder offers (protect or carry) | 0.8.0 | Heat system added. |
| Short-term ship rental | 0.8.0 | Deposit, daily rate, return at the same port. |
| Ship card on click; planet card on click | 0.8.0 | In-game dialogs. |
| Distance list instead of the dot map | 0.8.0 | Every port by distance and range. |
| Refuel button on the destination card and map bar | 0.8.1 | Appears when the jump needs more fuel. |
| Travel style, incidents, paper subscription, job board, hold meter | 0.10.0 | Three incidents; more can follow. |
| Escort avatars and backstories | 0.10.3 | Initials for now; real portraits are a backlog item. |
| Auto-route ("Go there for me") | 0.11.0 | Beginner to Normal. |
| Warp charges | 0.9.0 | Instant jump or battle escape, 2k cr. |
| Fuel help scaled by difficulty | 0.8.3 | Beginner full list, Hard none. |
| Route suggestion for out-of-range ports | 0.8.2 | Cheapest hops within range. |
| Livelier market (icons, price gauge, EVENT tag) | 0.8.0 | Gauge hidden on Hard and Impossible. |

| Leaderboard + race a rival AI to retire | 0.16.0 | Opt-in rival at new game; local leaderboard; Gold Seal Deed prize. Rival is a pacing model, not a live trader. |

## Player feedback 2026-11-15 (0.16.3)

Built: battle pop-outs, help button, newspaper chip, route banner and cross-Reach route drawing, Trip report, cargo-reserve wording, Activity log, 900 px side-by-side layout. See `reviews/2026-11-15-player-feedback.md`. Open: accept remote jobs from afar (owner decision), to-scale chart option, travel animation.

## Navigation tab length (2026-11-16, built in 0.24.0 and 0.24.1)

Sean: too much scrolling on Navigation. Audit in [reviews/2026-11-16-ui-length-audit.md](reviews/2026-11-16-ui-length-audit.md). Built in 0.24.0 (items 1 to 4): duplicate panels removed, one-row jobs (best highlighted), compact destination panel, vessel card replaced by a hull tile with ship thumbnail. Measured: desktop 3,354 px to 1,911 px (2.12 screens), Travel inside the first screen; phone 3,169 px (3.75 screens), Travel still at 1,373 px. `check-layout.cjs` guards this. Items 5 (crisis flame and job-count markers on map planets) and 6 (phone Travel in the bottom pill) built in 0.24.1; phone Travel is now reachable without scrolling. Watch item: flames may be too common to stand out; see DECISIONS.md. Known: `check-review.cjs` Beetle vs Gnat profit assertion fails at the committed baseline too (353,367 vs 1.3 x 298,346); unrelated to this change, needs a balance decision.

## Deferred (not built yet)
- Seasonal calendar (idea, not built): a year of named seasons (for example 24 days each) that give a gentle, readable rhythm: a seasonal price tilt on a few goods, a port festival day with a small bonus, and a Year N, Season label next to the day. Why: long-term engagement research (Stardew-style seasonal pacing, natural session chunks, anticipation). Risks: it shifts price balance, so the trade simulation, the review checks and the Hard and Impossible tuning would need re-running first. Keep it optional or very mild.
- Rival tuning: retire-day table (`RIVAL_DAYS`) is a first guess. Needs real playtest pace per difficulty. Online/shared leaderboard needs a server, so it is not built.
- Sound: redo the sound effects (the first synthesized set was rejected). Code is in place behind `SOUND_ENABLED=false`; needs better sounds or real audio files, then a Sound toggle in dock services.
- Mid-flight art: a police cutter and a marauder ship picture (both use the pirate ship for now); show customs inspections in flight (they happen after docking today).
- Cutaway scene cards (owner idea, Nov 15, 2026): short scene cards for key moments (pirate intercept, customs scan, arrival, big delivery), later as small AI-generated clips. The CSS jump scene (`jumpScene`) is the placeholder: it already switches for pirates, marauders, customs (police) and incidents. Needs: side-view ship art (the shipyard art is an angled 3/4 view, rotated in the scene for now), real pirate/police/marauder ships, and a clip format that stays small in a single HTML file (short looping WebM/WebP, loaded on demand).

| Idea | Why deferred | Next step |
| --- | --- | --- |
| **More crew story.** Only two story moments per character exist; more arcs, more characters, faction reputation, and complications during jobs. | Needs writing. | Draft more beats; add jobs that go sideways. |
| **Real portraits.** Crew show initials. Needs images in the ship-art style, supplied by Sean. | Needs art. | Sean generates portraits; Claude wires them in. |
| **Equipment drawn on the ship image.** The ship card now lists slots, but guns, bays, and shields do not yet appear on the picture. | Needs new ship art. The current ship pictures are fixed images. | Decide the art approach, then add overlays or per-loadout images. |
| **Artwork pass (owner reminder, Nov 16, 2026): characters, ships, and more, TBD.** Sean wants to come back to the artwork: crew/character portraits, ships, and other art still to be decided. | Needs scope and style decisions from Sean; art is generated outside the build environment. | Sean lists what he wants first. Research and plan: [ART_DIRECTION.md](ART_DIRECTION.md). Related rows: Real portraits (PORTRAITS.md), New ships, Equipment drawn on the ship image, Better planet and ship graphics, mid-flight art (police, marauder), cutaway scene cards. |
| **Better planet and ship graphics.** Sean says the planets and ships look poor; static ship images are fine. | Needs a decision on style. Planet checks (`check-planets`, `check-solar`) assert the current textured planets, and need `@napi-rs/canvas` to run. | Try clean, flat planets and larger map planets; fix the ship icon overlapping labels; run checks on the PC. |
| Easier levels get more help (route hints, friendlier tables) | Route-finding must stay the player's job. | Playtest the 0.7.0 aids first. |
| DONE 0.15.0. Events at game start: lore text describes early events as ongoing | Lore says "cold spell" and "shooting war" as permanent. | Reword port history so it reads as a past or recurring condition. |
| **New ships (owner request, Nov 15, 2026).** More ships, especially huge freighters for bulk freight runs. Today there are 10 ships (Flea to Wasp, 10 to 60 bays; Termite is the biggest hold). | Needs painted ship art in the existing style (no image generation in the build environment) and stats. | Sean makes art (ComfyUI) and picks names; Claude adds them to the catalog, Store, ship card and atlas, then re-tunes bulk pay. Ideas: a 100-bay and a 150-bay hauler with short range, so far runs need refuel planning. |
| **Bulk freight pay tuning (0.23.3).** Pay is 400 + bays x pc x 4 (x1.4 crisis), one run per port for ships with 20+ bays, 16 to 45 pc away, cargo 75% of bays (min 16). Not yet simulated against normal trading. | Needs playtest and a sim run to see if it dwarfs buy-low-sell-high on big ships, or is too thin on small ones. | Run the sim with a Beetle and a Termite; compare cr per day to trading; adjust the 4 cr per bay-pc rate, add risk (pirates scale with cargo value) or a rank gate if too rich. Also consider a reputation bonus for repeat clients and a ship-goal reward on first delivery. |
| Firefox, Edge, and Safari testing | No Firefox available in the build environment. | Sean to try Firefox and report; add notes to PLAYTEST_RESULTS.md. |
| iPhone/Xcode build | Needs a Mac. Left alone on purpose. | See IPHONE_ROADMAP.md. |

## Notes

- Save slot name `space-trader-chrome-preview-v1` is just a storage key. It is not browser-specific.
- Draw equipment (lasers etc.) on the ship image itself.
- Create the 24 character portraits (see PORTRAITS.md); optionally bake into the HTML.
- Make dimmed (non-event) buttons keyboard-focusable: needs the guide and CSS selectors moved off `[disabled]` first.
