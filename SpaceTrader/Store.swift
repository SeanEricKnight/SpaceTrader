// SPDX-License-Identifier: GPL-2.0-or-later
import SwiftUI

@MainActor final class GameStore: ObservableObject {
    @Published private(set) var game: Game
    @Published var saveError: String?
    private let saveURL: URL

    init() {
        saveURL = URL.documentsDirectory.appending(path: "commander-v1.json")
        let fresh = Game(catalog: .shared)
        if FileManager.default.fileExists(atPath: saveURL.path) {
            do {
                let loaded = try JSONDecoder().decode(Game.self, from: Data(contentsOf: saveURL))
                guard loaded.version == 1, loaded.worlds.count == 120,
                      loaded.worlds.indices.contains(loaded.location),
                      loaded.catalog.goods.count == 10, loaded.catalog.ships.count == 10,
                      loaded.catalog.ships.indices.contains(loaded.shipID),
                      loaded.cargo.count == 10, loaded.paid.count == 10,
                      loaded.worlds.allSatisfy({ $0.stock.count == 10 && $0.prices.count == 10 && (0...7).contains($0.crisis) }) else {
                    throw CocoaError(.fileReadCorruptFile)
                }
                game = loaded
            } catch {
                game = fresh
                saveError = "Your saved game could not be opened. The file has been kept. A new game is available; saving it will replace that file."
            }
        } else { game = fresh }
    }
    func perform(_ action: (inout Game) -> Void) {
        action(&game)
        save()
    }
    func save() {
        do {
            try JSONEncoder().encode(game).write(to: saveURL, options: .atomic)
        } catch { saveError = "Your latest progress could not be saved: \(error.localizedDescription)" }
    }
    func restart(name: String) {
        let cleaned = name.trimmingCharacters(in: .whitespacesAndNewlines)
        game = Game(catalog: .shared)
        game.commander = cleaned.isEmpty ? "Jameson" : String(cleaned.prefix(24))
        save()
    }
}
