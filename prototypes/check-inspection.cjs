const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
(async () => {
 const browser = await chromium.launch();
 try {
  for (const viewport of [{width:390,height:844},{width:1440,height:900}]) {
   for (const mode of ['static','animated']) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(pathToFileURL(path.join(__dirname,'inspect-ship.html')).href+'?study=1&mode='+mode);
    await page.locator('#open-inspection').focus();
    await page.keyboard.press('Enter');
    const state = () => page.evaluate(() => window.inspectShipPrototype.getState());
    assert.equal((await state()).renderedProgress,1);
    assert.equal(await page.locator('[data-mode]:visible').count(),0);
    await page.screenshot({path:'firefly-'+viewport.width+'-'+mode+'.png'});
    for(const id of ['close-inspection','assembled','cutaway','separation']){
     const rect=await page.locator('#'+id).boundingBox();
     assert.ok(rect && rect.x>=0 && rect.y>=-1 && rect.y+rect.height<=viewport.height+1,id+' outside viewport '+JSON.stringify(rect));
    }
    const labels=page.locator('#part-list button');
    assert.equal(await labels.count(),6);
    for(const button of await labels.all()){
     assert.ok(await button.evaluate(b=>b.scrollWidth<=b.clientWidth+1),'label overflow');
     await button.focus();await page.keyboard.press('Enter');
     assert.equal(await button.getAttribute('aria-pressed'),'true');
    }
    await page.locator('#assembled').click();
    assert.equal((await state()).renderedProgress,0);
    await page.locator('#separation').focus();await page.keyboard.press('ArrowRight');
    assert.equal((await state()).renderedProgress,mode==='animated'?.01:0);
    await page.waitForTimeout(150);
    await page.mouse.move(100,150);await page.mouse.wheel(0,1500);
    await page.waitForFunction(()=>window.inspectShipPrototype.getState().progress>.99);
    await page.mouse.wheel(0,-1500);
    await page.waitForFunction(()=>window.inspectShipPrototype.getState().progress<.01);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('#separation').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
    assert.equal((await state()).renderedProgress,0);
    await page.locator('#cutaway').click();assert.equal((await state()).renderedProgress,1);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'open-inspection');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);await page.close();
    console.log('PASS',viewport,mode);
   }
  }
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
