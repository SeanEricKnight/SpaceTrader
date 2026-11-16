// Navigation tab length check (audit 2026-11-16, reviews/2026-11-16-ui-length-audit.md). Real browser via playwright-core + Chrome.
// Hard rule: on desktop the Travel button is inside the first screen. Soft caps: total page height in screens.
// Phone: height cap only; Travel position is reported (the phone dock slot for Travel is not built yet).
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
  await page.close();
 }
 await browser.close();console.log('check-layout passed');
})().catch(e=>{console.error(e);process.exit(1)});
