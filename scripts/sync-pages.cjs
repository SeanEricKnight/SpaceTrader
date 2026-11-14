const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
fs.copyFileSync(path.join(root,'SpaceTrader-browser.html'),path.join(root,'docs','SpaceTrader-browser.html'));
if(fs.existsSync(path.join(root,'portraits')))fs.cpSync(path.join(root,'portraits'),path.join(root,'docs','portraits'),{recursive:true});
console.log('Updated docs/SpaceTrader-browser.html from the root game.');
