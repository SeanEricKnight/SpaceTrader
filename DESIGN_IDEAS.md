# Design notes and implementation status

**Status:** These began as design notes. The browser update implements the Reach map, easier refueling, port and character backgrounds, and The Reach Dispatch. Banking is implemented with rates by difficulty; whether interest should rise by loan amount or repeated borrowing remains unresolved. The update is for human playtesting; it is not a claim that these changes are proven fun.  
**Source:** Sean's design notes, November 13, 2026.

Use the browser build to learn whether these additions make the trade and travel loop clearer and more enjoyable.

## Reach regions

The map labels three areas: Inner Reach, Outer Reach, and Far Reach.

- Explain what these regions are in the game world and how they work.
- The current presentation may feel like the same map with planet names changed. Check whether the regions have meaningful identities or mechanics, and make that distinction clear to players.
- Avoid treating different names alone as meaningful worldbuilding. Any added differences should be understandable and useful in play.

**Implemented:** Three regions are presented as parts of one 24-port galaxy, with distinct stars and orbital layouts plus a separate distance map.

## Easier refueling

Refueling should take fewer steps. Players should not have to leave their current activity and open a separate screen just to buy fuel.

Explore a quick refuel control in a context where the need is clear, such as the route/chart or travel view. Show the cost and available fuel before confirming. Keep fuel planning meaningful; the goal is to remove unnecessary navigation friction, not remove the travel constraint.

## Worldbuilding, characters, and planets

Give the game a coherent backstory and a world with a recognizable identity, in the spirit of a lived-in space opera.

- Give important characters distinct histories, personalities, and characteristics.
- Give planets a reason for their needs, resources, shortages, and crises. For example, explain why a world needs water or medicine.
- Let this information make trading and missions more meaningful, rather than burying play in exposition.

## In-world newspaper

Consider a newspaper or local news digest inspired by the original game. It could report local events, crises, shortages, and mission developments, helping players understand why a planet needs particular goods.

Treat news as worldbuilding and useful context. Do not imply that a news item changes prices or missions unless the game actually implements that effect.

## Borrowing and loan progression

Make borrowing money easy to understand and available when it helps the player make a meaningful decision.

The browser update sets a different rate for each difficulty, compounds interest on successful travel days, shows the next charge, caps credit at 25,000, and offers partial loans and ship financing. This does not increase the rate by borrowed amount or repeated borrowing. That interpretation of “level” remains open for Sean to decide after playtesting.

## Ideas added November 14, 2026 (status updated in 0.7.0; full list in BACKLOG.md)

These came from Sean after reviewing the game. None changes the game yet. Each needs a design discussion and, where it touches the economy, new simulation checks before implementation.

- **Paid newspaper.** *(Built in 0.7.0.)* Charge a small price for The Reach Dispatch instead of making it free. Open questions: price per issue or per port, whether the price scales with difficulty, and how to keep the information worth the cost without making early progress harder.
- **Multiple hired escorts.** *(Built in 0.7.0.)* Let the player hire more than one escort. Escorts gain skill with use, and their hire price rises with skill. Open questions: how many can be hired, where they are hired, how skill is earned and shown, whether they take a share of earnings, and how they affect combat balance. The current game has no escorts or crew, so this is a new system.
- **Planet and ship graphics.** *(Deferred; see BACKLOG.md.)* Sean reports that the 3-D models (generated globes and rotating planets) look bad. Needs clarification of which visuals and what is wrong with them before any redesign.
- **Difficulty-based help.** *(Started in 0.7.0: days-left on events and papers at Beginner and Easy.)* Easier difficulties could get friendlier market presentation, while harder ones keep plain data. Raised in a design discussion on the same day; direction not decided.
- **Market screen rework.** *(Built in 0.7.0.)* Observed: on a phone the Market table hides the Buy, Sell, and stock columns off the right edge. Agreed direction in discussion: card layout with Buy and Sell always visible and a clearer way to compare logged markets, without recommending routes. Not built.

## Idea added November 14, 2026: a Firefly-style crew and story (proposal; not implemented)

Raised by Sean: escorts need avatars and backstories so they are characters, the game needs a story element, and it should feel a little like Firefly.

**What "a little like Firefly" could mean here** (a starting list to go through together, not a decision):

- **Found crew, not hired stats.** Escorts are named people with a portrait, a history, a personality, and something they want. The current escorts are only a name and a level. The game already has "People of the Reach" cards (history, nature, wants, home port); escorts could use the same shape.
- **The ship is home.** A small, aging ship with quirks, and crew who live aboard. Upgrades and repairs matter to the people, not only the numbers.
- **Small-time hauling with moral grey.** Jobs from the three powers (Trade Compact, Lantern Cooperative, Ash Freeholds) where the honest choice and the profitable choice differ: a legal run, a quiet run, a favor for someone with no money.
- **Jobs that go sideways.** A contract can reveal a complication mid-run (a stowaway, the cargo is not what was promised, a patrol), and the player chooses how to respond.
- **Loyalty and consequences.** Crew remember how you treated them and your passengers. Good treatment unlocks personal missions and better performance; neglect or betrayal makes them leave, or leave badly.
- **Reputation by faction.** Who you carry for changes what each faction offers or refuses you.
- **Personal story arcs.** Each crew member has a short arc that surfaces over many jumps. The existing story-stage system (the Baratas fever relief) is the starting pattern.

**Open questions:**

- How many crew, and do they fill roles (pilot, mechanic, gunner, medic) or stay as escorts that fly alongside?
- Portraits: simple generated vector faces in the game, hand-made images supplied by Sean (for example from his own image generator), or text only at first?
- Where do crew come from: port hiring, story encounters, or both?
- How much writing per character, and does Sean want to write or approve backstories?
- Tone: how dark, how funny, how much choice versus a fixed plot?
- Should crew be able to die, or only leave?

**Dependencies:** the escort system shipped in 0.7.0 (levels, wages, effects) is the mechanical base. Portraits tie into the deferred art work in BACKLOG.md. Any economy-touching change needs new simulation checks.

## Playtest questions

Use a few player sessions to learn:

- Can players explain what Inner, Outer, and Far Reach mean after seeing the map?
- Do players notice or feel the extra steps required to refuel?
- Do character and planet details make missions and goods feel more meaningful?
- Does a news digest clarify the world, or does it add reading without helping play?
- Do players understand loan cost and interest before borrowing?

Record what players do and say. This is qualitative feedback, not a representative survey.
