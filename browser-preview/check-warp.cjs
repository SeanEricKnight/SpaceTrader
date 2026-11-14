const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
// Warp charges: sold at tech 4+, capped, instant jump past range, no fuel, no pirates; escape from battle.
assert.equal(r('game.warps'),0);const low=r('game.worlds.findIndex(w=>w.tech<4)');assert.ok(low>=0);r('game.credits=20000;game.location='+low);assert.ok(r('warpReason()'),'tech too low');
r('game.location=1');assert.equal(r('world().tech>=4'),true);r('action("buywarp")');r('action("buywarp")');r('action("buywarp")');assert.equal(r('game.warps'),r('warpMax()'));
const fuel0=r('game.fuel');r('game.fuel=1;game.peace=false');const d=r('distance(3)');assert.ok(d>r('ship().range'));r('action("warp",3)');assert.equal(r('game.location'),3);assert.equal(r('game.fuel'),1);assert.equal(r('game.warps'),r('warpMax()-1'));assert.equal(r('!!game.encounter'),false);
r('game.warps=0;game.location=1');r('action("warp",3)');assert.equal(r('game.location'),1,'no charge, no warp');
r('game.warps=1;game.encounter=makeEncounter()');r('action("warp-escape")');assert.equal(r('game.warps'),0);assert.equal(r('game.encounter'),null);
// Travel style, incidents, newspaper subscription, hold meter.
storage.clear();t=context();r('game.location=1;game.fuel=14;game.peace=true;game.credits=5000');
r('action("style-quiet")');const d0=r('game.day');r('action("jump",2)');assert.equal(r('game.day'),d0+2,'quiet ride takes an extra day');
r('game.location=1;game.fuel=14;game.encounter=null;game.offer=null;action("style-excite")');
r('for(let i=0;i<40&&!game.offer;i++){game.location=1;game.fuel=14;game.encounter=null;jump(2)}');assert.equal(r('game.offer&&game.offer.kind'),'incident');assert.equal(r('active()'),false);
r('action("incident-2")');assert.equal(r('game.offer'),null);assert.equal(r('active()'),true);
r('game.fuel=1;game.offer={kind:"incident",id:1};action("incident-0")');assert.equal(r('!!game.offer'),true,'help needs 2 fuel');r('action("incident-2")');
r('game.credits=5000;action("buysub")');assert.equal(r('paperSubbed()'),true);const day=r('game.paper.day');r('game.location=1;game.fuel=14;game.style="steady";jump(2)');assert.equal(r('game.paper.day'),day+1,'subscription refreshes the edition');
assert.match(r('holdMeter()'),/free/);
const offs=JSON.parse(r('JSON.stringify(offers())'));assert.equal(offs.length,3);assert.ok(offs.every(j=>j.client));
console.log('PASS: warp charges, travel styles, incidents, subscription, job board');
