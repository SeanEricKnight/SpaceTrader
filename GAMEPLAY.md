# Space Trader: how it plays

The rules as they work in the current version (**0.12.2**). Update this file with every change that touches gameplay. Details by version are in [CHANGELOG.md](CHANGELOG.md).

## Goal and ending

- Save **500,000 cr** and clear your debt, then **Retire** (Commander screen or the goal bar) to buy a moon. That ends the game with a career summary. It cannot be undone, so save to a slot first if you want to keep that commander.
- There is no game over. If your ship is destroyed or you are jailed or kidnapped, there is a way back, usually at a cost.

## Dock services

The bar at the top of every screen is your dock services: refuel, repair, bank, read the news, buy a warp charge, and shortcuts to the shipyard & outfitter, job board, crew hiring, and saving. They only work while you are safely docked.

## Starting out

- A new game begins with **5 Water in your hold**, already bought, bound for Adahn. A welcome popup tells the story.
- **First haul** is the quick-win mission: fly to Adahn and sell the Water there. The first Water you sell at Adahn pays a **cash bonus** on top of the sale: Beginner 2,000, Easy 1,750, Normal 1,500, Hard 1,000, Impossible 500 cr. It is enough to buy something right away, like a crew member, an escort, or a warp charge.
- Beginner, Easy and Normal show the steps on the Market and System tabs; Hard and Impossible show a single line.
- If you sell the Water somewhere else first, the mission quietly closes. Saves from older versions do not get it.
- **How to play** (dock services bar) has a short guide to the loop below.

## Core loop

1. **Market tab:** buy goods where a tag says **Cheap**, sell where it says **Pricey** (tags are hidden on Hard and Impossible). A tag compares the price here with that good's usual range across all planets, shown as "vs usual 28–62 cr": the bottom third of the range is Cheap, the top third Pricey. The sticky hold meter shows cargo used and free.
2. **System tab:** tap a planet on the chart to open its card, then travel. Click or tap the chart first (it gets a green outline), then scroll, pinch or drag it; until then the page scrolls normally. Click anywhere outside to let go. You can also use + / −: the planet names and notes grow as you zoom, and up close each planet shows its kind, tech level, resources, and in orange what its colonists need while a crisis lasts (for example "Colonists need Medicine (plague outbreak)"). This applies to every planet in every system. Each jump uses fuel and takes days.
3. Repeat, take jobs, and avoid or fight trouble.

## Fuel, range, and warp

- **Fill the tank automatically when I dock** (checkbox on the Market tab, on by default) tops up the tank on arrival so you do not press Refuel each stop. It costs the same fuel money; turn it off to buy fuel yourself.
- Each ship has a **jump range** in parsecs (pc), also its tank size. Long trips need stops. Fuel costs the same at every port (rate depends on ship and difficulty).
- **Go there for me** plans the route through stops, buys the fuel needed, and flies it (Beginner to Normal only). It states the fuel and cost before you press it.
- **Warp charge** (bought at a port; there is a carry limit shown on the button): one charge jumps up to 40 pc with no fuel and no pirate check, or escapes any pirate fight.
- Help scales with difficulty: Beginner explains the most (what you can reach and what it costs), Hard and Impossible give none.

## Travel style

Chosen on the destination card before you jump:

- **Quiet ride:** +1 day, half the pirate risk, nothing unusual happens.
- **Steady:** normal pirate risk.
- **Excitement:** normal pirate risk plus about a 55% chance of an incident on the way (a derelict, a distress call, or a trader convoy). You choose how to respond.

## Events and the News

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

- **Ship tab:** your ship and its controls, then **Outfit your ship** (equipment), then **Get a different ship**, where a switch chooses **Buy** (own it, trade in your current ship) or **Rent** (pay per day, deposit returned), then the bank summary.
- Each ship has cargo bays, jump range, hull, laser mounts, shield and gadget slots. A ship needs a shipyard of a high enough **tech level**; the card names the nearest planet that has one.
- **Lasers** upgrade in tiers 1 to 3. The button shows the next step and cost; at tier 3 it reads "Lasers maxed".
- **One ship at a time:** there is no hangar of spare ships. Buying a ship trades in the one you fly (cargo and compatible lasers move over). To go back to a ship you traded in, buy it again. A rented ship is the only time your own ship is parked: it waits for you until you return the rental.
- **Rental:** rent a ship for a daily rate with a deposit (10% of its price, returned minus any damage fee when you give it back at the port you rented it from); return it before buying.
- Cargo and compatible lasers transfer when you change ships.

## Crew and escorts (Crew tab)

- **Crew:** three people look for work for now (a pilot, a mechanic and a gunner; the purser, smuggler and fixer are held back to keep things simple). You can hire up to 3, for 500 cr each, wage 15 cr per jump. Each has a role (pilot, mechanic, gunner, purser, smuggler, fixer) and a loyalty that rises or falls with your choices. They never die; treat them badly and they leave. A crew member can only be hired at their home planet; the card says where. **View profile** shows their portrait, character type, and backstory.
- **Escorts:** three pilots are for hire at a time; you can hire up to 3. Each lowers pirate encounters and adds damage to your volleys. Wages are paid every jump; they gain levels and cost more as they improve.

## Trouble

- **Pirates:** fight, try to flee, or use a warp charge to escape.
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
