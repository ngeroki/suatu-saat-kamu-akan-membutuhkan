import fs from 'fs';

console.log('🚀 Running Deterministic Assembler & QA Gate for 74 Pages...\n');

const bookPath = './src/data/book-pages.json';
const patch1Path = './scripts/patches/bab-1.json';
const patch2Path = './scripts/patches/bab-2.json';
const patch3Path = './scripts/patches/bab-3.json';
const patch4Path = './scripts/patches/bab-4.json';
const patch5Path = './scripts/patches/bab-5.json';

const patchFiles = [
  { path: patch1Path, name: 'Bab 1', expectedPages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  { path: patch2Path, name: 'Bab 2', expectedPages: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { path: patch3Path, name: 'Bab 3', expectedPages: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45] },
  { path: patch4Path, name: 'Bab 4', expectedPages: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59] },
  { path: patch5Path, name: 'Bab 5', expectedPages: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74] }
];

// Verify all patches exist
for (const p of patchFiles) {
  if (!fs.existsSync(p.path)) {
    console.error(`❌ ERROR: Missing patch file: ${p.path}`);
    process.exit(1);
  }
}

const currentPages = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
const pageMap = new Map();
currentPages.forEach(p => pageMap.set(p.page_number, p));

// Apply patches
for (const p of patchFiles) {
  const patchData = JSON.parse(fs.readFileSync(p.path, 'utf8'));
  console.log(`📦 Loaded ${p.name}: ${patchData.length} pages from ${p.path}`);
  
  for (const pageObj of patchData) {
    if (!p.expectedPages.includes(pageObj.page_number)) {
      console.error(`❌ ERROR: Unexpected page number ${pageObj.page_number} in patch ${p.name}`);
      process.exit(1);
    }
    pageMap.set(pageObj.page_number, pageObj);
  }
}

// Assemble full pages array
const assembledPages = [];
for (let i = 1; i <= 74; i++) {
  const page = pageMap.get(i);
  if (!page) {
    console.error(`❌ ERROR: Missing page ${i} during assembly`);
    process.exit(1);
  }
  assembledPages.push(page);
}

// QA Checks
let errors = [];

// 1. Total Pages
if (assembledPages.length !== 74) {
  errors.push(`Expected exactly 74 pages, got ${assembledPages.length}`);
}

// 2. Sequential order & pointer integrity
for (let idx = 0; idx < assembledPages.length; idx++) {
  const page = assembledPages[idx];
  const expectedPageNum = idx + 1;
  if (page.page_number !== expectedPageNum) {
    errors.push(`Page at index ${idx} has page_number ${page.page_number}, expected ${expectedPageNum}`);
  }
  if (idx > 0 && page.previous_page !== idx) {
    errors.push(`Page ${page.page_number} previous_page is ${page.previous_page}, expected ${idx}`);
  }
  if (idx < 73 && page.next_page !== idx + 2) {
    errors.push(`Page ${page.page_number} next_page is ${page.next_page}, expected ${idx + 2}`);
  }
}

// 3. Word counts & recalculation
let totalWords = 0;
let minWords = Infinity;
let maxWords = -Infinity;
let minPage = null;
let maxPage = null;

for (const page of assembledPages) {
  // Ensure text format
  if (!page.text || !page.paragraphs || page.paragraphs.length === 0) {
    errors.push(`Page ${page.page_number} is missing text or paragraphs`);
    continue;
  }
  
  // Format text cleanly if needed
  const expectedText = `> **${page.badge}**\n\n# ${page.title}\n\n*${page.subtitle}*\n\n${page.paragraphs.join('\n\n')}\n\n> **Intisari Kesadaran:** ${page.keyTakeaway}`;
  page.text = expectedText;
  
  const wc = page.text.trim().split(/\s+/).filter(Boolean).length;
  page.word_count = wc;
  totalWords += wc;
  if (wc < minWords) { minWords = wc; minPage = page.page_number; }
  if (wc > maxWords) { maxWords = wc; maxPage = page.page_number; }
}

// 4. Forbidden Defensive AI Disclaimers Scan
const forbiddenDisclaimers = [
  'tidak diperlakukan sebagai fakta',
  'bukan superkonduktor biologis',
  'tidak ada dasar untuk menyebut',
  'hanya dipakai sebagai metafora',
  'bukan jaminan bahwa semesta',
  'garam tidak perlu dianggap',
  'bukan diagnosis fisiologis',
  'bukan fakta klinis',
  'klaim donat bukan fakta',
  'tidak diakui kedokteran',
  'selamat datang di bab',
  'geser tombol',
  'selamat, kamu telah menyelesaikan bab',
  'klaim bahwa pineal',
  'belum terbukti',
  'bukan korespondensi anatomi',
  'bukan identitas biologis',
  'bukan identitas anatomi'
];

for (const page of assembledPages) {
  const content = (page.text + ' ' + page.keyTakeaway + ' ' + page.paragraphs.join(' ')).toLowerCase();
  for (const disc of forbiddenDisclaimers) {
    if (content.includes(disc.toLowerCase())) {
      errors.push(`Page ${page.page_number} contains forbidden defensive disclaimer or onboarding residue: "${disc}"`);
    }
  }
}

// 5. Provenance Integrity
for (const page of assembledPages) {
  if (!page.provenance || !page.provenance.source_chapter || !page.provenance.source_section) {
    errors.push(`Page ${page.page_number} missing valid provenance`);
  }
}

if (errors.length > 0) {
  console.error(`\n❌ QA GATE FAILED with ${errors.length} error(s):\n`);
  errors.forEach((err, i) => console.error(`${i + 1}. ${err}`));
  process.exit(1);
}

// Save merged canonical output
fs.writeFileSync(bookPath, JSON.stringify(assembledPages, null, 2), 'utf8');

console.log('✅ Deterministic Assembly & QA Gate Passed 100%!');
console.log(`📊 Statistics:`);
console.log(`- Total Pages: ${assembledPages.length}`);
console.log(`- Total Words: ${totalWords}`);
console.log(`- Average Words/Page: ${(totalWords / assembledPages.length).toFixed(1)}`);
console.log(`- Min Words: ${minWords} (Page ${minPage})`);
console.log(`- Max Words: ${maxWords} (Page ${maxPage})`);
console.log(`- Zero Disclaimers: CONFIRMED`);
console.log(`- File updated: ${bookPath}\n`);
process.exit(0);
