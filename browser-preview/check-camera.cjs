const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function harness(saved=new Map()){
 const nodes={},events={},frames=new Map();let clock=10000,id=0,reduced=false;const rect={width:1000,height:720,left:0,top:0};
 const document={activeElement:null,createElement:()=>createCanvas(160,160),getElementById:name=>nodes[name]||(nodes[name]={id:name,innerHTML:'',textContent:'',style:{},dataset:{},attributes:{},captured:new Set(),setAttribute(k,v){this.attributes[k]=String(v)},getBoundingClientRect(){return {...rect}},querySelectorAll(){return []},closest(s){return s==='#solar-map'&&this.id==='solar-map'?this:null},focus(){document.activeElement=this},showModal(){this.open=true},close(){this.open=false},setPointerCapture(id){this.captured.add(id)},hasPointerCapture(id){return this.captured.has(id)},releasePointerCapture(id){this.captured.delete(id)}}),querySelectorAll:()=>[],addEventListener:(name,fn)=>(events[name]??=[]).push(fn)};
 const context=vm.createContext({console,document,Math,Number,String,Array,JSON,Date:class extends Date{static now(){return clock}},confirm:()=>true,matchMedia:()=>({matches:reduced}),requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:i=>frames.delete(i),localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)}});
 vm.runInContext(script,context);const run=s=>vm.runInContext(s,context);
 return {run,nodes,events,saved,rect,document,advance(ms){clock+=ms;const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(clock))},setReduced(value){reduced=value},event(x,y,pointerId=1){return {target:nodes['solar-map'],clientX:x,clientY:y,pointerId,button:0,preventDefault(){this.prevented=true}}}};
}
let h,r,count=0;function test(name,fn){h=harness();r=h.run;r('game=fresh("Normal",57);sector=0;selectedWorld=1;tab="galaxy";resetMapViews();render()');fn();count++;console.log('PASS',name)}
function close(a,b){assert.ok(Math.abs(a-b)<1e-7,a+' != '+b)}
test('initial camera fits the entire system on desktop and phone',()=>{
 for(const [width,height]of [[1200,650],[390,400],[320,360],[844,350]]){Object.assign(h.rect,{width,height});r('resetMapViews();applyMapCamera()');const b=JSON.parse(r('JSON.stringify(cameraBox())'));assert.ok(b.x<=0&&b.y<=0);assert.ok(b.x+b.width>=1000&&b.y+b.height>=720)}
});
test('zoom remains anchored to the pointer until a boundary is reached',()=>{
 r('mapViews[0]={cx:500,cy:360,zoom:2}');const before=JSON.parse(r('JSON.stringify(cameraBox())')),wx=500+200*before.units,wy=360-60*before.units;r('zoomMapAt(mapViews[0],1.5,700,300)');const after=JSON.parse(r('JSON.stringify(cameraBox())'));close(r('mapViews[0].cx')+200*after.units,wx);close(r('mapViews[0].cy')-60*after.units,wy);
 r('zoomMapAt(mapViews[0],100000,500,360)');assert.equal(r('mapViews[0].zoom'),5);r('zoomMapAt(mapViews[0],.000001,500,360)');assert.equal(r('mapViews[0].zoom'),1);
});
test('overview can pan and camera bounds prevent getting lost in empty space',()=>{
 r('panMapBy(mapViews[0],40,30)');assert.equal(r('mapViews[0].cx'),460);assert.equal(r('mapViews[0].cy'),330);r('panMapBy(mapViews[0],1000000,-1000000)');assert.ok(r('mapViews[0].cx')>=380);assert.ok(r('mapViews[0].cy')<=460);r('handleMapAction("map-fit")');assert.equal(r('mapViews[0].cx'),500);assert.equal(r('mapViews[0].cy'),360);
});
test('camera movement leaves money, time, fuel, missions and engine RNG untouched',()=>{
 const before=r('JSON.stringify(game)');r('handleMapAction("map-in");panMapBy(mapViews[0],70,-40);handleMapAction("map-focus");handleMapAction("map-out");handleMapAction("map-fit")');assert.equal(r('JSON.stringify(game)'),before);assert.ok(h.saved.has('space-trader-chrome-preview-v1-camera-v1'));
});
test('view is retained across screens, bank access, region changes and reload',()=>{
 r('mapViews[0]={cx:560,cy:340,zoom:2.5};storeMapViews();tab="market";render();tab="ship";render();openBank();handleBankAction("bank-close");tab="galaxy";render()');assert.equal(r('mapViews[0].zoom'),2.5);assert.equal(r('mapViews[0].cx'),560);
 r('action("sector",1);handleMapAction("map-in");action("sector",0)');assert.equal(r('mapViews[0].zoom'),2.5);const reloaded=harness(h.saved);assert.equal(reloaded.run('mapViews[0].zoom'),2.5);assert.equal(reloaded.run('mapViews[0].cx'),560);
});
test('invalid camera data cannot break a valid saved game',()=>{
 for(const raw of ['{bad','[{"cx":null}]',JSON.stringify(Array(3).fill({cx:0,cy:0,zoom:999}))]){const saved=new Map([['space-trader-chrome-preview-v1-camera-v1',raw]]),x=harness(saved);assert.equal(x.run('mapViews[0].zoom'),1);assert.equal(x.run('game.location'),0)}
});
test('wheel zoom has a touch-independent button alternative and page scrolling stays outside map',()=>{
 const e=h.event(650,300);e.deltaY=-200;e.deltaMode=0;h.events.wheel[0](e);assert.equal(e.prevented,true);assert.ok(r('mapViews[0].zoom')>1);
 const zoom=r('mapViews[0].zoom'),outside={...e,target:{closest:()=>null},prevented:false};h.events.wheel[0](outside);assert.equal(outside.prevented,false);assert.equal(r('mapViews[0].zoom'),zoom);r('handleMapAction("map-in")');assert.ok(r('mapViews[0].zoom')>zoom);
});
test('dragging never becomes a planet-selection or travel click',()=>{
 const before=r('JSON.stringify(game)');h.events.pointerdown[0](h.event(400,350));h.events.pointermove[0](h.event(500,410));const end=h.event(500,410);end.type='pointerup';h.events.pointerup[0](end);assert.notEqual(r('mapViews[0].cx'),500);assert.equal(r('suppressMapClick({target:$("solar-map"),detail:1})'),true);assert.equal(r('selectedWorld'),1);assert.equal(r('JSON.stringify(game)'),before);h.advance(600);assert.equal(r('suppressMapClick({target:$("solar-map"),detail:1})'),false);
});
test('a normal tap selects details without zooming or travelling',()=>{
 const node={dataset:{action:'select',id:'5'},disabled:false,closest(s){if(s==='#solar-map')return h.nodes['solar-map'];if(s==='[data-action]')return this;return null}};
 h.events.pointerdown[0]({...h.event(400,350),target:node});h.events.pointerup[0]({...h.event(400,350),target:node});h.events.click[0]({target:node,detail:1});assert.equal(r('selectedWorld'),5);assert.equal(r('game.location'),0);assert.equal(r('mapViews[0].zoom'),1);
});
test('pinch changes zoom and suppresses the click when fingers lift',()=>{
 h.events.pointerdown[0](h.event(400,360,1));h.events.pointerdown[0](h.event(600,360,2));h.events.pointermove[0](h.event(700,360,2));assert.ok(r('mapViews[0].zoom')>1);h.events.pointerup[0](h.event(400,360,1));h.events.pointerup[0](h.event(700,360,2));assert.equal(r('selectedWorld'),1);assert.equal(r('game.location'),0);assert.equal(r('suppressMapClick({target:$("solar-map"),detail:1})'),true);
});
test('pointer cancellation clears the gesture without travelling',()=>{
 h.events.pointerdown[0](h.event(400,360));const e=h.event(400,360);e.type='pointercancel';h.events.pointercancel[0](e);assert.equal(r('mapPointers.size'),0);assert.equal(r('game.day'),1);assert.equal(r('suppressMapClick({target:$("solar-map"),detail:1})'),true);
});
test('keyboard camera controls keep focus for repeated input',()=>{
 h.nodes['solar-map'].focus();const key=k=>h.events.keydown[0]({target:h.nodes['solar-map'],key:k,preventDefault(){}});key('+');key('+');assert.ok(r('mapViews[0].zoom')>1.8);assert.equal(h.document.activeElement.id,'solar-map');key('ArrowRight');assert.ok(r('mapViews[0].cx')>500);key('0');assert.equal(r('mapViews[0].zoom'),1);key('Home');assert.equal(r('selectedWorld'),0);assert.equal(h.document.activeElement.id,'solar-map');
});
test('smaller planets retain at least 44 CSS-pixel tap targets at every zoom',()=>{
 for(const [width,height]of [[390,400],[1200,650]]){Object.assign(h.rect,{width,height});for(const z of [1,2,5]){r('mapViews[0].zoom='+z);for(let id=0;id<24;id++){const hit=r('mapPlanetSize('+id+').hit/cameraBox().units*2');assert.ok(hit>=44-1e-7)}}}
 r('mapViews[0].zoom=2');assert.ok(r('mapPlanetSize(4).r')<r('planetRadii[planetKind(4)]'));
});
test('zoom reveals labels progressively and fixed planet positions never drift',()=>{
 Object.assign(h.rect,{width:390,height:400});r('mapViews[0].zoom=1');assert.equal(r('mapViewLevel()'),'overview');r('mapViews[0].zoom=5');assert.equal(r('mapViewLevel()'),'detail');const p=r('JSON.stringify(mapPoint(5))');h.advance(100000);assert.equal(r('JSON.stringify(mapPoint(5))'),p);assert.match(html,/prefers-reduced-motion:reduce/);
});
test('travel animation is cosmetic, follows the route, and can be skipped',()=>{
 r('action("jump",1)');assert.equal(r('game.location'),1);assert.equal(r('game.day'),2);assert.equal(r('game.fuel'),5);assert.equal(r('JSON.stringify(travelPoint())'),r('JSON.stringify(mapPoint(0))'));const state=r('JSON.stringify(game)');h.advance(450);assert.notEqual(r('JSON.stringify(travelPoint())'),r('JSON.stringify(mapPoint(0))'));r('handleMapAction("map-skip")');assert.equal(r('mapTravel'),null);assert.equal(r('JSON.stringify(game)'),state);
});
test('reduced motion skips travel effects without changing the completed jump',()=>{
 h.setReduced(true);r('action("jump",1)');assert.equal(r('mapTravel'),null);assert.equal(r('game.location'),1);assert.equal(r('game.day'),2);assert.equal(r('game.fuel'),5);assert.equal(h.nodes['map-skip-travel'].hidden,true);
});
test('unreachable jumps never animate, consume fuel or advance time',()=>{
 r('action("jump",23)');assert.equal(r('mapTravel'),null);assert.equal(r('game.location'),0);assert.equal(r('game.fuel'),14);assert.equal(r('game.day'),1);
});
console.log(count+' camera/mouse/touch checks passed with a DOM harness. Full Chrome and real iPhone gestures remain unverified.');
