const tierA = require('../modules/tierADepth.js').TIER_A_QUESTIONS;
const tierB = require('../modules/tierBDepth.js').TIER_B_QUESTIONS;
const entries = [
  ['A', 1], ['A', 7], ['A', 8], ['A', 11], ['A', 18], ['A', 21],
  ['A', 37], ['A', 51], ['A', 52], ['A', 58], ['A', 60],
  ['B', 3], ['B', 12], ['B', 2]
];
let summary = [];
for (const [tier, id] of entries) {
  const m = tier === 'A' ? tierA[id] : tierB[id];
  if (!m) { summary.push({ tier, id, count: 'not found' }); continue; }
  let longest = 0, middle = 0, shortest = 0;
  m.forEach((q) => {
    const lens = q.options.map(o => o.length);
    const cl = lens[q.correct];
    const mx = Math.max(...lens), mn = Math.min(...lens);
    if (cl === mx && mx !== mn) longest++;
    else if (cl === mn && mx !== mn) shortest++;
    else middle++;
  });
  summary.push({ tier, id, count: m.length, longest, middle, shortest });
}
console.log('');
console.log('=== SUMMARY ===');
console.log('Tier | Module | Count | LONGEST | MIDDLE | SHORTEST | Pass?');
console.log('-----|--------|-------|---------|--------|----------|------');
for (const s of summary) {
  if (s.count === 'not found') { console.log(s.tier, '|', s.id, '| not found'); continue; }
  const pass = s.longest <= 6 && s.shortest >= 2 ? 'YES' : 'NO';
  console.log(s.tier, '|', s.id, '|', s.count, '|', s.longest, '|', s.middle, '|', s.shortest, '|', pass);
}
