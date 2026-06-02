const fs = require('fs');
function readDeps(path) {
	try {
		const txt = fs.readFileSync(path, 'utf8');
		const obj = JSON.parse(txt);
		return obj.dependencies || {};
	} catch (e) {
		return {};
	}
}

const a = readDeps('../package-lock.json.bak') || readDeps('./package-lock.json.bak');
const b = readDeps('../package-lock.json') || readDeps('./package-lock.json');
const ka = Object.keys(a).sort();
const kb = Object.keys(b).sort();
console.log('before', ka.length, 'after', kb.length);
const removed = ka.filter(x => !kb.includes(x));
const added = kb.filter(x => !ka.includes(x));
console.log('removed', removed.length, removed.length ? removed.join(',') : '(none)');
console.log('added', added.length, added.length ? added.join(',') : '(none)');
if (removed.length === 0 && added.length === 0) process.exit(0);
else process.exit(2);
