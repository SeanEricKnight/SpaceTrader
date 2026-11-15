const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1],nodes={},store=new Map();
const document={createElement:()=>createCanvas(160,160),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',value:'',focus(){},open:false,showModal(){this.open=true},close(){this.open=false}}),querySelectorAll:()=>[],addEventListener(){}};
const c=vm.createContext({document,Math,Number,String,Array,JSON,confirm:()=>true,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}});vm.runInContext(script,c);vm.runInContext('{const _f=fresh;fresh=(...a)=>{const s=_f(...a);s.cargo[0]=0;s.paid[0]=0;s.tutorial=null;return s};game=fresh()}',c);const r=s=>vm.runInContext(s,c);let count=0;
function test(name,fn){r('game=fresh("Normal",57);sector=0;selectedWorld=1;tab="galaxy";message=""');store.clear();fn();count++;console.log('PASS',name)}
test('all high tech ports and catalog content are reachable with starter jump range',()=>{
 const reached=r(`(()=>{const seen=new Set([0]),queue=[0];while(queue.length){const i=queue.shift(),a=game.worlds[i];game.worlds.forEach((b,j)=>{if(!seen.has(j)&&Math.ceil(Math.hypot(a.x-b.x,a.y-b.y))<=14){seen.add(j);queue.push(j)}})}return [...seen]})()`);
 assert.equal(reached.length,24);assert.equal(r('game.worlds.filter(w=>w.tech>=3).length'),19);assert.equal(r('game.worlds.filter(w=>w.strict).length'),9);
 assert.equal(r('catalog.goods.every((g,i)=>game.worlds.some(w=>w.tech>=g.production&&!(w.strict&&(i===5||i===8))))'),true);
 assert.equal(r('catalog.ships.every(s=>game.worlds.some(w=>w.tech>=s.tech))'),true);assert.equal(r('game.worlds.some(w=>w.tech>=6)'),true);
});
test('all commodities have a profitable reachable route somewhere in the curated galaxy',()=>{
 for(let i=0;i<10;i++)assert.equal(r(`game.worlds.some((a,from)=>a.tech>=catalog.goods[${i}].production&&!(a.strict&&[5,8].includes(${i}))&&game.worlds.some((b,to)=>to!==from&&b.tech>=catalog.goods[${i}].usage&&!(b.strict&&[5,8].includes(${i}))&&Math.ceil(Math.hypot(a.x-b.x,a.y-b.y))<=20&&Math.floor(b.prices[${i}]*level().sale)>a.prices[${i}]))`),true,'No profitable route for commodity '+i);
});
test('random ranges use more than the low LCG bits and stay within bounds',()=>{
 const counts=JSON.parse(r('JSON.stringify((()=>{const counts=Array(8).fill(0);game.seed=57;for(let i=0;i<8000;i++)counts[rng(8)]++;return counts})())'));assert.ok(counts.every(n=>n>800&&n<1200));
 assert.equal(r('(()=>{for(let i=0;i<1000;i++){const x=rng(100);if(x<0||x>=100||!Number.isInteger(x))return false}return true})()'),true);
 r('game=fresh("Normal",12345)');const sequence=r('JSON.stringify(Array.from({length:12},()=>rng(100)))');r('game=fresh("Normal",12345)');assert.equal(r('JSON.stringify(Array.from({length:12},()=>rng(100)))'),sequence);
});
test('contract boards offer three destinations throughout the galaxy and never reroll on reading',()=>{
 for(let i=0;i<24;i++){r('game.location='+i+';game.day=9;game.takenOffers=[]');const jobs=r('JSON.stringify(offers())');assert.equal(r('offers().length'),3);assert.equal(r('new Set(offers().map(j=>j.to)).size'),3);assert.equal(r('JSON.stringify(offers())'),jobs)}
 r('game.location=0;game.day=1;tab="jobs";render()');assert.match(nodes.screen.innerHTML,/job-chips/);assert.doesNotMatch(nodes.screen.innerHTML,/Uses 0 cargo bays|0 bays/);
});
test('goal remains visible, borrowing does not inflate progress, and retirement needs no debt',()=>{
 r('game.credits=1000;borrowCredits(5000);render()');assert.match(nodes['goal-progress'].innerHTML,/value="1000"/);assert.match(nodes['goal-progress'].innerHTML,/500,000/);
 r('game.credits=500000;game.debt=1;action("moon-buy")');assert.equal(r('moonList().length'),0);r('game.debt=0;action("moon-buy");render()');assert.equal(r('moonList().length'),1);assert.equal(r('game.retired'),false);assert.match(nodes['goal-progress'].innerHTML,/Moons: 1/);
});
test('market explains technology and customs',()=>{
 r('game.location=2;tab="market";render()');assert.match(nodes.screen.innerHTML,/Needs tech \d to (buy|sell)/);
 r('game.location=0;render()');assert.match(nodes.screen.innerHTML,/[Pp]rohibited here/);
});
test('multiple weapon mounts change real damage and upgrade price',()=>{
 r('game.laser=1;game.seed=44;game.encounter={hull:1000};resolve("fight")');const gnat=1000-r('game.encounter.hull');r('game.ship=3;game.hull=100;game.seed=44;game.encounter={hull:1000};resolve("fight")');assert.equal(1000-r('game.encounter.hull'),Math.floor(gnat*1.35));assert.equal(r('laserCost()'),8000);
 r('game.encounter=null;world().tech=7;game.credits=10000;action("laser")');assert.equal(r('game.credits'),2000);assert.equal(r('game.laser'),2);
 r('game.ship=0;game.hull=25;game.laser=1;game.encounter={hull:50};resolve("fight")');assert.equal(r('game.encounter.hull'),50);
});
test('encounter warning discloses damage, failed escape cost and bounty; surrender preserves hull',()=>{
 r('game.encounter=makeEncounter();render()');assert.match(nodes.encounter.innerHTML,/Enemy hit \d+–\d+ damage/);assert.match(nodes.encounter.innerHTML,/it fails you take a hit/);assert.match(nodes.encounter.innerHTML,/Bounty if you win/);
 const bounty=r('game.encounter.bounty');r('game.encounter.hull=1;resolve("fight")');assert.equal(r('game.credits'),1000+bounty);
 r('game.hull=31;game.cargo[0]=2;game.paid[0]=60;game.encounter=makeEncounter();resolve("surrender")');assert.equal(r('game.hull'),31);assert.equal(r('game.cargo[0]'),0);assert.equal(r('game.encounter'),null);
});
test('new encounters round trip and corrupt bounty or maximum hull is rejected',()=>{
 r('game.encounter=makeEncounter()');assert.equal(r('decodeSave(JSON.stringify(game)).encounter.bounty'),r('game.encounter.bounty'));
 r('game.encounter.bounty=-1');assert.throws(()=>r('decodeSave(JSON.stringify(game))'));r('game.encounter={hull:70,maxHull:60}');assert.throws(()=>r('decodeSave(JSON.stringify(game))'));
 r('game.encounter={hull:50}');assert.doesNotThrow(()=>r('decodeSave(JSON.stringify(game))'));
});
test('legacy demo shortcuts are recorded as cheats',()=>{
 r('action("demo")');assert.equal(r('game.cheatsUsed'),true);assert.equal(r('game.credits'),11000);r('game.cheatsUsed=false;action("encounter")');assert.equal(r('game.cheatsUsed'),true);assert.ok(r('game.encounter.bounty')>0);
});
test('emergency tow rescues the no-money no-fuel debt trap without erasing debt',()=>{
 r('game.location=23;game.fuel=0;game.credits=0;game.debt=25000;game.contracts=[{id:"tow-test",kind:"courier",title:"Dispatch",to:1,reward:200,due:5,cargo:0}];render()');assert.match(nodes['port-services'].innerHTML,/Request rescue tow/);r('action("rescue")');assert.equal(r('game.location'),0);assert.equal(r('game.day'),2);assert.equal(r('game.debt'),25375);assert.equal(r('game.fuel'),14);assert.equal(r('game.contracts.length'),0);assert.equal(r('game.credits'),0);assert.equal(r('valid(game)'),true);
 r('game=fresh();const before=JSON.stringify(game);emergencyTow();if(JSON.stringify(game)!==before)throw Error("Unneeded rescue was allowed")');
});
test('repair can be reached from any screen and Easy repair costs remain forgiving',()=>{
 for(const tab of ['market','galaxy','ship','commander','jobs','news']){r('game=fresh("Easy",57);game.hull=50;tab='+JSON.stringify(tab)+';render()');assert.match(nodes['port-services'].innerHTML,/Repair \+50 · 40 cr/)}
 r('action("repair")');assert.equal(r('game.hull'),100);assert.equal(r("game.credits"),1460);
});
test('authored galaxy, undo, chart scale and provenance labels are honest',()=>{
 assert.match(html,/curated galaxy/);assert.match(html,/Undo last action/);assert.match(html,/Copy save code/);assert.match(html,/Orbital spacing is illustrative/);assert.doesNotMatch(html,/the supplied Dark Nova|reddit\.com|steamcommunity\.com|fonts\.googleapis/);
});
const simulations=JSON.parse(fs.readFileSync('browser-preview/review-after.json','utf8'));assert.equal(simulations.buildSha256,crypto.createHash('sha256').update(html).digest('hex'),'Re-run the simulator after changing the game');
const find=(difficulty,loadout)=>simulations.combat.find(x=>x.difficulty===difficulty&&x.loadout===loadout);
assert.equal(find('Easy','starter').winPct,100);assert.ok(find('Easy','starter').repairPerWin>5&&find('Easy','starter').repairPerWin<55);assert.ok(find('Normal','starter').winPct>=70);assert.ok(find('Normal','shield').winPct>=find('Normal','starter').winPct);assert.ok(find('Hard','starter').repairPerWin>find('Normal','starter').repairPerWin);assert.ok(find('Normal','laser3').repairPerWin<find('Normal','starter').repairPerWin);
assert.ok(simulations.trade[0].topRoutePct<40);assert.ok(simulations.trade.find(x=>x.ship==='Beetle').tradeProfit>simulations.trade.find(x=>x.ship==='Gnat'&&x.start===250000).tradeProfit*1.3);
console.log(count+' review checks plus simulation balance assertions passed. Full Chrome layout remains unverified.');
