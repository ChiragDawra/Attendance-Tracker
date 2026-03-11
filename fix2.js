const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace('style={{width: \\`\\${perc}%\\`}}', 'style={{width: `${perc}%`}}');
fs.writeFileSync('src/App.jsx', code);
console.log("Fixed style width!");
