# Browser updates — November 14, 2026

This is an additive refinement after the initial GitHub upload. It documents the current browser game, not a new native iPhone release. Current package version: `0.8.2`.

## 0.23.3
- Fixed the pirate/encounter card and the bank pop-up being cut off at the bottom on iPhone Safari. They were sized to the tallest possible screen (92vh), which is taller than what you can see once the browser bars are showing. They now fit the visible screen (dvh), scroll inside if needed, and keep clear of the bottom bar.
- New **💾 Save** button in the page footer and at the bottom of the Help pop-out: says the game autosaves after every action, offers the three save slots and Export without opening Commander.
- New **↺ Reset** button beside it, in the footer and in Help (set apart from the other buttons so it is hard to hit by accident). It opens a card that says what will be replaced, offers "Export my save first", and keeps the same difficulty. After a reset, Commander's Restore button brings back the previous run. Before, starting over was buried in the collapsed "New game / difficulty" strip and Commander. Footer buttons (Log, Save, Reset, Test tools) now sit in one aligned row of equal-size touch targets.

## 0.23.2
- Market now shows what you carry: a "What you are carrying" card at the top lists each good with quantity, what you paid, what this port would pay in total (including the price drop from selling), profit or loss, and a one-tap Sell all. Goods you carry are also highlighted in green and moved to the top of the price list, and goods this port will not buy say so. An empty hold shows a one-line next step.
- Fixed pop-up cards (planet info, Show route, help, job details) opening at the top of the page instead of over the screen. On a phone, if you had scrolled down, you saw only the dark backdrop until you scrolled back up. The pop-up is now fixed to the screen. Cause: `#info-dialog{position:relative}` overrode the browser's fixed positioning for modal dialogs. Verified at 375x812.
- Fixed the Open Market / Open Jobs buttons in the Cargo, Credits, Fuel and Location pop-outs doing nothing. They changed the tab behind the pop-up but never closed it, so nothing seemed to happen. They now close the pop-up and open the tab.
- Switching tabs on a phone now scrolls the new tab's content into view when it would otherwise sit below the screen, so tapping Market, Jobs, Crew and the rest visibly does something.

## 0.23.1
- Guide fix: after Buy max, "Show me" now picks the buyer port for you, lights the exact Travel button, and refuels first if needed (it used to say "pick a port and Travel" with nothing glowing). The guide's first trade is chosen to be genuinely profitable, including the new sell-price impact. Tested end to end at phone size.
- Markets now react to you: each unit you sell lowers that port's price about 1.2% (down to -30%), and it recovers about 12% of the gap per travel day. A "▼ flooded N%" chip and note explain it. Selling in several ports now beats dumping everything in one. (Buying does not move prices yet; stock already limits that.)
- New encounter: a crippled trader begs you to carry an urgent shipment (vaccine stock, a court ledger, a coolant core, a colony charter, prosthetics). Short deadline, about double pay, optional fuel gift for a tip.
- Currency is now written "1,000 cr" (the old ₡ glyph looked like the euro sign).
- Chance meetings are real conversations now: readable speech bubbles in the card, back-and-forth replies, and choices that can hand you a side job (replaces your lowest-paying job if you hold 3, no fine), a price board for a nearby port, or fuel trades. New encounter: a patrol officer.
- Jobs: at 3 jobs the Accept button becomes "Swap for one of mine…" (drop one, no fine, take the new one).
- Always-visible "Your jobs" tracker on every tab; tap a job for details, show destination, or drop it.
- Credits, Cargo, Fuel and Location boxes open pop-outs; Cargo lists goods, average paid, sell price here, and job-reserved bays.
- Story card uses the full width (button beside text).
- Fixed ⓘ pop-outs not opening (string ids were turned into NaN).

Player feedback pass (Nov 15, 2026).

- **Guide hint follows you.** After Show me, the glow moves to the next step by itself (Refuel, then Travel) and the page scrolls only if the target is off screen. The page no longer jumps back to the glowing button on every redraw or on the 30 second nudge; it scrolls only when you press Show me or the target changes.
- **Market buttons say what they do.** Buy 1, Buy max (n), Sell 1, Sell all, Dump (discard), with a plain line under each open row. Dump asks first and names what you lose. New help topic: Market buttons and terms.
- **Home port** card rewritten: where your ship is based, why it matters, and what Move home costs, with Tell me more.
- **Trading options** (compare, auto-fill, reserve) are now one collapsible card with a plain sentence for each, and the Cheap/Pricey key sits right above the price list.
- **Jobs:** the Market shows how many jobs are offered here and the best pay, with See jobs; the Jobs tab shows how many are new. Intro and empty-board wording rewritten.
- **Small print:** all small text is at least 14 px, and long static explainers (goals, prices, warp, loan interest, warehouse, saving, pirate strength) moved into ⓘ pop-outs.
- **Move cards:** the System tab button is now Move cards (drag). Drag the ⠿ handle to reorder cards or drop them under the map; the arrows still work.
- **Jump scene:** travel now plays a full-screen jump (charge-up, star streaks, distance countdown, arrival flash and planet, reward chips, New port and jump-milestone callouts). Pirates and incidents cut it short with an alarm. Tap or press Esc to skip; later jumps are shorter; reduced-motion players skip it.
- **Show-on-chart buttons explain themselves.** Pressing one (for example Mara's story) now scrolls to the selected-port bar and says what to do next; the story button reads "Show Acamar on the chart". Goals pop-out reworded.
- **Delivery cheer** now appears in the middle of the screen: bigger card, sunburst rays, gold screen glow, large count-up reward, phone buzz. Tap to dismiss.
- **Guide for far trips.** When the Water's buyer is farther than one tank (for example after you wandered off), Show me now walks you through it: Show it on the map, then Go there for me, which plans the fuel stops and flies the whole way. Before, it kept saying Refuel then Travel, which cannot work.
- **Jump scene ships fly level.** Your ship is turned to fly left to right with side-scrolling stars (the shipyard picture is an angled view). Pirates and marauders fly in from the right; customs scans show a police cutter with flashing blue and red lights.
- **Random events explain themselves and follow up.** Every choice in a trader convoy, derelict, distress call or marauder offer has a plain line saying what it does (the convoy wording is rewritten). After you choose, a result card shows what happened and what you gained or lost (credits count up, cargo, fuel, hull).
- **Jump scene no longer rushes.** Arrival results appear one line at a time on a plain report card (not pill buttons), and stay until you press Continue on a first, milestone or event jump. Ordinary repeat jumps hold about two seconds and still show Continue.
- **Fixed the pop-up jump.** Screen shake moved the whole page, which dragged fixed pop-ups (pirate fights, the jump scene) down and back up. It now shakes only the content behind and the card itself, and the card stays put.
- **Laser fire redone.** Ships face each other level; each linked weapon mount fires its own bolt with a muzzle flash, an impact flash and sparks; the pirate's return fire flies back at you, then the hit lands with a shake.

## 0.23.0

- Vows: pick an optional promise when you start a new game. Peaceful (no laser upgrades), Debt-free (no bank loans) or Lean hold (15 bays max). Your vow shows in the header and on Commander. Buying your first moon with the vow intact marks it kept and records it with your score. Settings and difficulty are unchanged; vows only add limits.
- Fixed a flaky test in the moon sell-back check.

## 0.22.1

- Early pirates now scale with difficulty. The Rookie-tier discount to pirate hull and damage is full on Beginner and Easy, 75% on Normal, 40% on Hard and 20% on Impossible, so a fight early on costs real repairs (Hard about ₡185, Impossible about ₡308 on a starter ship) instead of being free.
- Fly back button under the stats once the guide is done: one tap to return to the port you just left, with distance and fuel.
- Welcome back card when you load a saved game: day, port, ship, credits, jobs due and next goal. It goes away on Continue.
- Atlas progress (ports logged out of 24) sits beside the Next goal bar.
- Commander shows your best sale and best streak.

## 0.22.0

- Captain's guide: after the welcome card a slim guide bar stays on every tab and walks a new player through the whole loop in 5 steps: deliver the Water, buy a Cheap good, sell it for a profit at another port, take a job, finish a job. It advances by itself as you play. 💡 Show me makes the next button glow (it opens the right tab first) and explains why. If you do nothing for 30 seconds it glows on its own. Skip guide hides it. Existing saves past the first haul do not get it.
- Flow: after the guide, a Next goal bar (₡2k, 5k, 10k, 25k, 50k, 100k, 250k, 500k) always shows one near target with progress and a gold toast when you reach it. Sales show a 🔥 streak of profitable sales in a row.
- The first haul card no longer carries its own hint button; the guide bar replaces it.

## 0.21.2

- Job board cards are now compact rows (about a third of the height): kind icon, title, reward, and chips for distance, deadline, cargo, crisis bonus and standing, with the client on one line and a short Accept button. Same layout for Your jobs and Government requests. Modeled on notice-board lists in Monster Hunter and The Witcher 3 (icon, name, reward, one-line detail) and the dense contract rows in Elite Dangerous and Starsector.

## 0.21.1

- The welcome card and first message point to ? Help at the top right, not the old dock bar.

## 0.21.0 — Store tab and to-scale Star chart (2026-11-15)

- **Store tab.** Warp charges, laser upgrades, equipment and the Shipyard (buy, trade, rent) moved to a new 🛒 Store tab. The Ship tab now shows your ship, fitted equipment, Refuel and Repair.
- **Star chart (to scale).** On the System tab, "🔭 Star chart (to scale)" draws all 24 planets at their real positions, so the gap between dots is the distance in pc and equals the fuel used. A dashed ring shows your fuel range, dim planets are out of range, and selecting a planet draws the route with its distance. Tapping a planet still opens its card. The orbit chart stays as scenery.

## 0.20.0 — More equipment and milestones (2026-11-15)

- **Five new equipment items** (all use Equipment slots, so you choose): Auxiliary fuel tank (+4 pc range, ₡3,500), Reinforced plating (+20 hull, ₡6,000), Market analyzer (+0.02 sale rate, ₡8,000), Long-range sensors (-15% pirate risk, ₡9,000), Repair nanites (+2 hull per jump, ₡12,000).
- **Milestones.** 13 named milestones (First profit, Five figures, First blood, Whole galaxy, Landowner and more) unlock with a gold toast and are listed on the Commander screen. They give recognition only, never credits, so your totals stay explainable.
- Outfit cards say EQUIPMENT SLOT.

## 0.19.0 — Moons you can keep playing (2026-11-15)

- **No more ending.** Buying a moon posts your score once and returns you to the game. No confetti. A small card offers Keep trading and Career summary. Old retired saves get a Keep flying button.
- **More moons.** Each costs 250,000 more than the last, pays 0.2% of its price per travel day as rent, and can be sold back for 75%. One moon per port.
- **Crew profiles** show a loyalty meter, ability, wage and a Hire button when you are at their port. Portrait crops focus on the face; one image serves both sizes.

## 0.18.1 — Crew cards, bank prompt, checks repaired (2026-11-15)

- **Crew cards open their profile when tapped** (bigger portrait, "What they do well", "About them"). Cards say "Good at:". One portrait image serves both sizes.
- **Bank offer.** When you need fuel and cannot afford a fill, the Needs attention bar adds "Short of cash? Open bank".
- **Help:** the travel topic explains the three Reaches.
- **All package checks pass.** The old checks were out of date with earlier changes (wording, home-rate repair price, career-scaled pirates, escape odds 85 for a navigation-equipped Rookie on Normal, drought triples water, file size budget 900 KB). Finding: in the simulation a Rookie now wins every pirate fight on every difficulty, so Normal and Hard may be too easy early on.

## 0.18.0 — Help Center, tappable terms, paper chip (2026-11-15)

- **Help Center.** The round ? is now a **? Help** button fixed at the top right. It opens a home page (goal, quick start, quick answers, nine topics). Each "More" opens a topic page in the same pop-up with a **← Help** button and Related links. No inline accordions, no stacked pop-ups.
- **Tappable terms.** Underlined terms elsewhere (Standing, Career goals, Newspaper subscription needed, Pirate safety, the newspaper note under Best runs) open the matching topic.
- **Newspaper chip.** It no longer sits in the header all the time. It appears only when a subscription has 2 days or less left ("Paper: 2 days left · Renew") or ended in the last 3 days ("Paper ended · Renew"). The newspaper topic and Help home say whether you are subscribed and how many days are left.
- Also in this build: stat boxes show short extra lines instead of empty space, job cards read as labelled rows, and Career goals replaces the old Optional goals box.

## 0.17.0 — Government requests and standing (2026-11-15)

- **Government requests.** On about one day in four, a port official (Compact harbormaster, Lantern steward or Freehold clerk) posts a request on the Jobs board: a dispatch or, when the destination is in a crisis, a relief run. Pays about 35% more than a normal job. Nothing interrupts you; a message line tells you it is waiting. Only pirates interrupt.
- **Standing with each Reach.** Finishing requests raises standing with that Reach's faction: Unknown, Known (2), Trusted (5), Honored (9). Trusted gives 10% off fuel and repairs in that Reach, Honored 20%. Shown on the Commander page.
- **No penalties.** Declining, failing, expiring or abandoning a request or job costs nothing. The first story chapter can be set aside too.
- **How to play** has a Tell me more under each answer. The Activity log button is only in the footer next to Test tools. The Jobs page no longer links to the People list.

## 0.16.4 — Panels, honest cards, tidier screens (2026-11-15)

- **Arrange panels.** On the System tab, **⇅ Arrange panels** lets you move every card (selected-port bar, Best runs, destination card, route card, vessel, My ports, Distances) up or down and place it beside or under the chart. Saved in this browser; **Reset layout** restores the default.
- **Pirate risk is now honest.** The destination card quoted the base regional rate; the real roll also uses your escorts, career level and Quiet ride, and nothing happens before day 3 or on a warp. Card and jump now share one formula (`arrivalRisk`).
- **Card matches the chart label.** The destination card now shows Resources and "Colonists need…"; "Water sells for" says which day the price was seen, or "Not seen yet".
- **Needs-attention bar** appears only when fuel, hull or a stranding needs it. The paper chip moved beside the day counter, **Log** moved to the footer next to Test tools.
- **Pop-ups** have one ✕ close in the corner (Esc still works) instead of a Close button under a Got it button; How to play has a **Tell me more** section.
- **Jobs screen:** compact job cards (pay beside the destination), colored section headers.
- **How to play** now says what the newspaper is for, how to tell whether you have one (the chip at the top right) and how to open it (News tab).
- Wording: "Get a different ship" is now **Shipyard**; "Gadget slots" is now **Equipment slots**.

## 0.16.3 — Player feedback pass (2026-11-15)

From the first outside players (raw notes and status in `reviews/2026-11-15-player-feedback.md`).

- **Battles pop out.** Pirate fights, marauder offers and custody now open as a centered pop-out over a dimmed screen, so you can see every option without scrolling.
- **Help is always there.** A round **?** button stays in the corner of every screen and opens a shorter How to play with quick answers (full hold, where credits came from, newspaper, distances, pirates).
- **Newspaper status** is a chip in the dock bar: "Paper on · through day N" or "No paper".
- **Show route actually shows the route.** Best runs buttons are now **Show route** (local jobs) and **Plan route to <port>** (jobs posted elsewhere). They close pop-ups, switch the chart to the right Reach, draw every leg that falls in that Reach, ring the stops, and scroll to a new **route banner** that lists every stop with its Reach. Tap a stop to switch the chart to its Reach. Routes that cross Reaches were previously invisible.
- **Side-by-side layout** (chart left, travel column right) now starts at 900 px wide instead of 1180 px.
- **Arrival feedback.** Every arrival shows a toast ("Arrived at X · Day N · −9 fuel"), scrolls to the arrival card, and adds a **Trip report**: fuel used, days, each delivery and its pay, and other costs (fuel stops, wages, interest). It answers "where did my credits come from".
- **Cargo clarity.** The CARGO stat shows "(N on jobs)", the hold meter says "FULL · N reserved for jobs", and selling into a still-full hold explains the reserved bays.
- **Best runs cards (later 0.16.3).** Each run is now a card: kind and big pay, "Here → Destination", chips for fuel, "Deliver by day X · N days left" and bays ("uses N bays" or "no cargo"), the relief bonus line, and a red reason if you cannot accept ("Needs 3 free bays; you have 2"). The unclear "Posted here" text is gone; jobs at other ports say "Pick up at <port>: fly there and dock to accept" with a **Fly to <port>** button.
- **Money is ₡, not "cr" (later 0.16.3).** Research: "Cr" is the stock sci-fi abbreviation (Elite, Traveller, Star Frontiers) and reads as flat text; games make money feel good with a dedicated symbol, a gold highlight, a count-up and floating +amounts. All amounts now read ₡1,000 (the Credits tile is gold, rewards and confetti use ₡). The dock bar buttons sit in a row again. A Best runs card with too little room now says "Not enough cargo space: needs N free bays, you have M".
- **Best runs wording.** "No cargo bays / reserved" is now "no cargo space needed / uses N of your bays until delivered"; due day reads "deliver by day X (N days left)".
- **Distance honesty.** The chart says orbit rings are scenery, and the planet card and selection bar show "N pc · N fuel · 1 day". Multi-stop routes show "N jumps · N days".
- **Market coach line.** The Market tab says what to do with what you carry and that you never have to travel just to sell.
- **Activity log.** New **📜 Log** button (dock bar and Help) lists the last 400 events and downloads a `.txt` with version, difficulty, day, credits, cargo, reserved bays, active jobs and the full log, for troubleshooting a playtest.

## 0.16.2 — Planet screen cleanup, finder card grid, harder Best runs

- Removed parenthetical text from planet screens: the crisis cause (such as "labor shortage") is gone from the chart label, route card and arrival banner; "(in range)" and "(N days old)" on the planet card became "· in range" and "· N days old". The Conditions line still names the crisis.
- Planet finder is now a card grid of all 24 planets with painted pictures, filter chips (In range, Pinned, Visited, Has crisis, Has job), sort (Distance, Name, Tech), a By Reach grouping, and a side detail panel (kind, tech, resources, distance, conditions, customs, market log, jobs) with a Select · show route button.
- Best runs scales with difficulty: Beginner/Easy unchanged; Normal ranks by pay and shows fuel but not cr per fuel; Hard shows only this port's board, unranked, no fuel math; Impossible hides it.


## 0.16.1 — Review fixes, desktop chart layout, Best runs Accept

Fixes from ChatGPT's 2026-11-14 review (`reviews/2026-11-14-chatgpt-browser-review.md`); details and test mapping in `reviews/2026-11-14-claude-response.md`.

- **Fix #1 (launch blocker):** nothing inside the main panel responded to clicks, including Travel. The panel carried `data-tab`, so the tab handler grabbed every click. It now uses `data-screen`. New real-Chrome check `check-clicks.cjs` clicks Travel, a Water sale, the chart Travel button and a crew ability.
- Crew ability buttons (Slipstream and the rest) now pass their string id. Kidnapping "Call your crew" now rescues instead of being read as the dock tow.
- Malformed saves are rejected at load: crew, escorts, custody, rental, crew events and offers are validated, so a bad file can no longer crash the Crew tab.
- Rescue tow now appears whenever you cannot reach any port with your fuel, affordable fuel, sellable cargo or a warp charge. Banned goods you cannot sell can always be dumped.
- Auto-fuel stays off until you turn it on, and the setting is saved. Saves from before this setting existed load with it off.
- "Go there for me" quotes each fuel stop at that port's rate, so the quote matches the cost.
- Returning a rental gives back your own ship's fuel, not a free full tank.
- **Balance:** Quiet ride now charges loan interest and rental for both days, as advertised.
- Winning, escaping or warping out of a pirate fight at a strict port still faces customs.
- The Surrender card now states the chance of being boarded.
- A How to play button is always in the dock services bar. The first-haul card has a Travel button (Open Market once you arrive).
- **Layout (desktop, 1180 px and wider):** the chart sits beside a travel column (Travel bar, Best runs, destination, route). The chart stays in view while the column scrolls. Phones keep the stacked layout.
- **Best runs:** local jobs have an **Accept** button beside Show route, and every row shows its deadline and reserved bays.
- New checks: `check-review-fixes.cjs`, `check-clicks.cjs` (needs `playwright-core` and Chrome; skips if absent).

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
