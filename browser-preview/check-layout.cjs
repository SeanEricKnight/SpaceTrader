// Check that the normal Chart view and its next travel action fit without page scrolling.
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const gameUrl=pathToFileURL(path.resolve('SpaceTrader-browser.html')).href;
let chromium;try{({chromium}=require('playwright-core'))}catch{console.log('SKIP: playwright-core not installed');process.exit(0)}
const exe=process.env.CHROME_PATH||['/usr/bin/google-chrome','/usr/bin/chromium','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p=>fs.existsSync(p));
if(!exe){console.log('SKIP: no Chrome found (set CHROME_PATH)');process.exit(0)}
(async()=>{
 const browser=await chromium.launch({executablePath:exe,args:['--no-sandbox']});
 for(const [name,w,h] of [['desktop',1440,900],['laptop',1366,768],['phone',390,844],['short-phone',375,667]]){
  const page=await browser.newPage({viewport:{width:w,height:h}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();
  await page.click('[data-action="info-close"]');
  for(const sel of ['[data-action="guide-skip"]','[data-action="arrival-close"]']){try{await page.click(sel,{timeout:800})}catch{}}
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';guideSt().off=true;render()});await page.click('nav [data-tab="galaxy"]');await page.evaluate(()=>{action('select',1)});
  await page.evaluate(()=>{const d=document.getElementById('info-dialog');if(d&&d.open)d.close();window.scrollTo(0,0)});
  const checkFit=async()=>page.evaluate(()=>{
   const bottom=selector=>document.querySelector(selector)?.getBoundingClientRect().bottom;
   const nav=document.querySelector('nav').getBoundingClientRect();
   return {document:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,
    height:innerHeight,viewportWidth:innerWidth,usableBottom:nav.top>innerHeight/2?nav.top:innerHeight,
    trip:bottom('.trip-panel'),map:bottom('.map-viewport, .sc-wrap'),travel:bottom('.trip-panel .primary')};
  });
  const assertFit=(m,state)=>{
   assert.ok(m.document<=m.height+1&&m.width<=m.viewportWidth+1,name+' '+state+' fits without scrolling: '+JSON.stringify(m));
   assert.ok(m.trip<=m.usableBottom&&m.map<=m.usableBottom,name+' '+state+' map and Trip panel are above the dock: '+JSON.stringify(m));
  };
  const m=await checkFit();
  assertFit(m,'Solar chart');
  assert.ok(m.travel!==undefined&&m.travel<=m.usableBottom,'Travel stays visible: '+JSON.stringify(m));
  if(process.env.SHOT)await page.screenshot({path:process.env.SHOT+'-'+name+'.png'});
  await page.getByRole('button',{name:'Chart tools',exact:true}).click();
  await page.locator('#info-dialog .route-overview summary').click();
  await page.locator('#info-dialog .distance-list button').first().click();
  assert.equal(await page.locator('#info-dialog').evaluate(el=>el.open),false,'choosing a port returns to the chart');
  await page.getByRole('button',{name:'Trip options',exact:true}).click();
  assert.match(await page.locator('#info-dialog').innerText(),/Travel style/);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Star chart',exact:true}).click();
  assertFit(await checkFit(),'Star chart');
  assert.deepEqual(errors,[],'no page errors');
  await page.close();
 }
 {const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('dialog',d=>d.accept());await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.contracts.push({id:'t1',kind:'freight',title:'Freight',to:1,reward:900,due:game.day+9,cargo:10});render()});await page.click('nav [data-tab="market"]');await page.click('.port-extras > summary');
  const a=await page.evaluate(()=>{const rows=[...document.querySelectorAll('.hold-jobs li')],b=rows[0]&&rows[0].querySelector('[data-action="abandon"]');return{rows:rows.length,text:rows[0]&&rows[0].textContent,res:reservedFor(game),btn:!!b}});
  assert.ok(a.rows===1&&a.btn&&/10 bays/.test(a.text)&&a.res===10,'hold card lists each job with its bays and a Drop job button: '+JSON.stringify(a));
  if(process.env.SHOT)await page.locator('.hold').first().screenshot({path:process.env.SHOT+'-hold.png'});
  await page.click('.hold-jobs [data-action="abandon"]');const z=await page.evaluate(()=>({res:reservedFor(game),rows:document.querySelectorAll('.hold-jobs li').length,jobs:game.contracts.length}));
  assert.deepEqual(z,{res:0,rows:0,jobs:0},'dropping a job from the hold card frees its bays at once');
  const lab=await page.evaluate(()=>{const j=offers().find(x=>x.cargo>0);action('port-menu');document.querySelector('#info-dialog [data-tab="jobs"]').click();const bs=[...document.querySelectorAll('[data-action="contract"],[data-action="request"]')].map(b=>b.textContent);return{has:!!j,bs}});
  if(lab.has)assert.ok(lab.bs.some(t=>/holds \d+ bays?/.test(t)),'Accept buttons for freight say how many bays they hold: '+JSON.stringify(lab.bs));
  await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const r=await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';let id=game.worlds.findIndex((w,i)=>i!==game.location&&distance(i)<=ship().range&&distance(i)>3);game.fuel=Math.max(0,distance(id)-2);render();action('select',id);action('planet-details',id);const before=document.querySelector('#info-dialog [data-action="refuel"]');if(!before)return{err:'no refuel button'};before.click();const d=document.getElementById('info-dialog');return{open:d.open,pid:Number(d.querySelector('.info-planet').dataset.pid)===id,travel:!d.querySelector('[data-action="jump"]').disabled,fuel:game.fuel>=distance(id),toast:!!document.querySelector('.toast')}});
  assert.deepEqual(r,{open:true,pid:true,travel:true,fuel:true,toast:true},'Refuel inside the Inspect card keeps it open, enables Travel and confirms: '+JSON.stringify(r));await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const q=await page.evaluate(async()=>{if(game.tutorial)game.tutorial.state='skipped';render();cheer('Delivered','Courier delivery',610);await new Promise(r=>setTimeout(r,700));const sm=document.querySelector('#toasts .cheer-small');const h=sm&&Math.round(sm.getBoundingClientRect().height),top=sm&&Math.round(sm.getBoundingClientRect().top);cheer('First haul complete','Your first delivery is done',1500,true);await new Promise(r=>setTimeout(r,700));return{small:!!sm,h,top,big:!!document.querySelector('#cheer-big .cheer-card'),glow:document.querySelectorAll('.cheer-small ~ .cheer-glow').length,rays:getComputedStyle(document.querySelector('#cheer-big .cheer-card'),'::before').content}});
  if(process.env.SHOT)await page.screenshot({path:process.env.SHOT+'-cheer.png'});
  assert.ok(q.small&&q.h<=60&&q.top<240&&q.big&&(q.rays==='none'||q.rays==='normal'),'routine wins are a small top strip; only rare wins get the centered card; no spinning rays: '+JSON.stringify(q));await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const dl=await page.evaluate(async()=>{if(game.tutorial)game.tutorial.state='skipped';render();document.querySelector('nav [data-tab="market"]').click();action('select',1);action('planet-details',1);await new Promise(r=>setTimeout(r,200));const d=document.getElementById('info-dialog');if(d.open)d.close();await new Promise(r=>setTimeout(r,200));return diagLines().join('\n')});
  assert.ok(/Browser: /.test(dl)&&/Window: 1440x900/.test(dl)&&/click tab:market/.test(dl)&&/pop-out open/.test(dl)&&/pop-out closed/.test(dl),'log download carries browser, window and a UI trace: '+dl.slice(0,400));await page.close()}
 {const page=await browser.newPage({viewport:{width:1200,height:900}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.credits=400000;game.location=7;game.worlds[7].tech=7;render()});await page.click('nav [data-tab="ship"]');await page.click('#screen [data-tab="store"]');
  const st=await page.evaluate(()=>{const cards=[...document.querySelectorAll('.ship-card')];return{n:cards.length,roles:cards.filter(c=>c.querySelector('.ship-role')&&c.innerText.includes('laser')).length,beetle:(cards.find(c=>c.querySelector('h3').textContent.startsWith('Beetle'))||{innerText:''}).innerText.includes('Freighter')}});
  assert.deepEqual(st,{n:12,roles:12,beetle:true},'every ship card shows a role and its lasers/shields/slots: '+JSON.stringify(st));
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
  await page.evaluate(()=>{document.getElementById('toasts').innerHTML='';toast('Plain note','info');toast('Port logged','gold',{act:{label:'View port',fn:()=>{window.__acted=1},done:'Showing it'}})});
  const sz=await page.evaluate(()=>[...document.querySelectorAll('#toasts .toast')].map(t=>t.offsetHeight));assert.ok(sz.length===2&&sz.every(h=>h>=44),'toast cards are at least 44px tall: '+sz);
  assert.ok(await page.evaluate(()=>!!document.querySelector('#toasts .toast .toast-act')),'action toast shows its verb');
  await page.click('#toasts .toast.has-act');await page.waitForTimeout(400);assert.ok(await page.evaluate(()=>window.__acted===1&&[...document.querySelectorAll('#toasts .toast')].some(t=>/Showing it/.test(t.textContent))),'tapping an action toast runs it, then confirms');
  await page.evaluate(()=>{document.getElementById('toasts').innerHTML='';window.__acted=0;toast('Milestone: test','gold',{act:{label:'All milestones',fn:()=>{window.__acted=1}}})});
  await page.click('#toasts .toast-x');await page.waitForTimeout(400);assert.ok(await page.evaluate(()=>window.__acted===0&&!document.querySelector('#toasts .toast')),'the X on an action toast only dismisses it; it does not run the action');
  {const y=await page.evaluate(async()=>{const o=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(a){if(a&&a.behavior==='smooth')return;return o.call(this,a)};tab='galaxy';render();window.scrollTo(0,0);const id=game.worlds.map((w,i)=>i).find(i=>i!==game.location&&distance(i)<=game.fuel);const bt=document.createElement('button');bt.dataset.action='showroute';bt.dataset.id=id;document.getElementById('screen').appendChild(bt);bt.dispatchEvent(new MouseEvent('click',{bubbles:true}));await new Promise(r=>setTimeout(r,1100));const e=document.querySelector('.trip-panel');Element.prototype.scrollIntoView=o;return e?Math.round(e.getBoundingClientRect().bottom):null});assert.ok(y!==null&&y<=900,'show route leaves the Trip panel on screen without scrolling: bottom='+y)}
  const ln=await page.evaluate(()=>{const o=[];for(let i=0;i<60;i++)o.push(travelLine(i%24,3+i%9,i));return {rep:o.some((x,i)=>i&&x===o[i-1]),uniq:new Set(o).size,empty:o.some(x=>!x)}});assert.ok(!ln.rep&&!ln.empty&&ln.uniq>=20,'travel lines never repeat back to back and vary: '+JSON.stringify(ln));
  await page.evaluate(()=>{document.getElementById('toasts').innerHTML='';const t=game.location===3?4:3;window.__jt=t;jobToast({title:'Reactor coolant core',to:t,due:game.day+4,reward:893,cargo:2})});
  const jt=await page.evaluate(()=>{const e=document.querySelector('#toasts .toast');return{txt:e?e.textContent:'',name:game.worlds[window.__jt].name}});assert.ok(jt.txt.includes(jt.name)&&/Delivers when you dock|dock to deliver/.test(jt.txt)&&/Show me where/.test(jt.txt)&&/day /.test(jt.txt),'accepted job names its destination, deadline and how to deliver: '+JSON.stringify(jt));
  await page.click('#toasts .toast.has-act');await page.waitForTimeout(300);assert.ok(await page.evaluate(()=>selectedWorld===window.__jt&&tab==='galaxy'),'job toast action shows the destination on the galaxy chart');await page.evaluate(()=>closeInfo());
  await page.evaluate(()=>{toast('One','gold');toast('Two','loss')});await page.click('#toasts .toast-clear');assert.equal(await page.evaluate(()=>document.querySelectorAll('#toasts .toast,#toasts .cheer-small').length),0,'Dismiss all clears the stack');await page.close()}
 {const page=await browser.newPage({viewport:{width:1200,height:900}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.credits=5000;render()});await page.click('nav [data-action="port-menu"]');await page.click('#info-dialog [data-tab="crew"]');
  const cards=await page.locator('.escort-panel article.tappable[data-action="escort-profile"]').count();await page.locator('.escort-panel h3:has-text("Pilots for hire") + .fleet-grid article.tappable h3').first().click();
  const e=await page.evaluate(()=>{const d=document.getElementById('info-dialog');return{open:d.open,stats:!!d.querySelector('.statrows'),hire:!!d.querySelector('[data-action="hire"]:not([disabled])')}});
  assert.deepEqual({cards:cards>=3,...e},{cards:true,open:true,stats:true,hire:true},'pilot cards open a profile with ratings and a Hire button: '+JSON.stringify({cards,...e}));
  await page.click('#info-dialog [data-action="hire"]');const h=await page.evaluate(()=>({n:escortList().length,open:document.getElementById('info-dialog').open}));
  assert.deepEqual(h,{n:1,open:false},'hiring from the profile hires the pilot and closes the card: '+JSON.stringify(h));await page.close()}
 {const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';render();jump(1)});await page.waitForSelector('#warp-scene .ws-continue, #warp-scene button',{timeout:15000});await page.waitForTimeout(1500);
  const t=await page.evaluate(()=>{const sc=document.getElementById('warp-scene'),b=[...sc.querySelectorAll('button')].pop().getBoundingClientRect();return[...document.querySelectorAll('.toast')].filter(e=>{const q=e.getBoundingClientRect();return q.bottom>b.top&&q.top<b.bottom&&q.right>b.left&&q.left<b.right}).map(e=>e.textContent)});
  assert.deepEqual(t,[],'no toast covers the travel scene Continue button: '+t.join(' | '));await page.close()}
 {const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  const h=await page.evaluate(()=>{game.tutorial={state:'active',to:game.location};tutorialCheck(0);const d=document.getElementById('info-dialog'),bs=[...d.querySelectorAll('button')].filter(b=>b.dataset.tab),p=d.querySelector('.next-steps .primary'),r=d.getBoundingClientRect();return{open:d.open,tabButtons:bs.length,primary:p&&p.textContent,inView:r.top>=0&&r.bottom<=innerHeight,lists:d.querySelectorAll('ul').length}});
  assert.deepEqual(h,{open:true,tabButtons:3,primary:'Open the Market',inView:true,lists:0},'First haul card: one primary next step plus two secondary, no bullet wall: '+JSON.stringify(h));await page.close()}
 {const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(gameUrl);await page.evaluate(()=>localStorage.clear());await page.reload();await page.click('[data-action="info-close"]');
  await page.evaluate(()=>{if(game.tutorial)game.tutorial.state='skipped';game.worlds[3].crisis=1;game.contracts.push({to:3,from:game.location,good:0,qty:1,pay:100,due:game.day+9});render()});await page.click('nav [data-tab="galaxy"]');
  const n=await page.evaluate(()=>{const bad=[];game.worlds.forEach((w,id)=>{const el=document.querySelector('[data-map-planet="'+id+'"]');if(!el)return;const fl=!!el.querySelector('.map-signal.crisis'),jt=el.querySelector('.map-signal.jobs text'),jn=game.contracts.filter(j=>j.to===id).length;if(fl!==!!w.crisis||(jt?+jt.textContent:0)!==jn)bad.push(id)});const e3=document.querySelector('[data-map-planet="3"]');return{bad,crisis:!!e3.querySelector('.map-signal.crisis'),jobs:e3.querySelector('.map-signal.jobs text').textContent}});
  assert.deepEqual(n,{bad:[],crisis:true,jobs:'1'},'map flame and job count appear exactly where a crisis or delivery job exists');await page.close()}
 {const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  await page.goto(gameUrl);
  await page.getByRole('button',{name:'Start flying'}).tap();
  const travel=page.getByRole('button',{name:/Travel to Adahn.*9 fuel/});
  const rect=await travel.boundingBox();
  const nav=await page.locator('nav').boundingBox();
  assert.ok(rect&&rect.y>=0&&rect.y+rect.height<=nav.y,'first flight is above the phone dock');
  await travel.tap();
  const proceed=page.locator('#warp-scene button').filter({hasText:/Continue/});
  await proceed.click({timeout:10000});
  await proceed.waitFor({state:'hidden'});
  await page.locator('.trip-panel').getByRole('button',{name:'Open market',exact:true}).tap();
  assert.equal(await page.locator('#screen').getAttribute('data-screen'),'market');
  await page.getByRole('button',{name:'Sell all',exact:true}).first().click();
  assert.equal(await page.locator('#stats .stat strong').first().innerText(),await page.evaluate(()=>money(game.credits)),'settled balance is visible immediately');
  await page.close()}
 {const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(gameUrl);
  await page.getByRole('button',{name:'Start flying'}).click();
  await page.evaluate(()=>{game.cargo[0]=capacity();tab='jobs';render()});
  const freight=page.locator('#screen button[data-action="contract"][aria-disabled="true"]').first();
  await freight.waitFor();
  await freight.evaluate(el=>{const before=document.createElement('button');el.before(before);before.focus()});
  await page.keyboard.press('Tab');
  assert.equal(await freight.evaluate(el=>document.activeElement===el),true,'Tab can reach locked freight');
  for(const key of ['Enter','Space']){
   await page.keyboard.press(key);
   assert.match(await page.locator('#lock-pop').innerText(),/cargo space/i);
   assert.equal(await page.evaluate(()=>game.contracts.length),0,'locked freight never reserves bays');
  }
  await page.close()}
 await browser.close();console.log('check-layout passed');
})().catch(e=>{console.error(e);process.exit(1)});
