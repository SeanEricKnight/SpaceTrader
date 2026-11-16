// Save integrity: every state the game can legally produce must survive export/import, slots and reload.
// Added 0.24.8 after the external code review (R1-R8). Also pins equipment limits, the clinic price fix,
// the simulator's win predicate, the guide's delivery step and the reserve-shortfall reason.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
const t=context(),r=s=>t.run(s);
const roundTrip=()=>JSON.parse(r('JSON.stringify(decodeSave(JSON.stringify(game)))'));
const fresh=ship=>r('game=fresh();game.tutorial=null;game.ship='+ship+';game.hull=ship().hull;game.fuel=ship().range;game.credits=50000;game.contracts=[];game.cargo=game.cargo.map(()=>0)');

// R1: every ship's generated jobs (bulk included) survive a save round trip.
let bulkShips=0;
for(let id=0;id<r('catalog.ships.length');id++){fresh(id);
  const kinds=JSON.parse(r('JSON.stringify(offers().map(j=>j.kind))'));
  for(let k=0;k<kinds.length;k++){fresh(id);if(!r('acceptOffer('+k+');game.contracts.length'))continue;
    const back=roundTrip();assert.equal(back.contracts.length,1,'ship '+id+' '+kinds[k]+' job kept');if(kinds[k]==='bulk')bulkShips++}}
assert.ok(bulkShips>=6,'bulk jobs were exercised on several ships ('+bulkShips+')');
// Zero-bay rush documents, crisis-bonus bulk pay and the largest hold are legal.
fresh(1);r('game.contracts=[{id:"talk-1-1",kind:"freight",title:"Sealed court ledger",to:7,reward:1121,due:5,cargo:0,client:"Captain Ibe"}]');assert.equal(roundTrip().contracts.length,1,'zero-bay freight loads');
fresh(8);r('game.contracts=[{id:"1-1-B",kind:"bulk",title:"Bulk freight run",to:7,reward:5096,due:20,cargo:45,client:"x"}]');assert.equal(roundTrip().contracts.length,1,'bulk with crisis bonus loads');
fresh(1);r('game.contracts=[{id:"b",kind:"bulk",title:"x",to:7,reward:900,due:9,cargo:0,client:"x"}]');assert.throws(()=>roundTrip(),/Invalid mission manifest/,'a bulk job needs bays');
fresh(1);r('game.contracts=[{id:"c",kind:"courier",title:"x",to:7,reward:900,due:9,cargo:3,client:"x"}]');assert.throws(()=>roundTrip(),/Invalid mission manifest/,'a courier cannot hold bays');
// Job history: accepting a side job at the cap stays at 300, and an oversized history is trimmed on load.
fresh(1);r('game.takenOffers=Array.from({length:300},(_,i)=>"x"+i);takeQuest({q:{id:"talk-1-9",kind:"freight",title:"T",to:7,reward:500,due:9,cargo:0,client:"c"}})');assert.equal(r('game.takenOffers.length'),300,'history capped');roundTrip();
fresh(1);r('game.takenOffers=Array.from({length:301},(_,i)=>"x"+i)');assert.equal(roundTrip().takenOffers.length,300,'oversized history trimmed, not rejected');

// R2/R3: equipment-aware limits in saves, and removal clamps against the new limits.
fresh(1);r('game.modules=["tank"];game.fuel=ship().range');assert.equal(r('game.fuel'),18);assert.equal(roundTrip().fuel,18,'upgraded tank save loads');
fresh(1);r('game.modules=["plating"];game.hull=ship().hull');assert.equal(r('game.hull'),120);assert.equal(roundTrip().hull,120,'plating save loads');
for(const [id,stat,full,bare] of [['tank','fuel',18,14],['plating','hull',120,100]]){fresh(1);r('game.modules=["'+id+'"];game.'+stat+'='+full);r('removeOutfit(OUTFITS.findIndex(o=>o.id==="'+id+'"))');assert.equal(r('game.'+stat),bare,id+' removal clamps to the bare ship');assert.equal(r('game.modules.length'),0);assert.equal(roundTrip()[stat],bare,'after removal the save still loads')}
// Saves already written with the old bug are repaired on load; absurd values are still rejected.
fresh(1);r('game.fuel=18;game.modules=[]');assert.equal(roundTrip().fuel,14,'old 18/14 save repaired');
fresh(1);r('game.hull=120;game.modules=[]');assert.equal(roundTrip().hull,100,'old 120/100 save repaired');
fresh(1);r('game.fuel=99');assert.throws(()=>roundTrip(),/not a valid Space Trader/,'impossible fuel still rejected');

// R5: clinic relief removes the premium from the stored price baseline too (no rebound after later recovery).
fresh(1);r('game.location=6;game.visited=[0,6];game.contracts=[];game.story={stage:1};const w=game.worlds[6];if(w.crisis)clearCrisis(w);setCrisis(w,2,game.day+30);const k=catalog.goods.findIndex(g=>g.crisis===2);window_k=k;game.cargo[k]=10;sellImpact(w,k,10)');
{const before=r('game.worlds[6].prices[window_k]');r('dock()');assert.equal(r('game.worlds[6].crisis'),0,'crisis cleared');const after=r('game.worlds[6].prices[window_k]');assert.ok(after<before,'relief lowers the price');
 r('recoverMarkets()');const next=r('game.worlds[6].prices[window_k]');assert.ok(next<=after*1.06,'next recovery does not bounce back up ('+after+' to '+next+')')}

// R4: the simulator counts a defeat as a defeat.
{const sim=fs.readFileSync('browser-preview/sim-review.cjs','utf8');assert.ok(/metrics\.pirates>beaten/.test(sim)&&!/if\(game\.hull\)\{wins/.test(sim),'simulator win predicate uses pirates beaten');
 fresh(1);r('game.peace=false;game.hull=1;game.credits=1000;game.encounter={hull:10000};const p0=game.metrics.pirates;for(let i=0;i<30&&game.encounter&&game.hull>0;i++)resolve("fight");window_beaten=game.metrics.pirates>p0');assert.equal(r('window_beaten'),false,'a lost fight is not a win');
 const rows=JSON.parse(fs.readFileSync('browser-preview/review-after.json','utf8')).combat||[];assert.ok(rows.length>=15,'combat matrix present');assert.ok(rows.some(x=>x.winPct<100),'not every loadout reports a 100% win rate')}

// R7: abandoning a job does not complete the guide's "Finish a job" step; a delivery does.
fresh(1);r('game.guide={step:4,off:false,profit:true};game.completed=["Abandoned: Sealed dispatch"];game.metrics.deliveries=0;guideAdvance()');assert.equal(r('game.guide.step'),4,'abandoned job does not count');assert.equal(r('game.guide.off'),false);
r('game.metrics.deliveries=1;guideAdvance()');assert.equal(r('game.guide.off'),true,'a real delivery completes the guide');

// R8: a purchase blocked by the fuel/interest reserve says so.
fresh(1);r('game.location=0;game.credits=40;game.fuel=0;game.reserveFuel=true;window_id=catalog.goods.findIndex((g,i)=>!prohibited(i)&&world().tech>=g.production&&world().stock[i]>0&&world().prices[i]<=40)');
{const why=r('lockWhy("buy",window_id)');assert.ok(/kept back for fuel/.test(why),'reserve shortfall named: '+why);assert.ok(!/Needs tech/.test(why))}
console.log('PASS: save round trips (every ship and job kind, equipment, history), equipment removal, old-save repair, clinic price rebound, simulator win predicate, guide delivery step and reserve reason.');
