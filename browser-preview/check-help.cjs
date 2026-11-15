// Help Center, tappable terms and paper chip (0.18.0). Engine level, Node vm.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('SpaceTrader-browser.html','utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
const storage=new Map();
const nodes={};const c=vm.createContext({console,Math,Number,Array,String,JSON,confirm:()=>true,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{storage.set(k,v)}},document:{createElement:()=>({width:0,height:0,getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:()=>{}}),toDataURL:()=>"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC3sAAAAASUVORK5CYII="}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',hidden:false,open:false,scrollTop:0,showModal(){this.open=true},close(){this.open=false},focus(){}}),querySelectorAll:()=>[],addEventListener:()=>{}}});vm.runInContext(script,c);
const r=s=>vm.runInContext(s,c);let n=0;const ok=m=>console.log('PASS '+m+' (#'+(++n)+')');
r('game.tutorial=null');
const home=r('helpHtml("home")');assert.ok(home.includes('All topics')&&!home.includes('<details'));ok('help home lists topics with no inline accordions');
for(const id of r('HELP_ORDER')){const h=r('helpHtml('+JSON.stringify(id)+')');assert.ok(h.includes('data-id="home"'),id+' has a Back button');assert.ok(h.includes('help-rel'),id+' has related topics');assert.ok(r('HELP['+JSON.stringify(id)+'].b().length')>150,id+' has real content')}
ok('every topic has a Back button, related links and content');
for(const id of r('HELP_ORDER'))for(const m of r('helpHtml('+JSON.stringify(id)+')').matchAll(/data-action="help" data-id="([a-z]+)"/g))assert.ok(m[1]==='home'||r('!!HELP["'+m[1]+'"]'),'link target '+m[1]);
ok('all help links point at real topics');
r('action("help","pirates")');assert.ok(r('$("info-body").innerHTML').includes('Pirates and safety'));assert.equal(r('$("info-dialog").open'),true);ok('action help opens a topic in the same dialog');
r('action("howto")');assert.ok(r('$("info-body").innerHTML').includes('All topics'));ok('Help button opens the home page');
assert.ok(html.includes('id="help-fab"')&&/#help-fab\{position:fixed;right:12px;top:10px/.test(html));ok('Help button is fixed at the top right');
// paper chip
r('game.paper={day:1,items:[],sub:null}');assert.equal(r('paperChip()'),'');ok('no chip before any subscription');
r('game.day=5;game.paper.sub=14');assert.equal(r('paperChip()'),'');ok('no chip when plenty of days remain');
r('game.paper.sub=6');assert.ok(r('paperChip()').includes('2 days left')&&r('paperChip()').includes('Renew'));ok('chip appears when 2 days remain');
r('game.paper.sub=4');assert.ok(r('paperChip()').includes('Paper ended'));ok('chip says ended just after expiry');
r('game.paper.sub=-20');assert.equal(r('paperChip()'),'');ok('chip stops nagging a few days after expiry');
console.log('All help checks passed.');
