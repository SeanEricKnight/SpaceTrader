# Space Trader

A browser game of interstellar trading, inspired by the classic Palm OS *Space Trader*. Buy low, sell high, dodge pirates and customs, and save **500,000 credits** to buy your own moon. No game over: lose a fight and you lose cargo, not the run.

**Version 0.15.0** · single HTML file · plays in a desktop or phone browser (Chrome tested most; Firefox lightly)

## Play

- **Open it:** download [SpaceTrader-browser.html](SpaceTrader-browser.html) and double-click it, or use the GitHub Pages link once enabled: `https://seanericknight.github.io/SpaceTrader/`
- Your save lives in your own browser. Use **Commander, then Export** to move it.

## How it plays

- **Trade:** 24 ports, 8 goods, price tags (Cheap / Fair / Pricey) that say where to buy and sell, and a cargo hold meter.
- **Events:** wars, plagues, droughts and more raise prices for a few days. The paid newspaper (single issue or 10-day subscription) lists every port in a crisis.
- **Travel:** pick a **Quiet ride**, **Steady** or **Excitement** trip. Excitement can bring a derelict, a distress call or a trader convoy.
- **Range and fuel:** each ship has a maximum jump, so long trips need stops. **Go there for me** plans the route and buys the fuel for you (Beginner to Normal). A one-use **warp charge** jumps up to 40 pc or escapes a fight.
- **Jobs:** contracts with named clients and relief bonuses for crisis ports.
- **Crew and escorts:** six crew with stories, plus hired escort pilots who lower pirate risk.
- **Consequences:** jail with bail, kidnapping with a way out, boarding that takes everything but only when you are rich, marauder offers, and ship rental.
- **Difficulty:** Beginner to Impossible. Easier levels give more hints; Hard and Impossible give almost none.

## Project notes

| File | What it is |
| --- | --- |
| [PORTRAITS.md](PORTRAITS.md) | How to add character faces |
| [GAMEPLAY.md](GAMEPLAY.md) | The rules, kept current with every version |
| [CHANGELOG.md](CHANGELOG.md) | What changed in each version |
| [BACKLOG.md](BACKLOG.md) | What is built and what is waiting |
| [DESIGN_IDEAS.md](DESIGN_IDEAS.md) | Ideas not built yet (threat map, reputation) |
| [FEATURES.md](FEATURES.md) | Longer notes from earlier versions |
| [CHEATS.md](CHEATS.md) | Hidden console commands |
| [IPHONE_ROADMAP.md](IPHONE_ROADMAP.md) | Plan for a native iPhone app |

## For developers

- Any change to how the game plays must also update `GAMEPLAY.md` (the rules) and `CHANGELOG.md`.
- Edit `SpaceTrader-browser.html`, then run `node scripts/sync-pages.cjs` to refresh the `docs/` copy.
- `npm test` runs the checks; some need `@napi-rs/canvas`.
- Native Swift project files are kept in the repo and not the current focus.

## Attribution

Based on *Space Trader* by Pieter Spronck, an unofficial adaptation released under `GPL-2.0-or-later` (see [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md)).
