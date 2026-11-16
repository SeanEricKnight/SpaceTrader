const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
assert.equal(r('game.credits'),1000);assert.match(t.nodes.screen.innerHTML,/Solar chart/);r('game.tutorial=null;game.cargo[0]=0;game.paid[0]=0');
r('action("buymax",0)');assert.equal(r('held()'),15);assert.equal(r('game.credits'),550);
r('action("jump",1)');assert.equal(r('game.location'),1);assert.equal(r('game.fuel'),5);assert.equal(r('game.day'),2);
r('action("sellall",0)');assert.ok(r('game.credits')>1250&&r('game.credits')<1360,'dumping 15 units lowers the price a little');assert.equal(r('held()'),0);
t=context();assert.ok(r('game.credits')>1250&&r('game.credits')<1360);
r('action("refuel")');assert.equal(r('game.credits'),1268);assert.equal(r('game.fuel'),14);
r('action("encounter")');assert.equal(t.nodes.encounter.hidden,false);r('action("surrender")');assert.equal(t.nodes.encounter.hidden,true);assert.equal(r('game.credits'),1142);
r('action("borrow")');assert.equal(r('game.debt'),1000);r('action("repay")');assert.equal(r('game.debt'),0);
r('action("reset")');assert.equal(r('game.credits'),1000);
r('action("demo");action("demo");action("ship",2)');assert.equal(r('ship().name'),'Firefly');assert.equal(r('game.credits'),3500);
for(const tab of ['market','galaxy','ship','commander']){r('tab='+JSON.stringify(tab)+';render()');assert.ok(t.nodes.screen.innerHTML.length>300)}
r('action("reset");action("job")');const destination=r('game.job.to'),reward=r('game.job.reward');r('action("jump",'+destination+')');assert.equal(r('game.job'),null);assert.equal(r('game.credits'),1000+reward);
r('game=fresh();game.cargo[0]=15;game.paid[0]=450;game.credits=0;buy(0,true)');assert.equal(r('held()'),15);assert.equal(r('game.credits'),0);
assert.equal(r('valid(game)'),true);
const blocked=context(true);assert.equal(blocked.run('saveOK'),false);blocked.run('action("buy",0)');assert.equal(blocked.run('game.cargo[0]'),6);assert.match(blocked.nodes['save-status'].textContent,/session/);
assert.ok(!/<(?:script|link|img)[^>]+(?:src|href)\s*=\s*["']https?:/i.test(html));
console.log('PASS: JavaScript parses; all four screens and the orbital chart generate; trading, fuel, travel, couriers, loans, encounters, ship upgrades, reset, save/reload, and blocked-storage fallback behave as expected. No external assets.');
console.log('Checked in Node with a minimal DOM; a full Chromium launch was blocked by this environment.');
const expected={Beginner:[2500,1,.5],Easy:[1500,2,1],Normal:[1000,2,1.5],Hard:[750,3,2],Impossible:[500,4,3]};
for(const [name,[credits,rate,interest]]of Object.entries(expected)){
 t.nodes.difficulty.value=name;r('action("newdifficulty")');
 assert.equal(r('game.difficulty'),name);assert.equal(r('game.credits'),credits);assert.equal(r('fuelRate()'),rate);
 r('game.tutorial=null;game.cargo[0]=0;game.paid[0]=0;buy(0,false);sell(0,true)');assert.ok(r('game.credits')<credits);
 r('action("borrow");action("jump",1)');assert.equal(r('game.debt'),1000+interest*10);
 t=context();assert.equal(r('game.difficulty'),name);
}
t.nodes.difficulty.value='Normal';r('action("newdifficulty")');
console.log('PASS: all five difficulty choices apply through the new-game action, change starting credits/fuel/interest, retain a resale spread, and persist across reloads.');
r('openCheats()');assert.equal(t.nodes['cheat-console'].open,true);
r('runCheat("cash 50000")');assert.equal(r('game.credits'),51000);
assert.match(r('runCheat("cash -1")'),/whole credit/);assert.equal(r('game.credits'),51000);
r('game.fuel=0;runCheat("fuel");game.hull=1;runCheat("heal")');assert.equal(r('game.fuel'),14);assert.equal(r('game.hull'),100);
r('runCheat("god");game.encounter={hull:50}');
const failingSeed=Array.from({length:10000},(_,n)=>n).find(n=>Math.floor(((Math.imul(n,1664525)+1013904223)>>>0)/4294967296*100)>=65);
r('game.seed='+failingSeed+';resolve("flee")');assert.equal(r('game.hull'),100);assert.notEqual(r('game.encounter'),null);
r('runCheat("ship Wasp")');assert.equal(r('ship().name'),'Wasp');assert.equal(r('game.laser'),3);
const oldFuel=r('game.fuel'),oldDay=r('game.day');r('runCheat("warp Adahn")');assert.equal(r('game.location'),1);assert.equal(r('game.fuel'),oldFuel);assert.equal(r('game.day'),oldDay);assert.equal(r('game.encounter'),null);
r('game.debt=1000;runCheat("debt");runCheat("peace")');assert.equal(r('game.debt'),0);assert.equal(r('game.peace'),true);
r('runCheat("win")');assert.equal(r('game.retired'),true);r('runCheat("resume")');assert.equal(r('game.retired'),false);
assert.equal(r('game.cheatsUsed'),true);assert.equal(r('valid(game)'),true);
r('runCheat("close")');assert.equal(t.nodes['cheat-console'].open,false);
t=context();assert.equal(r('game.godmode'),true);assert.equal(r('game.cheatsUsed'),true);
r('game=fresh();save();render()');
storage.clear();t=context();assert.equal(r('game.cargo[0]'),5);assert.equal(r('game.tutorial.state'),'active');assert.match(t.nodes.screen.innerHTML,/First haul/);
r('action("jump",1)');const before=r('game.credits');r('action("sellall",0)');assert.equal(r('game.tutorial.state'),'done');assert.equal(r('game.credits')-before>=1500,true);assert.doesNotMatch(r('tutorialCard()'),/First haul/);
storage.clear();t=context();r('game.difficulty="Hard"');assert.equal(r('tutorialBonus()'),1000);r('action("sellall",0)');assert.equal(r('game.tutorial.state'),'skipped');t=context();assert.equal(r('game.tutorial.state'),'skipped','missed haul survives a reload');
storage.clear();t=context();r('game.tutorial=null');
for(const [d,n] of Object.entries({Beginner:3,Easy:4,Normal:5,Hard:6,Impossible:9})){r('game.difficulty="'+d+'"');assert.equal(r('sqOffered().length'),n);assert.deepEqual([0,1,2].map(k=>r('sqOffered().filter(q=>q.tier==='+k+').length')>0),[true,true,true]);}
r('game.difficulty="Easy"');r('action("sq-accept",0)');assert.equal(r('Object.keys(game.sq.active).join()'),'tour');r('game.visited=[0,1,2,3,4];sqCheck()');assert.equal(r('game.sq.done.join()'),'tour');assert.equal(r('game.credits'),1600);
r('action("sq-accept",1)');r('game.location=1;game.cargo[2]=6;game.paid[2]=60;sell(2,true);sqCheck()');assert.equal(r('game.sq.done.includes("orchard")'),true);
r('action("sq-accept",2);action("sq-drop",2)');assert.equal(r('Object.keys(game.sq.active).length'),0);
console.log('PASS: hidden console open/close, credits, invalid commands, fuel, healing, invincibility under fire, ship grants, free warp, debt reset, peace, win/resume, and cheat-save persistence.');
