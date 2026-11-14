const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1],nodes={};let canvases=0;
const document={createElement:()=>{canvases++;return createCanvas(160,160)},getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false}),querySelectorAll:()=>[],addEventListener(){}};
const c=vm.createContext({document,Math,Number,String,Array,JSON,confirm:()=>true,localStorage:{getItem:()=>null,setItem(){}}});vm.runInContext(script,c);vm.runInContext('{const _f=fresh;fresh=(...a)=>{const s=_f(...a);s.cargo[0]=0;s.paid[0]=0;s.tutorial=null;return s};game=fresh()}',c);const r=s=>vm.runInContext(s,c);
assert.equal(r('PLANET_SPINS.length'),24);assert.equal(r('new Set(PLANET_SPINS.map(p=>p[0])).size'),24);assert.equal(r('new Set(PLANET_SPINS.map(p=>p[1])).size'),24);assert.equal(r('new Set(PLANET_SPINS.map((_,id)=>planetSpinSeconds(id))).size'),24);
assert.equal(r('new Set(Array.from({length:24},(_,id)=>planetSurface(planetKind(id),id))).size'),24);
assert.equal(r('new Set(Array.from({length:24},(_,id)=>planetShade(id))).size'),24);
for(let id=0;id<24;id++){
 const lights=r('planetLightSources('+id+')');assert.equal(lights.length,id>=8&&id<16?2:1);assert.ok(Math.abs(lights.reduce((sum,s)=>sum+s.weight,0)-1)<1e-9);for(const s of lights)assert.ok(Math.abs(Math.hypot(s.x,s.y,s.z)-1)<1e-9);
 c.worldId=id;const result=r(`(()=>{const lights=planetLightSources(worldId),dx=lights.reduce((n,s)=>n+s.x*s.weight,0),dy=lights.reduce((n,s)=>n+s.y*s.weight,0),d=Math.hypot(dx,dy),x=dx/d*.97,y=dy/d*.97,z=Math.sqrt(1-.97*.97);return [planetLightAt(lights,x,y,z),planetLightAt(lights,-x,-y,z)]})()`);assert.ok(result[0]>result[1]+.05,'Sun-facing rim must be brighter on world '+id);
 const art=r('planetArtwork('+id+')');assert.match(art,/class="axial-surface"/);assert.match(art,/class="sun-shadow"/);assert.equal(art.includes('animation-direction:reverse'),r('PLANET_SPINS['+id+'][1]>90'));
 assert.match(r('planetPreview('+id+')'),/spinning-preview/);assert.match(r('planetSpinFacts('+id+')'),/Axial tilt/);
}
const before=canvases,state=r('JSON.stringify(game)');r('for(let i=0;i<100;i++)planetArtwork(i%24)');assert.equal(canvases,before,'Repeated globe renders should reuse cached textures and lighting');assert.equal(r('JSON.stringify(game)'),state);
const ids=[...nodes.screen.innerHTML.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Map and preview must not share SVG definition IDs');
assert.match(html,/@media\(prefers-reduced-motion:reduce\)/);
console.log('PASS: 24 unique appearances, periods, visual speeds and tilts; retrograde worlds; star-facing day/night light; both binary stars; distinct SVG IDs; cached assets; unchanged game state. Full browser animation/device testing remains pending.');
