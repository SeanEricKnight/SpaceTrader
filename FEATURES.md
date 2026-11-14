# Space Trader: detailed feature notes (older)

The short overview is in [README.md](README.md). This file keeps the longer notes from earlier versions; the changelog has the current numbers.


**This is an update after the initial GitHub upload.** It packages the latest Chrome game and the subsequent world-building, banking, usability, and balance work. Keep the existing iPhone project and other unrelated repository files. This package does not contain a new iPhone build.

**iPhone remains the target platform; HTML is the playable prototype and browser edition.** The approved map refinement now has mouse and touch controls. See [IPHONE_ROADMAP.md](IPHONE_ROADMAP.md) for the delivery paths and device checks still needed.

## New in 0.8.0

- **No game over:** losing a fight costs cargo, not the run. Boardings become possible only as you get rich, and take everything you carry.
- **Crew:** six named characters with stories, found at their home ports. They never die.
- **Jail, bail, marauder offers, and ship rental.**
- **Info cards:** click a ship in the shipyard or a planet on the map. The old distance map is now a readable list.

See [CHANGELOG.md](CHANGELOG.md) for numbers and rules.

## New in 0.7.0

- **Market screen:** one compact row per good with Buy and Sell always visible; tap a row for the trade buttons. Goods you cannot trade at this port collapse into one line. Logged markets now show how old the quote is, and quotes three or more days old show "≈".
- **Timed market events:** war, plague, drought, boredom, cold spells, crop failures, and labor shortages start and end over days. Prices for the affected goods move while an event lasts. Water and food events now triple prices so cheap goods can matter.
- **Paid newspaper:** the Dispatch bulletin covers one port for free; the full edition lists every port in a crisis today. The price scales with difficulty. Beginner and Easy also show days left.
- **Escort wing:** hire up to three escorts, pay wages each jump, and watch them level up. They lower pirate encounters and add volley damage.
- **Planet art and ship previews with equipment** are not done yet. See [BACKLOG.md](BACKLOG.md).

Ideas and their status live in [BACKLOG.md](BACKLOG.md) and [DESIGN_IDEAS.md](DESIGN_IDEAS.md).

## Play

Open **[SpaceTrader-browser.html](SpaceTrader-browser.html)** in any modern browser (tested in Chrome; Firefox, Edge, and Safari are expected to work but are not yet tested). No server, installation, account, or network connection is needed to play. The JavaScript, CSS, planet rendering, and compressed ship artwork are included in the HTML.

You start with a Gnat, a simple laser, and cash determined by difficulty. Trade, explore, and take contracts. Your long-term goal is **500,000 credits with no debt**, enough to buy a moon. The goal and progress now stay visible at the top of the game.

For GitHub Pages, [docs/index.html](docs/index.html) is the entry page and [docs/SpaceTrader-browser.html](docs/SpaceTrader-browser.html) is the game. See [GITHUB_UPDATE.md](GITHUB_UPDATE.md) for upload and publishing instructions.

## Latest map refinement

- A full-width, draggable map with wheel zoom, two-finger pinch zoom, visible +/− controls, Fit system, Find my ship, and Focus selected.
- Zoom anchored under the pointer or pinch midpoint, bounded panning, and remembered camera position per region across screens and reloads.
- Smaller planet drawings with large independent selection areas. Labels reveal more information as you zoom; tap targets remain at least 44 CSS pixels.
- Port details below the map, with a compact selected-port Travel control immediately beneath the chart. A tap selects; travel always uses its own button.
- Stable orbital positions, 24 unique surface variants, individual rotation periods/axial tilts, two retrograde worlds, and quiet star glow. Star-relative day/night shading combines both stars in the Sisters; the larger planet preview uses the same animated globe. A brief, skippable ship-travel effect is separate from the completed game action.
- Reduced-motion support, keyboard camera controls, and gesture checks that distinguish taps from drags/pinches.

## Earlier refinements included

- Three visually distinct stellar neighborhoods: Hearth in the Inner Reach, the binary Sisters in the Outer Reach, and Cinder in the Far Reach. An additional map shows the actual coordinates used for fuel distances.
- Twenty-four authored ports with histories, resource profiles, shortages, and clear explanations of demand. Nineteen ports are tech 3 or above; nine enforce strict customs. All ten goods and ship types are available through normal play.
- Six original characters with histories, personalities, motivations, and relationships. The Reach Dispatch introduces the factions and follows the optional relief story.
- A visible consequence for the relief mission: delivering supplies ends Baratas’s disease emergency and reduces its medicine prices. The newspaper reports confirmed progress.
- Bank access from every main screen, partial loans and repayments, and shipyard financing for the exact cash shortfall. The confirmation shows trade-in, cash applied, debt, and the next travel-day interest charge.
- Refueling and repairs from every main screen. A rescue tow prevents a commander with no money, usable fuel, cargo, or remaining credit from becoming permanently stranded.
- Three different destinations on each contract board. Contracts remain stable while reading; existing contracts from different boards may still fit the same planned route.
- Combat warnings that show volley damage, enemy damage, estimated return damage, bounty, and escape odds. Weapon mounts now affect actual damage; laser upgrades cover all mounts and cost accordingly.
- A persistent moon-fund indicator, explanations for unavailable trades, clearer undo wording, and layout adjustments for phones.

## Difficulty and borrowing

| Difficulty | Starting cash | Loan interest per successful travel day | Starting Gnat fuel price |
| --- | ---: | ---: | ---: |
| Beginner | 2,500 cr | 0.5% | 1 cr/pc |
| Easy | 1,500 cr | 1% | 2 cr/pc |
| Normal | 1,000 cr | 1.5% | 2 cr/pc |
| Hard | 750 cr | 2% | 3 cr/pc |
| Impossible | 500 cr | 3% | 4 cr/pc |

The credit line is **25,000 credits including accrued interest**. Unpaid interest compounds on each successful jump, rounded up to whole credits; the rescue tow also advances one day and accrues interest. Reading, shopping, ordinary refueling, repairs, and repayments do not advance time. Repayments have no extra fee. Other ship types have their own fuel costs.

**Easy is deliberately forgiving.** A healthy ship should absorb meaningful damage and remain repairable. In 3,000 simulated Easy battles, a fully repaired starter Gnat survived all 3,000 and lost about 39 of its 100 hull points per fight on average. A damaged ship entering another fight remains vulnerable. Normal and higher difficulties put more weight on preparation and escape decisions.

## Saves and updating

The game autosaves locally when browser storage is available. Under Commander, **Export save** creates a portable JSON file and **Import save** validates it before replacement. Export before replacing a downloaded game or moving between a local file and a hosted site; those locations may have separate browser storage.

**Undo previous saved action** restores the last distinct saved state. It is not a named checkpoint. Export a save for a lasting checkpoint.

Older saves retain their worlds, prices, cargo, active missions, ship, and debt. Current difficulty-based interest and combat rules apply when playing this version. Start a new game to use the authored regional economies if continuing from a build that predates them.

Developer/testing shortcuts are documented separately in [CHEATS.md](CHEATS.md). Using them marks the commander’s run.

## Development and checks

The root `SpaceTrader-browser.html` is the editable source of truth. This is still a single-file prototype, not a fully separated cross-platform engine. Edit its embedded code and styles, then run `npm run sync` to update the Pages copy. Do not independently edit the two game files.

Playing needs no Node dependencies. Running the automated checks needs **Node.js 20 or later** and the pinned native canvas development dependency:

```sh
npm install
npm test
```

`npm test` verifies that the root and Pages games are identical, regenerates the simulation report, and runs the core, community, bank/world, solar, review, camera, planet, and events/escorts/newspaper checks. The simulation report includes the game’s SHA-256 digest so stale results are rejected. `npm run simulate` runs the simulations alone.

Seventeen additional camera checks exercise anchor math, simulated mouse/touch gestures, selection safety, view retention, and cosmetic animation. The checks also cover trading, cargo reservations, contracts, story rewards, market effects, equipment, financing, interest, rescue, cheats, save migration/import/export, and browser-storage failure. The simulated combat matrix has 3,000 fights per difficulty and loadout. Trade bots use perfect market information and disable encounters to isolate the economy; those outcomes are not human playtest results.

See [PLAYTEST_RESULTS.md](PLAYTEST_RESULTS.md) for measured results and [PLAYTEST_PLAN.md](PLAYTEST_PLAN.md) for the next human test session.

## Scope and remaining limits

- This is a playable browser prototype, not a complete recreation of Space Trader or Dark Nova, and not an installable iPhone app.
- The galaxy is intentionally authored and fixed. Each new voyage receives a separate encounter seed. Prices are generally fixed; the relief story is a specific exception. There is no ambient market simulation.
- This build has 24 playable ports, ten commodities, ten ship types, three outfit types, contracts, and one short optional story. The larger original name catalog does not make all those original systems playable.
- Police encounters, a crew-hiring system, fleets, and the original game’s full mission collection are not implemented. Ship quarters remain catalog data; linked weapon mounts do affect combat.
- The latest JavaScript and generated planet/chart markup were tested. Full Chrome layout, real-phone touch behavior, file-dialog interaction, and an iPhone build remain unverified in this authoring environment. Mobile CSS changes still need a device check.
- Bot outcomes are specific to the documented strategies, seeds, and starting conditions. They do not establish that human players will enjoy the balance or that one strategy is globally optimal.

## Native iPhone app

The repository also contains an independent SwiftUI adaptation based on the supplied Palm OS source. It targets iOS 17 or later and remains separate from the browser game.

### Build and run

You need a Mac with Xcode 16 or later for these instructions.

1. Unzip the download and open `SpaceTrader.xcodeproj`.
2. Choose the **SpaceTrader** scheme and an iPhone simulator. Press Run to build and try it in the simulator.
3. For your own phone, open the project settings, select the **SpaceTrader** target, and open **Signing & Capabilities**. Choose your Apple development team and replace `net.example.SpaceTraderUnofficial` with a unique bundle identifier.
4. Connect and select your iPhone as the run destination, complete any device setup requested by Xcode, and press Run.

This delivery is source code, not a signed installable app. It does not include an IPA, TestFlight build, or App Store release. No Apple account, signing identity, or publishing action has been used.

### Native implementation scope

| Area | This version |
| --- | --- |
| System names | All 120 names from the supplied source |
| Goods | All 10, with original base price, technology, resource, and crisis parameters |
| Ships | All 10 purchasable types and original core specifications |
| Galaxy | New, connected grid with randomized locations and economies |
| Trading | Local stock, technology restrictions, weighted cargo cost, profit logging, and a fixed 10% sale spread |
| Travel | Fuel range, one day per jump, market restocking, and loan interest |
| Encounters | Simplified pirate combat, escape, surrender, and contraband inspections |
| Equipment | Simplified laser levels and passive shields |
| Missions | New courier jobs; original story quest chains are not ported |
| End game | Simplified moon purchase and retirement |
| Interface | New SwiftUI views, scalable text, native controls, and an informational galaxy chart |

The chart is informational; use the destination list to travel. This is a functional first implementation rather than a complete recreation of every original mechanic.

Not implemented: original story quests, crew and skill allocation, wormholes, original government types, trader encounters, original combat balance and difficulty modes, insurance and escape pods, original equipment inventory, special ships, newspapers, sound, original graphics, cloud saves, or imports of Palm saved games. Ship trade-in is simplified and does not price equipment separately. A lower-priced ship does not pay surplus trade-in credit in this build.

### Native verification and limitations

This project was generated in a Linux environment without Swift, Xcode, an iOS simulator, or a connected iPhone. **The Swift code has not been compiled, the XCTest suite has not been run, and the interface has not been visually checked on an iPhone.** Treat the first Xcode build and device session as required validation, not a release-ready certification.

Run `python3 verify_project.py` to repeat the portable packaging and catalog checks.

Completed here: archive integrity, original catalog extraction and comparison, project file references and build phases, scheme XML structure, resource inclusion, and generated-galaxy connectivity checks.

Run the included core tests on a machine with Swift 5.9 or later:

```sh
cd SpaceTrader-iPhone
swift test
```

The Swift package builds the game engine and catalog, independently of the iPhone UI. It includes scenarios for cargo limits, immediate resale, travel and fuel, bank interest, encounter locks, inspections, delivery rewards, save round trips, retirement, and ship cargo compatibility. These tests do not cover SwiftUI or on-device persistence.

For a simulator build from the terminal on a Mac with Xcode:

```sh
xcodebuild -project SpaceTrader.xcodeproj -scheme SpaceTrader \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO build
```

Before relying on the build, try buying and selling, jumping, both encounter types, ship changes, app termination and relaunch during an encounter, new-game confirmation, small-screen layouts, and large accessibility text.

### Repository project files

- `SpaceTrader/Game.swift`: independent game state, simulation, and catalog models.
- `SpaceTrader/Catalog.json`: extracted original trade, ship, and system data.
- `SpaceTrader/Store.swift`: state ownership and atomic JSON save/load.
- `SpaceTrader/Views.swift`: four tabs and encounter interface.
- `SpaceTrader/App.swift`: app entry point and lifecycle saving.
- `Tests/GameTests.swift`: core XCTest scenarios.
- `Package.swift`: testable core package.
- `SpaceTrader.xcodeproj`: iPhone app project and shared Run scheme.
- `Original-Source-1.2.2.zip`: the original archive, unchanged.
- `Original-ReadMe.txt`, `NOTICE.md`, and `SpaceTrader/LICENSE.txt`: attribution, scope, and original license.


## Attribution

Based on Space Trader by Pieter Spronck. The HTML retains its `GPL-2.0-or-later` declaration; the supplied GPL v2 text is in [LICENSE](LICENSE) and [licenses/GPL-2.0.txt](licenses/GPL-2.0.txt). See [NOTICE.md](NOTICE.md) for source attribution and adaptation notes, and [CHANGELOG.md](CHANGELOG.md) for this update’s scope.
