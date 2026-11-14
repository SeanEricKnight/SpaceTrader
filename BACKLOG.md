# Backlog and idea tracker

One place for every idea Sean has raised, with status. Update this file whenever an idea is built, changed, or deferred. Details and open questions live in [DESIGN_IDEAS.md](DESIGN_IDEAS.md); what shipped lives in [CHANGELOG.md](CHANGELOG.md).

Last updated: November 14, 2026 (version 0.7.1).

## Built

| Idea | Version | Notes |
| --- | --- | --- |
| Test button for unlimited money | 0.6.2 | Footer "Test tools" opens the cheat console. |
| Market screen without sideways scrolling | 0.7.0 | Compact rows; tap a row to trade. |
| Price age on logged markets | 0.7.0 | Shows days old; "≈" at 3+ days. |
| Every good can have a big payoff (events start and end) | 0.7.0 | Timed events; water and food triple. |
| Paid newspaper | 0.7.0 | Full edition lists all crises; price scales with difficulty. |
| Multiple escorts that level up and cost more | 0.7.0 | Up to three, wages per jump. |
| Difficulty-based help | 0.7.0 (started) | Days-left shown only at Beginner and Easy. |

## Deferred (not built yet)

| Idea | Why deferred | Next step |
| --- | --- | --- |
| **Firefly-style crew and story.** Escorts become characters with avatars, backstories, loyalty, and personal arcs; faction jobs with moral choices. | Needs a design discussion first (see DESIGN_IDEAS.md). | Decide crew size and roles, portrait approach, and tone. |
| **Ship previews that show equipment.** Guns, cargo bays, shields should appear on the ship image before you buy them. | Needs new ship art. The current ship pictures are fixed images. | Decide the art approach, then add equipment overlays or per-loadout images in the Ship tab and shipyard. |
| **Better planet and ship graphics.** Sean says the planets and ships look poor; static ship images are fine. | Needs a decision on style. Planet checks (`check-planets`, `check-solar`) assert the current textured planets, and need `@napi-rs/canvas` to run. | Try clean, flat planets and larger map planets; fix the ship icon overlapping labels; run checks on the PC. |
| Easier levels get more help (route hints, friendlier tables) | Route-finding must stay the player's job. | Playtest the 0.7.0 aids first. |
| Events at game start: lore text describes early events as ongoing | Lore says "cold spell" and "shooting war" as permanent. | Reword port history so it reads as a past or recurring condition. |
| Firefox, Edge, and Safari testing | No Firefox available in the build environment. | Sean to try Firefox and report; add notes to PLAYTEST_RESULTS.md. |
| iPhone/Xcode build | Needs a Mac. Left alone on purpose. | See IPHONE_ROADMAP.md. |

## Notes

- Save slot name `space-trader-chrome-preview-v1` is just a storage key. It is not browser-specific.
