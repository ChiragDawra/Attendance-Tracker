const fs = require('fs');
try {
  let code = fs.readFileSync('src/App.jsx', 'utf8');
  code = code.replace(/\\\${/g, '${');
  code = code.replace(/\\`/g, '`');
  fs.writeFileSync('src/App.jsx', code);
  console.log("SUCCESS");
} catch(e) { console.log(e); }
