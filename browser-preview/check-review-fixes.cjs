// Regression checks for the 2026-11-14 ChatGPT review (reviews/2026-11-14-chatgpt-browser-review.md). Engine level, Node vm.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t,r=s=>t.run(s);const fresh=()=>{storage.clear();t=context()};
let n=0;const ok=m=>console.log('PASS '+m+' (#'+(++n)+')');
// #2 corrupt crew rejected; valid save still loads
fresh();const good=r('JSON.stringify(game)');r('decodeSave('+JSON.stringify(good)+')');
for(const bad of ['"crew":{}','"crew":[{"id":"nobody","loyalty":50,"jumps":0,"beat":0}]','"crew":[{"id":"wren","loyalty":"x","jumps":0,"beat":0}]'])assert.throws(()=>r('decodeSave('+JSON.stringify(good.replace('"crew":[]',bad))+')'),/Invalid crew/);
assert.throws(()=>r('decodeSave('+JSON.stringify(good.replace('"custody":null','"custody":{"kind":"x"}'))+')'),/custody/);
ok('corrupt crew and custody are rejected, valid saves load');
// #3 stranding
fresh();r('game.fuel=0;game.credits=2;game.debt=25000;game.cargo.fill(0);game.paid.fill(0);game.tutorial=null');assert.equal(r('stranded()'),true,'0 fuel, ₡2, no cargo');
r('game.credits=1000');assert.equal(r('stranded()'),false,'can afford fuel');
r('game.credits=0;game.cargo[5]=1;game.paid[5]=10;game.worlds[0].strict=true');assert.equal(r('stranded()'),true,'contraband only');
assert.match(r('market()'),/data-action="dump" data-id="5"/,'dump offered for prohibited cargo');
r('game.cargo[5]=0;game.paid[5]=0;game.cargo[0]=5;game.paid[0]=150');assert.equal(r('stranded()'),false,'can sell Water for fuel');
ok('stranding accounts for cash, sellable cargo, contraband and Dump');
// #4 string crew ids
fresh();r('game.crew=[{id:"wren",loyalty:50,jumps:0,beat:0}];game.encounter=makeEncounter()');r('action("ability","wren")');assert.equal(r('game.encounter'),null);assert.ok(r('abilityLeft("wren")')>0);
assert.match((fresh(),r('game.crew=[{id:"wren",loyalty:50,jumps:0,beat:0}];game.encounter=makeEncounter();combatPanel()')),/data-action="ability" data-id="wren"/);
ok('crew ability buttons carry string ids and work');
// #5 kidnapping rescue
fresh();r('game.crew=[{id:"wren",loyalty:50,jumps:0,beat:0}];startCustody("held")');assert.match(r('custodyPanel()'),/data-action="crew-rescue"/);
let moved=false;for(let i=0;i<40&&!moved;i++){fresh();r('game.crew=[{id:"wren",loyalty:50,jumps:0,beat:0}];startCustody("held");game.seed='+(i*17+3));const d=r('game.day');r('action("crew-rescue")');moved=r('game.day')>d||r('game.custody')===null}
assert.ok(moved);ok('kidnapping rescue dispatches and either frees you or costs a day');
// #6 auto-fuel persists
fresh();assert.equal(r('game.autoFuel'),false);r('save()');const saved=storage.get(r('key'));t=context();assert.equal(r('game.autoFuel'),false);
const legacy=JSON.parse(saved);delete legacy.autoFuel;assert.equal(r('decodeSave('+JSON.stringify(JSON.stringify(legacy))+').autoFuel'),false);
ok('auto-fuel default stays off through save and reload');
// #7 auto-route quote matches spend
fresh();r('game.credits=50000;game.fuel=0;game.peace=true;game.tutorial=null;game.cargo.fill(0);game.paid.fill(0);game.location=game.home;game.ship=catalog.ships.findIndex(s=>s.name==="Bumblebee");game.hull=ship().hull');const to=r('game.worlds.map((w,i)=>i).find(i=>{const p=autoPlan(i);return p&&p.jumps>=3})');assert.ok(to>0,'a multi-hop route exists');
const quote=r('autoPlan('+to+').cost'),before=r('game.credits');r('autoTravel('+to+')');assert.equal(r('game.location'),to);assert.equal(before-r('game.credits'),quote);
ok('auto-route fuel quote equals what the run costs');
// #8 rental cannot refill your own tank
fresh();r('game.credits=9000;game.location=0;game.fuel=1;game.tutorial=null');r('action("rent",2)');assert.equal(r('ship().name'),'Firefly');r('action("return-rental")');assert.equal(r('ship().name'),'Gnat');assert.equal(r('game.fuel'),1);
ok('returning a rental restores the original fuel');
// #9 per-day interest and rental
fresh();r('game.credits=9000;game.debt=1000;game.style="quiet";game.peace=true;game.fuel=99;game.tutorial=null');const i1=r('interestDue(1000)'),i2=r('interestDue('+(0)+'||1000+interestDue(1000))');r('action("jump",1)');assert.equal(r('game.day'),3);assert.equal(r('game.debt'),1000+i1+i2);
fresh();r('game.credits=9000;game.location=0;action("rent",2);game.style="quiet";game.peace=true;game.fuel=99');const rr=r('game.rental.rate'),c0=r('game.credits');r('action("jump",1)');assert.equal(c0-r('game.credits'),2*rr);
ok('quiet route charges interest and rental for both days');
// #10 pirate fights still face customs
fresh();r('game.worlds[4].strict=true;game.location=4;game.heat=30;game.credits=2000;game.warps=3');
r('for(let i=0;i<200&&!game.custody;i++){game.cargo[5]=3;game.paid[5]=300;game.encounter=makeEncounter();game.seed=i*31+5;resolve("warp")}');assert.equal(r('game.custody&&game.custody.kind'),'jail');
ok('escaping a pirate with contraband can still end in customs');
// #11 surrender card mentions boarding
fresh();r('game.credits=100000;game.encounter=makeEncounter()');assert.match(r('combatPanel()'),/chance the marauders board you instead/);
fresh();r('game.encounter=makeEncounter()');assert.doesNotMatch(r('combatPanel()'),/board you instead/);
ok('surrender card states the boarding risk only when it exists');
// #12 help always reachable; first-haul Travel button
fresh();r('game.tutorial={state:"active",to:1,seen:true}');assert.equal(r("portServices()"),"");assert.match(r("paperChip()"),/paper-chip/);assert.match(r('tutorialCard()'),/data-action="jump" data-id="1"/);
ok('help is in the dock bar and the first-haul card has Travel');
console.log('All review-fix checks passed.');
