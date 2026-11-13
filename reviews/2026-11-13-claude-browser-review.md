# Claude review: browser build

**Source:** Review text from Claude, provided by Sean on November 13, 2026.  
**Reviewed revision named in the report:** `20e733b`.  
**Status:** Historical review of the pre-update build at `20e733b`. Sean later authorized selected recommendations to be implemented; see `CHANGELOG.md` and `PLAYTEST_RESULTS.md` for the browser update. This review’s simulation findings describe the older build.  
**Evidence labels:** `[V]`, `[S]`, and `[G]` are Claude's labels. They describe Claude's checks and simulations, not independent verification by this repository.

> **Historical note:** The report gives two different tech-level counts for the old generated galaxy. The updated authored galaxy has separate counts documented in `PLAYTEST_RESULTS.md`; do not use the old figures to describe the current build. Claude’s original findings remain attributed to Claude.

## 1. Core loop and where the fun comes from

You dock, read the market, pick a destination within fuel range, and jump. A jump costs one day and carries a pirate chance. You sell, refuel and repair, then reinvest. Contracts and an optional story sit on top. The long goal is 500k credits and a moon.

The fun is the arbitrage puzzle. You build a price log, the compare dropdown shows you the gap, and you find a route that pays. The strongest moment is the first big discovery and the snowball after it.

As built, that moment happens once. After the snowball the game flattens (see risk 1 below).

## 2. Strongest parts and biggest risks

### Strongest

- **Market readability.** The market table shows average paid, profit per unit, and a compare-to-logged-market column with deltas. It also has a fuel reserve toggle and the “Max” button.
- **Contract clarity.** Offers don’t reroll, bays are reserved visibly, and a tracked-objective strip shows what’s next. The story is optional with no forced combat.
- **Polish and safety.** [V] There were zero external requests and zero console errors in headless Chrome. Save validation, damaged-save preservation, export/import and a “Cheats used” flag are all solid. The chart and ship art look good.

### Risks

1. **The economy collapses to one route.** [V] The generated galaxy is almost flat (details in section 6). [S] About 76% of the bot’s trade profit came from Narcotics on Acamar→Adahn. Prices never change after setup. Every new game is the same galaxy.
2. **Combat and upgrades don’t create decisions.** [S] Fighting wins about 100% of encounters on Beginner through Hard and nets +200 to +300 credits per fight. Lasers, shield and bigger holds barely move income.
3. **The mid-game is thin and the goal is hidden.** [S] After the early snowball, a trade-only bot slows to under 1k credits/day around days 30–50. A no-thought contract ferry earns about 1.1k/day. [V] The 500k goal appears only at the bottom of the Commander tab.

## 3. Do the systems support each other?

- **Trade and travel.** They work together, but fuel is nearly free. A Gnat pays 2 cr/pc, against margins of hundreds. Range is a hard gate (7 of 10 ships have 15 pc or less), not a cost.
- **Trade and missions.** They compete. [V] Offers are built as `[first, first, unseen]`, so a courier job and a freight job always share a destination. [S] A bot that accepted every offer and hopped earned about 1.1k/day with no cargo and no risk. Abandoning or expiring costs nothing, so there is no tension.
- **Combat.** It is +EV side income that pairs with nothing else. [S] A bounty of 300 beats the repair bill, even on Impossible with the starting laser (+67 per fight).
- **Upgrades.** They connect to little. [S] With 250k to start, 15-, 20- and 25-bay ships all earned about 2.1–2.2k/day. Stock restocks only +1 per jump per world, so hold size isn’t the limit. [V] Only Acamar sells Gnat-class ships and outfits, so every upgrade means a trip back there.

## 4. Five suggestions, ranked by impact over effort

### 1. Fix world generation first

- **Problem:** The galaxy is nearly flat, which causes the single-route solution and the unobtainable content.
- **Likely cause [G]:** The RNG uses `seed % n` on a power-of-two LCG, which gives weak low bits. Switching to high bits is probably a one-line fix, but I didn’t test it.
- **Also decide:** A fixed or hand-picked good seed versus per-game seeds. A fixed galaxy is fine if it’s tuned.
- **Test:** Print the tech histogram, then have 5 players play 20 minutes each and compare the routes they name as best.
- **Keep if:** At least about 8 worlds are tech 3 or higher, every good is buyable somewhere, and no single route supplies more than about 40% of an oracle bot’s profit. Players should name different routes.
- **Reject if:** The new galaxy still funnels everyone to one loop.
- **Sequence:** Do this before tuning anything else, then re-run the sims.

### 2. Give pirate encounters a real choice

- **Problem:** “Fire lasers” is always right.
- **Options:** Tie the bounty to enemy hull and difficulty, or raise enemy damage so a starting Gnat sometimes loses. Then check whether the laser and shield start paying off.
- **Test:** A combat matrix like mine, plus watching whether players ever flee or surrender.
- **Keep if:** The win rate at starting gear is about 70–90% and players report weighing the options.
- **Reject if:** Deaths feel arbitrary. Surrender already makes this fair.

### 3. Make contracts steer play instead of replacing it

- **Change:** Send the three offers to three different destinations, and scale rewards so a pair is a bonus, not a full income.
- **Problem:** Stacking is free and automatic.
- **Test:** Have players describe their plan after 20 minutes. Do they plan routes around contracts or just accept everything?
- **Keep if:** Players plan around contracts and still trade.
- **Reject if:** Contracts become ignorable.

### 4. Fix clarity and onboarding (cheap)

- Show the 500k goal and progress in the header.
- Explain the “—” cells (“needs tech 3 to buy”).
- Fix the phone tab row.
- Rewrite the opening hint. [S] Water earns +24 per unit, while Games out and Ore back earn several times more per credit.
- **Test:** A 5-minute “what are you trying to do?” check.
- **Keep if:** More players can state the goal and the next step without prompting.

### 5. Re-check whether upgrades pay after fix 1

- If they still don’t, adjust restock or stock caps rather than adding gear.
- **Test:** Ask players why they bought, or skipped, each upgrade.
- **Keep if:** At least some players buy a bigger ship or the shield and say it helped.

## 5. Bugs and rough edges reported

These findings are transcribed from Claude’s review and have not been independently reproduced here.

### Reported as verified by Claude [V]

- **Flat galaxy.** 21 of 24 worlds are tech 2, none are strict, and only Acamar reaches tech 5 or more. I tried 15 other seeds and they cluster at either 2/24 or 17/24 worlds at tech 3+, so it’s the generator and not just seed 57.
- **Unobtainable content.**
  - Robots can’t be bought anywhere.
  - Machines have no profitable route.
  - Hornet, Grasshopper, Termite and Wasp can’t be bought without cheats.
  - The Navigation computer (tech 6) is available nowhere.
  - Strict customs never appear, so the contraband code never runs.
- **Misleading claims.** The in-file comment says “meaningful cargo/shield/navigation equipment”. The README and your brief say 10 goods and 10 ships. Only 8 goods and 6 ships are usable in normal play.
- **Same game every time.** The galaxy is identical on every new game (fixed seed 57, confirmed on two loads), and prices never change after setup.
- **“Restore previous save” is a one-action undo.** It returns the state before your last action, not a checkpoint.
- **Unused ship stats.** Weapon-slot counts are only used as armed or unarmed, and the laser cap is 3 for every ship. Quarters are never used.
- **Odd job card text.** Courier and survey cards read “0 sealed bays”.
- **Chart geometry.** Planet slots come from world id, not distance. Aldea (18 pc) is drawn nearer than Brax (13 pc). The “not to scale” note is small, and route lines draw only within a sector.
- **Phone layout at 390 px.** The tab row clips “Commander”, the market header clips (“Profit here / un…”), and the page overflows by 4 px.
- **Rough edges.**
  - `demo` and `encounter` actions have no UI, and `demo` would skip the cheat flag if reached.
  - The footer says “the supplied Dark Nova II…”, which reads like internal notes.
  - Research URLs sit in an HTML comment in the shipped file.
  - `docs/index.html` loads Google Fonts, though the game file itself makes no external requests.

### Not verified / guesses [G]

- Whether the market table scrolls on a phone, and touch target sizes.
- Whether a softlock exists at zero credits, zero fuel and outstanding debt. I couldn’t reproduce one; the fuel-reserve default seems to protect against it.
- Whether Impossible is too hard. My bot got 0 of 20 runs to 500k and 3 deaths, but humans play differently.
- Licensing compatibility of the referenced sources.
- Real-device behavior. I didn’t test import/export through a file dialog or any iPhone build.

## 6. Playtest plan proposed by Claude

Use 5–8 players, mixing people who know Space Trader with people who don’t.

1. **Session 1, 15 minutes, no hints, think aloud.** Note time to first profit, whether they find the compare dropdown, and when they notice contracts.
2. **Session 2, about 30 minutes, free play.** Ask them to use Export save at minutes 10 and 20. The saves record credits, profit and deliveries, so you get numbers without adding code.
3. **Questions afterward:**
   - What were you trying to accomplish?
   - When did you last feel clever?
   - What did you do about pirates, and why?
   - Did you buy upgrades? Which, and did they help?
   - Did contracts feel like help, a distraction or a chore?
   - Was there a point where you didn’t know what to do next?
   - What would you have done with 1,000 more credits?
   - Would you open it again tomorrow?

Report findings as “N of M players did X”, not as “players want Y”.
