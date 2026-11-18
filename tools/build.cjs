const fs=require('fs'),assert=require('assert/strict');
const source=['dist/futestuning-diagnostics.js','dist/futestuning-card.js','dist/otthon-card.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n;');
if(process.argv.includes('--check'))assert.equal(fs.readFileSync('dist/futestuning-dashboard.js','utf8'),source,'Run node tools/build.cjs');
else fs.writeFileSync('dist/futestuning-dashboard.js',source);
