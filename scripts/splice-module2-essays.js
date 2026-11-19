const fs = require('fs');
const tierPath = 'modules/tierBDepth.js';
const newArrayPath = 'scripts/module2-essays.js';

if (!fs.existsSync(newArrayPath)) {
  console.error('Missing ' + newArrayPath);
  process.exit(1);
}

const original = fs.readFileSync(tierPath, 'utf8');
const newArrayBody = fs.readFileSync(newArrayPath, 'utf8').trim();

fs.writeFileSync(tierPath + '.backup-before-module2-essays', original, 'utf8');
console.log('Backed up tierBDepth.js');

const eDeclMarker = 'const TIER_B_ESSAYS = {';
const eDeclIdx = original.indexOf(eDeclMarker);
if (eDeclIdx === -1) {
  console.error('TIER_B_ESSAYS not found');
  process.exit(1);
}

let inner = newArrayBody;
if (inner.startsWith('[')) inner = inner.slice(1);
if (inner.endsWith(']')) inner = inner.slice(0, -1);

const searchStart = eDeclIdx + eDeclMarker.length;
const remaining = original.slice(searchStart);
const keyPattern = /(?:^|\n)\s*['"]?2['"]?\s*:\s*\[/;
const keyMatch = remaining.match(keyPattern);

let rebuilt;
if (keyMatch) {
  const keyIdx = searchStart + keyMatch.index;
  const openIdx = original.indexOf('[', keyIdx);
  let depth = 0, endIdx = -1;
  for (let i = openIdx; i < original.length; i++) {
    if (original[i] === '[') depth++;
    else if (original[i] === ']') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx === -1) {
    console.error('Matching ] not found for key 2');
    process.exit(1);
  }
  rebuilt = original.slice(0, openIdx + 1) + inner + original.slice(endIdx);
  console.log('Replaced TIER_B_ESSAYS[2]');
} else {
  let depth = 0, objEndIdx = -1;
  const braceStart = original.indexOf('{', eDeclIdx);
  for (let i = braceStart; i < original.length; i++) {
    if (original[i] === '{') depth++;
    else if (original[i] === '}') {
      depth--;
      if (depth === 0) { objEndIdx = i; break; }
    }
  }
  if (objEndIdx === -1) {
    console.error('Matching } for TIER_B_ESSAYS not found');
    process.exit(1);
  }
  const beforeClose = original.slice(braceStart + 1, objEndIdx).trim();
  const needsComma = beforeClose.length > 0 && !beforeClose.endsWith(',');
  const insertion = `${needsComma ? ',' : ''}\n\n  2: [${inner}\n  ]\n`;
  rebuilt = original.slice(0, objEndIdx) + insertion + original.slice(objEndIdx);
  console.log('Inserted TIER_B_ESSAYS[2]');
}

fs.writeFileSync(tierPath, rebuilt, 'utf8');
console.log('Old:', original.length, 'New:', rebuilt.length);
