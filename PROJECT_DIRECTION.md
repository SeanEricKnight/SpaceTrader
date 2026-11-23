# Project direction

## Browser prototype and iPhone decision

The Chrome/browser game is the fast-to-test prototype. Use it to evaluate whether the core loop—including missions, trading, and ship upgrades—is enjoyable and to support early market research before investing more effort in a native iPhone port.

The long-term platform choice remains open. The browser game may remain a browser game for fun even if an iPhone version is pursued. Treat the browser build as a useful product in its own right, not merely a throwaway prototype.

This records project direction, not a commitment to build or publish a native iPhone app.

## Platform decision: watch list (2026-11-14, Sean)

The desktop chart layout in 0.16.1 is deliberately not phone-ready: phones keep the stacked layout. Gameplay is getting more complicated, so a decision may be needed soon. This is a note, not a decision. Options: wrap the HTML in a `WKWebView` (see IPHONE_ROADMAP.md), or build a native SwiftUI port (the SwiftUI prototype is about 600 lines against 1,100+ dense lines in the browser build and is not at feature parity).

Signs the decision is close:
- The phone layout needs a separate design, not a narrower one.
- Playtesters cannot explain their choices without several panels visible at once.
- Remaining bugs come from the JS UI layer rather than the rules engine.
- Sean wants App Store distribution, haptics or offline play without Safari.

Keep the rules engine in plain functions, separate from rendering, so either route can reuse it.

## Sean's design constraints (recorded 2026-11-23 from Claude's memory)

- Keep the solar-system chart and the detailed ship artwork.
- Avoid, unless strong evidence supports it: passive income, automated trading, fleet micromanagement, runtime AI narration, persistent rivals, and major dependencies. (The opt-in rival race from 0.16.0 is in the backlog; Sean should confirm it fits this rule.)
- Treat player research as qualitative, not representative polling.
- Prioritize clarity, fun and learnable decisions over feature expansion. Independent reviews make no edits or commits unless asked.
