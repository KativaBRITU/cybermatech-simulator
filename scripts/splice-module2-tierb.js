const fs = require('fs');
const tierPath = 'modules/tierBDepth.js';
const newArrayPath = 'scripts/module2-questions-b1.js';
const original = fs.readFileSync(tierPath, 'utf8');
const newArrayBody = fs.readFileSync(newArrayPath, 'utf8').trim();
fs.writeFileSync(tierPath + '.backup-before-module2-b1', original, 'utf8');
console.log('Backed up tierBDepth.js');

const qDeclMarker = 'const TIER_B_QUESTIONS = {';
const qDeclIdx = original.indexOf(qDeclMarker);
if (qDeclIdx === -1) { console.error('TIER_B_QUESTIONS not found'); process.exit(1); }

const searchStart = qDeclIdx + qDeclMarker.length;
const keyPattern = /(?:^|\n)\s*['"]?2['"]?\s*:\s*\[/;
const remaining = original.slice(searchStart);
const keyMatch = remaining.match(keyPattern);
if (!keyMatch) { console.error('2: [ not found in TIER_B_QUESTIONS'); process.exit(1); }

const keyIdx = searchStart + keyMatch.index;
const openIdx = original.indexOf('[', keyIdx);
let depth = 0, endIdx = -1;
for (let i = openIdx; i < original.length; i++) {
  if (original[i] === '[') depth++;
  else if (original[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
}
if (endIdx === -1) { console.error('Matching ] not found'); process.exit(1); }

let inner = newArrayBody;
if (inner.startsWith('[')) inner = inner.slice(1);
if (inner.endsWith(']')) inner = inner.slice(0, -1);

const rebuilt = original.slice(0, openIdx + 1) + inner + original.slice(endIdx);
fs.writeFileSync(tierPath, rebuilt, 'utf8');
console.log('Replaced TIER_B_QUESTIONS[2]');
console.log('Old:', original.length, 'New:', rebuilt.length);
