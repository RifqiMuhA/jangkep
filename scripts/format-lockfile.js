const fs = require('fs');
try {
  fs.copyFileSync('package-lock.json', 'package-lock.json.bak');
  const j = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  fs.writeFileSync('package-lock.json', JSON.stringify(j, null, 2) + '\n', 'utf8');
  console.log('OK formatted');
} catch (e) {
  console.error('ERROR', e && e.message);
  process.exit(1);
}
