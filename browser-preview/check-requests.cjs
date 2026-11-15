// Government requests and standing (0.17.0). Engine level, Node vm.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t,r=s=>t.run(s);const fresh=()=>{storage.clear();t=context()};
let n=0;const ok=m=>console.log('PASS '+m+' (#'+(++n)+')');
// #2 corrupt crew rejected; valid save still loads
// find a day with a request at Acamar
fresh();r('game.tutorial=null');let found=false;for(let d=1;d<40&&!found;d++){r('game.day='+d);if(r('request()')){found=true}}
assert.ok(found,'a request appears on some days');
const rq=JSON.parse(r('JSON.stringify(request())'));assert.ok(rq.gov&&rq.reward>0&&rq.to!==0);ok('requests appear on some days only and carry a reward and a destination');
// accept, deliver, standing rises, no penalty on abandon
r('game.credits=5000;acceptRequest()');assert.equal(r('game.contracts.length'),1);assert.equal(r('request()'),null,'taken request is gone');
r('abandonOffer(0)');assert.equal(r('game.contracts.length'),0);assert.equal(r('game.credits'),5000);assert.equal(r('standingOf(0)'),0);ok('abandoning a request costs nothing');
r('game.day='+rq.id.split('-')[2]);r('game.takenOffers=[]');r('acceptRequest()');
r('game.location='+rq.to+';game.hull=game.hull||1;dock()');assert.equal(r('standingOf(0)'),rq.gov.gain);assert.ok(r('game.credits')>=5000+rq.reward);ok('delivering a request pays and raises standing');
// discount at Trusted
r('game.location=0;game.standing[0]=5');const full=r('level().fuel*ship().fuelCost');assert.ok(r('fuelRateAt(3)')<=Math.max(1,Math.ceil(full)));r('game.standing[0]=0');const base=r('fuelRateAt(3)');r('game.standing[0]=9');assert.ok(r('fuelRateAt(3)')<=base);ok('standing never raises fuel prices');
// old save without standing loads
fresh();const g=JSON.parse(r('JSON.stringify(game)'));delete g.standing;r('game=decodeSave('+JSON.stringify(JSON.stringify(g))+')');assert.deepEqual(JSON.parse(r('JSON.stringify(game.standing)')),[0,0,0]);ok('old saves get standing');
console.log('All request checks passed.');
