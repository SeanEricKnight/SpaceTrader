// Navigation tab length check (audit 2026-11-16, reviews/2026-11-16-ui-length-audit.md). Real browser via playwright-core + Chrome.
// Hard rule: on desktop the Travel button is inside the first screen. Soft caps: total page height in screens.
// Phone: height cap, and Travel is reachable without scrolling through the bottom pill (#dock-hint). Map signals (crisis flame, job count) are drawn on planets.
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright-core'))}catch{console.log('SKIP: playwright-core not installed');process.exit(0)}
const exe=process.env.CHROME_PATH||['/usr/bin/google-chrome','/usr/bin/chromium','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p=>fs.existsSync(p));
if(!exe){console.log('SKIP: no Chrome found (set CHROME_PATH)');process.exit(0)}
const CAPS={desktop:2.2,phone:4};
(async()=>{
 const browser=await chromium.launch({executablePath:exe,args:['--no-sandbox']});
 for(const [name,w,h] of [['desktop',1440,900],['phone',390,844]]){
  const page=await browser.newPage({viewport:{width:w,height:h}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();
  await page.click('[data-action="info-close"]');
  for(const sel of ['[data-action="guide-skip"]','[data-action="arrival-close"]']){try{await page.click(sel,{timeout:800})}catch{}}
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';render()});await page.click('nav [data-tab="galaxy"]');await page.evaluate(()=>{action('select',1)});
  await page.evaluate(()=>{const d=document.getElementById('info-dialog');if(d&&d.open)d.close();window.scrollTo(0,0)});
  const m=await page.evaluate(()=>{const r=s=>{const e=document.querySelector(s);return e?Math.round(e.getBoundingClientRect().height):null},t=document.querySelector('.map-selection [data-action="jump"]');return {docH:document.documentElement.scrollHeight,vh:innerHeight,travelBottom:t?Math.round(t.getBoundingClientRect().bottom):null,best:r('.best-runs'),dest:r('.destination-card'),side:r('.side-column'),stage:r('.orbital-stage'),dupRoute:!!document.querySelector('.route-card'),hullTile:!!document.querySelector('#stats .stat.hull'),vessel:!!document.querySelector('.vessel-card')}});
  if(process.env.SHOT)await page.screenshot({path:process.env.SHOT+'-'+name+'.png',fullPage:true});
  console.log(name,JSON.stringify(m),'screens='+(m.docH/m.vh).toFixed(2));
  assert.equal(errors.length,0,'page errors: '+errors.join('; '));
  assert.equal(m.hullTile,true,'hull and ship thumbnail live in the stats bar');
  assert.equal(m.vessel,false,'vessel card is not on the Navigation tab');
  assert.equal(m.dupRoute,false,'a one-jump route does not repeat itself in a Route card');
  assert.ok(m.docH/m.vh<=CAPS[name],name+' Navigation tab is '+(m.docH/m.vh).toFixed(2)+' screens, cap '+CAPS[name]);
  if(name==='desktop')assert.ok(m.travelBottom!==null&&m.travelBottom<=m.vh,'Travel is inside the first screen on desktop (bottom '+m.travelBottom+' of '+m.vh+')');
  const sig=await page.evaluate(()=>{const dh=document.getElementById('dock-hint'),r=dh.getBoundingClientRect(),vis=!dh.hidden&&getComputedStyle(dh).display!=='none';return{vis,text:dh.textContent,inView:vis&&r.top>=0&&r.bottom<=innerHeight,action:dh.dataset.action}});
  if(name==='phone'){assert.ok(sig.inView&&/^🚀 Travel to .+ · \d+ fuel$/.test(sig.text)&&sig.action==='jump','phone: Travel is in the bottom pill without scrolling: '+JSON.stringify(sig));
   const loc=await page.evaluate(()=>{const f=game.location;await0=0;return game.location});await page.click('#dock-hint');const moved=await page.evaluate(()=>game.location!==0||inFlight());assert.ok(moved,'phone: tapping the pill starts the trip')}
  else assert.equal(sig.vis,false,'desktop: the bottom Travel pill stays hidden (Travel is in the map bar)');
  await page.close();
 }
 {const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';render();jump(1)});await page.waitForSelector('#warp-scene .ws-continue, #warp-scene button',{timeout:15000});await page.waitForTimeout(1500);
  const t=await page.evaluate(()=>{const sc=document.getElementById('warp-scene'),b=[...sc.querySelectorAll('button')].pop().getBoundingClientRect();return[...document.querySelectorAll('.toast')].filter(e=>{const q=e.getBoundingClientRect();return q.bottom>b.top&&q.top<b.bottom&&q.right>b.left&&q.left<b.right}).map(e=>e.textContent)});
  assert.deepEqual(t,[],'no toast covers the travel scene Continue button: '+t.join(' | '));await page.close()}
 {const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const h=await page.evaluate(()=>{game.tutorial={state:'active',to:game.location};tutorialCheck(0);const d=document.getElementById('info-dialog'),bs=[...d.querySelectorAll('button')].filter(b=>b.dataset.tab),p=d.querySelector('.next-steps .primary'),r=d.getBoundingClientRect();return{open:d.open,tabButtons:bs.length,primary:p&&p.textContent,inView:r.top>=0&&r.bottom<=innerHeight,lists:d.querySelectorAll('ul').length}});
  assert.deepEqual(h,{open:true,tabButtons:3,primary:'Open the Market',inView:true,lists:0},'First haul card: one primary next step plus two secondary, no bullet wall: '+JSON.stringify(h));await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.worlds[3].crisis=1;game.contracts.push({to:3,from:game.location,good:0,qty:1,pay:100,due:game.day+9});render()});await page.click('nav [data-tab="galaxy"]');
  const n=await page.evaluate(()=>{const bad=[];game.worlds.forEach((w,id)=>{const el=document.querySelector('[data-map-planet="'+id+'"]');if(!el)return;const fl=!!el.querySelector('.map-signal.crisis'),jt=el.querySelector('.map-signal.jobs text'),jn=game.contracts.filter(j=>j.to===id).length;if(fl!==!!w.crisis||(jt?+jt.textContent:0)!==jn)bad.push(id)});const e3=document.querySelector('[data-map-planet="3"]');return{bad,crisis:!!e3.querySelector('.map-signal.crisis'),jobs:e3.querySelector('.map-signal.jobs text').textContent}});
  assert.deepEqual(n,{bad:[],crisis:true,jobs:'1'},'map flame and job count appear exactly where a crisis or delivery job exists');await page.close()}
 {
 }
 await browser.close();console.log('check-layout passed');
})().catch(e=>{console.error(e);process.exit(1)});
