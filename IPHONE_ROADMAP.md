# iPhone remains the destination

The HTML edition is the playable test bed for the intended iPhone game. It lets us test the rules, interface, economy, story, and feel quickly while keeping a useful browser game along the way.

## Two possible delivery paths

1. **Reuse the web game inside an iPhone app.** Bundle the HTML and embedded assets with an iOS project and display them with `WKWebView`. This keeps the current JavaScript rules and map. Add native persistence/export handling, lifecycle behavior, and platform features where needed.
2. **Build a native SwiftUI interface and engine.** The earlier repository contains an independent SwiftUI prototype. It has not been kept in feature parity with this browser edition. Bringing it forward requires explicit migration of the rules, content, save contracts, and tests; copying the HTML does not update that project.

Apple documents `WKWebView` as a native view capable of displaying interactive HTML, CSS, and JavaScript alongside native UI: [WKWebView documentation](https://developer.apple.com/documentation/webkit/wkwebview).

The package does not choose an irreversible delivery path. An iPhone release still requires an iOS project, an Xcode build, device testing, and the normal distribution work. This ZIP is not a signed app.

## Decisions that should guide browser work now

- Every essential interaction must work by touch; hovering is optional assistance.
- Pan with one finger and zoom around a two-finger pinch. Provide visible zoom, fit, and find-ship controls as alternatives.
- Keep planet drawings small enough for a spacious overview while retaining at least 44 CSS-pixel selection areas. Check overlap on physical devices; the numeric size alone does not prove usability.
- A tap selects information. It never spends credits or starts travel. Use an explicit Travel button.
- Keep the map full width and put detailed port information below it. Do not shrink the main map to make room for a permanent desktop sidebar.
- Remember the view while visiting Market, Bank, Ship, or Jobs. “Fit system” and “Find my ship” deliberately move it; ordinary planet selection does not.
- Preserve game time, fuel, money, missions, and RNG while panning and zooming. Camera preferences are stored separately from commander saves.
- A jump completes through the game rules immediately. Its short ship animation is cosmetic and skippable, and reduced-motion settings skip it.
- Orbit positions remain stable. Unique surfaces, per-world spin speeds and tilts, and star glow supply atmosphere without changing route distances. Lighting is computed once per world and reused; both binary stars contribute. Animation respects reduced motion.
- Keep rules and save data independent of animation timing. The current HTML still combines engine and presentation functions in one script; extracting explicit engine, persistence, and view modules is a future preparation step, not work already completed.

## Before calling the iPhone version ready

Run the current game on real iPhone hardware in Safari and then in the chosen app container. Check small-screen and landscape layouts, drag/pinch cancellation, accidental taps after gestures, orientation changes, interruption/background/resume, reduced motion, save retention, and import/export.

For a web-view app, explicitly test the persistence and file-export adapter in that container; browser-local storage behavior is not a substitute for those checks. For a SwiftUI port, replay deterministic saves and simulation fixtures to verify rule parity.

The current gesture checks use a DOM harness and simulated pointer events. The static SVG view was rendered for inspection. These checks do not establish that the complete interface or actual iPhone gestures have been verified in a browser/device session.
