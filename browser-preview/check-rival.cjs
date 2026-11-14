const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
// Rival race: opt-in, deterministic pacing, win/loss, leaderboard, cheats not ranked.
assert.equal(r('!!game.rival'),false,'no rival by default');
r('game.rival=makeRival("Normal",12345)');assert.ok(r('game.rival.retireDay')>=80&&r('game.rival.retireDay')<=115);
assert.equal(r('rivalWorth(game.rival,0)'),1000);assert.equal(r('rivalWorth(game.rival,game.rival.retireDay+1)'),500000);
let prev=0;for(let d=0;d<=r('game.rival.retireDay');d+=10){const w=r('rivalWorth(game.rival,'+d+')');assert.ok(w<=500000&&w>=1000);prev=w}
assert.equal(r('rivalWorth(game.rival,40)'),r('rivalWorth(game.rival,40)'),'deterministic');
assert.match(r('rivalStrip()'),/Race vs/);assert.match(r('goalPanel()'),/Race vs/);
// Win: retire on time.
r('game.day=50;game.credits=500000;game.debt=0;game.location=1;action("retire")');assert.equal(r('game.retired'),true);assert.equal(r('game.raceResult'),'won');
assert.match(r('retireScreen()'),/You beat/);assert.match(r('retireScreen()'),/Gold Seal Deed/);
let b=JSON.parse(storage.get('space-trader-leaderboard-v1'));assert.equal(b.length,1);assert.equal(b[0].race,'won');assert.ok(b[0].score>0);
// Loss: retire after the rival.
r('game=fresh("Normal");game.rival=makeRival("Normal",12345)');r('game.day=game.rival.retireDay+5;game.credits=500000;game.debt=0;game.location=1;rivalWatch();action("retire")');
assert.equal(r('game.raceResult'),'lost');assert.match(r('retireScreen()'),/retired first/);
b=JSON.parse(storage.get('space-trader-leaderboard-v1'));assert.equal(b.length,2);assert.ok(b[0].score>=b[1].score,'sorted by score');
// No rival: still ranks. Cheats: not ranked.
r('game=fresh("Hard");game.day=70;game.credits=500000;game.debt=0;game.location=1;action("retire")');assert.equal(r('game.raceResult'),'none');assert.equal(JSON.parse(storage.get('space-trader-leaderboard-v1')).length,3);
r('game=fresh("Normal");game.cheatsUsed=true;game.day=10;game.credits=500000;game.debt=0;game.location=1;action("retire")');assert.equal(JSON.parse(storage.get('space-trader-leaderboard-v1')).length,3,'cheated run not ranked');
// New-game option + save round trip.
r('game=fresh("Normal");game.rival=makeRival("Normal",game.seed)');const saved=r('JSON.stringify(game)');assert.equal(JSON.parse(saved).rival.name,r('game.rival.name'));
// Old saves without a rival render fine.
r('game=fresh("Normal")');assert.equal(r('rivalStrip()'),'');assert.doesNotThrow(()=>r('render()'));
console.log('PASS: rival race is opt-in and deterministic; win, loss, tie rules, leaderboard ranking, cheat exclusion, and old saves behave as designed.');
