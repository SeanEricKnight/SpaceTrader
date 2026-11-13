# Automated playtest results

Build: post-upload browser refinement, November 13, 2026. This package was checked using Node.js v24.22.1 and `@napi-rs/canvas` 0.1.100 already installed in the authoring environment. A fresh network dependency installation was not tested.

Game SHA-256: `52873102df748c0f1d957883f92c17d26c63cf838924d556ae84a7f8d567c8b0`.

The raw current results are in `browser-preview/review-after.json`. Run `npm run simulate` to regenerate them from the included engine. The test suite rejects results whose digest does not match the game file.

## What the earlier review did and did not describe

The supplied Claude review named repository commit `20e733b`. Its flat-world findings apply to an earlier browser build, not the authored-world game in this ZIP. The current local build was checked directly; no claim is made that the remote repository has already been updated.

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

## Verification and open questions

Core, community, banking/world, solar, and review checks pass. Coverage includes financing limits, repeated borrowing, repayments and interest, legacy saves, mission cargo and one-time rewards, corruption rejection, stranded rescue, real weapon damage, and the original hidden cheats. The root and hosted game copies are byte-identical.

The latest build has not had a complete Chrome or phone-layout run in this environment. Native canvas and SVG/HTML generation were exercised; browser storage dialogs, phone touch behavior, and the native iPhone project still need direct testing. The older external Chrome review is not evidence that the revised CSS has been visually verified.

Use `PLAYTEST_PLAN.md` to test whether people actually understand the goal, enjoy route discovery, find financing/repairs, and prefer the revised combat and contracts.
