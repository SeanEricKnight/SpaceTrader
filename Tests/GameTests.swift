// SPDX-License-Identifier: GPL-2.0-or-later
import XCTest
@testable import GameCore

final class GameTests: XCTestCase {
    func fresh() -> Game { Game(catalog: .shared, seed: 42) }
    func testOriginalCatalog() {
        let g = fresh()
        XCTAssertEqual(g.worlds.count, 120)
        XCTAssertEqual(g.ship.name, "Gnat")
        XCTAssertEqual(g.ship.bays, 15)
        XCTAssertEqual(g.catalog.goods.count, 10)
    }
    func testImmediateResaleCannotPrintMoney() {
        var g = fresh()
        let starting = g.credits
        g.buy(0, all: true)
        XCTAssertGreaterThan(g.occupied, 0)
        XCTAssertLessThanOrEqual(g.occupied, g.ship.bays)
        XCTAssertGreaterThanOrEqual(g.credits, 0)
        g.sell(0, all: true)
        XCTAssertEqual(g.occupied, 0)
        XCTAssertLessThan(g.credits, starting)
        XCTAssertEqual(g.paid[0], 0)
    }
    func testJumpCannotTeleport() {
        var g = fresh()
        g.fuel = 0
        g.jump(to: 1)
        XCTAssertEqual(g.location, 0)
        XCTAssertEqual(g.day, 1)
        g.jump(to: -1)
        XCTAssertEqual(g.location, 0)
    }
    func testTravelConsumesFuelAndChargesInterest() {
        var g = fresh()
        g.borrow()
        let target = g.worlds.first { $0.id != 0 && g.distance(to: $0.id) <= g.fuel }!.id
        let expected = g.fuel - g.distance(to: target)
        g.jump(to: target)
        XCTAssertEqual(g.fuel, expected)
        XCTAssertEqual(g.day, 2)
        XCTAssertEqual(g.debt, 1010)
        XCTAssertEqual(g.location, target)
    }
    func testPoliceSeizeOnlyContraband() {
        var g = fresh()
        g.cargo[5] = 3; g.cargo[8] = 2; g.cargo[0] = 1
        g.encounter = Encounter(id: UUID(), kind: "Police", hull: 50)
        g.resolve("inspect")
        XCTAssertEqual(g.cargo[5], 0)
        XCTAssertEqual(g.cargo[8], 0)
        XCTAssertEqual(g.cargo[0], 1)
        XCTAssertEqual(g.credits, 500)
        XCTAssertNil(g.encounter)
    }
    func testEncounterBlocksTradingAndTravel() {
        var g = fresh()
        g.encounter = Encounter(id: UUID(), kind: "Pirate", hull: 50)
        g.buy(0); g.jump(to: 1); g.borrow()
        XCTAssertEqual(g.credits, 1000)
        XCTAssertEqual(g.location, 0)
        XCTAssertEqual(g.occupied, 0)
    }
    func testSaveRoundTripPreservesPendingEncounter() throws {
        var g = fresh()
        g.buy(0)
        g.encounter = Encounter(id: UUID(), kind: "Pirate", hull: 41)
        let data = try JSONEncoder().encode(g)
        let decoded = try JSONDecoder().decode(Game.self, from: data)
        XCTAssertEqual(decoded.encounter?.hull, 41)
        XCTAssertEqual(decoded.cargo, g.cargo)
        XCTAssertEqual(decoded.rng.seed, g.rng.seed)
        XCTAssertEqual(decoded.credits, g.credits)
    }
    func testDeliveryPaysExactlyOnce() {
        var g = fresh()
        let target = g.worlds.first { $0.id != 0 && g.distance(to: $0.id) <= g.fuel }!.id
        g.delivery = Delivery(destination: target, reward: 500, deadline: 10)
        g.jump(to: target)
        XCTAssertEqual(g.credits, 1500)
        XCTAssertNil(g.delivery)
    }
    func testRefuelHonorsBalanceAndTankCapacity() {
        var g = fresh()
        g.fuel = 0; g.credits = 5
        g.refuel()
        XCTAssertEqual(g.fuel, 2)
        XCTAssertEqual(g.credits, 1)
        g.credits = 10000; g.refuel()
        XCTAssertEqual(g.fuel, g.ship.range)
    }
    func testRetirementRequiresCreditsAndNoDebt() {
        var g = fresh()
        g.credits = 500000; g.debt = 1; g.retire()
        XCTAssertFalse(g.retired)
        g.debt = 0; g.retire()
        XCTAssertTrue(g.retired)
        XCTAssertEqual(g.credits, 0)
        XCTAssertFalse(g.active)
    }
    func testShipCannotDiscardCargoSilently() {
        var g = fresh()
        g.cargo[0] = 15; g.credits = 1000000
        g.purchase(g.catalog.ships[0])
        XCTAssertEqual(g.shipID, 1)
        XCTAssertEqual(g.cargo[0], 15)
    }
}
