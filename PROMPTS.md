# AI prompts for Space Trader

Copy-paste prompts for using other AI tools with this project. Each is self-contained. Bot or AI-player results are directional, not evidence of what real players think.

Last updated: November 14, 2026 (version 0.15.1).

## 1. Code and bug review (Claude, ChatGPT or Gemini)

```
TITLE: Space Trader — independent bug review (no edits)

CONTEXT
Space Trader is an unofficial adaptation of Pieter Spronck's Palm OS game.
Repo: https://github.com/SeanEricKnight/SpaceTrader (version 0.15.1).
The game is one self-contained file, SpaceTrader-browser.html (about 700 KB).
Read README.md, GAMEPLAY.md, CHANGELOG.md and BACKLOG.md first.
GAMEPLAY.md is the rules reference. Where code and GAMEPLAY.md disagree, report it.

TASK
Find real bugs in the browser build. Do not edit files, commit or publish.

FOCUS AREAS
- Save/load: legacy saves, corrupt saves, blocked storage, slot export/import.
- Money and cargo math: buy, sell, loans, interest, warehouse fee, home-port discount,
  rental deposits, crew wages. Look for rounding, negative values and double charges.
- State transitions: jail, bail, kidnapping, capture, boarding, mid-flight incidents,
  warp charges, auto-route interrupted by an event.
- Contracts and missions: expiry, abandonment, reserved bays, one-time rewards.
- Crew abilities and cooldowns, escort loyalty and leaving.
- Anything that can soft-lock the player (no money, no fuel, no legal action).
- Documentation that contradicts the code.

REQUIREMENTS
- Cite the function name or line range for every finding.
- Label each finding VERIFIED (you traced or ran it), INFERRED, or GUESS.
- Give a minimal reproduction: starting state, steps, expected vs actual.
- Give severity (blocker / high / medium / low) and confidence (high / medium / low).
- Do not report style preferences or feature ideas as bugs.
- Do not claim you ran code unless you did.

OUTPUT
1. Table of findings ranked by severity.
2. For the top five: root cause and the smallest fix you would make.
3. A short list of things you checked and found fine.
```

## 2. Gameplay and fun review (Claude, ChatGPT or Gemini)

```
TITLE: Space Trader — gameplay and decision-quality review (no edits)

CONTEXT
Same repo and files as the bug review (version 0.15.1). Goal: reach 500,000 credits
and buy a moon. Sean's design rule: the game must explain itself, and the player
should never have to ask. Priority is clarity, fun and learnable decisions, not
feature expansion. The browser build is a prototype for a later iPhone game.

TASK
Judge whether the core loop stays engaging from the first jump to the endgame.
Do not edit files, commit or publish.

ASSESS
- Route discovery and trading: does a player keep finding new profitable routes?
- Contracts, Best runs and job boards: do they steer play or replace it?
- Combat: is there ever a real choice among fight, flee and surrender?
- Upgrades, crew abilities, rental, warehouse and home port: do they change decisions?
- Mid-game pacing: does anything flatten into one dominant strategy?
- Difficulty tiers and the help they remove.
- First 10 minutes: is the goal and the next action obvious?

REQUIREMENTS
- Back each claim with a file, function or reproducible scenario.
- Separate VERIFIED facts, INFERENCES and GUESSES.
- Treat bot simulations as directional. PLAYTEST_RESULTS.md was built on 0.6.2, so
  say which of its claims no longer apply to 0.15.1.
- Do not recommend a feature just because the code could support it.

OUTPUT
1. One-paragraph overall judgment.
2. Five suggestions ranked by player impact vs effort. For each: the player problem,
   evidence, a concrete change, tradeoffs, and how to validate it.
3. Exploits or flattened strategies you can describe step by step.
4. What can wait until human playtests.
```

## 3. AI as a first-time player

```
TITLE: Space Trader — cold-start player test

CONTEXT
You are a first-time player. You have not read the README, GAMEPLAY.md or any
source notes. Open only SpaceTrader-browser.html in a browser (or, if you cannot
run it, read the visible UI text strings and reason as a new player would).

TASK
Play at least 20 jumps. Narrate as you go, briefly, in first person.

REQUIREMENTS
- Start with what you think the goal is, based only on the screen.
- At each decision, say what you chose and why.
- Every time you are confused, stuck or surprised, record it as a numbered
  CONFUSION: what you expected, what happened, and the exact text or control involved.
- Note any moment you felt fun, tension or a clear payoff.
- Note anything that looked broken. Do not guess at causes.
- Do not read source code or documentation to resolve confusion. Confusion is
  the data.

OUTPUT
1. Your goal as you understood it after 1 minute and after 20 jumps.
2. The numbered CONFUSION list, ordered by how much it slowed you down.
3. Your best route found and how long it took you to find it.
4. Three changes that would have helped most.
Remember this is one simulated player, not evidence of what real players think.
```

## 4. Writing pack (local model)

```
TITLE: Space Trader — world writing pack

CONTEXT
Space Trader is a space trading game. The player trades goods between 24 planets
across three regions: Inner Reach, Outer Reach and Far Reach. Tone: dry, human,
a little wry, never sappy. Text appears in small UI cards on a phone.

TASK
Write original text for the planet list I paste below. Do not reproduce text from
the original Palm OS Space Trader or any other game.

PER PLANET, WRITE
- Local color: 2 sentences, max 35 words total.
- 3 port rumors: one line each, max 20 words, each hinting at a trade, danger or job.
- 3 newspaper headlines: max 12 words each, plain news style.

REQUIREMENTS
- Each planet must feel different. No two planets share a rumor idea.
- Describe lasting conditions, not temporary events. Do not write phrases like
  "cold spell", "war" or "outbreak" as permanent facts.
- Do not state prices, numbers or game mechanics.
- No profanity, no real-world countries, brands or people.
- Keep lines self-contained, with no references to other planets' lines.
- Plain text only, with the planet name as a heading.

OUTPUT
Write one planet at a time and wait for "next". After every six planets, list any
phrases you repeated so I can fix them.

PLANETS: [paste planet list and tech/resource notes here]
```
