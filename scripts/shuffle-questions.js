const fs = require('fs');
const path = require('path');

// Usage: node scripts/shuffle-questions.js <input-file> [pattern]
// Example: node scripts/shuffle-questions.js scripts/module37-questions.js
// Pattern defaults to alternating distribution; pass custom if needed.

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: node scripts/shuffle-questions.js <input-file>');
  process.exit(1);
}

const inputPath = path.resolve(inputFile);
if (!fs.existsSync(inputPath)) {
  console.error('File not found:', inputPath);
  process.exit(1);
}

let content = fs.readFileSync(inputPath, 'utf8');

// Target positions: A=0, B=1, C=2, D=3
// Pattern: 3 of each, spread out
const targetPattern = [2, 0, 3, 1, 0, 3, 1, 2, 3, 1, 2, 0];
// For 12 questions: A=3 (idx 1,4,10... let me count: 0 appears at pos 1,4 → wait
// pattern = [2,0,3,1,0,3,1,2,3,1,2,0]
// 0 (A) at positions: 1, 4 → 2 times
// 1 (B) at positions: 3, 6, 9 → 3 times
// 2 (C) at positions: 0, 7, 10 → 3 times
// 3 (D) at positions: 2, 5, 8, 11 → 4 times
// Hmm that's 2/3/3/4. Let me fix: 
// Want A=3, B=3, C=3, D=3. Pattern: [0,1,2,3, 1,2,3,0, 2,3,0,1]
// A at 0,7,10 → 3
// B at 1,4,11 → 3
// C at 2,5,8 → 3
// D at 3,6,9 → 3
const pattern = [0, 1, 2, 3, 1, 2, 3, 0, 2, 3, 0, 1];

// Parse the file: find each q(...) block, extract the options array and correct index
// We work with the string directly, finding `q(` blocks

// Find all top-level q( occurrences — we use a simple state machine
const qPositions = [];
let i = 0;
while (i < content.length) {
  // Look for "  q(" or "q(" at start of a line (with indentation)
  if (content[i] === 'q' && content[i+1] === '(') {
    // Check it is at the start of a line (only whitespace before)
    let lineStart = i - 1;
    while (lineStart >= 0 && content[lineStart] !== '\n') lineStart--;
    const beforeOnLine = content.slice(lineStart + 1, i);
    if (/^\s*$/.test(beforeOnLine)) {
      qPositions.push(i);
    }
  }
  i++;
}

console.log('Found', qPositions.length, 'q( blocks');

if (qPositions.length === 0) {
  console.error('No q() blocks found');
  process.exit(1);
}

// Process from end to start so earlier positions stay valid
// Actually process each block, building a new output
let output = '';
let lastEnd = 0;

for (let b = 0; b < qPositions.length; b++) {
  const qStart = qPositions[b];
  
  // Find the matching close paren for this q(
  let depth = 0, qEnd = -1;
  for (let j = qStart; j < content.length; j++) {
    if (content[j] === '(') depth++;
    else if (content[j] === ')') { depth--; if (depth === 0) { qEnd = j; break; } }
  }
  if (qEnd === -1) {
    console.error('Could not find matching close paren for q block', b + 1);
    process.exit(1);
  }

  const block = content.slice(qStart, qEnd + 1);
  
  // Within the block, find the options array [ ... ] and the correct index
  // The block structure is: q('stem', [opts...], correct, 'explanation', 'topic', num, {...})
  
  // Find the first [ after the stem
  const optStart = block.indexOf('[');
  if (optStart === -1) {
    console.error('No options array in block', b + 1);
    process.exit(1);
  }
  
  // Find the matching ] for options
  let optDepth = 0, optEnd = -1;
  for (let j = optStart; j < block.length; j++) {
    if (block[j] === '[') optDepth++;
    else if (block[j] === ']') { optDepth--; if (optDepth === 0) { optEnd = j; break; } }
  }
  if (optEnd === -1) {
    console.error('No matching ] for options in block', b + 1);
    process.exit(1);
  }
  
  // Extract the options array (including brackets)
  const optionsStr = block.slice(optStart, optEnd + 1);
  
  // Parse options as an array — it's a JS array of strings
  // We use eval carefully — the options are always strings
  let optionsArr;
  try {
    optionsArr = eval(optionsStr);
  } catch (e) {
    console.error('Could not parse options in block', b + 1, ':', e.message);
    process.exit(1);
  }
  
  // Find correct index — it's the first number after the options array close
  // Pattern: ], correctNum,
  const afterOpts = block.slice(optEnd + 1);
  const correctMatch = afterOpts.match(/^\s*,\s*(\d+)\s*,/);
  if (!correctMatch) {
    console.error('Could not find correct index in block', b + 1);
    process.exit(1);
  }
  const oldCorrect = parseInt(correctMatch[1], 10);
  
  if (oldCorrect < 0 || oldCorrect >= optionsArr.length) {
    console.error('Invalid correct index', oldCorrect, 'in block', b + 1);
    process.exit(1);
  }
  
  // Target position for this question
  const targetPos = pattern[b % pattern.length];
  
  // Rotate options: move oldCorrect to targetPos
  // We build a new array by swapping
  const newOptions = optionsArr.slice();
  const correctOption = newOptions[oldCorrect];
  // Remove old correct, insert at target
  newOptions.splice(oldCorrect, 1);
  newOptions.splice(targetPos, 0, correctOption);
  
  // The new correct index is targetPos
  const newCorrect = targetPos;
  
  // Build the new options string
  // Preserve original formatting roughly: each option on its own line
  const indent = '      '; // 6 spaces
  const newOptionsStr = '[\n' + newOptions.map(o => indent + JSON.stringify(o)).join(',\n') + '\n    ]';
  
  // Find distractor_rationale array in the block (if present)
  // We need to rotate it too
  let newBlock = block;
  
  // Find distractor_rationale: [ ... ]
  const ratMatch = block.match(/distractor_rationale:\s*\[/);
  if (ratMatch) {
    const ratStartInBlock = ratMatch.index + ratMatch[0].length - 1;
    let ratDepth = 0, ratEnd = -1;
    for (let j = ratStartInBlock; j < block.length; j++) {
      if (block[j] === '[') ratDepth++;
      else if (block[j] === ']') { ratDepth--; if (ratDepth === 0) { ratEnd = j; break; } }
    }
    if (ratEnd !== -1) {
      const ratStr = block.slice(ratStartInBlock, ratEnd + 1);
      let ratArr;
      try {
        ratArr = eval(ratStr);
      } catch (e) {
        console.error('Could not parse distractor_rationale in block', b + 1, ':', e.message);
        process.exit(1);
      }
      
      if (ratArr.length === optionsArr.length) {
        // Rotate the same way
        const newRat = ratArr.slice();
        const ratItem = newRat[oldCorrect];
        newRat.splice(oldCorrect, 1);
        newRat.splice(targetPos, 0, ratItem);
        
        const newRatStr = '[\n' + newRat.map(r => indent + JSON.stringify(r)).join(',\n') + '\n      ]';
        
        // Replace rationale in block
        newBlock = newBlock.slice(0, ratStartInBlock) + newRatStr + newBlock.slice(ratEnd + 1);
      }
    }
  }
  
  // Now replace options and correct index in newBlock
  // Recompute positions in newBlock (they may have shifted if rationale was replaced before them? No — rationale is after correct index in source order)
  // Actually options are before rationale, so positions in newBlock for options are same as in block
  
  // Recompute optStart/optEnd within newBlock
  const newOptStart = newBlock.indexOf('[');
  let newOptDepth = 0, newOptEnd = -1;
  for (let j = newOptStart; j < newBlock.length; j++) {
    if (newBlock[j] === '[') newOptDepth++;
    else if (newBlock[j] === ']') { newOptDepth--; if (newOptDepth === 0) { newOptEnd = j; break; } }
  }
  
  // Build the updated block: options + rest, then fix correct index
  let updated = newBlock.slice(0, newOptStart) + newOptionsStr + newBlock.slice(newOptEnd + 1);
  
  // Fix correct index: find the correct number after the new options
  // Pattern: ], N,
  const afterNewOpts = updated.slice(newOptStart + newOptionsStr.length);
  const correctFix = afterNewOpts.match(/^(\s*,\s*)(\d+)(\s*,)/);
  if (correctFix) {
    const replaced = correctFix[1] + newCorrect + correctFix[3];
    updated = updated.slice(0, newOptStart + newOptionsStr.length) + replaced + afterNewOpts.slice(correctFix[0].length);
  }
  
  // Append to output: everything since lastEnd, then updated
  output += content.slice(lastEnd, qStart) + updated;
  lastEnd = qEnd + 1;
  
  console.log('Q' + (b + 1) + ': correct moved from ' + oldCorrect + ' to ' + newCorrect);
}

output += content.slice(lastEnd);

// Write back
fs.writeFileSync(inputPath, output, 'utf8');
console.log('Done. Shuffled', qPositions.length, 'questions.');
console.log('New file length:', output.length);
