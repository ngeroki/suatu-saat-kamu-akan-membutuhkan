const all = require('../src/data/visual-narrative-74.json');

console.log('--- WORD COUNT AUDIT (TARGET 8-18 WORDS) ---');
let min = 999, max = 0, sum = 0;
const outliers = [];

all.forEach(p => {
  const words = p.side_a_text.trim().split(/\s+/).length;
  if (words < min) min = words;
  if (words > max) max = words;
  sum += words;
  if (words < 8 || words > 18) {
    outliers.push({ page: p.page_number, words, text: p.side_a_text });
  }
});

console.log(`Min words: ${min}`);
console.log(`Max words: ${max}`);
console.log(`Average words: ${(sum / all.length).toFixed(1)}`);
console.log(`Outliers (<8 or >18 words): ${outliers.length}`);
if (outliers.length > 0) {
  console.log(outliers);
}
