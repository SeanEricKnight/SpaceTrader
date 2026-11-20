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
      assert.ok(results.every(Boolean));
      // Exercise the normal store entry points on a fitted, three-mount hull.
      await page.evaluate(()=>{closeInfo();game.ship=6;game.laser=1;game.modules=[];game.credits=100000;game.worlds[game.location].tech=7;game.hull=100;game.encounter=null;game.offer=null;game.custody=null;tab='store';render()});
      const preview=id=>page.locator('#screen [data-action="fit-preview"][data-id="'+id+'"]').click();
      const dialog=page.locator('#info-dialog');
      const confirmFit=()=>dialog.locator('[data-action="fit-confirm"]').click();
      const closeFit=()=>dialog.locator('#info-body [data-action="info-close"]').click();
      await preview(8);
      assert.equal(await dialog.locator('.tile-1').count(),3);
      const art=await dialog.locator('.tile-1').first().evaluate(async el=>{
        const url=getComputedStyle(el).backgroundImage.slice(5,-2);
        const image=new Image();image.src=url;await image.decode();return image.naturalWidth;
      });
      assert.equal(art,224);
      await closeFit();
      assert.equal(await page.evaluate(()=>game.laser),1);
      await preview(8);await confirmFit();
      assert.equal(await page.evaluate(()=>game.laser),2);
      assert.equal(await dialog.locator('.fit-receipt').count(),1);
      await closeFit();await preview(3);await confirmFit();await closeFit();
      assert.ok(await page.evaluate(()=>game.modules.includes('tank')));
      await page.evaluate(()=>{game.encounter=makeEncounter();render()});
      const mine=page.locator('#encounter .cs-ship').first();
      assert.equal(await mine.locator('.tile-1').count(),3);
      assert.equal(await mine.locator('.tile-3').count(),1);
      await page.evaluate(()=>{game.encounter=null;render()});
      await preview(3);await confirmFit();await closeFit();
      assert.ok(await page.evaluate(()=>!game.modules.includes('tank')));
      await preview(9);await confirmFit();await closeFit();
      assert.equal(await page.evaluate(()=>game.laser),1);
      await preview(0);await confirmFit();await closeFit();
      await page.evaluate(()=>{game.cargo[0]=catalog.ships[game.ship].bays+2;render()});
      await preview(0);assert.match(await dialog.innerText(),/Free 2 cargo bays/);
      assert.equal(await dialog.locator('[data-action="fit-confirm"]').isDisabled(),true);
      await closeFit();
      await page.evaluate(()=>{closeInfo();game=fresh();game.tutorial=null;game.jumps=4;game.credits=150000;game.worlds[game.location].tech=7;game.fuel=4;tab='store';render()});
      await page.locator('[data-action="ship-options"][data-id="4"]').click();
      await dialog.locator('[data-action="keep-hull"]').click();
      assert.ok(await page.evaluate(()=>game.ship===4&&game.garage.length===1&&game.garage[0].fuel===4&&game.hangarMilestone));
      await page.evaluate(()=>{closeInfo();game=decodeSave(JSON.stringify(game));tab='ship';render()});
      const parkedId=await page.evaluate(()=>game.garage[0].ship);
      await page.locator('[data-action="switch-hull"][data-id="'+parkedId+'"]').click();
      assert.equal(await page.evaluate(()=>game.fuel),4);
      await page.evaluate(()=>{closeInfo();tab='jobs';game.location=6;render()});
      await page.locator('#screen [data-action="shore-visit"]').click();
      await dialog.locator('[data-action="shore-choice"][data-id="0"]').click();
      assert.equal(await page.evaluate(()=>game.shoreJob.id),0);
      await dialog.locator('[data-action="shore-route"]').click();
      assert.equal(await page.evaluate(()=>selectedWorld),1);
      assert.ok(await page.evaluate(()=>{
        const credits=game.credits;game.location=1;settleShore();settleShore();
        if(game.credits!==credits+600||game.shoreJob||!game.shoreDone.includes(0))return false;
        for(let i=0;i<4;i++)for(let k=0;k<2;k++){
          game.shoreDone=[];game.location=shoreStories()[i].port;takeShore(2*i+k);closeInfo();
          game=decodeSave(JSON.stringify(game));const p=shoreStories()[i].paths[k],before=game.credits;
          game.location=p[1];settleShore();if(game.credits!==before+p[2])return false;
        }
        game.shoreDone=[];game.location=6;takeShore(0);game.day=game.shoreJob.due+1;game.location=1;
        const before=game.credits;settleShore();return !game.shoreJob&&game.credits===before;
      }));
      await page.evaluate(()=>{
        closeInfo();game=fresh();game.tutorial=null;game.credits=600000;game.worlds[0].tech=7;
        game.location=0;game.cargo=game.cargo.map(()=>0);tab='store';render();
      });
      await page.locator('[data-action="ship-options"][data-id="11"]').click();
      await dialog.locator('[data-action="keep-hull"]').click();
      assert.ok(await page.evaluate(()=>ship().name==='Goliath'&&capacity()===120&&decodeSave(JSON.stringify(game)).ship===11));
      await page.evaluate(()=>{closeInfo();game.day=6;recordSighting('police',1);game.day=7;recordSighting('pirate',2);tab='news';render()});
      await page.locator('#screen [data-action="sighting-chart"][data-id="1"]').click();
      assert.equal(await page.evaluate(()=>chartMode), 'star');
      const marker=page.locator('.sc-port[data-id="1"] .sighting-mark');
      assert.match(await marker.getAttribute('title'),/1 day ago/);
      await page.locator('.sc-port[data-id="1"]').click();
      await dialog.locator('[data-action="sighting-news"]').click();
      assert.match(await dialog.innerText(),/Customs patrol reported/);
      await page.evaluate(()=>{closeInfo();game.day=11;render()});
      assert.equal(await marker.count(),0);
      assert.equal(await page.locator('.sc-port[data-id="2"] .sighting-mark').count(),1);
      assert.ok(await page.evaluate(()=>{
        game.crew=[{id:'wren',beat:2,jumps:33,loyalty:60}];game.pendingBeat=null;
        payCrew();applyBeat(0);const m=game.crew[0];if(!crewChapter(m).text.includes('paper lifeboat'))return false;
        m.jumps=47;payCrew();applyBeat(0);return m.beat===4;
      }));
      await page.evaluate(()=>{
        game.crew=[];game.credits=100000;game.contracts=[];game.takenOffers=[];
        const job=bulkOffer()[0];job.rerouteEligible=true;
        game.contracts=[job];game.location=job.to;dock();tab='jobs';render();
      });
      await page.locator('[data-action="freight-divert"]').click();
      assert.ok(await page.evaluate(()=>{
        const job=decodeSave(JSON.stringify(game)).contracts[0];if(job.disruption||job.rerouteEligible||job.to===game.location)return false;
        const before=game.credits;game.location=job.to;dock();dock();return game.credits-before===job.reward&&game.contracts.length===0;
      }));
      await page.evaluate(()=>{
        game.takenOffers=[];const job=bulkOffer()[0];job.rerouteEligible=true;
        game.contracts=[job];game.location=job.to;dock();tab='jobs';render();
      });
      const expected=await page.evaluate(()=>game.credits+game.contracts[0].reward-Math.ceil(game.contracts[0].reward*.12));
      await page.locator('[data-action="freight-lighter"]').click();
      assert.equal(await page.evaluate(()=>game.credits),expected);
      await page.close();
    }
  } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
