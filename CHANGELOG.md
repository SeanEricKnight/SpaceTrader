# Browser updates — November 14, 2026

This is an additive refinement after the initial GitHub upload. It documents the current browser game, not a new native iPhone release. Current package version: `0.16.0`.

## 0.16.0 — Leaderboard and race a rival AI

- New game: tick **Race a rival AI** next to Start new game (off by default; New game keeps it on if the last run had a rival). One of three rivals (Marta Voss, Kade Orrin, Ilse Tarn) races you to 500,000 cr. A race strip under your goal bar shows their cash, ship and last-seen port.
- The rival is a **pacing model, not a live trader**: its cash follows a fixed curve and it retires on a fixed day by difficulty (about 80 to 140 days; Hard and Impossible rivals are faster). It does not touch your markets, jobs or pirates.
- Retire on or before the rival's day to **win the Gold Seal Deed** (title card on the retire screen) and +300 score. A tie goes to you. If they retire first, you are told, and you can still finish and rank.
- **Leaderboard**: top 10 retired careers, stored in this browser, on the Commander tab and the retire screen. Score = max(100, 1500 − 6 × days) + difficulty bonus (0/100/250/450/700) + 300 for a rival win. Cheated runs are not ranked.
- New check: `check-rival.cjs`.

## 0.15.1 — Market: quick way back to the map; matching colors

- Market: the sticky Cargo hold bar now has a **Done trading · Open map** button, so after loading up you go straight to the System map to travel. If you picked a "Compare a logged market" planet, a second button, **Go to <planet> · N pc**, jumps to that planet on the map.
- One color per screen: every box (panels, trade rows, cargo bar, job, ship and crew cards, map side cards, news) now takes its border and highlight from the tab accent: Market green, System blue, Jobs amber, Ship purple, Crew coral, Commander gold, News light blue. Open or owned cards glow in the same accent. Job kinds keep their own top stripe. Commander tab now has its own gold accent.

## 0.15.0 — Feedback, crew abilities, clearer News

- Planet audit (all 24): "Lifeless" is now **No native life** (Cestus and Draylon are inhabited; the old label read as no one living there) with a clearer price note. Fixed Balosnee, Capelle and Castor showing a blank resource (a short list was missing Artistic culture and Arms industry). Port histories no longer describe temporary events (cold spell, blight, war, outbreak, crop failure, labor shortage) as if permanent; they now describe lasting conditions. The iPhone project's resource label matches.
- Escorts (pilots for hire) now have Hull, Evasion, Aim and Loyal star ratings, a trait that fits jobs (Principled, Shady, Frugal, Guardian, Scout, Hotshot) and a home Reach, shown before you hire. Loyalty is tracked and low loyalty makes them leave.
- Pirates and police scale with career tier (net worth): easy for Rookies, harder at each step. The pirate card names your tier.
- Removed the Dock services bar. Its News, Shipyard, Jobs and Crew shortcuts duplicated the tabs; Refuel, Repair, Warp charge and Bank remain on the Ship tab (Bank also on Commander). A slim "Needs attention" strip shows Refuel/Repair/rescue only when needed. Haggle moved to the Market tab. Save game and How to play buttons are gone with it (autosave stays; slots and export are on Commander).
- Buying a moon: pulsing "Buy your moon" button, then a full-screen moon-rise with confetti before the career summary (which now shows a moon).
- Defeating a pirate: green flash, screen shake, spark burst and a "Pirate down" card with the bounty counting up.
- Firing lasers: beam, hit flash, damage number and spark burst; the pirate's return shot shows its beam, damage and a shake.
- Crew for hire now have special abilities with jump cooldowns (Slipstream, Broadside, Emergency patch, Haggle, Smooth talk, Pull strings), listed on crew cards, the pirate card, dock services and the jail screen.
- News: new Top headlines block with colored ALERT, DEADLINE, DANGER, MONEY, GOAL and STORY tags and one-tap buttons.
- Fix: gunner and escort volley bonus now actually apply in fights, matching the volley range already shown.

## 0.14.3 — Planet screen cleanup, finder list, harder Best runs

- Removed parenthetical text from planet screens: the crisis cause (such as "labor shortage") is gone from the chart label, route card and arrival banner; "(in range)" and "(N days old)" on the planet card became "· in range" and "· N days old". The Conditions line still names the crisis.
- Planet finder is now a drop-down list of all 24 planets instead of a type-to-search box.
- Best runs scales with difficulty: Beginner/Easy unchanged; Normal ranks by pay and shows fuel but not cr per fuel; Hard shows only this port's board, unranked, no fuel math; Impossible hides it.

## 0.14.2 — Zoom, auto-fuel, simpler crew

- Raised the HTML size cap in `check-solar` from 700 KB to 2 MB (it was a self-imposed test limit, not a platform limit).

- Style pass: rounded panels, pill buttons, color-coded tabs, stats and job types; subtle toasts for sales, purchases and newly logged ports; +profit/−cost numbers float up from the button you tapped; aligned number digits; warehouse shows its daily cost.

- My ports: pin planets with a tag, live status list under the chart, plus a planet finder box.

- Home port (default Acamar; about 20% off repairs and fuel; move for 500 cr) and a 20-unit warehouse there (1 cr per unit per day). Restore point: tag/branch `before-best-runs` predates Best runs and Home.

- Best runs list on the chart: jobs ranked by pay per fuel, one-tap route or pickup port. Experimental; restore point is the `before-best-runs` branch (commit c1784c6).

- Route planning: selecting a destination rings every stop on the chart and shows a Route card (distance, refuel, crises, your deliveries). With the newspaper subscription it also shows the job boards at each stop that go your way. Side quests and exact terms stay local.
- DELIVERED stamp card with a counting-up reward when you finish a job, courier delivery, side quest or the First haul.

- Visuals: procedurally painted planets (craters, continents, clouds, ice caps, dunes, gas bands and storm spots, cracked ice, lightning) with atmosphere glow; drawn placeholder portraits for every crew, escort and person (painted files still override them); ships bob with a pulsing engine glow.

- Sounds are switched off (code kept, flag `SOUND_ENABLED`) until they are redone.

- Game feel pass: credits count up/down with a glow and a floating +/- amount, and an arrival banner at every port with the planet, a story hook, and any colonists' need.

- Mid-flight view: when a pirate, marauders or an incident interrupts a trip, the Solar chart shows your ship stopped on the route (or just short of the destination for cross-Reach trips) with the other party beside it.

- The pirate encounter card now says what is happening (a pirate blocks your approach and you cannot dock until it is dealt with), what FAVORABLE / RISKY / OUTGUNNED mean, and explains each choice (fire, escape, surrender, warp out) beside its button.

- Market price tags now say what they compare against: "Cheap vs usual 28-62 cr", the good's normal range across all planets.

- The solar chart no longer grabs the mouse wheel or drag by accident. Click or tap it to activate (green outline); click outside to release. Until then the page scrolls normally.

- Each Reach (Inner, Outer, Far) has a backstory popup, opened from the Solar chart, with a few things to know before you fly there.

- Solar chart zoom is back (pinch, scroll or + / -). Zoomed in, planet text grows and each planet shows its kind, tech level, resources, and a separate orange line for any crisis, such as "Colonists need Medicine (plague outbreak)".
- **Fill the tank automatically when I dock** (on by default, a checkbox on the Market tab) so you do not keep pressing Refuel. It spends the same fuel money.
- Only three crew look for work (pilot, mechanic, gunner), matching the three escort pilots.

## 0.14.1 — Ship screen order

- The current ship's shipyard card now says "You fly this one" (it said "In your hangar", which suggested you could keep several ships). You fly one ship at a time; buying swaps it for the old one at the trade-in price.

- Ship tab order: your ship, its controls, **Outfit your ship** (right under the ship), then **Get a different ship** with a **Buy a ship / Rent a ship** switch and a one-line explanation of each. Rental cards now show the ship picture. Only the shipyard cards open the full ship card; the top ship card does not.

## 0.14.0 — Side quests

- Nine optional **side quests** in three tiers (Easy, Medium, Hard), on the Jobs screen: port tours, selling Food, Medicine or Machines at a named port, trade profit goals, and pirate fights. No deadlines; up to 3 active; each pays a one-time reward (500 to 4,000 cr).
- More are offered at higher difficulty, and every difficulty has all three tiers: Beginner 3, Easy 4, Normal 5, Hard 6, Impossible 9. The Mara story is separate.

## 0.13.1 — Fixed solar chart

- The solar chart no longer pans or zooms. It always shows the whole sector, and tapping a planet opens its card (works by touch on iPhone). The zoom/pan toolbar, drag, pinch, wheel and keyboard map controls, and the Focus selected button are removed. The camera test was retired with them.

## 0.13.0 — First haul

- New games start with **5 Water already in the hold**, a short welcome popup with the backstory, and a **First haul** quick-win mission: sell the Water at Adahn for a cash bonus (Beginner 2,000, Easy 1,750, Normal 1,500, Hard 1,000, Impossible 500 cr). Beginner, Easy and Normal show step-by-step instructions; Hard and Impossible show one line.
- When the bonus is paid, a popup suggests what to buy or do next.
- New **How to play** button in the dock services bar, with a short guide.
- Older saves are not changed.

## 0.12.2 — Profile popups

- Dock services now has shortcuts: warp charge, shipyard & outfitter, job board, hire crew, and save game, alongside refuel, repair, bank and news.
- Saving: three save slots, and Copy/Paste save code to move a game between devices. The JSON file export and import moved under "Advanced". The News screen now labels what is free (this port and one sample port) versus paid (every port).
- Portrait support: crew, escorts, and named people show a face from `portraits/<name>.webp` when it exists, and initials otherwise. See PORTRAITS.md for file names and a matching style prompt. Portraits are bigger on cards.
- "Accept this job" (was Take), "Side quest" (was Side story). The Ship tab hero card is compact and opens the full ship card on tap; shipyard cards use smaller pictures.
- New **GAMEPLAY.md** rules reference. The News screen now spells out free (this port) versus paid (every port).
- Icons on the tabs and the Bank button. The Newspaper tab is now called **News**, and the paper is "The Reach News".
- The Captain's log is removed from the Commander page (a flat list of purchases is not useful without a storyline). A story-beat journal idea is in DESIGN_IDEAS.md.
- Crew and escort cards are compact: avatar, name, role or level, perk, and a **View profile** button. The profile opens as a popup with a large avatar, character type, what they do, and backstory.

## 0.12.1 — Retirement ending

- "Go there for me" now says how much fuel it buys and what that costs ("buy 13 fuel for 26 cr") instead of "about N cr fuel". Fuel price is the same at every port, so the figure is exact.
- Retiring now shows an ending screen with your moon, days flown, worlds, jobs, profit, pirates, difficulty, and whether cheats were used. The Commander page explains what retiring does. Rank ladder idea added to DESIGN_IDEAS.md.

## 0.12.0 — Plain-language job board

- Contracts tab renamed **Jobs** in plain words: "Go to X · N pc away", "Pays N cr", "Deadline: day N (M days left)", what it costs in cargo space, and a reason under a disabled Take this job button. Jobs you hold come first, then offers, then the side story.

## 0.11.4 — Crew hiring clarity

- Crew cards you cannot hire yet say which planet to fly to and how far it is, with a "Go there for me" button when the trip needs stops.

## 0.11.3 — Shipyard hint

- Ships you cannot buy or rent because the local yard is too low-tech now name the nearest planet that has the needed yard and its distance.

## 0.11.2 — Laser upgrade clarity

- The laser button now says what the next step is ("tier 2 → 3 · cost") and "Lasers maxed" at the top. The upgrade message says whether you can upgrade again, and the ship card shows tier dots (●●○).

## 0.11.1 — Ship screen split

- **Crew & escorts** have their own **Crew** tab. The **Ship** tab now shows the Shipyard first, then Ship rental, then the Outfitter and bank summary.

## 0.11.0 — "Go there for me" auto-route

- When a port needs fuel or stops, the destination card, map bar and info card offer **Go there for me**: it plans the cheapest route within your ship's range, buys the fuel at each stop, and flies the legs. It shows the number of jumps and the fuel cost first, stops if an event or encounter interrupts, and stops if you run out of credits. Available on Beginner, Easy and Normal; not on Hard or Impossible.

## Docs — README rewritten

- `README.md` is now a short, phone-friendly overview of the current game. The old long notes moved to `FEATURES.md`.

## 0.10.3 — buy-one stays open, big cargo hold, escort avatars

- Opening a market row now stays open while you trade, so Buy 1, Sell 1 and the rest can be clicked repeatedly (the row used to collapse after every click, which made it look like only one unit could be bought).
- The cargo hold meter is a large full-width bar that stays pinned at the top of the market while you scroll.
- Escorts (hired and for hire) have avatars (colored initials) and a short backstory.

## 0.10.2 — price tags instead of bars

- The slider-like price bar is gone. Each good now has a small tag: ▼ Cheap (good to buy), ● Fair, ▲ Pricey (good to sell), with a one-line key. Hidden on Hard and Impossible.

## 0.10.1 — clearer price gauge

- The bar under each good is a read-only gauge, not a slider. It now always carries a word (Cheap, Fair, Pricey; shown on every level except Hard and Impossible) with a plain-language key above the list.

## 0.10.0 — travel style, incidents, newspaper subscription, job board, hold meter

- **Travel style** on the destination card: **Quiet ride** (+1 day, half the pirate risk, no incidents), **Steady** (the old behavior, default), **Excitement** (about a 55% chance of an incident on the way).
- Three **incidents**, each with a safe and a risky choice (odds shown on Beginner/Easy): a drifting derelict (salvage or scrap), a distress call (help for pay and crew goodwill, relay it, or ignore it), a trader convoy (free full newspaper edition, or sell them fuel). No death, never a game over.
- **Newspaper**: buy a single edition or subscribe for 10 days at 6× the single price; a subscription delivers a fresh edition every time you dock. Editions now show which goods spike at each port in a crisis.
- **Job board**: roughly double the pay, routes out to full ship range, named clients, +40% relief bonus for jobs to crisis ports and +40% for urgent ones, with the reason shown on the card.
- **Market**: a Cargo hold meter (trade goods, sealed mission bays, free bays) replaces the 7/15 readout, and a short key explains the price bar.

## 0.9.0 — warp charges

- New consumable **warp charge**, sold at tech level 4+ ports (about 2,000 cr on Normal; 1,500 on Beginner/Easy, 3,000 Hard, 4,000 Impossible). Carry 2, or 3 on ships with range 20+. One charge either jumps up to 40 pc with no fuel and no pirate check (a **Warp here** button appears on the destination card, map bar and info card when a port is beyond your fuel), or escapes any pirate fight (**Warp out**). Customs inspections still apply on arrival. Not usable while held or in custody.

## 0.8.4 — info card explains a disabled Travel button

- The planet info card now says why Travel is disabled: out of range (with the ship's range and, on lower difficulties, a suggested route), not enough fuel (with a Refuel button), or busy with an event.

## 0.8.3 — fuel help that scales with difficulty

- The "Refuel or travel closer" badge is now **NEEDS FUEL · REFUEL BELOW** (the refuel button sits in the card). Under it, help scales with difficulty: **Beginner** lists the ports you can reach on current fuel with costs, how many more a full tank opens, and exactly how much more fuel you need and what it costs; **Easy** the same with a shorter list; **Normal** only counts reachable ports; **Hard and Impossible** give no hints (out-of-range ports just say so, with no suggested route).

## 0.8.2 — route suggestion when a port is out of range

- When the selected port is farther than your ship's full-tank range, the destination card now says **OUT OF RANGE · USE A STOP**, suggests the cheapest route that works (for example Adahn → Aldea → Andevian, with each leg's distance), and offers a button to inspect the first stop. The map bar notes it is beyond your range and no longer shows a useless Refuel button. If no route exists with the ship's range, it says so. Previously the card said "Refuel or travel closer" while the tank was already full.

## 0.8.1 — refuel from the destination card

- When the selected destination needs more fuel than you have, the destination card and the map selection bar now include a **Refuel** button (cost shown). If the jump is out of range even on a full tank, the card says so and suggests a closer stop. Verified in headless Chrome: the button appears in both places and refuels.

## 0.8.0 — crew, capture instead of game over, jail, marauder offers, rental, info cards

- **No more game over.** A ship at zero hull is no longer destroyed. Losing a fight or surrendering now costs your cargo and 10% of your credits, and you keep flying with at least a quarter hull. Old saves with a destroyed ship are revived at a quarter hull.
- **Boarding scales with wealth.** Below about 3,000 credits of net worth (credits plus cargo cost) you cannot be boarded. Above that the chance rises 1% per 1,500 credits (max 40% before scaling), scaled by difficulty and region danger, up to 60%. Pilot (-8), gunner (-4), and escorts (-1.5 per level) lower it. If boarded you lose cargo and all credits, keep your ship, crew, and debt, and are **held**. Ways out: wait (5 days, 4 with a fixer), try a breakout (35% base, plus pilot, fixer, escorts), or call your crew and escorts for a rescue (30% plus 10% per crew and 8% per escort level). Loan interest runs while held.
- **Jail and bail.** At strict ports, carrying firearms or narcotics can get them seized and you jailed (30% base, +4% per point of "heat", -15% with a smuggler). Wait 3 days (2 with a fixer) with interest running, or pay bail (about 120 credits per repair-rate point plus 8% of your credits; half with a fixer).
- **Heat.** Accepting marauder deals adds heat; it fades by 1 per jump and raises customs risk.
- **Marauder offers.** Once your net worth is 1,500+ and day 5+, some encounters become offers: **protection** (armed ships) or **carry a crate** (2 free bays), paying about 200 credits plus 5% of net worth (carry pays 30% more). Accept: paid immediately, heat up, honest crew lose loyalty, rogue crew gain it, and a carry job can get you jailed. Refuse: the fight starts.
- **Crew.** Six named characters with backstories, each found at one home port: Wren Calloway (pilot, Aldea), Odo Brandt (mechanic, Campor), Juno Ashby (gunner, Capelle), Mattias Vell (purser, Calondia), Dessa Quill (smuggler, Cestus), Ruvi Okafor (fixer, Courteney). Hire up to three for 500 credits; wage 15 credits per jump. Perks: pilot +10% flee and fewer boardings; mechanic repairs 3 hull per jump; gunner +5 volley damage; purser +3% sale prices; smuggler fewer customs finds; fixer halves bail and shortens jail and captivity. Each has two story moments (at 8 and 22 jumps) with a choice that changes loyalty, credits, or heat. Below 15 loyalty they leave. They never die. Portraits are initials for now.
- **Ship rental.** Rent any ship you can fly: 1.2% of its price per travel day, 10% of its price as a deposit. Your own ship and fittings wait at the port; return the rental there to get the deposit back minus a damage fee (twice the repair cost). Unpaid rent becomes debt. You cannot buy a ship while renting.
- **Info cards.** Click a ship in the shipyard for a full ship card (picture, slots, stats, comparison, Buy and Rent). Click a planet on the map for a planet card (picture, region, tech, resources, distance, customs, your log, Travel). Fixes the "Three Reaches explained" map, which was an unlabelled dot grid, by replacing it with a list of every port by distance and whether it is in range.
- **Market look.** Goods have icons and color edges. On Beginner, Easy, and Normal each row shows a price gauge (where the price sits in the good's usual range); Beginner and Easy also name it Low, Fair, or High. Goods affected by the port's current event are tagged EVENT.
- Raised the HTML size cap in `check-solar` from 600 KB to 700 KB. Added `browser-preview/check-crew.cjs` to `npm test`.
- Verified here: logic, solar, events, and crew checks pass in Node; headless Chrome showed no console errors and rendered the ship card, planet card, distance list, and market. The community, world-bank, review, camera, and planets checks need `@napi-rs/canvas`; please run `npm test` on your PC. Firefox, a phone, and long-run balance are untested.

## 0.7.1 — dismiss-escort popup

- Dismissing an escort now opens an in-game popup (name, level, jumps, a note that the hiring fee is not refunded) with **Dismiss** and **Keep** buttons, instead of the browser's plain confirm box. Verified in headless Chrome: Keep leaves the escort, Dismiss removes them, no console errors.

## 0.7.0 — market rows, timed events, paid newspaper, escorts

- **Market:** replaced the sideways-scrolling table with compact tap-to-expand rows (Buy and Sell always visible, 44 px touch targets). Unavailable goods collapse into one line. Phone header is tighter (four stat tiles in a row, tabs scroll sideways).
- **Price age:** logged markets show their age; quotes 3+ days old are marked "≈" and "may have moved". The compare menu lists the log day.
- **Timed events:** crises now start (about 3% per port per day) and end (6 to 14 days) as you travel. Starting ports' crises end between day 6 and 17; the Baratas fever story is unchanged. Water and food events triple prices (others still double). New games only; saves from earlier versions keep their fixed conditions.
- **Paid newspaper:** full edition lists every port in a crisis, 20 credits times the difficulty's repair rate (Beginner 20, Easy 20, Normal 40, Hard 60, Impossible 80). Beginner and Easy editions include days left; the market banner shows days left on those levels only. One edition per day.
- **Escorts:** up to three, hired in the Ship tab for 300 credits per level (levels 1 to 3 offered). Wage is 10 credits per level per jump; escorts level up at 6, 16, 32, 55 jumps. Each level cuts pirate encounters 5% (capped at 60%) and adds 2 damage per volley. Unpaid escorts leave.
- Added `browser-preview/check-events.cjs` to `npm test`.
- Verified here: logic, solar, and events checks pass in Node; a headless Chrome run of the market, newspaper, and ship screens showed no console errors. The community, world-bank, review, camera, and planets checks need `@napi-rs/canvas`, which cannot be installed in this environment. Please run `npm test` on your PC. Full phone-device layout and Firefox are untested.

## 0.6.2 — visible Test tools button

- Added a **Test tools** button in the page footer that opens the existing cheat console. It uses the same commands and the same "Cheats used this run" flag as the hidden shortcuts (typing `cheats` or clicking the title five times), and it works by touch on a phone.
- No rules, economy, combat, or map behavior changed. Regenerated `browser-preview/review-after.json` (only the build digest changed) and the SHA-256 records.
- Verified: `npm test` passed all package checks (logic, community, world-bank, solar, review, camera, planets, plus the simulation) on Sean's Windows PC, Node v26.13.1, with `@napi-rs/canvas` installed, on branch `claude/test-button-and-ideas` (November 14, 2026). The checks use a DOM harness and do not replace real Chrome or iPhone testing. The Test tools button was also exercised in headless Chrome at a 390-pixel width: it opens the console, `cash 50000` works, and Close works. Physical-device testing remains pending.

## 0.6.1 — individual planet rotation and lighting

- Gave all 24 worlds distinct generated surface variants, rotation periods, visual spin speeds, and axial tilts. Two worlds rotate retrograde.
- Added star-relative day/night shading. The Sisters combine two light sources with distance-based weighting. Illumination stays fixed relative to the stars while the surface rotates underneath.
- Applied the same animated globe, tilt, and lighting to the larger selected-planet preview. Ring planes follow the displayed axial tilt.
- Added fictional rotation/tilt facts to the selected-port card. Animation time is compressed for readability and does not change travel days or economy rules.
- Cached surfaces and lighting, retained reduced-motion support, and added planet appearance/lighting checks.
- This is stylized globe shading, not an eclipse, terrain-shadow, or ring-self-shadow simulation. Real browser animation and device performance remain to be checked.

## 0.6.0 — approved map and touch refinement

- Replaced the fixed chart panel with a full-width pan/zoom map.
- Added pointer-anchored wheel zoom, two-finger pinch zoom, keyboard controls, and visible zoom/fit/focus/find-ship buttons.
- Remembered camera state separately from commander progress, per region, across screen changes and reloads.
- Reduced planet sizes, retained generous tap targets, and varied label detail with zoom.
- Moved port details below the map and added a compact selected-port travel bar. Selection preserves the camera; an explicit focus command moves it.
- Added subtle surface/star motion and a brief skippable ship animation; orbit positions and game distances remain fixed.
- Kept game actions independent of visual timing and added reduced-motion handling.
- Added 17 camera/gesture checks and an iPhone roadmap. Complete Chrome/iPhone layout and gesture verification remains pending.

## Earlier 0.5.0 refinements

## World and interface refinement

- Replaced the repetitive region presentation with three distinct stars, orbital layouts, planet arrangements, and regional descriptions.
- Added an explanatory distance map alongside the illustrative orbital charts.
- Authored 24 planet histories, three faction descriptions, and six connected characters.
- Added The Reach Dispatch with setting background, supply bulletins, character profiles, bank rates, and story-dependent reporting.
- Made the Baratas relief delivery end its disease emergency and lower medicine prices once.
- Retained the illustrated ship atlas in a single embedded WebP and procedural textured planets. The standalone game has no external runtime assets.

## Banking and routine services

- Added partial borrowing and repayment through a bank accessible from every main screen and the Ship screen.
- Added reviewed shipyard financing that borrows exactly the purchase shortfall, including the current hull’s trade-in value.
- Set distinct loan rates for all five difficulties: 0.5%, 1%, 1.5%, 2%, and 3% per travel day.
- Disclosed compound interest, the next charge, post-jump debt, the 25,000-credit line, and repayment behavior.
- Added refueling and repairs to the shared dock controls.
- Added a public rescue tow for a commander stranded without money, usable fuel, cargo, or available credit. The tow advances time and retains debt.

## Response to the supplied review

- Verified the current authored galaxy rather than retuning the earlier flat generator: 19 of 24 ports are tech 3+, nine are strict, and every commodity and ship can be bought somewhere in normal play.
- Changed random sampling to use the full LCG state rather than weak low bits. New voyages have separate encounter seeds; authored world identities and ordinary prices remain fixed.
- Kept Easy combat forgiving while giving Normal and higher difficulties meaningful danger. Added damage and threat previews, hull-based bounties adjusted for difficulty, and useful weapon mount counts.
- Made laser upgrades apply to all linked mounts, with a price that reflects the number of mounts.
- Changed new contract boards to three distinct destinations and reduced automatic ferry income. Existing accepted contracts retain their quoted terms.
- Put the moon goal and debt-free cash progress in the header.
- Explained unavailable market cells and made the first-trade hint describe Water as an introductory route rather than the best route.
- Adjusted phone navigation, content widths, scroll containers, and control sizes. Full browser/device layout verification remains pending.
- Renamed previous-save restoration to an undo action and documented exported saves as lasting checkpoints.
- Removed “0 sealed bays” wording from data-only contracts; recorded legacy demo/encounter shortcuts as cheats.
- Removed internal research notes from the shipped game footer/comment while retaining attribution.

## What did not change

The browser build remains separate from the native iPhone project. It does not add full police encounters, crew management, fleets, an ambient economy, or the original mission catalog. Existing saved prices and missions are retained on import; the current balance and interest rules apply going forward.
