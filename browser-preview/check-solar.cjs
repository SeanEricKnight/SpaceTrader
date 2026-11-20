const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const textures=[],surfaces=[],nodes={},events={};
const document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:i=>{if(i.data.length===160*160*4)textures.push(Buffer.from(i.data));else if(i.data.length===256*128*4)surfaces.push(Buffer.from(i.data))}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={textContent:'',innerHTML:'',hidden:false,open:false,focus(){},showModal(){this.open=true},close(){this.open=false}}),querySelectorAll:()=>[],addEventListener:(e,cb)=>(events[e]||=[]).push(cb)};
const c=vm.createContext({document,Math,Number,String,Array,JSON,confirm:()=>true,localStorage:{getItem:()=>null,setItem:()=>{}}});vm.runInContext(script,c);const run=s=>vm.runInContext(s,c);
assert.equal(run('tab'),'galaxy');assert.equal((nodes.screen.innerHTML.match(/class="orbit-line /g)||[]).length,8);assert.equal((nodes.screen.innerHTML.match(/class="planet-node /g)||[]).length,8);assert.match(nodes.screen.innerHTML,/sunBall/);assert.match(nodes.screen.innerHTML,/Selected destination/);assert.doesNotMatch(nodes.screen.innerHTML,/Your vessel/);
run('action("select",5)');assert.equal(run('selectedWorld'),5);assert.equal(run('game.location'),0);assert.match(nodes.screen.innerHTML,/Balosnee/);
run('action("sector",2)');assert.equal(run('sector'),2);assert.equal(run('selectedWorld'),16);assert.equal(run('game.location'),0);
run('action("locate")');assert.equal(run('sector'),0);assert.equal(run('selectedWorld'),0);
run('action("select",1);action("jump",1)');assert.equal(run('game.location'),1);assert.equal(run('selectedWorld'),1);assert.equal(run('tab'),'galaxy');
run('runCheat("warp Devidia")');assert.equal(run('sector'),2);assert.equal(run('selectedWorld'),22);
run('tab="store";render()');assert.equal((nodes.screen.innerHTML.match(/<article class="ship-card /g)||[]).length,12);assert.ok(!nodes.screen.innerHTML.includes('▲'));
assert.ok(surfaces.length>=16);assert.ok(surfaces.every(s=>s[3]===255));assert.equal(new Set(surfaces.map(s=>s.toString("base64"))).size,surfaces.length);for(let i=0;i<textures.length;i++){assert.equal(textures[i][3],0);assert.ok(textures[i][(80*160+80)*4+3]>240);fs.writeFileSync('browser-preview/assets/planet-'+i+'.rgba',textures[i]);}
assert.ok(html.length<2000000);assert.equal((html.match(/data:image\/webp;base64,/g)||[]).length,1);
console.log('PASS: solar chart opens first; eight orbital paths and textured planets; selection, sectors, locate, travel and warp; twelve illustrated ship cards and embedded artwork.');
