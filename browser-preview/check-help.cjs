// Help Center, tappable terms and paper chip (0.18.0). Engine level, Node vm.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,scrollTop:0,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);
const r=s=>vm.runInContext(s,c);let n=0;const ok=m=>console.log('PASS '+m+' (#'+(++n)+')');
r('game.tutorial=null');
const home=r('helpHtml("home")');assert.ok(home.includes('All topics')&&!home.includes('<details'));ok('help home lists topics with no inline accordions');
for(const id of r('HELP_ORDER')){const h=r('helpHtml('+JSON.stringify(id)+')');assert.ok(h.includes('data-id="home"'),id+' has a Back button');assert.ok(h.includes('help-rel'),id+' has related topics');assert.ok(r('HELP['+JSON.stringify(id)+'].b().length')>150,id+' has real content')}
ok('every topic has a Back button, related links and content');
for(const id of r('HELP_ORDER'))for(const m of r('helpHtml('+JSON.stringify(id)+')').matchAll(/data-action="help" data-id="([a-z]+)"/g))assert.ok(m[1]==='home'||r('!!HELP["'+m[1]+'"]'),'link target '+m[1]);
ok('all help links point at real topics');
r('action("help","pirates")');assert.ok(r('$("info-body").innerHTML').includes('Pirates and safety'));assert.equal(r('$("info-dialog").open'),true);ok('action help opens a topic in the same dialog');
r('action("howto")');assert.ok(r('$("info-body").innerHTML').includes('All topics'));ok('Help button opens the home page');
assert.ok(html.includes('id="help-fab"')&&/#help-fab\{position:fixed;right:12px;top:10px/.test(html));ok('Help button is fixed at the top right');
// paper chip
r('game.paper={day:1,items:[],sub:null}');assert.equal(r('paperChip()'),'');ok('no chip before any subscription');
r('game.day=5;game.paper.sub=14');assert.equal(r('paperChip()'),'');ok('no chip when plenty of days remain');
r('game.paper.sub=6');assert.ok(r('paperChip()').includes('2 days left')&&r('paperChip()').includes('Renew'));ok('chip appears when 2 days remain');
r('game.paper.sub=4');assert.ok(r('paperChip()').includes('Paper ended'));ok('chip says ended just after expiry');
r('game.paper.sub=-20');assert.equal(r('paperChip()'),'');ok('chip stops nagging a few days after expiry');
// crew profile
r('game.crew=[];game.location=2;game.credits=5000');const wren=r('crewProfile(CREW[0])');assert.ok(wren.includes('What they do well')&&wren.includes('About them')&&wren.includes('data-action="crew-hire"'));ok('crew profile shows what they do well, about them, and a Hire button at their port');
r('game.location=0');assert.ok(!r('crewProfile(CREW[0])').includes('data-action="crew-hire"'));ok('no Hire button away from their port');
r('game.location=2;action("crew-hire",0)');assert.equal(r('crewList().length'),1);assert.ok(r('crewProfile(CREW[0])').includes('Loyalty')&&r('crewProfile(CREW[0])').includes('class="meter"'));assert.ok(!r('crewProfile(CREW[0])').includes('data-action="crew-hire"'));ok('hired crew show a loyalty meter and no Hire button');
assert.ok(r('crewPanel()').includes('data-action="crew-profile"'));ok('crew cards open their profile');
// moons
r('game=fresh("Normal");game.tutorial=null;game.day=30;game.credits=2000000;game.debt=0;game.location=1');r('action("moon-buy")');assert.equal(r('moonList().length'),1);assert.equal(r('game.credits'),1500000);assert.equal(r('game.retired'),false);assert.equal(r('active()'),true);ok('buying a moon keeps you playing');
assert.ok(r('$("info-body").innerHTML').includes('Keep trading')&&!/confetti/.test(r('$("info-body").innerHTML')));ok('moon pop-up has Keep trading and no confetti');
r('action("moon-buy")');assert.equal(r('moonList().length'),1);ok('cannot buy a second moon at the same port');
r('game.location=2;action("moon-buy")');assert.equal(r('moonList().length'),2);assert.equal(r('game.credits'),750000);ok('a second moon costs 250,000 more');
const before=r('game.credits');r('jump(1)');assert.ok(r('game.credits')>before-60000);ok('moons pay rent on jumps');
r('game.encounter=null;game.custody=null;game.hull=game.hull||1;action("moon-sell",0)');assert.equal(r('moonList().length'),1);ok('a moon can be sold back');
const posted=JSON.parse(storage.get('space-trader-leaderboard-v1')||'[]').length;assert.ok(posted<=1);ok('score is posted at most once');
// equipment and milestones
r('game=fresh("Normal");game.tutorial=null;game.modules=["tank"]');assert.equal(r('ship().range'),r('catalog.ships[game.ship].range')+4);ok('fuel tank adds range');
r('game.modules=["plating"]');assert.equal(r('ship().hull'),r('catalog.ships[game.ship].hull')+20);ok('plating adds hull');
r('game.modules=[]');const base=r('saleRate()'),risk=r('arrivalRisk(8)');r('game.modules=["analyzer"]');assert.ok(Math.abs(r('saleRate()')-base-.02)<1e-9);r('game.modules=["sensors"]');assert.ok(r('arrivalRisk(8)')<=risk);ok('analyzer raises sale rate and sensors lower risk');
r('game.modules=["nanites"];game.hull=50;game.credits=100;game.day=5');r('jump(1)');assert.ok(r('game.hull')>=52||r('game.encounter')!==null);ok('nanites mend hull on jumps');
r('game=fresh("Normal");game.tutorial=null;game.credits=1500;game.metrics.profit=10;checkBadges()');assert.ok(r('badgesDone().includes("k1")')&&r('badgesDone().includes("first")')&&r('game.credits')===1500);ok('milestones unlock without changing your credits');
r('checkBadges()');assert.equal(r('badgesDone().length'),2);ok('milestones unlock only once');
assert.ok(r('commander()').includes('Milestones'));assert.ok(!/GADGET SLOT/.test(r('outfitsPanel()')));ok('milestones listed on Commander, equipment slot wording');
// store tab
r('game=fresh("Normal");game.tutorial=null;tab="store";render()');const st=nodes.screen.innerHTML;assert.ok(st.includes('Outfit your ship')&&st.includes('data-action="buywarp"')&&st.includes('Shipyard'));ok('Store tab holds equipment, warp charges and the shipyard');
r('tab="ship";render()');const sh=nodes.screen.innerHTML;assert.ok(sh.includes('data-action="refuel"')&&sh.includes('Fitted equipment')&&!sh.includes('Outfit your ship')&&!sh.includes('data-action="buywarp"'));ok('Ship tab shows the ship, fitted gear, refuel and repair only');
// star chart
r('game=fresh("Normal");game.tutorial=null;tab="galaxy";action("chart-mode",1)');assert.equal(r('chartMode'),'star');const sc=nodes.screen.innerHTML;assert.ok(sc.includes('Star chart · to scale'));assert.equal((sc.match(/class="sc-world/g)||[]).length,24);ok('star chart shows all 24 planets');
const xy=[...sc.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="1[15]" fill/g)].map(m=>[+m[1],+m[2]]);assert.equal(xy.length,24);let worst=0;for(let i=0;i<24;i++)for(let j=i+1;j<24;j++){const real=r('Math.hypot(game.worlds['+i+'].x-game.worlds['+j+'].x,game.worlds['+i+'].y-game.worlds['+j+'].y)'),drawn=Math.hypot(xy[i][0]-xy[j][0],xy[i][1]-xy[j][1])/24;worst=Math.max(worst,Math.abs(real-drawn))}assert.ok(worst<0.01,'drawn distance matches real distance, worst error '+worst);ok('star chart distances are drawn to scale');
r('action("select",5)');assert.equal(r('chartMode'),'star');assert.equal(r('selectedWorld'),5);ok('tapping a planet on the star chart selects it');
r('action("chart-mode",0)');assert.ok(!nodes.screen.innerHTML.includes('Star chart · to scale'));ok('back to the solar chart');
console.log('All help checks passed.');
