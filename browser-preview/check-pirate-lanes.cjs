const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({args: ['--no-sandbox']});
  try {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({viewport: {width, height: 850}, reducedMotion: 'reduce'});
      await page.goto(pathToFileURL(path.resolve('SpaceTrader-browser.html')).href);
      await page.locator('[data-action="intro-go"]').click();
      assert.equal(await page.locator('#goal-progress details').evaluate(el => el.open), false);
      await page.evaluate(() => {tab='galaxy'; chartMode='star'; render()});
      const port = page.locator('.sc-port[data-id="2"]');
      await port.evaluate(el => el.scrollIntoView({block:'center', behavior:'instant'}));
      const bounds = await port.boundingBox();
      await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
      assert.ok(await port.evaluate(el=>el.matches(':hover')));
      assert.deepEqual(await port.boundingBox(), bounds);
      await port.click();
      assert.equal(await page.evaluate(() => selectedWorld), 2);
      const results = await page.evaluate(() => {
        const test = [];
        for (let i=0; i<catalog.ships.length; i++) {
          game.ship=i; game.encounter=makeEncounter();
          const panel=document.createElement('div'); panel.innerHTML=combatPanel();
          const images=panel.querySelectorAll('.ship-sprite');
          test.push(images[0].ariaLabel===ship().name+' spacecraft' && pirateHull()!==i &&
            images[1].ariaLabel===catalog.ships[pirateHull()].name+' spacecraft');
        }
        game.encounter={hull:20,maxHull:30};test.push(!combatPanel().includes('undefined'));
        const lines=[];for(let i=0;i<100;i++){const line=travelLine(1,9,i);test.push(!lines.slice(-16).includes(line));lines.push(line)}
        game.encounter=null;game.jumps=8;const q=sqOffered().findIndex(x=>x.id==='lastLight');sqAccept(q);
        game.location=6;dock();dock();test.push(sqState().active.lastLight.n===1);
        game.location=1;dock();test.push(sqState().done.includes('lastLight'));
        game.pirateReport={day:game.day,port:2,edition:0};test.push(pirateBulletin().includes(game.worlds[2].name));
        game.day+=5;test.push(pirateBulletin()==='');return test;
      });
      assert.ok(results.every(Boolean));await page.close();
    }
  } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
