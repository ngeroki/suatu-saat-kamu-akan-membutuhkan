// scripts/rewrite_caknun/apply_rewrite.js
const fs = require('fs');
const path = require('path');

const bab1 = require('./bab1.cjs');
const bab2 = require('./bab2.cjs');
const bab3 = require('./bab3.cjs');
const bab4 = require('./bab4.cjs');
const bab5 = require('./bab5.cjs');

const allPatches = [...bab1, ...bab2, ...bab3, ...bab4, ...bab5];
console.log(`Loaded ${allPatches.length} patch pages.`);

if (allPatches.length !== 74) {
  console.error(`Error: Expected 74 pages, got ${allPatches.length}`);
  process.exit(1);
}

const bookPagesPath = path.resolve(__dirname, '../../src/data/book-pages.json');
const originalData = JSON.parse(fs.readFileSync(bookPagesPath, 'utf8'));

console.log(`Original book-pages.json has ${originalData.length} pages.`);

// Create patch map
const patchMap = new Map();
allPatches.forEach(p => patchMap.set(p.page_number, p.text));

let updatedCount = 0;
const updatedData = originalData.map(page => {
  const newText = patchMap.get(page.page_number);
  if (newText) {
    page.text = newText;
    // Recalculate word count of the text
    page.word_count = newText.split(/\s+/).filter(Boolean).length;
    updatedCount++;
  }
  return page;
});

console.log(`Successfully updated ${updatedCount} pages.`);

// Write back to book-pages.json
fs.writeFileSync(bookPagesPath, JSON.stringify(updatedData, null, 2), 'utf8');
console.log(`Saved changes to ${bookPagesPath}`);

// Summary stats
const wordCounts = updatedData.map(p => p.word_count);
const minWords = Math.min(...wordCounts);
const maxWords = Math.max(...wordCounts);
const avgWords = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);

console.log(`\n=== REWRITE SUMMARY ===`);
console.log(`Total Pages: ${updatedData.length}`);
console.log(`Min words: ${minWords} words`);
console.log(`Max words: ${maxWords} words`);
console.log(`Average words: ${avgWords} words per page`);
console.log(`All 74 pages now rewritten in Cak Nun on-stage Maiyah spoken delivery style!`);
