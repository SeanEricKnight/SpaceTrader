# Automated playtest results

Build: 0.6.2 browser refinement, November 14, 2026 (adds a visible Test tools button; economy, combat, and map results are unchanged and were regenerated). This package was checked using Node.js v24.22.1 and `@napi-rs/canvas` 0.1.100 already installed in the authoring environment. A fresh network dependency installation was not tested.

Game SHA-256: `47658cc50b1e691287318c107a7ef2cf68c4c4279981160f249a7262b24832d1`.

The raw current results are in `browser-preview/review-after.json`. Run `npm run simulate` to regenerate them from the included engine. The test suite rejects results whose digest does not match the game file.

## What the earlier review did and did not describe

The supplied Claude review named repository commit `20e733b`. Its flat-world findings apply to an earlier browser build, not the authored-world game in this ZIP. The current local build was checked directly. These package-level checks do not establish that the hosted page or a physical device has been visually verified.

| Current world check | Result |
| --- | ---: |
| Playable ports | 24 |
| Ports at tech 3 or above | 19 |
| Strict-customs ports | 9 |
| Normally buyable commodity types | 10 / 10 |
| Normally buyable ship types | 10 / 10 |
| Ports reachable through connected starter-range jumps | 24 / 24 |

Every commodity also has at least one profitable route somewhere within a 20-pc jump, before fuel, encounters, and financing costs. This is a coverage check, not a promise of profit on every route or difficulty.

## Combat: 3,000 fights per row

Each fight starts with a fully repaired ship and a newly generated pirate. The bot keeps firing; it never flees or surrenders. Seeds are `Math.imul(i + 1, 2654435761) >>> 0` for trial indices 0–2999. Results describe those trials only.

| Difficulty | Starter Gnat wins | Average repair cost among wins | Average bounty among wins |
| --- | ---: | ---: | ---: |
| Beginner | 100% | 12 cr | 45 cr |
| Easy | 100% | 39 cr | 75 cr |
| Normal | 88.4% | 142 cr | 118 cr |
| Hard | 59.7% | 233 cr | 142 cr |
| Impossible | 27.6% | 339 cr | 169 cr |

On Easy, repairs cost 1 credit per hull point. The 39-credit average therefore means about **39 hull points lost out of 100**, with all 3,000 tested ships surviving. This does not mean a previously damaged ship is safe or that every possible random sequence is survivable.

On Normal, starter win rate is 88.4%; a Firefly with a shield wins 99.9%, and a Gnat with tier-3 lasers wins 100%. Shields and lasers improve actual outcomes, not just displayed statistics. Repair and bounty averages above exclude destroyed ships, so they are **not** an expected-value calculation including replacement-ship losses.

The current encounter interface shows damage ranges and potential return damage. A player can stop firing and choose escape or surrender between volleys. A failed escape costs a hit; surrender preserves the hull while losing cargo and 10% of cash.

## Economy and upgrades: one oracle strategy

The bot knows all prices, chooses a single best immediate trade among reachable ports, refuels/repairs, and runs for 120 jumps. Encounters are disabled to isolate the economy, it takes no loans, and stock still limits purchases. These are idealized strategy comparisons, not human earnings predictions and not a proof of global optimality.

- Starting with 1,000 credits and a Gnat, it finishes with 468,281 credits, earns 469,767 in recorded trade profit, and uses 11 distinct route/commodity combinations.
- Its leading directed route contributes **30.6%** of recorded trade profit, below the earlier review’s suggested 40% screening threshold for this particular bot.
- With equal 250,000-credit starting cash, the Gnat earns 467,754 trade profit and the 50-bay Beetle earns 696,492: about 49% more gross trade profit. Their ship purchase costs are excluded from this comparison; their actual fuel bills are deducted from ending cash.
- The contract-only ferry finishes with 46,046 credits after 120 jumps. Before the contract changes, the same ferry strategy finished with 126,161. This deliberately reduces automatic ferry income; human testing must check whether contracts still feel worthwhile.

Ordinary market prices and authored port identities remain fixed intentionally. This update did not add ambient price shocks or replace the authored economy with a random galaxy.

## Map and touch refinement

The approved map update has 17 automated interaction scenarios using a DOM harness with simulated pointer events. They check desktop/phone fit geometry, pointer-anchored zoom, bounded pan, per-region view retention, wheel and button alternatives, tap/drag/pinch separation, pointer cancellation, keyboard focus, minimum 44 CSS-pixel targets, zoom-dependent labels, and cosmetic/skippable travel. Camera changes leave time, money, fuel, missions, and engine RNG unchanged. Reduced motion skips the travel effect.

The three actual region SVGs were rendered for inspection. The complete Chrome interface, native WebKit embedding, and physical-device gestures remain unverified. See `IPHONE_ROADMAP.md` for the target-platform plan.

## Individual planet rotation and lighting

All 24 fictional worlds have distinct rotation periods, visual speeds, obliquities, and generated surface images. Two rotate retrograde. Mathematical shading checks confirm a brighter star-facing rim on each world, normalized lighting weights, and two light sources in the Sisters. Each map globe and larger preview has isolated SVG definitions. Repeated globe renders reuse cached textures/shading and leave the game state unchanged.

The displayed physical rotation periods are fictional world facts; the animation compresses them into seconds for visibility. The day/night renderer uses point-source diffuse lighting and a visibility-preserving ambient term. It does not model eclipses, seasons, terrain occlusion, or ring self-shadowing. Browser animation and physical-device performance remain unverified.

The design borrows the general diversity of real planets, not their exact parameters. NASA examples: [Venus rotation](https://science.nasa.gov/venus/venus-facts/) and [Uranus tilt and rotation](https://science.nasa.gov/uranus/facts/).

## Verification and open questions

Core, community, banking/world, solar, review, and camera checks pass. Coverage includes financing limits, repeated borrowing, repayments and interest, legacy saves, mission cargo and one-time rewards, corruption rejection, stranded rescue, real weapon damage, and the original hidden cheats. The root and hosted game copies are byte-identical.

The latest build has not had a complete Chrome or phone-layout run in this environment. Native canvas and SVG/HTML generation were exercised; browser storage dialogs, phone touch behavior, and the native iPhone project still need direct testing. The older external Chrome review is not evidence that the revised CSS has been visually verified.

Use `PLAYTEST_PLAN.md` to test whether people actually understand the goal, enjoy route discovery, find financing/repairs, and prefer the revised combat and contracts.

## 0.7.0 (November 14, 2026)

Checked in this environment: `check-logic`, `check-solar`, and the new `check-events` pass in Node. A headless Chrome run loaded the game at phone size, opened the Market, Newspaper, and Ship screens, bought a newspaper, hired an escort, and simulated 60 days of events with no console errors; about seven ports were in a crisis at once. The community, world-bank, review, camera, and planets checks could not run here because `@napi-rs/canvas` cannot be installed; please run `npm test` on the PC. Not tested: Firefox, Edge, Safari, a real phone, and long play sessions for balance. Balance of wages, event frequency, and the 3x water/food multiplier is a first guess and needs play.
