// SPDX-License-Identifier: GPL-2.0-or-later
// Adapted from Space Trader by Pieter Spronck. See NOTICE.md.
import Foundation

struct Good: Codable, Identifiable {
    let id: Int
    let name: String
    let production: Int
    let usage: Int
    let peak: Int
    let base: Int
    let increment: Int
    let variance: Int
    let crisis: Int
    let cheap: Int
    let expensive: Int
}
struct Vessel: Codable, Identifiable {
    let id: Int
    let name: String
    let bays: Int
    let weapons: Int
    let shields: Int
    let range: Int
    let tech: Int
    let fuelCost: Int
    let price: Int
    let hull: Int
}
struct Catalog: Codable {
    let goods: [Good]
    let ships: [Vessel]
    let names: [String]
    static let shared: Catalog = {
        #if SWIFT_PACKAGE
        let bundle = Bundle.module
        #else
        let bundle = Bundle.main
        #endif
        guard let url = bundle.url(forResource: "Catalog", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let catalog = try? JSONDecoder().decode(Catalog.self, from: data) else {
            preconditionFailure("The bundled Catalog.json is missing or invalid.")
        }
        return catalog
    }()
}
struct Generator: Codable {
    var seed: UInt64
    mutating func number(_ limit: Int) -> Int {
        seed = seed &* 6364136223846793005 &+ 1442695040888963407
        return Int((seed >> 32) % UInt64(max(1, limit)))
    }
}
struct World: Codable, Identifiable {
    let id: Int
    let name: String
    let x: Int
    let y: Int
    let tech: Int
    let resource: Int
    let crisis: Int
    let strict: Bool
    let danger: Int
    var stock: [Int]
    var prices: [Int]
    var visited: Bool
}
struct Encounter: Codable, Identifiable {
    let id: UUID
    let kind: String
    var hull: Int
}
struct Delivery: Codable {
    let destination: Int
    let reward: Int
    let deadline: Int
}
struct Game: Codable {
    var version = 1
    var commander = "Jameson"
    var credits = 1000
    var debt = 0
    var day = 1
    var location = 0
    var shipID = 1
    var fuel = 14
    var hull = 100
    var laser = 1
    var shield = 0
    var cargo = Array(repeating: 0, count: 10)
    var paid = Array(repeating: 0, count: 10)
    var worlds: [World] = []
    var rng: Generator
    var encounter: Encounter?
    var delivery: Delivery?
    var log = ["Welcome, Commander. Buy low, sell high, and keep enough credits for fuel."]
    var retired = false
    var catalog: Catalog

    init(catalog: Catalog, seed: UInt64 = UInt64.random(in: 1...UInt64.max)) {
        self.catalog = catalog
        rng = Generator(seed: seed)
        // A jittered grid keeps the galaxy connected even for short-range ships.
        for (id, name) in catalog.names.enumerated() {
            let tech = id == 0 ? 5 : rng.number(8)
            let resource = rng.number(13)
            let crisis = rng.number(4) == 0 ? 1 + rng.number(7) : 0
            var prices: [Int] = []
            var stock: [Int] = []
            for good in catalog.goods {
                var price = good.base + good.increment * tech
                if good.cheap == resource { price = price * 3 / 4 }
                if good.expensive == resource { price = price * 4 / 3 }
                if good.crisis == crisis { price *= 2 }
                price += rng.number(good.variance * 2 + 1) - good.variance
                prices.append(max(1, price))
                stock.append(tech >= good.production ? max(3, 40 - abs(tech - good.peak) * 5 + rng.number(16)) : 0)
            }
            worlds.append(World(id: id, name: name, x: (id % 12) * 9 + rng.number(3),
                y: (id / 12) * 9 + rng.number(3), tech: tech, resource: resource,
                crisis: crisis, strict: id == 0 ? false : rng.number(3) == 0,
                danger: rng.number(5), stock: stock, prices: prices, visited: id == 0))
        }
    }
    var ship: Vessel { catalog.ships[shipID] }
    var world: World { worlds[location] }
    var occupied: Int { cargo.reduce(0, +) }
    var active: Bool { hull > 0 && !retired && encounter == nil }
    var netWorth: Int { credits - debt + ship.price * 3 / 4 + cargo.indices.reduce(0) { $0 + cargo[$1] * sellPrice($1) } }
    var crisisName: String { ["Stable economy", "War", "Plague", "Drought", "Boredom", "Cold spell", "Crop failure", "Labor shortage"][world.crisis] }
    func distance(to id: Int) -> Int {
        let dx = Double(world.x - worlds[id].x), dy = Double(world.y - worlds[id].y)
        return max(1, Int(ceil(sqrt(dx * dx + dy * dy))))
    }
    func illegal(_ id: Int) -> Bool { world.strict && (id == 5 || id == 8) }
    func canBuy(_ id: Int) -> Bool { active && !illegal(id) && world.tech >= catalog.goods[id].production && world.stock[id] > 0 && credits >= world.prices[id] && occupied < ship.bays }
    func canSell(_ id: Int) -> Bool { active && !illegal(id) && cargo[id] > 0 && world.tech >= catalog.goods[id].usage }
    func sellPrice(_ id: Int) -> Int { max(1, world.prices[id] * 90 / 100) }
    mutating func note(_ text: String) { log.insert("Day \(day): \(text)", at: 0); log = Array(log.prefix(60)) }
    mutating func buy(_ id: Int, all: Bool = false) {
        guard canBuy(id) else { return }
        let price = world.prices[id]
        let qty = all ? min(ship.bays - occupied, min(world.stock[id], credits / price)) : 1
        credits -= qty * price; cargo[id] += qty; paid[id] += qty * price
        worlds[location].stock[id] -= qty
        note("Bought \(qty) \(catalog.goods[id].name) for \(qty * price) cr.")
    }
    mutating func sell(_ id: Int, all: Bool = false) {
        guard canSell(id) else { return }
        let qty = all ? cargo[id] : 1
        let cost = paid[id] * qty / cargo[id]
        let revenue = qty * sellPrice(id)
        paid[id] -= cost; cargo[id] -= qty; credits += revenue
        worlds[location].stock[id] += qty
        note("Sold \(qty) \(catalog.goods[id].name). Profit: \(revenue - cost) cr.")
    }
    mutating func refuel() {
        guard active else { return }
        let amount = min(ship.range - fuel, credits / ship.fuelCost)
        guard amount > 0 else { return }
        credits -= amount * ship.fuelCost; fuel += amount
        note("Added \(amount) parsecs of fuel.")
    }
    mutating func repair() {
        guard active else { return }
        let cost = max(1, ship.price / 20000)
        let amount = min(ship.hull - hull, credits / cost)
        guard amount > 0 else { return }
        credits -= amount * cost; hull += amount
        note("Repaired \(amount) hull points.")
    }
    mutating func jump(to id: Int) {
        guard worlds.indices.contains(id), active, id != location, distance(to: id) <= fuel else { return }
        fuel -= distance(to: id); location = id; day += 1; worlds[id].visited = true
        if debt > 0 { debt += max(1, debt / 100) }
        // Markets regenerate slowly each day; buying and selling alone cannot reroll prices.
        for w in worlds.indices {
            for g in catalog.goods.indices where worlds[w].tech >= catalog.goods[g].production {
                worlds[w].stock[g] = min(70, worlds[w].stock[g] + rng.number(3))
            }
        }
        note("Arrived at \(world.name). \(crisisName).")
        if let mission = delivery {
            if day > mission.deadline { note("Courier deadline missed."); delivery = nil }
            else if mission.destination == id { credits += mission.reward; delivery = nil; note("Delivery complete. Earned \(mission.reward) cr.") }
        }
        if rng.number(100) < 12 + world.danger * 7 {
            encounter = Encounter(id: UUID(), kind: world.strict && rng.number(3) == 0 ? "Police" : "Pirate", hull: 30 + rng.number(50))
            note("\(encounter!.kind) vessel intercepted your approach.")
        }
    }
    mutating func resolve(_ action: String) {
        guard var enemy = encounter, hull > 0, !retired else { return }
        if enemy.kind == "Police" {
            var seized = 0
            for id in [5, 8] { seized += cargo[id]; cargo[id] = 0; paid[id] = 0 }
            let fine = min(credits, seized * 100)
            credits -= fine; encounter = nil
            note(seized == 0 ? "Inspection passed. Clear to dock." : "Contraband seized. Fine: \(fine) cr.")
            return
        }
        if action == "surrender" {
            cargo = Array(repeating: 0, count: 10); paid = cargo
            let loss = credits / 10; credits -= loss; encounter = nil
            note("Pirates took your cargo and \(loss) cr. Your ship survived."); return
        }
        if action == "flee" && rng.number(100) < 60 {
            encounter = nil; note("Escaped the pirates and docked safely."); return
        }
        if action == "fight" && laser > 0 {
            enemy.hull -= 8 + laser * 10 + rng.number(15)
            if enemy.hull <= 0 {
                let bounty = 150 + rng.number(450); credits += bounty; encounter = nil
                note("Pirate destroyed. Bounty: \(bounty) cr."); return
            }
        }
        let damage = max(1, 8 + rng.number(20) - shield * 6)
        hull = max(0, hull - damage); encounter = enemy
        note("Enemy hit: \(damage) damage. Enemy hull: \(enemy.hull).")
        if hull == 0 { encounter = nil; note("Your ship was destroyed. Start a new commander to try again.") }
    }
    func shipCost(_ vessel: Vessel) -> Int { max(0, vessel.price - ship.price * 3 / 4) }
    func canPurchase(_ vessel: Vessel) -> Bool { active && vessel.id != shipID && world.tech >= vessel.tech && occupied <= vessel.bays && credits >= shipCost(vessel) }
    mutating func purchase(_ vessel: Vessel) {
        guard canPurchase(vessel) else { return }
        credits -= shipCost(vessel); shipID = vessel.id; hull = vessel.hull; fuel = vessel.range
        laser = min(laser, vessel.weapons); shield = min(shield, vessel.shields)
        note("Traded your ship for a \(vessel.name). Fuel and hull restored.")
    }
    mutating func upgradeLaser() {
        guard active, world.tech >= 5, laser < 3, ship.weapons > 0, credits >= 2000 * (laser + 1) else { return }
        credits -= 2000 * (laser + 1); laser += 1; note("Laser upgraded to level \(laser).")
    }
    mutating func upgradeShield() {
        guard active, world.tech >= 5, shield < ship.shields, credits >= 5000 else { return }
        credits -= 5000; shield += 1; note("Energy shield installed.")
    }
    mutating func borrow() {
        guard active, debt == 0 else { return }
        debt = 1000; credits += 1000; note("Borrowed 1,000 cr. Interest is 1% per travel day.")
    }
    mutating func repay() {
        guard active else { return }
        let amount = min(debt, credits); debt -= amount; credits -= amount
        if amount > 0 { note("Repaid \(amount) cr.") }
    }
    mutating func acceptDelivery() {
        guard active, delivery == nil else { return }
        let candidates = worlds.filter { $0.id != location && distance(to: $0.id) <= ship.range }
        guard !candidates.isEmpty else { return }
        let target = candidates[rng.number(candidates.count)]
        let reward = 200 + distance(to: target.id) * 30
        delivery = Delivery(destination: target.id, reward: reward, deadline: day + 5)
        note("Courier job: reach \(target.name) by day \(day + 5) for \(reward) cr. No cargo space required.")
    }
    mutating func retire() {
        guard active, credits >= 500000, debt == 0 else { return }
        credits -= 500000; retired = true; note("You bought a moon and retired. A very respectable ending.")
    }
}
