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
 {const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('dialog',d=>d.accept());await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.contracts.push({id:'t1',kind:'freight',title:'Freight',to:1,reward:900,due:game.day+9,cargo:10});render()});await page.click('nav [data-tab="market"]');
  const a=await page.evaluate(()=>{const rows=[...document.querySelectorAll('.hold-jobs li')],b=rows[0]&&rows[0].querySelector('[data-action="abandon"]');return{rows:rows.length,text:rows[0]&&rows[0].textContent,res:reservedFor(game),btn:!!b}});
  assert.ok(a.rows===1&&a.btn&&/10 bays/.test(a.text)&&a.res===10,'hold card lists each job with its bays and a Drop job button: '+JSON.stringify(a));
  if(process.env.SHOT)await page.locator('.hold').first().screenshot({path:process.env.SHOT+'-hold.png'});
  await page.click('.hold-jobs [data-action="abandon"]');const z=await page.evaluate(()=>({res:reservedFor(game),rows:document.querySelectorAll('.hold-jobs li').length,jobs:game.contracts.length}));
  assert.deepEqual(z,{res:0,rows:0,jobs:0},'dropping a job from the hold card frees its bays at once');
  const lab=await page.evaluate(()=>{const j=offers().find(x=>x.cargo>0);document.querySelector('nav [data-tab="jobs"]').click();const bs=[...document.querySelectorAll('[data-action="contract"],[data-action="request"]')].map(b=>b.textContent);return{has:!!j,bs}});
  if(lab.has)assert.ok(lab.bs.some(t=>/holds \d+ bays?/.test(t)),'Accept buttons for freight say how many bays they hold: '+JSON.stringify(lab.bs));
  await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const r=await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';let id=game.worlds.findIndex((w,i)=>i!==game.location&&distance(i)<=ship().range&&distance(i)>3);game.fuel=Math.max(0,distance(id)-2);render();action('select',id);const before=document.querySelector('#info-dialog [data-action="refuel"]');if(!before)return{err:'no refuel button'};before.click();const d=document.getElementById('info-dialog');return{open:d.open,pid:Number(d.querySelector('.info-planet').dataset.pid)===id,travel:!d.querySelector('[data-action="jump"]').disabled,fuel:game.fuel>=distance(id),toast:!!document.querySelector('.toast')}});
  assert.deepEqual(r,{open:true,pid:true,travel:true,fuel:true,toast:true},'Refuel inside the Inspect card keeps it open, enables Travel and confirms: '+JSON.stringify(r));await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const q=await page.evaluate(async()=>{if(game.tutorial)game.tutorial.state='skipped';render();cheer('Delivered','Courier delivery',610);await new Promise(r=>setTimeout(r,700));const sm=document.querySelector('#toasts .cheer-small');const h=sm&&Math.round(sm.getBoundingClientRect().height),top=sm&&Math.round(sm.getBoundingClientRect().top);cheer('First haul complete','Your first delivery is done',1500,true);await new Promise(r=>setTimeout(r,700));return{small:!!sm,h,top,big:!!document.querySelector('#cheer-big .cheer-card'),glow:document.querySelectorAll('.cheer-small ~ .cheer-glow').length,rays:getComputedStyle(document.querySelector('#cheer-big .cheer-card'),'::before').content}});
  if(process.env.SHOT)await page.screenshot({path:process.env.SHOT+'-cheer.png'});
  assert.ok(q.small&&q.h<=60&&q.top<200&&q.big&&(q.rays==='none'||q.rays==='normal'),'routine wins are a small top strip; only rare wins get the centered card; no spinning rays: '+JSON.stringify(q));await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const dl=await page.evaluate(async()=>{if(game.tutorial)game.tutorial.state='skipped';render();document.querySelector('nav [data-tab="market"]').click();action('select',1);await new Promise(r=>setTimeout(r,200));const d=document.getElementById('info-dialog');if(d.open)d.close();await new Promise(r=>setTimeout(r,200));return diagLines().join('\n')});
  assert.ok(/Browser: /.test(dl)&&/Window: 1440x900/.test(dl)&&/click tab:market/.test(dl)&&/pop-out open/.test(dl)&&/pop-out closed/.test(dl),'log download carries browser, window and a UI trace: '+dl.slice(0,400));await page.close()}
 {const page=await browser.newPage({viewport:{width:1200,height:900}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.credits=400000;game.location=7;game.worlds[7].tech=7;render()});await page.click('nav [data-tab="store"]');
  const st=await page.evaluate(()=>{const cards=[...document.querySelectorAll('.ship-card')];return{n:cards.length,roles:cards.filter(c=>c.querySelector('.ship-role')&&c.innerText.includes('laser')).length,beetle:(cards.find(c=>c.querySelector('h3').textContent.startsWith('Beetle'))||{innerText:''}).innerText.includes('Freighter')}});
  assert.deepEqual(st,{n:10,roles:10,beetle:true},'every ship card shows a role and its lasers/shields/slots: '+JSON.stringify(st));
  await page.locator('.ship-card',{hasText:'Beetle'}).first().click();const info=await page.evaluate(()=>document.getElementById('info-dialog').innerText);
  assert.ok(/freighter/i.test(info)&&/Fuel per pc/.test(info)&&/Laser mounts/.test(info),'ship card names role, fuel cost and laser stat: '+info.slice(0,300));
  await page.evaluate(()=>{closeInfo();game.location=0;game.worlds[0].tech=0;game.credits=400000;render()});await page.locator('.ship-card',{hasText:'Termite'}).first().click();
  const route=await page.evaluate(()=>{const b=document.querySelector('#info-dialog button.primary');return{t:b?b.textContent:'',dis:b?b.disabled:null,buy:!!document.querySelector('#info-dialog [data-action="ship"]')}});
  assert.ok(/Show me where/.test(route.t)&&!route.dis&&!route.buy,'locked ship offers a route button, not a dead Buy: '+JSON.stringify(route));
  await page.click('#info-dialog button.primary');const after=await page.evaluate(()=>({tab:typeof tab!=='undefined'?tab:'',open:document.getElementById('info-dialog').open,txt:document.getElementById('info-dialog').innerText.slice(0,60)}));
  assert.equal(after.tab,'galaxy','route button opens the galaxy view: '+JSON.stringify(after));
  await page.evaluate(()=>{closeInfo();game.worlds[game.location].tech=7;game.modules=['cargo'];render()});const why=await page.evaluate(()=>outfitReason(OUTFITS.find(o=>o.id==='tank')));assert.ok(/Remove Cargo expansion/.test(why),'full slots say what to remove: '+why);
  await page.evaluate(()=>{say('test event');openInfo(logHtml())});await page.click('#info-dialog [data-action="log-clear"]');const lg=await page.evaluate(()=>({n:game.log.length,open:document.getElementById('info-dialog').open,txt:document.getElementById('info-dialog').innerText}));assert.ok(lg.n===0&&lg.open&&/Nothing yet/.test(lg.txt),'Clear log empties the log and keeps the dialog open: '+JSON.stringify(lg).slice(0,200));
  await page.evaluate(()=>{closeInfo();toast('Stays until tapped','gold');cheer('Success','You hauled out 5 Water from the wreck. It cost you nothing.  (+5 cargo)',0)});await page.waitForTimeout(4600);
  const tt=await page.evaluate(()=>{const b=document.getElementById('toasts').getBoundingClientRect();return{n:document.querySelectorAll('#toasts .toast.sticky,#toasts .cheer-small').length,clear:!!document.querySelector('#toasts .toast-clear'),top:Math.round(b.top),bottom:Math.round(b.bottom),vh:innerHeight}});
  assert.ok(tt.n>=2&&tt.clear&&tt.top<200&&tt.bottom<tt.vh/2,'event messages stay past 4.5s, sit at the top, offer Dismiss all: '+JSON.stringify(tt));
  await page.click('#toasts .toast-clear');assert.equal(await page.evaluate(()=>document.querySelectorAll('#toasts .toast,#toasts .cheer-small').length),0,'Dismiss all clears the stack');await page.close()}
 {const page=await browser.newPage({viewport:{width:1200,height:900}});await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.credits=5000;render()});await page.click('nav [data-tab="crew"]');
  const cards=await page.locator('.escort-panel article.tappable[data-action="escort-profile"]').count();await page.locator('.escort-panel h3:has-text("Pilots for hire") + .fleet-grid article.tappable h3').first().click();
  const e=await page.evaluate(()=>{const d=document.getElementById('info-dialog');return{open:d.open,stats:!!d.querySelector('.statrows'),hire:!!d.querySelector('[data-action="hire"]:not([disabled])')}});
  assert.deepEqual({cards:cards>=3,...e},{cards:true,open:true,stats:true,hire:true},'pilot cards open a profile with ratings and a Hire button: '+JSON.stringify({cards,...e}));
  await page.click('#info-dialog [data-action="hire"]');const h=await page.evaluate(()=>({n:escortList().length,open:document.getElementById('info-dialog').open}));
  assert.deepEqual(h,{n:1,open:false},'hiring from the profile hires the pilot and closes the card: '+JSON.stringify(h));await page.close()}
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
