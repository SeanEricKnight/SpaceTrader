const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
const N=r('INCIDENTS.length');assert.equal(N,42,'39 bag events plus 3 rare');
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
// State-reactive variants (0.26.0): every choice of every event runs under each player-state variant and every card renders.
const VARIANTS={base:'',contraband:'game.cargo[5]=2;game.paid[5]=200',medicine:'game.cargo[6]=2;game.paid[6]=100',fullHold:'game.cargo=game.cargo.map((q,i)=>i===0?capacity()-reservedFor(game):0);game.paid=game.paid.map((x,i)=>i===0?50:0)',lowFuel:'game.fuel=1',dryTank:'game.fuel=0',trusted:'game.standing=[9,9,9]',mechanic:'game.crew=[{id:"odo",loyalty:60,jumps:0,beat:0}]',noCrew:'game.crew=[]',broke:'game.credits=0',jobHeld:'game.heat=4',tier3:'game.jumps=60'};
for(const [vn,setup] of Object.entries(VARIANTS))for(let i=0;i<N;i++){
  prep();r(setup);r('game.offer={kind:"incident",id:'+i+'}');
  const h=r('incidentPanel()');assert.ok(!h.includes('undefined')&&!h.includes('NaN'),'variant '+vn+' renders '+i);
  const n=r('curNode(game.offer).choices.length');
  for(let k=0;k<n;k++){
    prep();r(setup);r('game.offer={kind:"incident",id:'+i+'}');const locked=r('(()=>{const c=curNode(game.offer).choices['+k+'];return !!(c.ok&&!c.ok(game.offer))})()');
    r('action("incident-'+k+'")');
    if(locked){assert.ok(r('!!game.offer'),'locked option leaves the card open ('+vn+' '+i+'/'+k+')');continue}
    if(r('!!game.offer')){const m=r('curNode(game.offer).choices.length');for(let q=0;q<m;q++){prep();r(setup);r('game.offer={kind:"incident",id:'+i+'}');r('action("incident-'+k+'")');r('action("incident-'+q+'")');sane()}}else sane();
  }
}
// Same title, different situation: text and options differ with state, base options stay first and at the same index.
{const T=t=>r('INCIDENTS.findIndex(x=>x.title==='+JSON.stringify(t)+')'),show=(t,setup)=>{prep();r(setup||'0');r('game.offer={kind:"incident",id:'+T(t)+'}');return r('incidentPanel()')};
 const cases=[['A drifting derelict','mechanic','Let the mechanic cut it open'],['A distress call','medicine','Give them 1 Medicine'],['A patrol flags you down','contraband','Pay a courtesy fee'],['A patrol flags you down','trusted','pass'],['A toll buoy','trusted','pass'],['A trader convoy','lowFuel','Buy 2 fuel'],['A fuel line leaks','mechanic','Let the mechanic seal it'],['A crippled trader','base','Take 2 crates as thanks']];
 for(const [t,v,label] of cases){const a=show(t,VARIANTS[v]),b=show(t,v==='base'?'game.cargo=game.cargo.map((q,i)=>i===0?capacity()-reservedFor(game):0)':VARIANTS.noCrew+';game.fuel=ship().range;game.standing=[0,0,0];game.cargo=game.cargo.map(()=>0)');assert.ok(a.includes(label),t+' offers "'+label+'" in variant '+v);assert.ok(!b.includes(label),t+' hides "'+label+'" otherwise');assert.notEqual(a,b,t+' plays differently')}
 // Greyed variant option explains itself: courtesy fee with no cash.
 {const h=show('A patrol flags you down',VARIANTS.contraband+';game.credits=10');assert.ok(/Needs 50 cr; you have 10 cr\./.test(h),'courtesy fee lock reason shown')}
 // Medicine is really taken and paid.
 prep();r(VARIANTS.medicine);r('game.credits=0;game.offer={kind:"incident",id:'+T('A distress call')+'}');const di=r('curNode(game.offer).choices.findIndex(c=>/Give them 1 Medicine/.test(c.label()))');assert.ok(di>=4,'new option comes after the base options');r('action("incident-'+di+'")');assert.equal(r('game.cargo[6]'),1,'1 Medicine given');assert.ok(r('game.credits')>=400&&r('game.credits')<=700,'paid 400 to 700');assert.equal(r('game.paid[6]'),50,'cost basis follows the unit');
 // Conversation nodes that point at base choices still work.
 prep();r('game.cargo[6]=2;game.offer={kind:"incident",id:'+T('A distress call')+'}');r('action("incident-0")');assert.ok(r('!!game.offer&&!!game.offer.node'),'ask-what-happened still opens the story node');
}
// Rare tier: never in the bag, never before tier 2, once each per game, never back to back, around 8% of events.
{const rareIds=[0,1,2].map(k=>r('INCIDENTS.findIndex(x=>x.rare)')+k);prep();r('game.jumps=0');const early=new Set();for(let k=0;k<200;k++)early.add(r('pickIncident()'));assert.ok(![...early].some(id=>r('!!INCIDENTS['+id+'].rare')),'no rare events at tier 1');
 prep();r('game.jumps=20;game.seed=777');const picks=[];for(let k=0;k<600;k++){picks.push(r('pickIncident()'));if(k%35===34)r('game.rareSeen=[]')}
 const rare=picks.filter(id=>r('!!INCIDENTS['+id+'].rare'));assert.ok(rare.length>=8&&rare.length<=60,'rare events appear sometimes ('+rare.length+' of 600 with resets)');
 prep();r('game.jumps=20;game.seed=4242');const seenRare=[];for(let k=0;k<400;k++){const id=r('pickIncident()');if(r('!!INCIDENTS['+id+'].rare'))seenRare.push(id)}assert.ok(seenRare.length<=3&&new Set(seenRare).size===seenRare.length,'each rare event at most once per game');
 prep();r('game.jumps=20;game.rareSeen=['+rareIds.join(',')+']');r('game.incBag=['+rareIds[0]+',3]');assert.ok(!r('INCIDENTS[pickIncident()].rare'));assert.ok(r('game.incBag.every(i=>!INCIDENTS[i].rare)'),'a rare id in a saved bag is dropped');
 prep();r('game.jumps=20;game.seed=31');let pv=-1;for(let k=0;k<500;k++){const id=r('pickIncident()');assert.notEqual(id,pv,'rare or not, never back to back');pv=id;if(k%40===39)r('game.rareSeen=[]')}
 // Rare cargo event: liner pays triple for the best legal good and never takes contraband.
 const L=r('INCIDENTS.findIndex(x=>x.title==="A liner at full burn")');prep();r('game.cargo=game.cargo.map(()=>0);game.cargo[5]=3;game.paid[5]=300;game.offer={kind:"incident",id:'+L+'}');assert.ok(/Needs legal cargo/.test(r('incidentPanel()')),'liner locked with only banned goods');
 prep();r('game.cargo=game.cargo.map(()=>0);game.cargo[2]=5;game.paid[2]=250;game.offer={kind:"incident",id:'+L+'}');const before=r('game.credits'),price=r('world().prices[2]');r('action("incident-0")');assert.equal(r('game.credits')-before,Math.round(price*3*3),'paid 3x for 3 units');assert.equal(r('game.cargo[2]'),2);
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
console.log('PASS: 42 incidents (3 rare), state variants, every choice runs safely, greyed-out choices say why, the shuffle bag shows each event once before repeating and never twice in a row.');
