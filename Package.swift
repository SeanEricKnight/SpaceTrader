// swift-tools-version: 5.9
import PackageDescription
let package = Package(
    name: "SpaceTraderCore",
    platforms: [.macOS(.v13)],
    products: [.library(name: "GameCore", targets: ["GameCore"])],
    targets: [
        .target(name: "GameCore", path: "SpaceTrader",
                exclude: ["App.swift", "Store.swift", "Views.swift", "LICENSE.txt"],
                sources: ["Game.swift"], resources: [.copy("Catalog.json")]),
        .testTarget(name: "GameCoreTests", dependencies: ["GameCore"], path: "Tests")
    ]
)
