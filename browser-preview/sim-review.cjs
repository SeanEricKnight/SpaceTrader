const fs=require('node:fs'),vm=require('node:vm');
const input=process.argv[2]||'SpaceTrader-browser.html';
const src=fs.readFileSync(input,'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes={},document={createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}}),toDataURL:()=>''}),getElementById:id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',focus(){}}),querySelectorAll:()=>[],addEventListener(){}};
const c=vm.createContext({Math,Number,String,Array,JSON,document,confirm:()=>true,localStorage:{getItem:()=>null,setItem(){}}});
vm.runInContext(src,c);vm.runInContext(`render=()=>{};
function auditWorld(){game=fresh();const techs=Array(8).fill(0);game.worlds.forEach(w=>techs[w.tech]++);return {techs,tech3plus:game.worlds.filter(w=>w.tech>=3).length,strict:game.worlds.filter(w=>w.strict).length,goods:catalog.goods.map((g,i)=>({name:g.name,buyable:game.worlds.some(w=>w.tech>=g.production&&!(w.strict&&(i===5||i===8)))})),ships:catalog.ships.map(s=>({name:s.name,buyable:game.worlds.some(w=>w.tech>=s.tech)}))}}
function fightMatrix(){const rows=[];for(const difficulty of Object.keys(levels))for(const loadout of ['starter','laser3','shield']){let wins=0,repair=0,rewards=0,rounds=0;game=fresh(difficulty);if(loadout==='laser3')game.laser=3;if(loadout==='shield'){game.ship=2;game.modules=['shield']}for(let i=0;i<3000;i++){game.seed=Math.imul(i+1,2654435761)>>>0;game.credits=1000;game.hull=100;
 game.encounter=typeof makeEncounter==='function'?makeEncounter():{hull:level().enemy+rng(level().enemyRange)};
 for(let t=0;t<50&&game.encounter&&game.hull>0;t++){resolve('fight');rounds++}
 if(game.hull){wins++;repair+=(100-game.hull)*level().repair;rewards+=game.credits-1000}}
 rows.push({difficulty,loadout,winPct:+(wins/30).toFixed(1),repairPerWin:Math.round(repair/Math.max(1,wins)),rewardPerWin:Math.round(rewards/Math.max(1,wins)),rounds:+(rounds/3000).toFixed(1)})}return rows}
function tradeBot({shipId=1,credits=1000,days=120,contracts=false,seed=57}={}){game=fresh();game.seed=seed;game.ship=shipId;game.hull=ship().hull;game.fuel=ship().range;game.credits=credits;game.peace=true;const routes={},goods={},daily=[];let peak=0,jobPay=0;
 for(let turn=0;turn<days;turn++){
  refuel();repair();if(game.fuel<9)break;
  let best=null;for(let to=0;to<24;to++){const dest=game.worlds[to],d=distance(to);if(to===game.location||d>game.fuel)continue;
   if(contracts){const js=offers().filter(j=>j.to===to);const score=js.reduce((n,j)=>n+j.reward,0);if(!best||score>best.score)best={to,good:null,score}}
   else for(let good=0;good<10;good++){const g=catalog.goods[good];if(prohibited(good)||world().tech<g.production||dest.tech<g.usage||dest.strict&&(good===5||good===8))continue;const qty=tradeLimit(good,true),score=qty*(sellPrice(good,dest)-world().prices[good])-d*fuelRate();if(qty&&(!best||score>best.score))best={to,good,score};}
  }
  if(!best)break;const from=game.location,beforeProfit=game.metrics.profit;
  if(contracts){for(let k=0;k<3;k++){const ix=offers().findIndex(j=>j.to===best.to);if(ix<0)break;acceptOffer(ix)}}else buy(best.good,true);
  const balance=game.credits;jump(best.to);if(game.location!==best.to)break;jobPay+=game.credits-balance;
  if(!contracts){sell(best.good,true);const profit=game.metrics.profit-beforeProfit,key=from+'→'+best.to+' / '+catalog.goods[best.good].name;routes[key]=(routes[key]||0)+profit;goods[catalog.goods[best.good].name]=(goods[catalog.goods[best.good].name]||0)+profit}
  daily.push(game.credits);peak=Math.max(peak,game.credits);
 }
 const total=game.metrics.profit,rank=Object.entries(routes).sort((a,b)=>b[1]-a[1]);return {ship:ship().name,start:credits,days:daily.length,credits:game.credits,tradeProfit:total,jobPay,topRoute:rank[0],topRoutePct:total?+(100*(rank[0]?.[1]||0)/total).toFixed(1):0,routeCount:rank.length,goods,creditsAt30:daily[29],creditsAt60:daily[59],creditsAt120:daily[119]};
}
`,c);
const result=vm.runInContext(`({world:auditWorld(),combat:fightMatrix(),trade:[tradeBot(),tradeBot({contracts:true}),...[1,2,4,5].map(shipId=>tradeBot({shipId,credits:250000}))]})`,c);
result.buildSha256=require('node:crypto').createHash('sha256').update(fs.readFileSync(input)).digest('hex');
const json=JSON.stringify(result,null,2);if(process.argv[3]){fs.writeFileSync(process.argv[3],json+'\n');console.log('Saved simulation results to '+process.argv[3]);}else console.log(json);
