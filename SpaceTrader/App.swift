// SPDX-License-Identifier: GPL-2.0-or-later
import SwiftUI

@main @MainActor struct SpaceTraderApp: App {
    @StateObject private var store = GameStore()
    @Environment(\.scenePhase) private var scenePhase
    var body: some Scene {
        WindowGroup {
            RootView().environmentObject(store).preferredColorScheme(.dark)
                .onChange(of: scenePhase) { _, phase in
                    if phase != .active { store.save() }
                }
        }
    }
}
