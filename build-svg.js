const svgToMiniDataURI = require('mini-svg-data-uri');
const fs = require('fs-extra');
const path = require('path');

const dir = 'svg';
const files = fs.readdirSync(dir);

let bg = [];
let ns = [];

files.forEach(f => {
	const n = f.replace(/\.svg$/, '');
	let s = fs.readFileSync(path.join(dir, f)).toString('utf8');
	const u = svgToMiniDataURI(s);
	ns.push (n);
	bg.push (`.scanex-feature-collection .${n} {background-image: url("${u}");}`);
});

const css = bg.join('\r\n');

fs.writeFileSync(path.join('src', 'icons.css'), css);