const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
function context(blocked=false){const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);return{run:s=>vm.runInContext(s,c),nodes}}
let t=context(),r=s=>t.run(s);
// Leaderboard (rival race removed in 0.26.12): no race UI, retired careers rank, cheats excluded, old rival saves load.
const html2=fs.readFileSync('SpaceTrader-browser.html','utf8');assert.ok(!html2.includes('race-rival'),'no rival option');assert.equal(r('typeof makeRival'),'undefined');
r('game=fresh("Normal");game.day=50;game.credits=500000;game.debt=0;game.location=1;action("moon-buy")');assert.equal(r('game.moons.length'),1);assert.doesNotMatch(r('retireScreen()'),/rival|Gold Seal/i);
let b=JSON.parse(storage.get('space-trader-leaderboard-v1'));assert.equal(b.length,1);assert.ok(b[0].score>0);assert.equal(b[0].race,undefined);
r('game=fresh("Hard");game.day=70;game.credits=500000;game.debt=0;game.location=1;action("moon-buy")');b=JSON.parse(storage.get('space-trader-leaderboard-v1'));assert.equal(b.length,2);assert.ok(b[0].score>=b[1].score,'sorted by score');
r('game=fresh("Normal");game.cheatsUsed=true;game.day=10;game.credits=500000;game.debt=0;game.location=1;action("moon-buy")');assert.equal(JSON.parse(storage.get('space-trader-leaderboard-v1')).length,2,'cheated run not ranked');
const old=r('(()=>{const s=JSON.parse(JSON.stringify(fresh("Normal")));s.rival={name:"Marta Voss",retireDay:100};return normalizeSave(s)??s})()');assert.equal(old.rival,undefined,'old rival field dropped');
r('game=fresh("Normal")');assert.doesNotThrow(()=>r('render()'));assert.doesNotMatch(r('goalPanel()'),/Race vs/);
console.log('PASS: rival race removed; leaderboard ranks retired careers, excludes cheats, and old rival saves load.');
