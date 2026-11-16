import sys
from playwright.sync_api import sync_playwright
import os
path=sys.argv[1] if len(sys.argv)>1 else os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','SpaceTrader-browser.html'); vw=int(sys.argv[2]) if len(sys.argv)>2 else 390; vh=int(sys.argv[3]) if len(sys.argv)>3 else 844
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--disable-background-networking','--no-first-run'])
    pg=b.new_context(viewport={'width':vw,'height':vh}).new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+path);pg.wait_for_timeout(800)
    # click Start flying if intro open
    if pg.evaluate("document.getElementById('info-dialog').open"):
        pg.click('[data-action="intro-go"]');pg.wait_for_timeout(300)
    # buy Water, jump to tutorial destination
    pg.evaluate("()=>{game.cargo[0]=5;game.paid[0]=100;game.credits=1000;render();jump(game.tutorial.to)}")
    pg.wait_for_timeout(300)
    # dismiss any travel scene button
    for sel in ['[data-action="scene-continue"]','#warp-scene button','button:has-text("Continue")']:
        if pg.locator(sel).count():
            pg.locator(sel).first.click();pg.wait_for_timeout(500);break
    pg.evaluate("()=>{tab='market';render()}");pg.wait_for_timeout(300)
    btn=pg.locator('button[data-action="sell-all"], button[data-action="sellall"], button:has-text("Sell all")').first
    print('sell btn count',pg.locator('button:has-text("Sell all")').count())
    btn.click();pg.wait_for_timeout(500)
    print('dlg open',pg.evaluate("document.getElementById('info-dialog').open"),'h2',pg.evaluate("document.querySelector('#info-body h2')&&document.querySelector('#info-body h2').textContent"))
    box=pg.evaluate("()=>{const r=document.querySelector('.info-x').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    print('x at',box,'hit',pg.evaluate("([x,y])=>{const e=document.elementFromPoint(x,y);return e.tagName+'.'+e.className}",box))
    pg.screenshot(path='/home/claude/tools/s_%dx%d.png'%(vw,vh))
    pg.evaluate("()=>{window.__ev=[];['pointerdown','pointerup','click'].forEach(t=>document.addEventListener(t,e=>__ev.push(t+':'+e.target.tagName+'.'+(e.target.className||'')+' detail='+e.detail),true));const oc=closeInfo;window.closeInfo=function(){__ev.push('closeInfo');return oc()};const oo=openInfo;window.openInfo=function(h){__ev.push('openInfo:'+h.slice(0,30));return oo(h)}}")
    pg.mouse.click(*box);pg.wait_for_timeout(600);print(pg.evaluate("__ev"))
    print('open after X',pg.evaluate("document.getElementById('info-dialog').open"),errs)
    b.close()
