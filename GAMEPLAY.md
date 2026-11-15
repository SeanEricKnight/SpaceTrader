# Space Trader: how it plays

The rules as they work in the current version (**0.12.2**). Update this file with every change that touches gameplay. Details by version are in [CHANGELOG.md](CHANGELOG.md).

## Goal and ending

- Save **500,000 cr** and clear your debt, then **Retire** (Commander screen or the goal bar) to buy a moon. That ends the game with a career summary. It cannot be undone, so save to a slot first if you want to keep that commander.
- There is no game over. If your ship is destroyed or you are jailed or kidnapped, there is a way back, usually at a cost.

## Leaderboard and rival race
- **Leaderboard:** every honest retirement posts a score to a top-10 list in this browser (Commander tab and retire screen). Score = max(100, 1500 − 6 × days) + difficulty bonus (Beginner 0, Easy 100, Normal 250, Hard 450, Impossible 700) + 300 for beating a rival. Runs that used cheats are not ranked. It is local only; there is no online board.
- **Race a rival AI (optional):** tick the box beside Start new game. A rival (Marta Voss, Kade Orrin or Ilse Tarn) races you to 500,000 cr. The strip under your goal bar shows their cash and last-seen port.
- **How the rival works:** it is a scripted pace, not a live trader. It never touches your markets, jobs or pirates. It retires on a fixed day: Beginner about 130, Easy 115, Normal 100, Hard 90, Impossible 80, times 0.92 (Kade), 1.0 (Ilse) or 1.08 (Marta). Harder difficulties have faster rivals.
- **Prize:** retire on or before their day (a tie goes to you) to win the Gold Seal Deed and +300 score. If they retire first you get a notice, no prize, and your finish still ranks.

## Dock services

On the Market, the cargo bar has **Done trading · Open map** (0.15.1) and, when a comparison market is chosen, **Go to <planet>**; both go to the System map. Each tab has its own accent color for box borders and highlights (0.15.1).

The old Dock services bar is gone (0.15.0). Its shortcuts to News, Shipyard, Jobs and Crew duplicated the tabs. Refuel, Repair, Warp charge and the Bank still work from the **Ship** tab (Bank also on Commander and in News). A slim **Needs attention** strip appears under the stats only when your fuel is not full, your hull is damaged, or you are stranded, and vanishes otherwise. Fuel still auto-fills on docking when you can afford it. Haggle (Mattias) sits at the top of the Market tab. Actions only work while you are safely docked.

## Feel: sound, number pops, arrival banner

- **Sound** is switched off for now (the first synthesized sounds were not good enough). It is on the to-do list.
- **Credits** count up or down and the Credits tile glows green or red with a floating "+340 cr" or "−28 cr" for every change. Players who prefer reduced motion get no animation.
- **Arrival banner:** when you dock, the Market and System tabs open with a card showing the planet, its kind, tech level and resources, a one-line story hook, and in orange what its colonists need if there is a crisis. Press ✕ to dismiss it; it returns at the next port.

## Look of the game

- **Planets** are procedurally painted: each kind has its own surface (craters on barren rock, continents, clouds and ice caps on ocean worlds, dune streaks on deserts, banded gas giants with storm spots, cracked ice, lightning storms), an atmosphere glow, and a slow spin. Surfaces are made once and remembered by the browser.
- **Portraits:** crew, escorts and people of the Reach get drawn placeholder faces (each name always draws the same face). A painted portrait file with the matching name (see PORTRAITS.md) automatically replaces it.
- **Ships** in your ship card and in pirate encounters bob gently with a pulsing engine glow.

## Look and feel

- Rounded panels and pill buttons, color-coded tabs and stats, and job cards colored by type (courier green, freight amber, survey violet).
- Small toasts at the bottom: each sale shows its profit (green, with a star for a big one; coral for a loss), each purchase shows its cost, and a new port gets a gold "New port logged" toast.

## My ports and the finder

- Every planet card has **Pin to My ports** and a tag button (Favorite, Good buyer, Refuel stop, Shipyard, Jobs, Avoid). **My ports** under the chart lists your home and pinned planets with live status: distance, crisis, job count and best pay (the pay and count need the newspaper), and how old your price log is.
- The **finder** opens a card grid of all 24 planets, each with its picture, kind, tech, distance and range status, pin tag and crisis need. Filter chips (In range, Pinned, Visited, Has crisis, Has job) narrow it; sort by Distance, Name or Tech; "By Reach" groups the cards under Hearth, Inner Reach and the other regions. Tapping a card shows its full details (market log age, customs, jobs) in a side panel without leaving the list; "Select · show route" picks it on the chart. "Has job" only knows other ports' boards with the newspaper subscription. On a phone the panel stacks above the grid.

## Home port and warehouse

- Your **home port** starts as Acamar. Repairs and fuel cost about 20% less there (small differences vanish at the lowest prices). You can move home from any port's market screen for 500 cr, once your warehouse is empty.
- The **warehouse** (market screen at home) holds 20 units of goods for 1 cr per unit per day, collected when you next use it. It only exists at home. Moving goods keeps their average paid price, so profit stays correct.

## Help, log and arrival report (0.16.3)

- Money is written with the credit sign ₡ (for example ₡1,000), not "cr".
- A round **?** button on every screen opens How to play. The dock bar also shows a newspaper chip and a **Log** button.
- Battles, marauder offers and custody open as a centered pop-out over a dimmed screen.
- Each arrival shows a **Trip report** (fuel, days, deliveries and pay, other costs). The Log lists the last 400 events and can be downloaded as a text file.
- Bays reserved for jobs count as used. The cargo stat and hold meter show how many are reserved; they free on delivery. You can sell a good at any port that buys it, including where you bought it.
- Every jump takes 1 day (2 on the quiet route) and uses fuel equal to its distance in pc. Orbit rings on the chart are scenery.
- **Show route** and **Plan route to <port>** (Best runs) draw the route, switch to the right Reach, and show a route banner listing every stop. Jobs are still accepted only at the port that posts them.

## Planning a route

- Pick a destination on the Solar chart and every stop on the way is ringed in green. Below the chart a **Route card** lists each stop with its distance, whether you refuel there, any crisis (what its colonists need), and any of your contracts that deliver there.
- With a **newspaper subscription** (News tab) the card also shows the **job boards at each stop**: how many jobs are posted there that go your way (to a later stop on the route) and the best pay. Chart captions show the same count.
- Some things stay **local**: exact contract terms, side quests, and crew and escorts are only visible when you dock at the planet.

- **Best runs** (below the chart) gets harder to read as difficulty rises. Beginner and Easy: ranked by pay per fuel, with the fuel and rate shown. Normal: ranked by pay only, with the fuel needed shown; you weigh the cost. Hard: only jobs posted at your current port, unranked, no fuel math. Impossible: the panel is hidden. The newspaper subscription adds other ports' boards on Beginner, Easy and Normal only. Details below describe the Beginner/Easy version. Without the paper it lists jobs posted at your current port; with it, every job board in range. "Show route" selects the job's destination; "Go to X" selects the port where a remote job is posted.

## Celebrations

- **Buying your moon** is the big moment: when you have 500,000 cr and no debt, the goal bar's button pulses gold and reads "Buy your moon". Buying it fills the screen with a rising moon, "YOU BOUGHT A MOON", and falling confetti. Tap to continue to the career summary.
- **Beating a pirate** flashes the screen green, shakes it, bursts sparks and shows a "Pirate down" card with the bounty counting up.
- **Firing lasers** draws a beam to the pirate, flashes it, and pops the damage number; when the pirate shoots back you see its beam, the damage taken and a screen shake. Reduced-motion players skip these animations.
- Finishing a job, a courier delivery, a side quest or the First haul pops a **DELIVERED card**: a stamp slams down, small credit chips float up and away, and the reward counts up. Tap it to dismiss; it fades on its own. Reduced-motion players get the card without the animation.

## Starting out

- A new game begins with **5 Water in your hold**, already bought, bound for Adahn. A welcome popup tells the story.
- **First haul** is the quick-win mission: fly to Adahn and sell the Water there. The first Water you sell at Adahn pays a **cash bonus** on top of the sale: Beginner 2,000, Easy 1,750, Normal 1,500, Hard 1,000, Impossible 500 cr. It is enough to buy something right away, like a crew member, an escort, or a warp charge.
- Beginner, Easy and Normal show the steps on the Market and System tabs; Hard and Impossible show a single line.
- If you sell the Water somewhere else first, the mission quietly closes. Saves from older versions do not get it.
- The first-haul steps and the welcome popup explain the loop below. The separate How to play button was removed in 0.15.0.

## Core loop

1. **Market tab:** buy goods where a tag says **Cheap**, sell where it says **Pricey** (tags are hidden on Hard and Impossible). A tag compares the price here with that good's usual range across all planets, shown as "vs usual 28–62 cr": the bottom third of the range is Cheap, the top third Pricey. The sticky hold meter shows cargo used and free.
2. **System tab:** tap a planet on the chart to open its card, then travel. Click or tap the chart first (it gets a green outline), then scroll, pinch or drag it; until then the page scrolls normally. Click anywhere outside to let go. You can also use + / −: the planet names and notes grow as you zoom, and up close each planet shows its kind, tech level, resources, and in orange what its colonists need while a crisis lasts (for example "Colonists need Medicine"; the cause is not shown on planet screens). This applies to every planet in every system. Each jump uses fuel and takes days.
3. Repeat, take jobs, and avoid or fight trouble.

## Fuel, range, and warp

- **Fill the tank automatically when I dock** (checkbox on the Market tab, on by default) tops up the tank on arrival so you do not press Refuel each stop. It costs the same fuel money; turn it off to buy fuel yourself.
- Each ship has a **jump range** in parsecs (pc), also its tank size. Long trips need stops. Fuel costs the same at every port (rate depends on ship and difficulty).
- **Go there for me** plans the route through stops, buys the fuel needed, and flies it (Beginner to Normal only). It states the fuel and cost before you press it.
- **Warp charge** (bought at a port; there is a carry limit shown on the button): one charge jumps up to 40 pc with no fuel and no pirate check, or escapes any pirate fight.
- Help scales with difficulty: Beginner explains the most (what you can reach and what it costs), Hard and Impossible give none.

## Travel style

Chosen on the destination card before you jump:

- **Quiet ride:** +1 day, half the pirate risk, nothing unusual happens. Loan interest and ship rental are charged for both days.
- **Steady:** normal pirate risk.
- **Excitement:** normal pirate risk plus about a 55% chance of an incident on the way (a derelict, a distress call, or a trader convoy). You choose how to respond.

## Events and the News

- The News opens with **Top headlines**, the few things that matter right now, each with a colored tag: ALERT (a port in crisis and which prices rose), DEADLINE (a job due within 3 days), DANGER (high boarding risk), MONEY (debt and next-jump interest), GOAL (close to or able to buy your moon) and STORY. Ports shown follow the free/paid rules: your port, the free sample port, and the ports in a paid edition you bought.
- Ports can be in a **crisis** (war, plague, drought and so on) that raises some prices. Each crisis lasts roughly 6 to 14 days, then eases and prices settle. A calm port has about a 3% chance per day of a new crisis, so they rotate. Time only passes when you travel.
- **Free:** the Market tab shows conditions at the port you are docked at. The News tab also shows a free sample for one other port in trouble, a different port each day.
- **Paid:** **The Reach News** (News tab) lists every port in a crisis. Buy one issue, or **subscribe for 10 days** and a fresh edition is delivered every time you dock. An issue is a snapshot of the day it was printed. Crises start and end, so check its date.

## Jobs

- Up to **3 jobs** at once from the job board of the port you are at. Offers stay the same until you leave.
- Each job: go to one planet by the deadline and get paid. Kinds: deliver a message (no cargo space), haul supplies (uses some of your cargo bays; the supplies are provided and cannot be sold), survey trip (no cargo space).
- Crisis ports add a relief bonus; urgent jobs pay more but have short deadlines.
- Abandoning a job loses the pay, no fine.
- **The story of each Reach:** the Solar chart has a "The story of the ... Reach" button that opens a short backstory (who runs it, how it got here) and a few things to know before you fly.
- An optional story ("A light in the Reach") and **side quests** are on the same screen.

## Side quests

- Optional goals with no deadline, in three tiers: **Easy**, **Medium**, **Hard**. You can have 3 active at once. Each pays a one-time cash reward when finished: Easy 500 to 700 cr, Medium 1,100 to 1,800 cr, Hard 3,000 to 4,000 cr.
- Kinds: visit a number of ports, sell a goods quantity at a named port (progress counts only sales there), earn trade profit since you accepted, defeat pirates since you accepted.
- How many are offered depends on difficulty, always with all three tiers: Beginner 3, Easy 4, Normal 5, Hard 6, Impossible 9.
- Dropping a quest loses its progress. Completed quests do not come back.

## Ships

- **Ship tab:** your ship and its controls, then **Outfit your ship** (equipment), then **Shipyard**, where a switch chooses **Buy** (own it, trade in your current ship) or **Rent** (pay per day, deposit returned), then the bank summary.
- Each ship has cargo bays, jump range, hull, laser mounts, shield and gadget slots. A ship needs a shipyard of a high enough **tech level**; the card names the nearest planet that has one.
- **Lasers** upgrade in tiers 1 to 3. The button shows the next step and cost; at tier 3 it reads "Lasers maxed".
- **One ship at a time:** there is no hangar of spare ships. Buying a ship trades in the one you fly (cargo and compatible lasers move over). To go back to a ship you traded in, buy it again. A rented ship is the only time your own ship is parked: it waits for you until you return the rental.
- **Rental:** rent a ship for a daily rate with a deposit (10% of its price, returned minus any damage fee when you give it back at the port you rented it from); return it before buying.
- Cargo and compatible lasers transfer when you change ships.

## Crew and escorts (Crew tab)

- **Special abilities** (new in 0.15.0), shown on every crew card: Wren **Slipstream** (guaranteed escape from one pirate, cooldown 6 jumps); Juno **Broadside** (one volley at triple damage, 4); Odo **Emergency patch** (+25 hull, does not use your turn, 5); Mattias **Haggle** (your next sale pays 20% more, 6; button on the Market tab); Dessa **Smooth talk** (automatically talks you past one customs inspection that would have caught you, 8); Ruvi **Pull strings** (out of jail at once, no bail, 10). Cooldowns tick down once per jump. Their old passive perks still apply.
- Fix in 0.15.0: the gunner's bonus and escort damage were shown in the volley range on the pirate card but not actually applied; they now are.
- **Crew:** three people look for work for now (a pilot, a mechanic and a gunner; the purser, smuggler and fixer are held back to keep things simple). You can hire up to 3, for 500 cr each, wage 15 cr per jump. Each has a role (pilot, mechanic, gunner, purser, smuggler, fixer) and a loyalty that rises or falls with your choices. They never die; treat them badly and they leave. A crew member can only be hired at their home planet; the card says where. **View profile** shows their portrait, character type, and backstory.
- **Escorts:** three pilots are for hire at a time; you can hire up to 3. Each has four 1-5 star ratings that grow as it levels: **Hull** (soaks 1 damage per pirate hit for every 3 stars across the wing), **Evasion** (+1% escape per star), **Aim** (adds its level plus Aim stars to your volleys) and **Loyal** (sets starting loyalty, 40 plus 8 per star). Each also has a **trait**: Principled (loses loyalty on contraband or marauder work), Shady (gains loyalty on it; cuts customs and patrol odds by 10 points), Frugal (-20% wage), Guardian (+1 damage soaked), Scout (counts as an extra level for fewer encounters), Hotshot (+1 Aim, +20% wage). Each has a home Reach where it counts as an extra level against encounters. Loyalty rises 1 per jump; below 15 the escort leaves. Escorts still lower pirate encounters. Wages are paid every jump; they gain levels and cost more as they improve.

## Trouble

- **Encounters scale with your career.** Pirate hull, pirate damage, how often they find you, and how often customs and patrols catch contraband all follow your net worth: Rookie (under 5,000), Trader (under 25,000), Veteran (under 100,000), Magnate (under 300,000), Legend. Rookies face pirates at about 55% hull and 60% damage, find them half as often, escape 10 points easier, and are caught by customs at 40% of the usual odds; Veterans get the old baseline; Legends face 140% hull, 130% damage and 140% police odds. The pirate card names your tier.
- **Crew abilities:** each crew member has one named ability with a cooldown counted in jumps (see Crew). Combat abilities appear as extra buttons on the pirate card; Haggle sits at the top of the Market tab; Pull strings shows while you are in jail.
- **Mid-flight view:** when a pirate, marauders or an incident stop you, the Solar chart shows your ship stopped on the route with the other party beside it (pirate and marauders use the pirate ship picture for now; incidents show a label). The destination reads DESTINATION until you dock.
- **Pirates:** a pirate ship can block your approach, and you cannot dock until you deal with it. The card shows a threat label (FAVORABLE: you should win; RISKY: a fair fight; OUTGUNNED: you will probably lose; UNARMED: no working laser) and explains each choice. **Fire lasers:** you shoot first, win and you collect the bounty. **Escape:** a percent chance; success lets you dock, failure costs a hit and the fight goes on. **Surrender:** keep your ship, lose all cargo and 10% of your cash. **Warp out:** a guaranteed escape for one warp charge.
- **Customs and boarding:** contraband can be found; a boarding takes everything but only when you are rich.
- **Jail and kidnapping:** both have a way out (bail, a rescue), and a fixer on your crew halves bail and captivity.
- **Marauder offers** and other consequences are described as they happen.

## Bank

- **Bank / financing** (dock button): borrow and repay. Interest accrues per travel day and depends on difficulty. You must be debt-free to retire.

## Difficulty

Beginner, Easy, Normal, Hard, Impossible. Easier levels give more hints; Hard and Impossible remove the hints, the price tags, and the auto-route.

## Saving

- The game autosaves in your browser. Clearing browser data or switching browser or device loses that save.
- **Save slots:** three named-by-number checkpoints in the browser (Commander screen), each showing day, credits and ship.
- **Copy save code / Paste save code:** moves your game to another device as plain text, no file needed.
- **Undo last action** steps back one saved state. A save file export and import is under "Advanced".

## Hidden test tools

See [CHEATS.md](CHEATS.md). Using them marks the run as "Cheats used".

## Layout, cards and pop-ups (0.16.4)

- **Arrange panels** (System tab): move each card up/down and place it beside or under the chart; saved per browser; Reset layout restores the default.
- **Pirate risk on the destination card** = base Reach rate x escorts x career level x (half on a Quiet ride). None before day 3 and none on a warp.
- **Needs attention** shows only when fuel is low, hull is damaged or you are stranded. Ship tab always has Refuel and Repair.
- Pop-ups close with the ✕ or Esc. Help has a **Tell me more** section.
