const fs = require('fs');
const path = require('path');

const bookPages = require('../src/data/book-pages.json');

const bab1 = require('./curation/bab-01.cjs');
const bab2 = require('./curation/bab-02.cjs');
const bab3 = require('./curation/bab-03.cjs');
const bab4 = require('./curation/bab-04.cjs');
const bab5 = require('./curation/bab-05.cjs');

const all = [...bab1, ...bab2, ...bab3, ...bab4, ...bab5];

console.log('=== RUNNING RIGOROUS QUALITY GATE AUDIT ===');
console.log(`Total Pages Collected: ${all.length}`);

if (all.length !== 74) {
  console.error(`ERROR: Expected 74 pages, got ${all.length}`);
  process.exit(1);
}

// 1. Audit sequential page numbers and metadata sync with book-pages.json
let errorCount = 0;
const forbiddenWords = ['kesialan', 'hukuman semesta', 'temukan dirimu', 'cahaya batin', 'perjalanan transformasi', 'merajut asa', 'versi terbaik'];
const forbiddenPrompts = ['floating chakras', 'glowing aura', 'cosmic galaxy', 'sacred geometry', 'floating temple', 'glowing third eye'];

for (let i = 0; i < 74; i++) {
  const p = all[i];
  const expectedNum = i + 1;
  const original = bookPages.find(bp => bp.page_number === expectedNum);

  if (!original) {
    console.error(`ERROR: Page ${expectedNum} missing from book-pages.json!`);
    errorCount++;
    continue;
  }

  // Check page number
  if (p.page_number !== expectedNum) {
    console.error(`ERROR: Item at index ${i} has page_number ${p.page_number}, expected ${expectedNum}`);
    errorCount++;
  }

  // Check chapter_code sync
  if (p.chapter_code !== original.chapter_code) {
    console.error(`ERROR: Page ${expectedNum} chapter_code mismatch: got "${p.chapter_code}", expected "${original.chapter_code}"`);
    errorCount++;
  }

  // Check chapter_name sync
  if (p.chapter_name !== original.chapter_name) {
    console.error(`ERROR: Page ${expectedNum} chapter_name mismatch: got "${p.chapter_name}", expected "${original.chapter_name}"`);
    errorCount++;
  }

  // Check Side A word count (8 to 18 words)
  const words = p.side_a_text.trim().split(/\s+/).length;
  if (words < 8 || words > 18) {
    console.warn(`WARNING: Page ${expectedNum} Side A length is ${words} words (target 8-18): "${p.side_a_text}"`);
  }

  // Check dashes
  if (p.side_a_text.includes('—') || p.side_a_text.includes('–')) {
    console.error(`ERROR: Page ${expectedNum} Side A contains em-dash or en-dash: "${p.side_a_text}"`);
    errorCount++;
  }

  // Check forbidden words in Side A
  for (const fw of forbiddenWords) {
    if (p.side_a_text.toLowerCase().includes(fw)) {
      console.error(`ERROR: Page ${expectedNum} Side A contains forbidden cliche "${fw}": "${p.side_a_text}"`);
      errorCount++;
    }
  }

  // Check forbidden AI slop in prompt
  for (const fp of forbiddenPrompts) {
    // Only flag if it's in positive prompt, not in negative constraints
    const promptParts = p.image_prompt.split('[NEGATIVE CONSTRAINTS]');
    const positivePart = promptParts[0] || '';
    if (positivePart.toLowerCase().includes(fp)) {
      console.error(`ERROR: Page ${expectedNum} positive prompt contains forbidden slop "${fp}"!`);
      errorCount++;
    }
  }

  // Check reflection_target doesn't use prescriptive editor instruction ("Pembaca menyadari...")
  if (p.reflection_target.startsWith('Pembaca menyadari') || p.reflection_target.startsWith('Menyadarkan pembaca') || p.reflection_target.startsWith('Menimbulkan rasa ngeri')) {
    console.error(`ERROR: Page ${expectedNum} reflection_target has prescriptive instruction language: "${p.reflection_target}"`);
    errorCount++;
  }
}

if (errorCount > 0) {
  console.error(`\nQUALITY AUDIT FAILED with ${errorCount} errors!`);
  process.exit(1);
}

console.log('✅ QUALITY GATE AUDIT 100% PASS: Zero errors, zero forbidden cliches, metadata 1-to-1 sync!');

// Write to src/data/visual-narrative-74.json
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'visual-narrative-74.json');
fs.writeFileSync(jsonPath, JSON.stringify(all, null, 2), 'utf8');
console.log(`Saved structured JSON to: ${jsonPath}`);

// Write full Markdown dossier
let md = `# SUATU SAAT — NARRATIVE VISUAL + SELF-REFLECTION DOSSIER (74 HALAMAN)\n\n`;
md += `> **Standard**: Master Prompt V2 (Restrained Ordinary Reality, One Meaningful Detail, Anti-Doctrine Side A)\n`;
md += `> **Coverage**: 74/74 Halaman Utuh (Bab 1 s.d. Bab 5)\n`;
md += `> **Metadata Ground-Truth**: Disinkronkan 1-to-1 dengan \`src/data/book-pages.json\`\n\n---\n\n`;

let currentChap = '';
for (const p of all) {
  if (p.chapter_code !== currentChap) {
    currentChap = p.chapter_code;
    md += `## ${p.chapter_code}: ${p.chapter_name}\n\n---\n\n`;
  }

  md += `### [PAGE ${String(p.page_number).padStart(2, '0')}] ${p.title}\n\n`;
  if (p.subtitle) {
    md += `*${p.subtitle}*\n\n`;
  }
  md += `**SIDE A TEXT:**\n> "${p.side_a_text}"\n\n`;
  md += `**VISUAL CONCEPT:**\n${p.visual_concept}\n\n`;
  md += `**IMAGE PROMPT (9:16 Vertical):**\n\`\`\`text\n${p.image_prompt}\n\`\`\`\n\n`;
  md += `**SOURCE ANCHOR:**\n> "${p.source_anchor}"\n\n`;
  md += `**REFLECTION TARGET:**\n${p.reflection_target}\n\n---\n\n`;
}

const mdPath = path.join(__dirname, '..', 'docs', 'visual-narrative-prompts-74.md');
fs.writeFileSync(mdPath, md, 'utf8');
console.log(`Saved Markdown dossier to: ${mdPath}`);
