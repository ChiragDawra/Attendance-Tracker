const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/\\\${/g, '${');
code = code.replace(/\\`/g, '`');
fs.writeFileSync('src/App.jsx', code);
console.log("Fixed template literals!");
