const fs = require('fs');
const srcPath = 'scripts/module2-questions-b1.js';
let code = fs.readFileSync(srcPath, 'utf8');

// Shift Q9 (index 8) from 1 -> 2, and Q12 (index 11) from 1 -> 3
let qIndex = 0;
code = code.replace(/(\s*q\(\s*[\s\S]*?\],\s*)(\d+)(,)/g, (match, prefix, pos, comma) => {
  const current = qIndex++;
  if (current === 8 && pos === '1') return `${prefix}2${comma}`;
  if (current === 11 && pos === '1') return `${prefix}3${comma}`;
  return match;
});

fs.writeFileSync(srcPath, code, 'utf8');
console.log('Updated Q9 -> 2 and Q12 -> 3 in', srcPath);
