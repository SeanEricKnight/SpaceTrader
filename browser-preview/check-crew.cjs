const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
// Hire crew only at their home port, up to three.
r('game.credits=20000;game.location=2');r('action("crew-hire",0)');assert.equal(r('game.crew.length'),1);
r('action("crew-hire",1)');assert.equal(r('game.crew.length'),1,'Odo is not at Aldea');
r('game.location=10;action("crew-hire",1);game.location=11;action("crew-hire",2);game.location=9;action("crew-hire",3)');assert.equal(r('game.crew.length'),3,'cap is three');
// Perks.
assert.ok(r('crewHas("pilot")')&&r('crewHas("mechanic")')&&r('crewHas("gunner")')&&!r('crewHas("purser")'));
assert.equal(r('escapeOdds()'),r('Math.min(95,level().escape+10)'));
// Mechanic patches hull on a jump; wages are paid; beat triggers at 8 jumps.
storage.clear();t=context();r('game.credits=20000;game.location=10;action("crew-hire",1);game.location=0;game.hull=50;game.fuel=99;game.peace=true;game.crew[0].jumps=7');
const before=r('game.credits');r('action("jump",1)');assert.equal(r('game.hull'),53);assert.equal(r('game.credits'),before-15);assert.deepEqual(JSON.parse(r('JSON.stringify(game.pendingBeat)')),{c:'odo',i:0});
r('action("beat",0)');assert.equal(r('game.pendingBeat'),null);assert.equal(r('game.crew[0].beat'),1);assert.ok(r('game.crew[0].loyalty')>50);
// Low loyalty leaves.
r('adjustLoyalty(game.crew[0],-90)');assert.equal(r('game.crew.length'),0);
// Boarding never happens when poor; can happen when rich; boarding takes everything and holds you.
storage.clear();t=context();assert.equal(r('boardChance()'),0);r('game.credits=100000');assert.ok(r('boardChance()')>0);
r('game.credits=100000;game.cargo[0]=5;game.paid[0]=150;for(let i=0;i<500&&!game.custody;i++){game.credits=100000;game.encounter=makeEncounter();game.seed=i*7919+1;resolve("surrender")}');
assert.equal(r('game.custody.kind'),'held');assert.equal(r('game.credits'),0);assert.equal(r('held()'),0);assert.ok(r('game.hull')>0,'no game over');
assert.equal(r('active()'),false);
// Held: wait releases and interest accrues.
r('game.debt=1000;game.fuel=5');const day=r('game.day');r('action("wait")');assert.equal(r('game.custody'),null);assert.ok(r('game.day')>day);assert.ok(r('game.debt')>1000);
// Poor player losing a fight is not boarded and keeps playing.
storage.clear();t=context();r('game.encounter=makeEncounter();game.encounter.hull=9999;game.hull=1;game.godmode=false;game.seed=3');
for(let i=0;i<60&&r('!!game.encounter');i++)r('resolve("fight")');assert.ok(r('game.hull')>0&&r('game.encounter')===null&&r('game.custody')===null,'a lost fight no longer ends the run');
// Jail: contraband at a strict port; bail frees you; fixer halves bail.
storage.clear();t=context();r('game.worlds[4].strict=true;game.location=4;game.cargo[5]=3;game.paid[5]=300;game.heat=30;game.credits=2000');
r('for(let i=0;i<200&&!game.custody;i++){game.cargo[5]=3;game.paid[5]=300;game.seed=i*31+5;inspectGoods()}');assert.equal(r('game.custody.kind'),'jail');assert.equal(r('game.cargo[5]'),0,'contraband seized');
const bail=r('game.custody.bail'),cr=r('game.credits');r('action("bail")');assert.equal(r('game.custody'),null);assert.equal(r('game.credits'),cr-bail);
storage.clear();t=context();r('game.credits=2000;const b0=jailBail();globalThis.__b0=b0;game.crew=[{id:"ruvi",loyalty:50,jumps:0,beat:0}]');assert.ok(r('jailBail()')<=r('__b0')/2+1);
// Marauder offers: accept pays and adds heat; refuse starts a fight.
storage.clear();t=context();r('game.credits=5000;game.offer={kind:"protect",reward:500}');r('action("offer-accept")');assert.equal(r('game.credits'),5500);assert.ok(r('game.heat')>=2);assert.equal(r('game.offer'),null);
r('game.offer={kind:"protect",reward:500}');r('action("offer-refuse")');assert.ok(r('!!game.encounter'));
// Rental: rent, pay daily, return with deposit.
storage.clear();t=context();r('game.credits=9000;game.location=0');const rd=r('rentDeposit(2)'),rr=r('rentRate(2)');r('action("rent",2)');assert.equal(r('ship().name'),'Firefly');assert.equal(r('game.credits'),9000-rd);
assert.equal(r('shipRestriction(3)'),'Return your rental first');r('game.fuel=99;game.peace=true;action("jump",1)');assert.equal(r('game.credits'),9000-rd-rr);
r('game.location=0;action("return-rental")');assert.equal(r('ship().name'),'Gnat');assert.equal(r('game.rental'),null);assert.equal(r('game.credits'),9000-rr);
// Old saves gain the new fields and a dead hull is revived.
const old=JSON.parse(r('JSON.stringify(game)'));['crew','heat','custody','offer','rental','stored','pendingBeat'].forEach(k=>delete old[k]);old.hull=0;
r('globalThis.__o='+JSON.stringify(old)+';normalizeSave(__o)');assert.ok(r('__o.hull')>0&&Array.isArray(r('__o.crew')));
console.log('PASS: crew, boarding, jail, offers, and rental behave as designed; no game over; old saves load.');
