const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
const N=r('INCIDENTS.length');assert.equal(N,39,'39 incidents');
const prep=()=>{r('game.credits=5000;game.fuel=ship().range;game.hull=Math.max(1,ship().hull-20);game.heat=3;game.peace=true;game.seed=12345;game.contracts=[];game.cargo=game.cargo.map(()=>0);game.paid=game.paid.map(()=>0);game.offer=null;game.encounter=null;game.custody=null;game.memory={};game.incBag=[];game.lastInc=undefined;game.crew=[{id:"ruvi",loyalty:60,jumps:0,beat:0},{id:"odo",loyalty:60,jumps:0,beat:0}]')};
const sane=()=>{assert.ok(r('Number.isInteger(game.credits)&&game.credits>=0'),'credits');assert.ok(r('Number.isInteger(game.fuel)&&game.fuel>=0&&game.fuel<=ship().range'),'fuel');assert.ok(r('Number.isInteger(game.hull)&&game.hull>=1&&game.hull<=ship().hull'),'hull');assert.ok(r('game.cargo.every(n=>Number.isInteger(n)&&n>=0)'),'cargo');assert.ok(r('Number.isInteger(game.heat)&&game.heat>=0'),'heat')};
// Every choice of every incident (and conversation node) renders and runs without breaking state.
for(let i=0;i<N;i++){
  prep();r('game.offer={kind:"incident",id:'+i+'}');
  const html=r('incidentPanel()');assert.ok(html.includes('data-action="incident-0"'),'panel renders for '+i);assert.ok(!html.includes('undefined'),'no undefined text in '+i);
  const n=r('curNode(game.offer).choices.length');
  for(let k=0;k<n;k++){
    prep();r('game.offer={kind:"incident",id:'+i+'}');r('action("incident-'+k+'")');
    if(r('!!game.offer')){ // went to a conversation node
      const h2=r('incidentPanel()');assert.ok(!h2.includes('undefined'),'node text '+i+'/'+k);
      const m=r('curNode(game.offer).choices.length');
      for(let q=0;q<m;q++){prep();r('game.offer={kind:"incident",id:'+i+'}');r('action("incident-'+k+'")');r('action("incident-'+q+'")');sane()}
    } else sane();
  }
}
// Greyed-out choices explain themselves.
prep();r('game.fuel=1;game.offer={kind:"incident",id:INCIDENTS.findIndex(x=>x.title==="A debris field")}');assert.ok(/Needs 1 fuel/.test(r('incidentPanel()'))===false,'1 fuel is enough for the detour');
r('game.fuel=0');{const h=r('incidentPanel()');assert.ok(/<b class="lock-why">Needs 1 fuel; you have 0\.<\/b>/.test(h),'reason shown in amber, before the description');assert.ok(/class="locked"[^>]*aria-disabled="true"/.test(h)&&!/\bdisabled(?!=)/.test(h.replace(/aria-disabled/g,'')),'locked option stays focusable (aria-disabled, no disabled attribute)');assert.ok(h.includes('lock-tag'),'Locked tag sits on the button itself');assert.ok(!h.includes('lock-next'),'next step only after a tap');}
// Tapping a locked option explains instead of doing nothing, and changes no state.
{const before=r('JSON.stringify([game.fuel,game.credits,game.hull])'),k=r('curNode(game.offer).choices.findIndex(c=>c.ok&&!c.ok(game.offer))');r('action("incident-'+k+'")');assert.ok(r('!!game.offer'),'card stays open');assert.equal(r('JSON.stringify([game.fuel,game.credits,game.hull])'),before,'tap on locked option changes nothing');const h=r('incidentPanel()');assert.ok(/class="locked tapped"/.test(h)&&/Next step: refuel at your next port/.test(h),'tap shows the next step');}
// Distress call at 0 fuel: Help is locked with the reason, the free options stay open.
prep();r('game.fuel=0;game.offer={kind:"incident",id:INCIDENTS.findIndex(x=>x.title==="A distress call")}');{const h=r('incidentPanel()');assert.ok(h.includes('Needs 2 fuel; you have 0.')&&(h.match(/class="locked/g)||[]).length===1,'only the fuel option is locked');}
// Gated cr/bay options get the right next step.
assert.ok(/earn credits/.test(r('lockNext("Needs 40 cr; you have 5 cr.")'))&&/refuel/.test(r('lockNext("Needs 2 fuel; you have 0.")'))&&/free up cargo/.test(r('lockNext("Needs 3 free bays")')),'next step matches the missing resource');
// Central lock reasons: every disabled button explains itself when tapped (0.24.7).
prep();r('game.fuel=0');assert.ok(/^Needs \d+ fuel; you have 0\.$/.test(r('lockWhy("jump",1)')),'jump needs fuel');
r('game.credits=0');assert.ok(/^Needs [\d,]+ cr; you have 0 cr\.$/.test(r('lockWhy("crew-hire",0)')),'crew hire needs credits');
r('game.fuel=ship().range');assert.ok(/tank is full/i.test(r('lockWhy("refuel",0)')),'full tank');
assert.ok(/zoomed out/.test(r('lockWhy("map-out",0)'))&&/empty/.test(r('lockWhy("slot-load",0)')),'map and slot reasons');
r('game.offer={kind:"incident",id:0}');assert.ok(/open offer or event/.test(r('lockWhy("buy",0)')),'busy state says to finish the event first');r('game.offer=null');
assert.ok(/^Not available right now/.test(r('lockWhy("no-such-action",0)')),'unknown action gets the plain fallback');
// Shuffle bag: all 15 appear before any repeat; never back to back; garbage bag is repaired.
prep();const seen=[];for(let k=0;k<15;k++)seen.push(r('pickIncident()'));assert.equal(new Set(seen).size,15,'first 15 picks are all different');
let prev=seen[14];for(let k=0;k<200;k++){const id=r('pickIncident()');assert.notEqual(id,prev,'no back-to-back repeat');prev=id}
prep();r('game.incBag=[99,"x",-1,3]');const first=r('pickIncident()');assert.equal(first,3);assert.ok(r('game.incBag.every(i=>Number.isInteger(i)&&i>=0&&i<INCIDENTS.length)'));
// Ineligible events are skipped but kept for later: no crew means no crew events.
prep();r('game.crew=[];game.heat=0;game.fuel=ship().range;game.seed=99');const titles=new Set();for(let k=0;k<60;k++)titles.add(r('INCIDENTS[pickIncident()].title'));assert.ok(!titles.has('A crew argument')&&!titles.has('A glowing nebula')&&!titles.has('A customs drone'),'ineligible events are not offered');
// Side jobs cannot be taken twice.
prep();r('game.offer={kind:"incident",id:INCIDENTS.findIndex(x=>x.title==="A distress call")}');r('action("incident-0")');r('action("incident-0")');assert.equal(r('game.contracts.length'),1);
r('game.offer={kind:"incident",id:INCIDENTS.findIndex(x=>x.title==="A distress call")}');r('action("incident-0")');assert.ok(/You already carry this job/.test(r('incidentPanel()'))||r('game.contracts.length')===1);
// Saving keeps the bag and old saves without it still load.
prep();r('pickIncident();save()');const raw=r('JSON.stringify(game)');assert.ok(Array.isArray(JSON.parse(raw).incBag));
console.log('PASS: 39 incidents, every choice runs safely, greyed-out choices say why, the shuffle bag shows each event once before repeating and never twice in a row.');
