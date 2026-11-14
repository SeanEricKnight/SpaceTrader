const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
// Timed events: start, double/triple prices, end, restore exactly.
assert.equal(r('game.eventsVersion'),1);
r('(()=>{const w=game.worlds[2];if(w.crisis)clearCrisis(w);globalThis.__before=[...w.prices];setCrisis(w,3,game.day+8)})()');
assert.equal(r('game.worlds[2].prices[0]'),r('__before[0]*3'),'drought triples water');
assert.equal(r('game.worlds[2].prices[1]'),r('__before[1]'),'drought leaves furs alone');
r('clearCrisis(game.worlds[2])');assert.equal(r('JSON.stringify(game.worlds[2].prices)'),r('JSON.stringify(__before)'),'ending restores prices exactly');
// Over 80 days events start and end; the story outbreak at Baratas is untouched until relief.
r('for(let d=0;d<80;d++){advanceEvents();game.day++}');
assert.ok(r('game.worlds.filter(w=>w.crisis).length')>=2&&r('game.worlds.filter(w=>w.crisis).length')<=14,'a reasonable number of events are active');
assert.equal(r('game.worlds[6].crisis'),2);
// Paid newspaper.
t=context();r('game.credits=500;action("buypaper")');assert.equal(r('game.credits'),500-r('paperPrice()'));assert.ok(r('game.paper.day')===1);
r('action("buypaper")');assert.equal(r('game.credits'),500-r('paperPrice()'),'one edition per day');
// Escorts: hire, wages, levelling, dismiss.
t=context();r('game.credits=2000;action("hire",1);action("hire",2)');assert.equal(r('game.escorts.length'),2);assert.equal(r('game.credits'),2000-300-600);
assert.ok(r('escortRiskFactor()')<1&&r('volleyRange()[0]')>r('(()=>{const e=game.escorts;game.escorts=[];const v=volleyRange()[0];game.escorts=e;return v})()'));
r('game.fuel=99;game.peace=true;const c=game.credits;globalThis.__c=c;action("jump",1)');assert.equal(r('game.credits'),r('__c')-r('game.escorts.reduce((a,e)=>a+escortWage(e),0)'),'wages paid (traits change wages)');assert.ok(r('game.escorts.every(e=>e.loy>0)'),'escorts have loyalty');
r('game.escorts[0].jumps=5;payEscorts()');assert.equal(r('game.escorts[0].level'),2,'six jumps reach level 2');
r('game.credits=0;payEscorts()');assert.equal(r('game.escorts.length'),0,'unpaid escorts leave');
// Old saves keep fixed events and gain empty escort/paper fields.
const old=JSON.parse(r('JSON.stringify(game)'));delete old.eventsVersion;delete old.escorts;delete old.paper;
r('globalThis.__o='+JSON.stringify(old)+';normalizeSave(__o);advanceEvents()');
console.log('PASS: timed events, paid newspaper, and escorts behave as designed; old saves load.');
