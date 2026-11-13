# Space Trader — browser playtest and iPhone prototype

An unofficial SwiftUI adaptation of Pieter Spronck's Palm OS Space Trader 1.2.2, based on the source archive you supplied. Targets iPhone with iOS 17 or later. There are no external dependencies or network services.

## Try the browser playtest

Open the [playable browser build](https://seanericknight.github.io/SpaceTrader-iPhone/SpaceTrader-browser.html) in Chrome. It is one self-contained HTML file with its code and artwork embedded; no install, account, package setup, or local server is required. You can also download `docs/SpaceTrader-browser.html` and open it directly. Local save data works when browser storage is available; the game also supports save export and import.

This build is a prototype for playtesting and qualitative market research. Ask players what feels engaging, confusing, too easy, or grindy. Feedback can guide whether the game remains browser-based or moves toward an iPhone release; it is not a representative market survey by itself.

The browser game and the SwiftUI app below are separate implementations with different feature sets. The browser build currently has 24 destinations. Do not assume browser features are present in the native app, or vice versa.

## Run on your iPhone

You need a Mac with Xcode 16 or later for these instructions.

1. Unzip the download and open `SpaceTrader.xcodeproj`.
2. Choose the **SpaceTrader** scheme and an iPhone simulator. Press Run to build and try it in the simulator.
3. For your own phone, open the project settings, select the **SpaceTrader** target, and open **Signing & Capabilities**. Choose your Apple development team and replace `net.example.SpaceTraderUnofficial` with a unique bundle identifier.
4. Connect and select your iPhone as the run destination, complete any device setup requested by Xcode, and press Run.

This delivery is source code, not a signed installable app. It does not include an IPA, TestFlight build, or App Store release. No Apple account, signing identity, or publishing action has been used.

## Start playing

You begin in Acamar with a Gnat, 1,000 credits, a pulse laser, 15 cargo bays, and a full tank.

- **Market:** buy one unit or the maximum you can afford and carry. Sale prices include a spread, so immediate resale loses credits. Travel to find a profitable route.
- **Galaxy:** the chart shows your current position and fuel range. Select a destination from the list and confirm your jump. Each jump advances one day.
- **Ship:** buy fuel, repair damage, upgrade equipment, and trade ships. Services use as much of your available balance as needed, up to a full tank or hull.
- **Commander:** accept courier work, borrow or repay money, read the log, and start a new commander. Courier payments help fund early travel.
- **Encounters:** pirates can be fought, fled, or surrendered to. Failed escape attempts cost hull. Police seize contraband and charge a fine.
- **Win:** earn 500,000 liquid credits, repay your debts, and buy a moon in Commander.

Progress is automatically saved after actions and when the app leaves the foreground. Pending encounters are saved too. Starting a new commander replaces your progress; there is one local save slot. Deleting the app can remove that save.

## Implemented and adapted

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

## Verification and limitations

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

## Project files

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

## Credits

Original Space Trader copyright © 2000–2005 Pieter Spronck, with contributors credited in the supplied source. This adaptation preserves the GPL version 2-or-later notice. See `NOTICE.md` and the included license. Original game artwork by Alexander Lawrence is not used by the iPhone app.
