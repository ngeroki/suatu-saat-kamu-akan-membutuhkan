const all = require('../src/data/visual-narrative-74.json');
const openings = {};
all.forEach(p => {
  const firstWord = p.side_a_text.trim().split(/\s+/)[0];
  openings[firstWord] = (openings[firstWord] || 0) + 1;
});

console.log('--- SENTENCE OPENING DIVERSITY AUDIT ---');
const sorted = Object.entries(openings).sort((a,b) => b[1] - a[1]);
sorted.forEach(([w, count]) => {
  console.log(`${w}: ${count}`);
});
console.log(`\nDistinct Opening Words: ${sorted.length} / 74 pages`);
