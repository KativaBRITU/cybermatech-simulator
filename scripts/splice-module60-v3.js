const fs = require('fs');
const tierPath = 'modules/tierADepth.js';
const newArrayPath = 'scripts/module60-questions-v3.js';
const original = fs.readFileSync(tierPath, 'utf8');
const newArrayBody = fs.readFileSync(newArrayPath, 'utf8').trim();
fs.writeFileSync(tierPath + '.backup-before-module60-v3', original, 'utf8');
console.log('Backed up tierADepth.js');

const qDeclMarker = 'const TIER_A_QUESTIONS = {';
const qDeclIdx = original.indexOf(qDeclMarker);
if (qDeclIdx === -1) { console.error('TIER_A_QUESTIONS not found'); process.exit(1); }

const searchStart = qDeclIdx + qDeclMarker.length;
const keyPattern = /\n\s*60\s*:\s*\[/;
const remaining = original.slice(searchStart);
const keyMatch = remaining.match(keyPattern);

let inner = newArrayBody;
if (inner.startsWith('[')) inner = inner.slice(1);
if (inner.endsWith(']')) inner = inner.slice(0, -1);

let rebuilt;
if (keyMatch) {
  const keyIdx = searchStart + keyMatch.index;
  const openIdx = original.indexOf('[', keyIdx);
  let depth = 0, endIdx = -1;
  for (let i = openIdx; i < original.length; i++) {
    if (original[i] === '[') depth++;
    else if (original[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
  }
  if (endIdx === -1) { console.error('Matching ] not found'); process.exit(1); }
  rebuilt = original.slice(0, openIdx + 1) + inner + original.slice(endIdx);
  console.log('Replaced TIER_A_QUESTIONS[60]');
} else {
  let depth = 0, objEndIdx = -1;
  for (let i = qDeclIdx; i < original.length; i++) {
    if (original[i] === '{') depth++;
    else if (original[i] === '}') {
      depth--;
      if (depth === 0) { objEndIdx = i; break; }
    }
  }
  if (objEndIdx === -1) { console.error('Matching } for TIER_A_QUESTIONS not found'); process.exit(1); }
  const insertion = `,\n\n  60: [${inner}\n  ]\n`;
  rebuilt = original.slice(0, objEndIdx) + insertion + original.slice(objEndIdx);
  console.log('Appended TIER_A_QUESTIONS[60]');
}

fs.writeFileSync(tierPath, rebuilt, 'utf8');
console.log('Old:', original.length, 'New:', rebuilt.length);
