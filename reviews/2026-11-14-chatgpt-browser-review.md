# Space Trader browser review — 2026-11-14 [ChatGPT]

Bug review, gameplay assessment, and cold-start player test. Reviewed [0.15.1 at d9521f0](https://github.com/SeanEricKnight/SpaceTrader/blob/d9521f0b91fba175964fea19906597d979ec0263/SpaceTrader-browser.html). Also reproduced the launch blocker on the then-current 0.16.0 checkout at `9925238661fe30b3ef02f7961956c0c26604e6da`. All HTML line numbers below refer to 0.15.1. This review made no gameplay changes.

## Handoff for Claude

**Fix #1 first.** A fresh player cannot leave Acamar through the browser UI. The engine can make the jump, but delegated click handling intercepts the Travel button. After fixing dispatch, verify a real browser click through the starter delivery and Water sale, then run the 20-jump cold-start playtest from a clean save. The review only reached zero jumps. Fixing #1 also exposes independent bugs, including string crew IDs and kidnapping rescue dispatch.

Design goal: reach 500,000 debt-free credits and buy a moon. Sean’s rule is that the game must explain itself and the player should never have to ask. The browser build is a prototype for a later iPhone game.

## 1. Bugs, ranked by severity

**VERIFIED** means reproduced or traced directly as noted. **INFERRED** labels consequences that follow from evidence without playing the full scenario. Browser observations come from Chrome. Engine reproductions used the exact 0.15.1 HTML and a Node DOM harness.

| # | Severity | Status and confidence | Minimal reproduction, expected vs. actual | Source |
|---|---|---|---|---|
| 1 | Blocker | VERIFIED · high | Fresh Normal game → Start flying → either Adahn Travel button. Expected Adahn, Day 2, 5 fuel. Actual Acamar, Day 1, 14 fuel, no error. Top-level tabs work, but the catch-all tab selector intercepts actions inside the main panel, including controls in Market, Jobs, Ship, Crew, and Commander. Reproduced in Chrome on both versions. | `renderCore` L1054, delegated click L1126, Travel L975 and L1013 |
| 2 | High | VERIFIED · high | In a valid exported save replace `"crew":[]` with `"crew":{}`. Expected rejection before applying. Actual decoder accepts it and opening Crew throws `list.some is not a function`. JSON, slot and save-code loads share the decoder. Reproduced with the decoder and renderer in Node. | `decodeSave` L129–146, `crewPanel` L348–356, slot and save-code functions L191–199, JSON import L1126 |
| 3 | High | VERIFIED · high | Normal Acamar, 0 fuel, 2 cr, 25,000 cr debt, no cargo or warp charges. Expected rescue when ordinary options cannot buy the nine fuel needed to leave. Actual rescue is hidden until the player spends 2 cr on one unit. With zero cash and one crate of Firearms, tow eligibility remains false and Market hides both Sell and Dump for that banned good. With no other income, that variant soft-locks. Verified eligibility and generated Market in Node. | `stranded`, `emergencyTow` L791–792, `creditAvailable` L650, `market` L1069–1076 |
| 4 | High | VERIFIED · high | With Wren in a pirate encounter, press Slipstream. Expected escape and a six-jump cooldown. Actual string ID `wren` is coerced to `NaN`, so it does nothing. The same path breaks Juno, Odo, Mattias, and Ruvi. Dessa's automatic trigger passes a string directly. Traced. | `abilityButtons`, `crewAbility` L322–323, `inspectGoods` L371–375, `action` L1055, delegated click L1126 |
| 5 | Medium | VERIFIED · high | Get kidnapped with crew aboard and press Call your crew for a rescue. Expected a rescue roll and a day on failure. Actual nothing changes. The dockside tow branch handles the same action first and returns. Wait it out remains available. Reproduced in Node. | `custodyAction`, `custodyPanel` L377–387, `emergencyTow` L792, `action` L1055 |
| 6 | Medium | VERIFIED · high | Start a fresh career with auto-fuel untouched. Save and reload or load it from a slot. Expected the setting to persist. Actual fresh games start with auto-fuel effectively off and the decoder switches it on, so the next eligible docking can spend money automatically. Reproduced in Node. | `fresh` L115–121, `normalizeSave` L125, `autoFuel` L932, `market` L1078 |
| 7 | Medium | VERIFIED · high | Normal, Bumblebee at its Acamar home, zero fuel and auto-fill off. Quote Go there for me to Balosnee. Expected the 270 cr quote to cover the five legs in an uninterrupted run. Actual fuel costs 306 cr because the quote uses the home rate at every stop. Reproduced in Node with adequate cash and encounters disabled. | `autoPlan`, `autoTravel`, `autoButton` L511–528, `fuelRate` L923 |
| 8 | Medium | VERIFIED · high | Bring a Gnat with 1 fuel and enough for a Firefly deposit to a tech-eligible yard. Rent the Firefly and return it immediately undamaged. Expected the original tank or a fuel charge. Actual the Gnat gets 14 fuel, the deposit comes back in full, and no day passes. Reproduced in Node. | `rentShip`, `returnRental` L445–456 |
| 9 | Medium | VERIFIED · high | Normal with 1,000 cr debt → take a Quiet ride. Expected advertised per-travel-day interest over both days. Actual two days elapse and debt reaches just 1,015 cr. Rental is also advertised per day and charged once per jump. Crew and escort wages are advertised per jump. | `jump` L931, `interestDue` L648, `payRental` L457, `rentalPanel` L460–465 |
| 10 | Medium | VERIFIED · high | Approach a strict port carrying Firearms or Narcotics and roll a pirate encounter. Fight and win, escape, or warp out. Expected the normal customs check. Actual those outcomes dock directly. Uneventful arrivals and resolved incidents call `inspectGoods()` before docking. Traced. | `jump` L931, `resolve` L935, `incidentAction` L426, `inspectGoods` L371–375 |
| 11 | Medium | VERIFIED · high | At net worth high enough for positive `boardChance()`, choose Surrender cargo. Expected the fight card's stated cargo loss and 10% cash loss. Actual the boarding roll can take all cash and leave the player in captivity. The fight card omits that branch. Traced. | `boardChance` L330–336, `boarded`, `capturedOrBoarded` L389–400, `combatPanel` L785, GAMEPLAY.md L132–134 |
| 12 | Low | VERIFIED · high | Fresh Normal start → look for How to play in the dock services bar as instructed. Expected help there. Actual that bar is gone and the conditional replacement is absent at full hull and fuel. Help exists in the welcome and first-haul cards. Observed in Chrome. | `introHtml`, `tutorialCard` L202–205, `portServices` L647, `renderCore` L1054, GAMEPLAY.md L14 and L64 |

### Smallest fixes for the top five

1. **Click dispatch.** Give the panel theme a separate attribute such as `data-screen` and update its CSS. Limit navigation delegation to actual tab controls. Add a browser check that clicks through the first jump and Water sale. Existing engine tests call `action()` directly and skip the broken selector.
2. **Corrupt saves.** Validate the crew array, known IDs, and the fields used by render and payroll before accepting a candidate. Preserve defaults for omitted legacy fields. Audit other persisted structures used directly by rendering, especially custody, encounters, and rental.
3. **Stranding.** Compare actual reachable ports against current fuel plus the amount the player can afford. Account for usable warp charges and locally sellable cargo. Keep Dump available for held goods even when locally prohibited.
4. **Crew abilities.** Forward the string ID for ability actions while retaining numeric conversion for actions that take indexes. Check from the actual Slipstream button that the encounter clears and cooldown starts.
5. **Kidnapping rescue.** Use a distinct action such as `crew-rescue` and dispatch it to `custodyAction`. Check both success and a failed attempt that advances the clock.

### Checks that passed and limits

- A legacy courier migrated to an active contract with its reward intact. Blocked storage let the session continue and displayed the session-only notice. Ordinary save/reload passed.
- A three-unit warehouse lot with 100 cr of cost basis came back intact after split withdrawal. Two elapsed days cost exactly 6 cr. A direct warp spent one charge and no normal fuel.
- An Excitement incident stopped auto-route at the first hop. The first sale at Adahn added the 1,500 cr bonus and the second paid regular sale proceeds only.
- Five existing checks passed on the exact HTML in Node: logic, events, crew, warp, and solar. Three other attempted checks needed unavailable `@napi-rs/canvas` (community, world-bank, and review). Browser slot export/import was not completed end to end.

## 2. Gameplay and decision quality

The opening supplies a clear destination, reason to go, and payoff. The engine supports route variety. A price-aware bot found 37 directed route-and-commodity combinations over 120 jumps in 0.15.1. Its top combination contributed 17.7% of trade profit. **INFERRED:** mid-game repetition is more likely to come from repeating the same decision than from repeating a single route. Once you can afford a bigger hold, maximizing the likely margin on a full load may crowd out jobs, storage, and home-port choices. Combat has meaningful choices when hull, cash, or cargo are at risk, though fighting looks routinely favorable for an undamaged Rookie in controlled trials. The browser blocker prevented a judgment about the feel of a full run. Evidence: `market`, `advanceEvents`, `offers`, `bestRuns`, `combatPanel`, `careerTier`, and the rerun of `sim-review.cjs`.

| Rank | Player problem and evidence | Concrete change | Tradeoff and validation |
|---|---|---|---|
| 1 | VERIFIED: tutorial names Adahn and describes departure, but actual Travel is farther down the page. Chrome, `tutorialCard`, `mapSelectionBar`. | After fixing dispatch, put Travel to Adahn · 9 fuel on the first-haul card. After arrival, change it to Open Market to sell Water. | Duplicates controls for one short tutorial. Give a player a clean save and see whether they earn the bonus unaided. |
| 2 | VERIFIED: Market shows per-unit difference and quote age, with fuel shown elsewhere. INFERRED: a favorable unit margin can look like a good trip even when the trip loses money. `market`. | For a selected logged port, show expected sale proceeds, cargo cost and fuel for the next leg. Show quote age alongside. Preserve Hard and Impossible's reduced help. | Estimates may look more certain than they are. Give players fresh and stale quotes and see if they can explain their load choice. |
| 3 | VERIFIED: Beginner/Easy Best runs sorts by pay per fuel, Normal by payout, Hard lists local offers in posted order, and Impossible hides the panel. `bestRunsTier`, `bestRuns`. | Keep the Normal sort and add deadline and reserved bays beside pay and fuel. Open the specific job for review from its shortcut. | Adds density to a short list. Give players a high-paying freight job, a smaller courier run and a good trade. See if they can explain what fits their plan. |
| 4 | VERIFIED: damage and escape odds are available, while surrender omits possible boarding. `combatPanel`, `capturedOrBoarded`. | Show possible boarding and the actual cash and freight at risk alongside the existing bounty, hull, and damage information. | Additional numbers can slow the choice. Present the same pirate against a healthy empty ship and a damaged loaded one and see if the choice changes. |
| 5 | INFERRED: the cards lack a common way to judge competing uses of cash. `shipRestriction`, `rentShip`, `storageDue`, `setHome`, `payCrew`, `payEscorts`. | Show consequences in the unit that matters to the choice: extra bays, newly reachable ports, planned trip fees, or first charge and deposit. | Detail should earn its space by changing decisions. Give a player cash for one upgrade and a route in mind. Ask them to explain their choice before buying. |

### What the 0.6.2 results no longer establish

- The static-price description is obsolete because timed crises alter prices. The old starter win rates and repair costs predate career scaling and capture. In the 0.15.1 rerun, a full-hull Normal Rookie Gnat won 3,000 of 3,000 seeded fire-only trials. Win measurement was adjusted in memory to count actual pirate kills. Positive hull can also result from capture. This does not establish results for a damaged ship or a later career tier.
- The old 120-jump cash totals, leading-route share, ferry earnings, and Beetle premium are historical. The 0.15.1 bot reruns from 1,000 cr ended at **504,959 cr** for the oracle trader and **87,359 cr** for the contracts-only ferry. The oracle sees all prices and runs with encounters disabled. These are directional comparisons and cannot tell us how quickly a human discovers routes.
- [Historical playtest results](https://github.com/SeanEricKnight/SpaceTrader/blob/d9521f0/PLAYTEST_RESULTS.md) · [Simulator](https://github.com/SeanEricKnight/SpaceTrader/blob/d9521f0/browser-preview/sim-review.cjs)

### Exploits and flattened strategies

- **VERIFIED:** At a yard, rent a longer-range ship while your owned ship is nearly empty, then return the rental undamaged without leaving. Same credits and a filled owned tank. Repeat on later visits. `rentShip`, `returnRental`.
- **VERIFIED by trace:** Carry prohibited goods toward a strict port. When a pirate intercepts the approach, win or escape to dock with contraband without the usual roll. Ordinary play cannot force that pirate encounter. `jump`, `resolve`, `inspectGoods`.
- **INFERRED:** Fill the hold with the highest-margin eligible commodity, find a new buyer as crises shift, and channel proceeds into cargo volume. The equal-cash oracle Beetle ran at about 2.5× the Gnat's gross trade profit. Purchase cost and encounters were excluded, so the result does not establish the best first upgrade. `tradeLimit`, `advanceEvents`, `sim-review.cjs`.

Wait for human playtests before changing ship prices, wages, contract payouts, or endgame incentives. Observe whether players find a second worthwhile route, adapt after a crisis ends, and voluntarily switch between trade, jobs, and combat on the way to 500,000 cr.

## 3. Cold-start player test

**Goal after about a minute.** I understood that I needed 500,000 credits to buy a moon. I planned to take the five bays of Water already in the hold to Adahn, sell them, and collect the 1,500 cr bonus.

**Decisions.** I chose Start flying because the welcome gave me a destination and a payout. I kept Steady because the first jump was in range. I tried Travel to Adahn · 9 fuel, then the chart's Travel · 9 fuel. I opened Market to see whether I had missed a trading step, went back to System, selected Adahn again, and retried. The opening payoff felt concrete enough to make me want to go, but I never reached a sale, encounter, or reward.

**CONFUSION, ordered by how much it slowed me down**

1. **Travel to Adahn · 9 fuel / Travel · 9 fuel.** I expected to leave or get a reason I couldn't. I still saw DOCKED · DAY 1, Acamar, and FUEL 14/14. This stopped me.
2. **Show Adahn on the map.** I expected it to switch from Market to System with Adahn selected. I stayed in Market and opened System myself.
3. **Press How to play in the dock services bar any time.** I expected a Help control near the ship stats. I found no dock services bar. I had seen help in the welcome.

**Goal after 20 jumps:** no observation. **Completed jumps:** 0. **Best route found:** the game handed me Acamar → Adahn within the first minute. I saw the 54 cr Water quote and 1,500 cr bonus but did not complete the route or discover a repeatable one.

**Three changes that would have helped me most:** make Travel advance the game, make Show Adahn on the map take me to the correct screen, and put help where the welcome says to look.

This is one simulated first-time player. Source and documentation were used in the separate bug and gameplay review, never to resolve confusion for the cold-start run.
