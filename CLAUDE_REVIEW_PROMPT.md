# Claude review prompt — Space Trader

Review the current project in https://github.com/SeanEricKnight/SpaceTrader-iPhone. The browser build is the fast, playable prototype for testing the game and should remain fun on its own. The longer-term goal is an iPhone game. Keep that direction in mind throughout your review.

Read the README, CHANGELOG, IPHONE_ROADMAP, PLAYTEST_RESULTS, the current browser HTML, the earlier review in `reviews/`, and the native SwiftUI project for context. The browser and SwiftUI projects are separate; do not assume they are in feature parity.

Do not edit files, commit, or publish anything. I want an independent review and suggestions only.

Assess:
- Whether the newest map camera controls, touch interactions, planet rotation, axial tilt, and star-relative lighting improve the game, and what usability, performance, accessibility, or visual risks remain.
- Whether the browser prototype supports the eventual iPhone goal: touch-first interaction, small-screen layout, lifecycle and save behavior, and a sensible path for evaluating WKWebView versus a native SwiftUI port. Do not treat automated DOM checks as real iPhone testing.
- Whether the core loop is engaging: discovering routes, trading, contracts, combat choices, upgrades, loans, refueling/repairs, and story. Look for strategies or exploits that flatten decisions.
- Whether the simulation results support the conclusions in the docs. Flag claims that exceed the evidence or miss meaningful edge cases.
- Which improvements are most likely to make play more enjoyable, and which should wait until human tests.

Return:
1. A concise overall judgment.
2. The five best suggestions, ranked by likely player impact and effort.
3. For each suggestion: evidence from specific files/functions or a reproducible scenario, the player problem it addresses, a concrete change, tradeoffs, and a way to validate it.
4. A separate list of factual bugs or unsupported claims, with severity and confidence.
5. A short playtest plan that distinguishes questions requiring human players, Chrome testing, and real iPhone hardware.
6. A brief recommendation on the next iPhone-path experiment, without pretending this review chooses the final architecture.

Separate verified facts, inferences, and guesses. Treat bot results as directional rather than human evidence. Do not recommend feature expansion just because the code could support it; prioritize clarity, fun, and learnable decisions.