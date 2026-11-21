// Real-browser click check (playwright-core + Chrome). Catches dispatch bugs that action()-level tests skip.
// Needs: npm i --no-save playwright-core ; CHROME_PATH or a system Chrome. Exits 0 with SKIP if no browser is found.
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright-core'))}catch{console.log('SKIP: playwright-core not installed');process.exit(0)}
const exe=process.env.CHROME_PATH||['/usr/bin/google-chrome','/usr/bin/chromium','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p=>fs.existsSync(p));
if(!exe){console.log('SKIP: no Chrome found (set CHROME_PATH)');process.exit(0)}
(async()=>{
 const browser=await chromium.launch({executablePath:exe,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1400,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve('SpaceTrader-browser.html'));await page.evaluate(()=>localStorage.clear());await page.reload();
 await page.click('[data-action="info-close"]');
 const st=()=>page.evaluate(()=>({loc:game.location,day:game.day,fuel:game.fuel,credits:game.credits,tab}));
 assert.equal((await st()).day,1);
 // Fresh Normal start: the Chart's Travel button must move the ship.
 await page.click('.trip-panel [data-action="jump"]');
 let s=await st();assert.equal(s.loc,1,'Travel to Adahn moved the ship');assert.equal(s.day,2);
 // Sell the Water by real clicks in the Market.
 await page.click('nav [data-tab="market"]');await page.click('.trade-row[data-good="0"] summary');
 const before=(await st()).credits;await page.click('.trade-row[data-good="0"] [data-action="sellall"]');
 s=await st();assert.ok(s.credits>before+1000,'sold Water and earned the bonus: '+(s.credits-before));
 // A control inside the main panel must still work after the tab-selector fix: open the System tab, select Acamar, press Travel.
 await page.keyboard.press('Escape');await page.evaluate(()=>{const d=document.getElementById('info-dialog');if(d&&d.open)d.close()});
 await page.click('nav [data-tab="galaxy"]');await page.evaluate(()=>{game.fuel=99;game.peace=true});await page.evaluate(()=>action('select',0));
 await page.evaluate(()=>{const d=document.getElementById('info-dialog');if(d&&d.open)d.close()});
 await page.click('.map-selection [data-action="jump"]');s=await st();assert.equal(s.loc,0,'chart Travel button works');
 // Desktop layout: the map and the travel column sit side by side. Best runs can accept a job directly.
 await page.evaluate(()=>{game.encounter=null;tab='galaxy';render()});
 const g=await page.evaluate(()=>{window.scrollTo(0,0);const a=document.querySelector('.orbital-stage').getBoundingClientRect(),b=document.querySelector('.trip-panel').getBoundingClientRect();return{sameRow:Math.abs(a.top-b.top)<40,beside:b.left>=a.right-1}});
 assert.deepEqual(g,{sameRow:true,beside:true},'map and travel column are side by side at 1400px');
 const nC=await page.evaluate(()=>game.contracts.length);await page.click('[data-action="chart-tools"]');await page.click('.best-runs [data-action="contract"]:not([disabled])');
 assert.equal(await page.evaluate(()=>game.contracts.length),nC+1,'Accept on a Best runs row takes the job');
 // Crew ability button carries a string id through the click handler.
 await page.evaluate(()=>{game.crew=[{id:'wren',loyalty:50,jumps:0,beat:0}];game.encounter=makeEncounter();render()});
 await page.click('#encounter [data-action="ability"][data-id="wren"]');assert.equal(await page.evaluate(()=>game.encounter),null,'Slipstream clears the encounter');
 assert.deepEqual(errors,[],'no page errors');
 await browser.close();console.log('PASS: real Chrome clicks drive Travel, Market sale, chart Travel and crew abilities');
})().catch(e=>{console.error(e);process.exit(1)});
