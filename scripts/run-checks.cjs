const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);
assert.ok(fs.readFileSync('SpaceTrader-browser.html').equals(fs.readFileSync('docs/SpaceTrader-browser.html')),'Root and Pages games differ. Run npm run sync.');
const commands=[['browser-preview/sim-review.cjs','SpaceTrader-browser.html','browser-preview/review-after.json'],...['review-fixes','clicks','logic','community','world-bank','solar','review','planets','events','warp','crew','rival','requests','help','firstrun','incidents'].map(name=>['browser-preview/check-'+name+'.cjs'])];
for(const args of commands){const result=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
console.log('All package checks passed. Full Chrome/device layout remains unverified.');
