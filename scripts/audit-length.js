const tier = require('../modules/tierADepth.js').TIER_A_QUESTIONS;
const ids = [7, 11, 18, 37, 38, 52, 58];

for (const id of ids) {
  const m = tier[id];
  if (!m) { console.log('Module ' + id + ': not found'); continue; }
  console.log('');
  console.log('=== MODULE ' + id + ' ===');
  console.log('Count:', m.length);
  let longest = 0, shortest = 0, middle = 0;
  const positions = [0, 0, 0, 0];
  m.forEach((q, i) => {
    const lens = q.options.map(o => o.length);
    const correctLen = lens[q.correct];
    const minL = Math.min(...lens);
    const maxL = Math.max(...lens);
    let rank;
    if (correctLen === maxL && maxL !== minL) { rank = 'LONGEST'; longest++; }
    else if (correctLen === minL && maxL !== minL) { rank = 'SHORTEST'; shortest++; }
    else { rank = 'MIDDLE'; middle++; }
    positions[q.correct]++;
    const others = lens.filter((_, j) => j !== q.correct);
    const spread = maxL - minL;
    console.log('Q' + String(i+1).padStart(2) + ' pos=' + q.correct + ' rank=' + rank.padEnd(8) + ' correct=' + String(correctLen).padStart(3) + ' others=[' + others.join(',') + '] spread=' + spread);
  });
  console.log('---');
  console.log('Length ranks: LONGEST=' + longest + ' MIDDLE=' + middle + ' SHORTEST=' + shortest);
  console.log('Positions: A=' + positions[0] + ' B=' + positions[1] + ' C=' + positions[2] + ' D=' + positions[3]);
}
