const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,dataset:{},classList:{toggle(){}},showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
// First-run on phone: Start flying must run the step-1 hint, the dock button must show, intro must be one-time.
const g=r;
assert.equal(g("guideOn()"),true,'guide is on for a fresh run');
assert.ok(t.nodes['info-body'].innerHTML.includes('data-action="intro-go"'),'intro offers Start flying as intro-go');
assert.ok(!t.nodes['info-body'].innerHTML.includes('data-action="info-close">Start flying'),'old info-close Start flying is gone');
g("action('intro-go')");
assert.equal(t.nodes['info-dialog'].open,false,'intro dialog closed');
assert.equal(g('hintFollow'),true,'hint follow is on so the next button glows and scrolls into view');
assert.equal(t.nodes['dock-hint'].hidden,false,'dock hint visible while the guide is on');
assert.match(t.nodes['dock-hint'].textContent,/Travel to Adahn.*9 fuel/,'dock shows the first action without a second hint tap');
g("message='';render()");assert.equal(t.nodes['message'].textContent,'','duplicate goal line is blank while the guide is on');
assert.ok(t.nodes['guide-bar'].innerHTML.includes('Step 1'),'guide bar shows step 1');
g("selectedWorld=game.location;action('guide-skip');message='';render()");
assert.equal(t.nodes['dock-hint'].hidden,true,'dock hint hides when guide is skipped');
assert.ok(t.nodes['message'].textContent.includes('500,000'),'goal line returns when guide is off');
assert.ok(t.nodes['message'].innerHTML.includes('Next move')||g("goalBar()").includes('Next move'),'goal bar names a concrete next move after the guide');
assert.ok(g("goalBar()").includes('data-action="objective"'),'next move offers a Show button');
g("game.story.stage=2;game.location=0");assert.ok(g("goalBar()").includes('Brax'),'story stage 2 points to Brax');
g("game.story.stage=4");
const branch=context(true),run=branch.run;
run("action('intro-go'); tab='market'; sell(0,true); render()");
assert.equal(run('game.tutorial.state'),'skipped','selling starter Water in Acamar forfeits the bonus');
assert.equal(run('guideSt().step'),1,'the guide continues to speculative trading');
run('buy(0,true); render()');
assert.equal(run('guideSt().step'),2,'newly bought Water advances the trading guide');
console.log('PASS first run: Start flying runs the hint, dock button tracks the guide, duplicate goal line hidden');
// Market order (playtest 0.24.10 item 3): trade rows come before home/warehouse panel, price legend and history.
{const html=fs.readFileSync('SpaceTrader-browser.html','utf8'),m=html.match(/holdMeter\(travelBar\(\)\)\+[\s\S]*?<p class="micro">'\+tipBtn\('prices'\)/)[0];
const at=k=>m.indexOf(k);
assert.ok(at("trade-list")>0&&at("trade-list")<at("homePanel()")&&at("trade-list")<at("legend+worldHistory")&&at("tools+")<at("trade-list"),'Market shows trade rows before home panel, legend and history');
console.log('PASS market order: trade rows before home panel, legend and history');}
// Footer difficulty: cancelling "Start new game" must keep the player's pick (playtest 0.24.10 item 5).
{const c=context(),q=c.run;q("action('intro-go')");
q("$('difficulty').value='Hard';diffPick='Hard';confirm=()=>false;action('newdifficulty')");
assert.equal(q("$('difficulty').value"),'Hard','cancelling a new game keeps the chosen difficulty');
assert.equal(q('game.difficulty'),'Normal','cancel leaves the current game alone');
q("render()");assert.equal(q("$('difficulty').value"),'Hard','a later render keeps the pending pick');
assert.ok(q("$('difficulty-info').textContent").includes('Click Start new game'),'info still says what Start will do');
q("confirm=()=>true;action('newdifficulty')");
assert.equal(q('game.difficulty'),'Hard','confirming starts the chosen difficulty');assert.equal(q("diffPick"),'','pending pick clears after a new game');
q("$('difficulty').value='Easy';diffPick='Easy';render();$('difficulty').value='Normal';diffPick='';render()");
assert.equal(q("$('difficulty').value"),'Hard','picking the current difficulty clears the pending pick');
console.log('PASS footer difficulty: cancel keeps the pick, confirm clears it');}
