const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'docs', 'visual-narratives');
let total = 0;
const all = [];

for (let i = 1; i <= 5; i++) {
  const p = path.join(baseDir, `bab-0${i}.json`);
  if (!fs.existsSync(p)) {
    console.error(`File missing: ${p}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`Bab ${i}: ${data.length} pages`);
  total += data.length;
  all.push(...data);
}

console.log(`TOTAL PAGES COLLECTED: ${total}`);
all.sort((a, b) => a.page_number - b.page_number);

// Check if all pages 1 to 74 exist sequentially
for (let num = 1; num <= 74; num++) {
  const found = all.find(x => x.page_number === num);
  if (!found) {
    console.error(`Missing page number: ${num}`);
  }
}

// Write src/data/visual-narrative-74.json
const jsonTarget = path.join(__dirname, '..', 'src', 'data', 'visual-narrative-74.json');
fs.writeFileSync(jsonTarget, JSON.stringify(all, null, 2), 'utf8');
console.log(`Successfully written JSON to ${jsonTarget}`);

// Also build full Markdown dossier docs/visual-narrative-prompts-74.md
let md = `# SUATU SAAT — NARRATIVE VISUAL + SELF-REFLECTION DOSSIER (74 HALAMAN)\n\n`;
md += `Dokumen resmi arahan narasi visual, teks Side A, prompt Gemini, dan jangkar naskah untuk 74 halaman buku *Suatu Saat Kamu Akan Membutuhkan*.\n\n`;
md += `Disusun berdasarkan Master Prompt dengan pemisahan tegas antara tipografi UI dan visual murni seni (9:16 vertical).\n\n---\n\n`;

let currentChap = "";
for (const p of all) {
  if (p.chapter_code !== currentChap) {
    currentChap = p.chapter_code;
    md += `## ${p.chapter_code} — ${p.chapter_name}\n\n---\n\n`;
  }
  
  md += `### PAGE ${String(p.page_number).padStart(2, '0')}: ${p.title}\n\n`;
  md += `**SIDE A TEXT:**\n> "${p.side_a_text}"\n\n`;
  md += `**VISUAL CONCEPT:**\n${p.visual_concept}\n\n`;
  md += `**IMAGE PROMPT (9:16 Vertical):**\n\`\`\`text\n${p.image_prompt}\n\`\`\`\n\n`;
  md += `**SOURCE ANCHOR:**\n> "${p.source_anchor}"\n\n`;
  md += `**SELF-REFLECTION CHECK:**\n${p.self_reflection_check}\n\n---\n\n`;
}

const mdTarget = path.join(__dirname, '..', 'docs', 'visual-narrative-prompts-74.md');
fs.writeFileSync(mdTarget, md, 'utf8');
console.log(`Successfully written Markdown dossier to ${mdTarget}`);
