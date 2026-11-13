# Browser update — November 13, 2026

This is an additive refinement after the initial GitHub upload. It documents the current browser game, not a new native iPhone release. Package version: `0.5.0`.

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
