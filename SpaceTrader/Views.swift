// SPDX-License-Identifier: GPL-2.0-or-later
import SwiftUI

private let space = Color(red: 0.025, green: 0.045, blue: 0.09)
private let mint = Color(red: 0.37, green: 0.94, blue: 0.77)
private let techNames = ["Pre-agricultural", "Agricultural", "Medieval", "Renaissance", "Early industrial", "Industrial", "Post-industrial", "Hi-tech"]
private let resources = ["Nothing special", "Mineral rich", "Mineral poor", "Desert", "Sweetwater oceans", "Rich soil", "Poor soil", "Rich fauna", "Lifeless", "Weird mushrooms", "Special herbs", "Artistic populace", "Warlike populace"]
private func cr(_ value: Int) -> String { value.formatted() + " cr" }

struct RootView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        TabView {
            NavigationStack { MarketView() }.tabItem { Label("Market", systemImage: "shippingbox") }
            NavigationStack { GalaxyView() }.tabItem { Label("Galaxy", systemImage: "sparkles") }
            NavigationStack { ShipView() }.tabItem { Label("Ship", systemImage: "airplane") }
            NavigationStack { CommanderView() }.tabItem { Label("Commander", systemImage: "person.crop.circle") }
        }
        .tint(mint)
        .sheet(isPresented: Binding(get: { store.game.encounter != nil }, set: { _ in })) {
            EncounterView().interactiveDismissDisabled()
        }
        .alert("Save notice", isPresented: Binding(get: { store.saveError != nil }, set: { if !$0 { store.saveError = nil } })) {
            Button("OK") { store.saveError = nil }
        } message: { Text(store.saveError ?? "") }
    }
}
struct StatusView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("DOCKED AT").font(.caption2.weight(.bold)).tracking(3).foregroundStyle(mint)
                    Text(store.game.world.name).font(.largeTitle.bold())
                }
                Spacer()
                Image(systemName: "sparkle").font(.largeTitle).foregroundStyle(mint)
            }
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], alignment: .leading) {
                metric("CREDITS", store.game.credits.formatted())
                metric("CARGO", "\(store.game.occupied)/\(store.game.ship.bays)")
                metric("FUEL", "\(store.game.fuel) pc")
            }
            if store.game.hull == 0 || store.game.retired {
                Label(store.game.retired ? "You retired to your own moon." : "Ship destroyed. Start a new game in Commander.", systemImage: "flag.checkered")
                    .foregroundStyle(.orange).font(.callout)
            }
        }.padding().background(.white.opacity(0.045), in: RoundedRectangle(cornerRadius: 22))
    }
    private func metric(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).font(.caption2).foregroundStyle(.secondary)
            Text(value).font(.headline.monospacedDigit()).minimumScaleFactor(0.7).lineLimit(1)
        }
    }
}
struct MarketView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                StatusView()
                VStack(alignment: .leading, spacing: 6) {
                    Text(techNames[store.game.world.tech]).font(.headline)
                    Text("\(resources[store.game.world.resource]) · \(store.game.crisisName)").font(.subheadline).foregroundStyle(.secondary)
                    if store.game.world.strict { Label("Firearms and narcotics prohibited", systemImage: "exclamationmark.shield").font(.caption).foregroundStyle(.orange) }
                }
                ForEach(store.game.catalog.goods) { good in GoodsRow(good: good) }
                Text("Prices are per unit. Local sale prices include a 10% spread. Travel to find better markets.")
                    .font(.footnote).foregroundStyle(.secondary)
            }.padding()
        }.background(space).navigationTitle("Space Trader").navigationBarTitleDisplayMode(.inline)
    }
}
struct GoodsRow: View {
    @EnvironmentObject var store: GameStore
    let good: Good
    var body: some View {
        let g = store.game
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text(good.name).font(.headline)
                    Text(g.illegal(good.id) ? "Prohibited here" : "Stock \(g.world.stock[good.id]) · On board \(g.cargo[good.id])")
                        .font(.caption).foregroundStyle(g.illegal(good.id) ? .orange : .secondary)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 3) {
                    Text(cr(g.world.prices[good.id])).font(.headline.monospacedDigit())
                    Text("Sell \(cr(g.sellPrice(good.id)))").font(.caption).foregroundStyle(.secondary)
                }
            }
            if g.cargo[good.id] > 0 {
                Text("Average cost: \(cr(g.paid[good.id] / g.cargo[good.id]))")
                    .font(.caption).foregroundStyle(.secondary)
            }
            ViewThatFits(in: .horizontal) {
                HStack { buyButtons; sellButtons }
                VStack { HStack { buyButtons }; HStack { sellButtons } }
            }
        }.padding().background(.white.opacity(0.045), in: RoundedRectangle(cornerRadius: 16))
    }
    @ViewBuilder private var buyButtons: some View {
        Button("Buy 1") { store.perform { $0.buy(good.id) } }
            .buttonStyle(.bordered).disabled(!store.game.canBuy(good.id))
        Button("Buy max") { store.perform { $0.buy(good.id, all: true) } }
            .buttonStyle(.bordered).disabled(!store.game.canBuy(good.id))
    }
    @ViewBuilder private var sellButtons: some View {
        Button("Sell 1") { store.perform { $0.sell(good.id) } }
            .buttonStyle(.bordered).disabled(!store.game.canSell(good.id))
        Button("Sell all") { store.perform { $0.sell(good.id, all: true) } }
            .buttonStyle(.bordered).disabled(!store.game.canSell(good.id))
    }
}
struct GalaxyView: View {
    @EnvironmentObject var store: GameStore
    @State private var search = ""
    @State private var reachable = true
    private var destinations: [World] {
        store.game.worlds.filter { world in
            world.id != store.game.location && (!reachable || store.game.distance(to: world.id) <= store.game.fuel) && (search.isEmpty || world.name.localizedCaseInsensitiveContains(search))
        }.sorted { store.game.distance(to: $0.id) < store.game.distance(to: $1.id) }
    }
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                StatusView()
                GalaxyChart().frame(height: 285).accessibilityLabel("Galaxy chart. Choose a destination from the list below.")
                Toggle("Within current fuel range", isOn: $reachable)
                Text("Travel uses one fuel unit per parsec and advances one day. Encounters may interrupt docking.").font(.footnote).foregroundStyle(.secondary)
                if destinations.isEmpty {
                    ContentUnavailableView("No destinations", systemImage: "fuelpump", description: Text("Refuel in Ship, show all systems, or adjust your search."))
                }
                ForEach(destinations) { world in
                    DestinationRow(world: world)
                }
            }.padding()
        }.background(space).navigationTitle("Galaxy").searchable(text: $search, prompt: "Find a star system")
    }
}
struct GalaxyChart: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        Canvas { context, size in
            let g = store.game
            func point(_ w: World) -> CGPoint {
                CGPoint(x: 12 + Double(w.x) / 105 * (size.width - 24), y: 12 + Double(w.y) / 85 * (size.height - 24))
            }
            let center = point(g.world)
            let rx = Double(g.fuel) / 105 * (size.width - 24)
            let ry = Double(g.fuel) / 85 * (size.height - 24)
            let circle = Path(ellipseIn: CGRect(x: center.x - rx, y: center.y - ry, width: rx * 2, height: ry * 2))
            context.fill(circle, with: .color(mint.opacity(0.08)))
            context.stroke(circle, with: .color(mint.opacity(0.4)), lineWidth: 1)
            for w in g.worlds {
                let p = point(w)
                let current = w.id == g.location
                let r: CGFloat = current ? 5 : 2.5
                let color: Color = current ? mint : (g.distance(to: w.id) <= g.fuel ? .white : .gray)
                context.fill(Path(ellipseIn: CGRect(x: p.x-r, y: p.y-r, width: r*2, height: r*2)), with: .color(color))
            }
        }.background(.white.opacity(0.03), in: RoundedRectangle(cornerRadius: 20)).clipped()
    }
}
struct DestinationRow: View {
    @EnvironmentObject var store: GameStore
    let world: World
    @State private var confirm = false
    var body: some View {
        let distance = store.game.distance(to: world.id)
        HStack {
            VStack(alignment: .leading, spacing: 5) {
                Text(world.name).font(.headline)
                Text("\(techNames[world.tech]) · \(distance) pc").font(.caption).foregroundStyle(.secondary)
                Text(world.strict ? "Strict policing" : "Open trade").font(.caption).foregroundStyle(.secondary)
                if store.game.delivery?.destination == world.id { Label("Courier destination", systemImage: "envelope").font(.caption).foregroundStyle(mint) }
            }
            Spacer()
            Button("Jump") { confirm = true }.buttonStyle(.borderedProminent)
                .disabled(!store.game.active || distance > store.game.fuel)
        }.padding().background(.white.opacity(0.04), in: RoundedRectangle(cornerRadius: 16))
        .confirmationDialog("Travel to \(world.name)? Uses \(distance) fuel and advances one day.", isPresented: $confirm, titleVisibility: .visible) {
            Button("Jump to \(world.name)") { store.perform { $0.jump(to: world.id) } }
        }
    }
}
struct ShipView: View {
    @EnvironmentObject var store: GameStore
    @State private var selectedShip: Vessel?
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                StatusView()
                Label(store.game.ship.name, systemImage: "airplane").font(.largeTitle.bold())
                Text("Hull \(store.game.hull)/\(store.game.ship.hull) · Fuel \(store.game.fuel)/\(store.game.ship.range) · Laser \(store.game.laser) · Shields \(store.game.shield)")
                    .font(.subheadline).foregroundStyle(.secondary)
                ProgressView(value: Double(store.game.hull), total: Double(store.game.ship.hull)).tint(mint)
                HStack {
                    Button("Refuel · \(store.game.ship.fuelCost) cr/pc") { store.perform { $0.refuel() } }
                        .disabled(!store.game.active || store.game.fuel == store.game.ship.range || store.game.credits < store.game.ship.fuelCost)
                    Button("Repair · \(max(1, store.game.ship.price / 20000)) cr/pt") { store.perform { $0.repair() } }
                        .disabled(!store.game.active || store.game.hull == store.game.ship.hull || store.game.credits < max(1, store.game.ship.price / 20000))
                }.buttonStyle(.bordered)
                Text("Equipment").font(.title2.bold())
                Button("Upgrade laser · \(cr(2000 * (store.game.laser + 1)))") { store.perform { $0.upgradeLaser() } }
                    .disabled(!store.game.active || store.game.world.tech < 5 || store.game.laser >= 3 || store.game.ship.weapons == 0 || store.game.credits < 2000 * (store.game.laser + 1))
                Button("Install shield · 5,000 cr") { store.perform { $0.upgradeShield() } }
                    .disabled(!store.game.active || store.game.world.tech < 5 || store.game.shield >= store.game.ship.shields || store.game.credits < 5000)
                Text("Equipment requires an industrial or higher tech port and compatible ship slots. Lasers have three upgrade levels.").font(.footnote).foregroundStyle(.secondary)
                Text("Shipyard").font(.title2.bold())
                Text("Prices include a 75% trade-in allowance for your hull. Cargo transfers; incompatible equipment is removed.").font(.footnote).foregroundStyle(.secondary)
                ForEach(store.game.catalog.ships) { vessel in
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(vessel.name).font(.headline)
                            Text("\(vessel.bays) bays · \(vessel.range) pc · \(vessel.hull) hull").font(.caption)
                            Text("Requires \(techNames[vessel.tech])").font(.caption).foregroundStyle(.secondary)
                        }
                        Spacer()
                        Button(vessel.id == store.game.shipID ? "Owned" : cr(store.game.shipCost(vessel))) { selectedShip = vessel }
                            .buttonStyle(.bordered).disabled(!store.game.canPurchase(vessel))
                    }.padding().background(.white.opacity(0.04), in: RoundedRectangle(cornerRadius: 16))
                }
            }.padding()
        }.background(space).navigationTitle("Ship & services")
        .confirmationDialog("Trade ships? Equipment beyond the new ship's capacity will be removed.", isPresented: Binding(get: { selectedShip != nil }, set: { if !$0 { selectedShip = nil } }), titleVisibility: .visible) {
            if let vessel = selectedShip {
                Button("Buy \(vessel.name) for \(cr(store.game.shipCost(vessel)))") { store.perform { $0.purchase(vessel) }; selectedShip = nil }
            }
        }
    }
}
struct CommanderView: View {
    @EnvironmentObject var store: GameStore
    @State private var restart = false
    @State private var name = "Jameson"
    var body: some View {
        List {
            Section {
                Text("Commander \(store.game.commander)").font(.title2.bold())
                LabeledContent("Day", value: "\(store.game.day)")
                LabeledContent("Net worth", value: cr(store.game.netWorth))
                LabeledContent("Systems visited", value: "\(store.game.worlds.filter(\.visited).count) / 120")
            }
            Section("Bank") {
                LabeledContent("Debt", value: cr(store.game.debt))
                Button("Borrow 1,000 cr") { store.perform { $0.borrow() } }.disabled(!store.game.active || store.game.debt > 0)
                Button("Repay as much as possible") { store.perform { $0.repay() } }.disabled(!store.game.active || store.game.debt == 0 || store.game.credits == 0)
                Text("Outstanding loans accrue 1% interest per travel day. A loan can fund fuel or cargo when credits run low.").font(.footnote)
            }
            Section("Courier board") {
                if let job = store.game.delivery {
                    Text("Reach \(store.game.worlds[job.destination].name) by day \(job.deadline). Reward: \(cr(job.reward)).")
                } else {
                    Button("Accept a local delivery") { store.perform { $0.acceptDelivery() } }.disabled(!store.game.active)
                    Text("One delivery at a time. Arrival completes it automatically; no cargo space is needed.").font(.footnote)
                }
            }
            Section("A place to call home") {
                Text("Build your fortune, pay off your debts, and buy a moon for 500,000 credits.")
                Button("Buy a moon & retire · 500,000 cr") { store.perform { $0.retire() } }
                    .disabled(!store.game.active || store.game.credits < 500000 || store.game.debt != 0)
            }
            Section("Captain's log") {
                ForEach(Array(store.game.log.enumerated()), id: \.offset) { item in Text(item.element).font(.callout) }
            }
            Section("New game") {
                TextField("Commander name", text: $name)
                Button("Start a new commander", role: .destructive) { restart = true }
            }
            Section("About this port") {
                Text("Based on Space Trader 1.2.2 by Pieter Spronck (2000–2005). Unofficial iPhone adaptation, distributed under GPL version 2 or later. Original artwork is not used.")
                Text("First playable version: the original system names, goods, and ship specifications, with a new galaxy, simplified economy and encounters, courier jobs, and retirement. Original story quests, crew, skills, wormholes, and special equipment are not implemented.")
            }.font(.footnote).foregroundStyle(.secondary)
        }.navigationTitle("Commander")
        .confirmationDialog("Replace your current commander and saved progress?", isPresented: $restart, titleVisibility: .visible) {
            Button("Start new game", role: .destructive) { store.restart(name: name) }
        }
    }
}
struct EncounterView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Image(systemName: "exclamationmark.triangle").font(.system(size: 60)).foregroundStyle(.orange)
                if let enemy = store.game.encounter {
                    Text("\(enemy.kind) intercept").font(.largeTitle.bold())
                    Text("Your hull: \(store.game.hull) / \(store.game.ship.hull)").font(.title3.monospacedDigit())
                    if enemy.kind == "Police" {
                        Text("Submit to a cargo inspection. Firearms and narcotics will be seized, with a fine of up to 100 credits per unit.")
                        Button("Submit to inspection") { store.perform { $0.resolve("inspect") } }.buttonStyle(.borderedProminent)
                    } else {
                        Text("Enemy hull: \(enemy.hull)").font(.headline.monospacedDigit())
                        Text("Fight for a bounty, try to escape, or surrender all cargo and 10% of your credits.")
                        Button("Fire lasers") { store.perform { $0.resolve("fight") } }.disabled(store.game.laser == 0)
                        Button("Attempt escape · 60% chance") { store.perform { $0.resolve("flee") } }
                        Button("Surrender cargo") { store.perform { $0.resolve("surrender") } }
                        Text(store.game.log.first ?? "").font(.callout).foregroundStyle(.secondary)
                    }
                }
            }.buttonStyle(.bordered).multilineTextAlignment(.center).padding(28).frame(maxWidth: .infinity, maxHeight: .infinity).background(space)
                .navigationTitle("Incoming transmission").navigationBarTitleDisplayMode(.inline)
        }.tint(mint)
    }
}
