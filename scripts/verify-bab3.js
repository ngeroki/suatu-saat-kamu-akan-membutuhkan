import fs from 'fs';

const pages = JSON.parse(fs.readFileSync('./src/data/book-pages.json', 'utf8'));

let errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
    console.error(`❌ FAIL: ${message}`);
  }
}

console.log('🔍 Running Phase 1 Bab 3 Verification (Pages 38-44)...\n');

const p38 = pages[37];
const p39 = pages[38];
const p40 = pages[39];
const p41 = pages[40];
const p42 = pages[41];
const p43 = pages[42];
const p44 = pages[43];

// 1. Page 38: 7 Cakra Part 1 (Cakra 1-3)
assert(p38.page_number === 38, 'Page 38 must have page_number 38');
assert(p38.title.includes('7 Cakra') && (p38.title.includes('Bagian 1') || p38.title.includes('Cakra 1')), `P38 title mismatch: ${p38.title}`);
assert(p38.badge === '2. Peta Endokrin', `P38 badge mismatch: ${p38.badge}`);
const p38Text = p38.paragraphs.join(' ');
assert(p38Text.includes('Muladhara') && p38Text.includes('Svadhisthana') && p38Text.includes('Manipura'), 'P38 must describe Cakra 1-3 (Muladhara, Svadhisthana, Manipura)');
assert(p38Text.includes('Gonad') && p38Text.includes('Pankreas') && p38Text.includes('Adrenal'), 'P38 must describe Gonad, Pankreas, Adrenal');

// 2. Page 39: 7 Cakra Part 2 (Cakra 4-7)
assert(p39.page_number === 39, 'Page 39 must have page_number 39');
assert(p39.title.includes('7 Cakra') && (p39.title.includes('Bagian 2') || p39.title.includes('Puncak Mahkota')), `P39 title mismatch: ${p39.title}`);
assert(p39.badge === '2. Peta Endokrin', `P39 badge mismatch: ${p39.badge}`);
const p39Text = p39.paragraphs.join(' ');
assert(p39Text.includes('Anahata') && p39Text.includes('Vishuddha') && p39Text.includes('Ajna') && p39Text.includes('Sahasrara'), 'P39 must describe Cakra 4-7 (Anahata, Vishuddha, Ajna, Sahasrara)');
assert(p39Text.includes('Timus') && p39Text.includes('Tiroid') && p39Text.includes('Pineal') && p39Text.includes('Pituitari'), 'P39 must describe Timus, Tiroid, Pineal, Pituitari');

// 3. Page 40: Mahabharata in Neural Anatomy
assert(p40.page_number === 40, 'Page 40 must have page_number 40');
assert(p40.title.includes('Mahabharata'), `P40 title must be Mahabharata, got: ${p40.title}`);
assert(p40.badge === '3. Mitologi Saraf', `P40 badge mismatch: ${p40.badge}`);
const p40Text = p40.paragraphs.join(' ');
assert(p40Text.includes('Sengkuni') || p40Text.includes('Sangkuni'), 'P40 must describe Sengkuni/Sangkuni');
assert(p40Text.includes('Amigdala') || p40Text.includes('amigdala'), 'P40 must connect Sengkuni to Amigdala');
assert(p40Text.includes('Kresna') && (p40Text.includes('Pineal') || p40Text.includes('pineal')), 'P40 must describe Kresna as Pineal');

// 4. Page 41: Ganesha, Anubis, Sun Go Kong
assert(p41.page_number === 41, 'Page 41 must have page_number 41');
assert(p41.title.includes('Ganesha') && p41.title.includes('Anubis'), `P41 title must include Ganesha and Anubis, got: ${p41.title}`);
assert(p41.badge === '3. Simbolisme Tubuh', `P41 badge mismatch: ${p41.badge}`);
const p41Text = p41.paragraphs.join(' ');
const p41Lower = p41Text.toLowerCase();
assert(p41Lower.includes('ganesha') && p41Lower.includes('cerebellum'), 'P41 must describe Ganesha as Cerebellum');
assert(p41Lower.includes('anubis') && (p41Lower.includes('epiglotis') || p41Lower.includes('lidah')), 'P41 must describe Anubis as Epiglotis/Lidah');
assert(p41Lower.includes('sun go kong') || p41Lower.includes('monkey mind'), 'P41 must mention Sun Go Kong/Monkey Mind');

// 5. Page 42: Biohacking Kuno Selapanan 35 Hari & Pati Geni
assert(p42.page_number === 42, 'Page 42 must have page_number 42');
assert((p42.title.includes('35 Hari') || p42.title.includes('Selapanan') || p42.title.includes('Weton')) && p42.title.includes('Pati Geni'), `P42 title mismatch: ${p42.title}`);
assert(p42.badge === '3. Biohacking Leluhur', `P42 badge mismatch: ${p42.badge}`);
const p42Text = p42.paragraphs.join(' ');
assert(p42Text.includes('35 hari') || p42Text.includes('35 Hari') || p42Text.includes('Selapanan'), 'P42 must explain 35 Hari Selapanan');
assert(p42Text.includes('Apit Weton') || p42Text.includes('Weton') || p42Text.includes('weton'), 'P42 must explain Puasa Apit Weton');
assert(p42Text.includes('Pati Geni') || p42Text.includes('pati geni'), 'P42 must explain Pati Geni');
assert(p42Text.includes('melatonin') || p42Text.includes('Melatonin'), 'P42 must mention melatonin');

// 6. Page 43: Sains Grounding Garam Krosok & Daun Kelor
assert(p43.page_number === 43, 'Page 43 must have page_number 43');
assert(p43.title.includes('Garam Krosok') && p43.title.includes('Daun Kelor'), `P43 title must be Garam Krosok & Daun Kelor, got: ${p43.title}`);
assert(p43.badge === '3. Pembersih Energi', `P43 badge mismatch: ${p43.badge}`);
const p43Text = p43.paragraphs.join(' ');
assert(p43Text.includes('garam krosok') || p43Text.includes('Garam krosok') || p43Text.includes('Garam Krosok'), 'P43 must explain Garam Krosok');
assert(p43Text.includes('Kelor') || p43Text.includes('kelor'), 'P43 must explain Daun Kelor');
assert(p43Text.includes('statis') || p43Text.includes('ion') || p43Text.includes('torus') || p43Text.includes('elektromagnetik'), 'P43 must explain electromagnetic grounding mechanism');

// 7. Page 44: Protokol Napas Parasimpatis 4-4-8
assert(p44.page_number === 44, 'Page 44 must have page_number 44');
assert(p44.title.includes('4-4-8') || p44.title.includes('Napas') || p44.title.includes('Protokol'), `P44 title mismatch: ${p44.title}`);
assert(p44.badge === '4. Protokol Eksekusi', `P44 badge mismatch: ${p44.badge}`);
const p44Text = p44.paragraphs.join(' ');
assert(p44Text.includes('4-4-8') || (p44Text.includes('4 Detik') && p44Text.includes('8 Detik')), 'P44 must contain 4-4-8 breathing protocol details');
assert(p44Text.includes('Vagus') || p44Text.includes('vagus') || p44Text.includes('Parasimpatis') || p44Text.includes('parasimpatis'), 'P44 must mention Vagus nerve or parasympathetic activation');
assert(p44Text.includes('kortisol') || p44Text.includes('Kortisol'), 'P44 must mention cortisol reduction');

// 8. Disclaimer & Nerfing Check across P38-44
const forbiddenDisclaimers = [
  'tidak diperlakukan sebagai fakta',
  'bukan korespondensi anatomi',
  'bukan diagnosis fisiologis',
  'belum terbukti',
  'hanya dipakai sebagai metafora',
  'bukan fakta klinis',
  'istilah “pembersih bioelektrik” adalah metafora',
  'bukan identitas biologis',
  'bukan identitas anatomi',
  'hanya metafora'
];

for (let i = 37; i < 44; i++) {
  const p = pages[i];
  const combined = (p.text + ' ' + p.keyTakeaway + ' ' + p.paragraphs.join(' ')).toLowerCase();
  for (const disc of forbiddenDisclaimers) {
    if (combined.includes(disc.toLowerCase())) {
      errors.push(`Page ${p.page_number} contains forbidden defensive disclaimer: "${disc}"`);
    }
  }
}

// 9. Provenance check
for (let i = 37; i < 44; i++) {
  const p = pages[i];
  assert(p.provenance && p.provenance.source_chapter === 3, `Page ${p.page_number} must have valid Bab 3 provenance`);
  assert(p.provenance.source_section && p.provenance.source_section.length > 5, `Page ${p.page_number} must have valid provenance source_section`);
}

// 10. Visual descriptions alignment
assert(p38.illustration_description.includes('Cakra') || p38.illustration_description.includes('Endokrin'), 'P38 visual description must match Cakra 1-3');
assert(p39.illustration_description.includes('Cakra') || p39.illustration_description.includes('Mahkota') || p39.illustration_description.includes('Endokrin'), 'P39 visual description must match Cakra 4-7');
assert(p40.illustration_description.includes('Mahabharata') || p40.illustration_description.includes('Kurusetra') || p40.illustration_description.includes('Sengkuni'), 'P40 visual description must match Mahabharata');
assert(p41.illustration_description.includes('Ganesha') || p41.illustration_description.includes('Anubis'), 'P41 visual description must match Ganesha/Anubis');
assert(p42.illustration_description.includes('Weton') || p42.illustration_description.includes('Selapanan') || p42.illustration_description.includes('Pati Geni'), 'P42 visual description must match Selapanan/Pati Geni');
assert(p43.illustration_description.includes('Garam') || p43.illustration_description.includes('Kelor') || p43.illustration_description.includes('Grounding'), 'P43 visual description must match Garam/Kelor');
assert(p44.illustration_description.includes('4-4-8') || p44.illustration_description.includes('Napas') || p44.illustration_description.includes('Vagus'), 'P44 visual description must match 4-4-8 breath protocol');

if (errors.length > 0) {
  console.log(`\n❌ VERIFICATION FAILED with ${errors.length} error(s):\n`);
  errors.forEach((err, idx) => console.log(`${idx + 1}. ${err}`));
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED! Pages 38-44 successfully verified against original manuscript.');
  process.exit(0);
}
