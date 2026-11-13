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

## Playtest questions

Use a few player sessions to learn:

- Can players explain what Inner, Outer, and Far Reach mean after seeing the map?
- Do players notice or feel the extra steps required to refuel?
- Do character and planet details make missions and goods feel more meaningful?
- Does a news digest clarify the world, or does it add reading without helping play?
- Do players understand loan cost and interest before borrowing?

Record what players do and say. This is qualitative feedback, not a representative survey.
