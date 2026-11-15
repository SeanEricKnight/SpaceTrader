const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes={},events={},storage=new Map();
const document={createElement:t=>t==='canvas'?createCanvas(160,160):{click(){}},getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',value:'',textContent:'',open:false,focus(){},showModal(){this.open=true},close(){this.open=false}}),querySelectorAll:()=>[],addEventListener:(t,cb)=>(events[t]??=[]).push(cb)};
const c=vm.createContext({console,document,Math,Number,String,Array,JSON,Blob,confirm:()=>true,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}});
vm.runInContext(script,c);vm.runInContext('{const _f=fresh;fresh=(...a)=>{const s=_f(...a);s.cargo[0]=0;s.paid[0]=0;s.tutorial=null;return s};game=fresh()}',c);const r=s=>vm.runInContext(s,c);let checks=0;
function test(name,f){storage.clear();r('game=fresh();message="";sector=0;selectedWorld=1;tab="galaxy";bankShip=null');for(const n of Object.values(nodes))n.open=false;f();checks++;console.log('PASS',name)}
test('five strictly increasing, disclosed rates accrue exactly once on travel',()=>{
 for(const [difficulty,rate]of Object.entries({Beginner:.5,Easy:1,Normal:1.5,Hard:2,Impossible:3})){
  r('game=fresh('+JSON.stringify(difficulty)+');borrowCredits(1001);openBank()');assert.match(nodes['bank-body'].innerHTML,new RegExp(rate+'%'));
  assert.equal(r('interestDue()'),Math.ceil(1001*rate/100));const before=r('game.debt');r('jump(1)');assert.equal(r('game.debt'),before+Math.ceil(before*rate/100));
  const after=r('game.debt');r('jump(1);jump(23);render();refuel();tab="news";render()');assert.equal(r('game.debt'),after);
 }
});
test('loans allow partial borrowing and repayment without advancing time',()=>{
 assert.equal(r('borrowCredits(1000)'),true);assert.equal(r('borrowCredits(1250)'),true);assert.equal(r('game.debt'),2250);assert.equal(r('game.credits'),3250);
 assert.equal(r('repayCredits(250)'),true);assert.equal(r('game.debt'),2000);assert.equal(r('interestDue()'),30);assert.equal(r('game.day'),1);
 r('repayCredits(2000)');assert.equal(r('game.debt'),0);assert.equal(r('interestDue()'),0);assert.equal(r('game.credits'),1000);
});
test('credit limit counts existing debt and interest; repayment frees credit',()=>{
 r('borrowCredits(24000);borrowCredits(1000)');assert.equal(r('creditAvailable()'),0);assert.equal(r('borrowCredits(1)'),false);
 r('jump(1)');assert.equal(r('game.debt'),25375);assert.equal(r('creditAvailable()'),0);assert.equal(r('borrowCredits(1)'),false);
 r('repayCredits(1375)');assert.equal(r('game.debt'),24000);assert.equal(r('creditAvailable()'),1000);assert.equal(r('borrowCredits(1000)'),true);
});
test('invalid, fractional, excessive and unaffordable transactions are rejected',()=>{
 for(const amount of ['-1','0','.5','25001','NaN','Infinity','Number.MAX_SAFE_INTEGER'])assert.equal(r('borrowCredits('+amount+')'),false);
 r('borrowCredits(2000)');const before=r('JSON.stringify([game.credits,game.debt])');
 for(const amount of ['-1','0','.5','2001','NaN','Infinity'])assert.equal(r('repayCredits('+amount+')'),false);
 r('game.credits=10');assert.equal(r('repayCredits(11)'),false);r('game.credits=3000');assert.equal(r('JSON.stringify([game.credits,game.debt])'),before);
});
test('bank transactions are unavailable during encounters, destruction or retirement',()=>{
 for(const condition of ['game.encounter={hull:30}','game.hull=0','game.retired=true']){
  r('game=fresh();borrowCredits(1000);'+condition);assert.equal(r('borrowCredits(1)'),false);assert.equal(r('repayCredits(1)'),false);
 }
});
test('ship finance is a reviewed exact shortfall, with no loan until confirmed',()=>{
 r('action("finance",2)');assert.equal(nodes['bank-dialog'].open,true);assert.equal(r('game.debt'),0);assert.equal(r('game.ship'),1);
 assert.match(nodes['bank-body'].innerHTML,/Finance a Firefly/);assert.match(nodes['bank-body'].innerHTML,/₡16,500/);assert.match(nodes['bank-body'].innerHTML,/₡248/);
 r('action("finance-confirm")');assert.equal(r('game.ship'),2);assert.equal(r('game.debt'),16500);assert.equal(r('game.credits'),0);assert.equal(r('game.fuel'),17);assert.equal(r('game.hull'),100);assert.equal(nodes['bank-dialog'].open,false);assert.equal(r('tab'),'ship');
 r('action("finance-confirm")');assert.equal(r('game.debt'),16500);assert.equal(r('game.day'),1);
});
test('financing includes existing debt and current cash; over-limit purchase cannot partially borrow',()=>{
 r('borrowCredits(1000);game.credits=500;action("finance",2);action("finance-confirm")');assert.equal(r('game.ship'),2);assert.equal(r('game.debt'),18000);
 r('game=fresh();game.debt=10000;game.credits=0;action("finance",2);action("finance-confirm")');assert.equal(r('game.debt'),10000);assert.equal(r('game.credits'),0);assert.equal(r('game.ship'),1);
});
test('ship finance respects technology, cargo, equipment and docking restrictions',()=>{
 for(const setup of ['world().tech=4','game.cargo[0]=21','game.encounter={hull:30}','game.retired=true','game.ship=9;game.hull=200;game.modules=["cargo","navigation"];game.credits=0']){
  r('game=fresh();'+setup);const before=r('JSON.stringify([game.ship,game.debt,game.credits])');r('action("finance",2);action("finance-confirm")');assert.equal(r('JSON.stringify([game.ship,game.debt,game.credits])'),before);
 }
});
test('bank input event quotes a valid amount; transaction handlers apply it',()=>{
 r('action("bank")');nodes['bank-amount'].value='5000';events.input[0]({target:{id:'bank-amount'}});assert.equal(nodes['bank-borrow-button'].disabled,false);assert.match(nodes['borrow-preview'].innerHTML,/₡75/);
 r('action("bank-borrow")');assert.equal(r('game.debt'),5000);document.getElementById('repay-amount').value='1234';r('action("bank-repay")');assert.equal(r('game.debt'),3766);assert.equal(r('game.credits'),4766);
 r('action("bank-repay-all")');assert.equal(r('game.debt'),0);assert.equal(r('game.credits'),1000);
 nodes['bank-amount'].value='-50';r('previewBorrow();action("bank-borrow")');assert.equal(r('game.debt'),0);assert.match(nodes['bank-status'].textContent,/No transaction/);
});
test('refueling is offered on all six screens when needed, and the bank is offered when cash is short',()=>{
 for(const tab of ['galaxy','market','jobs','ship','commander','news']){
  r('tab='+JSON.stringify(tab)+';game.fuel=5;game.credits=1000;render()');assert.match(nodes['port-services'].innerHTML,/Refuel \+9 · ₡18/);assert.doesNotMatch(nodes['port-services'].innerHTML,/data-action="bank"/);
 }
 const day=r('game.day');r('action("refuel")');assert.equal(r('game.fuel'),14);assert.equal(r('game.credits'),982);assert.equal(r('game.day'),day);
 r('game.fuel=0;game.credits=3;render()');assert.match(nodes['port-services'].innerHTML,/Refuel \+1 · ₡2/);assert.match(nodes['port-services'].innerHTML,/data-action="bank"/);r('action("refuel")');assert.equal(r('game.fuel'),1);assert.equal(r('game.credits'),1);
});
test('regions have distinct stars, orbit coordinates, planet orders, resources and risk',()=>{
 const layouts=[],stars=['HEARTH','THE SISTERS','CINDER'];
 for(let i=0;i<3;i++){r('sector='+i+';selectedWorld='+i*8+';render()');layouts.push(r('JSON.stringify(Array.from({length:8},(_,i)=>planetPoint(i)))'));assert.match(nodes.screen.innerHTML,new RegExp(stars[i]));assert.equal((nodes.screen.innerHTML.match(/class="planet-node /g)||[]).length,8);assert.match(r('helpHtml("travel")'),/Three Reaches/);assert.equal(r('game.location'),0)}
 assert.equal(new Set(layouts).size,3);assert.equal(r('regionalRisk(0)'),13);assert.equal(r('regionalRisk(8)'),20);assert.equal(r('regionalRisk(16)'),27);
 assert.notEqual(r('PLANET_LORE.slice(0,8).map(x=>x[0]).join()'),r('PLANET_LORE.slice(8,16).map(x=>x[0]).join()'));
});
test('all 24 planets have unique histories and supply explanations tied to price data',()=>{
 assert.equal(r('new Set(PLANET_LORE.map(p=>p[4])).size'),24);
 for(let i=0;i<24;i++){assert.ok(r('worldHistory('+i+').includes(PLANET_LORE['+i+'][4])'));assert.equal(r('game.worlds['+i+'].resource'),r('PLANET_LORE['+i+'][2]'));assert.equal(r('game.worlds['+i+'].crisis'),r('PLANET_LORE['+i+'][3]'))}
 assert.match(r('marketContext(1)'),/Drought triples water/);assert.match(r('marketContext(6)'),/outbreak doubles medicine/);
});
test('relief changes the outbreak, prices, recorded market and news exactly once',()=>{
 const medicine=r('game.worlds[6].prices[6]');r('beginStory();game.location=6;dock()');assert.equal(r('game.worlds[6].crisis'),0);assert.equal(r('game.worlds[6].prices[6]'),Math.floor(medicine/2));assert.equal(r('game.memory[6].prices[6]'),Math.floor(medicine/2));assert.match(r('communityNews()[0]'),/premium eases/);assert.match(r('worldHistory(6)'),/reopened/);
 r('dock();dock()');assert.equal(r('game.worlds[6].prices[6]'),Math.floor(medicine/2));r('game=decodeSave(JSON.stringify(game))');assert.equal(r('game.story.clinicRelief'),true);
});
test('news follows story progress and contains six connected original characters',()=>{
 r('tab="news";render()');assert.match(nodes.screen.innerHTML,/The Reach News/);assert.equal((nodes.screen.innerHTML.match(/class="person-card"/g)||[]).length,6);assert.match(nodes.screen.innerHTML,/relay lattice failed/);
 r('beginStory()');assert.match(r('communityNews()[0]'),/leaves Acamar/);r('game.location=6;dock();game.location=7;dock()');assert.match(r('communityNews()[0]'),/data recovered/);r('completeStory(1200)');assert.match(r('communityNews()[0]'),/crew home/);
});
test('old saves retain location, inventory, debt, prices and active missions',()=>{
 const raw=fs.readFileSync('browser-preview/fixtures/pre-world-bank-save.json','utf8');c.oldSave=raw;r('game=decodeSave(oldSave)');assert.equal(r('game.location'),8);assert.equal(r('game.debt'),999);assert.equal(r('game.credits'),4321);assert.equal(r('JSON.stringify(game.worlds)'),JSON.stringify(JSON.parse(raw).worlds));assert.equal(r('game.contracts.length'),1);assert.equal(r('level().interest'),1.5);
});
test('bank balances and difficulty round trip through validated saves',()=>{
 r('game=fresh("Hard");borrowCredits(12345);jump(1);save()');const raw=storage.get('space-trader-chrome-preview-v1');c.saved=raw;r('game=decodeSave(saved)');assert.equal(r('game.debt'),12592);assert.equal(r('game.difficulty'),'Hard');assert.equal(r('creditAvailable()'),12408);assert.equal(r('interestDue()'),252);
});
assert.ok(Buffer.byteLength(html)<900000);assert.equal((html.match(/data:image\/webp;base64,/g)||[]).length,1);
console.log(checks+' world/bank checks passed. Tested JS, generated markup and canvas; full Chrome layout is not verified.');
