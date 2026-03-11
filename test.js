const cp = require('child_process');
try {
  let out = cp.execSync('npx eslint src/App.jsx', {encoding:'utf8'});
  console.log("SUCCESS NO ERRORS");
} catch(e) {
  console.log("ESLINT OUTPUT:\n", e.stdout);
}
