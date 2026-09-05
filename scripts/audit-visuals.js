import fs from 'fs';
import path from 'path';

const bookPath = './src/data/book-pages.json';
const pages = JSON.parse(fs.readFileSync(bookPath, 'utf8'));

console.log('🎨 Running Phase 4 Visual Audit across 74 Pages...\n');

let missingAssets = [];
let auditedPages = [];

const priorityPages = [3, 5, 9, 38, 39, 40, 41, 42, 43, 44, 46, 63, 64, 70, 74];

for (const page of pages) {
  // Check image_path
  const imgRelPath = page.image_path.startsWith('/') ? page.image_path.slice(1) : page.image_path;
  const fullImgPath = path.join(process.cwd(), 'public', imgRelPath);
  
  const exists = fs.existsSync(fullImgPath);
  if (!exists) {
    missingAssets.push({ page: page.page_number, path: page.image_path });
  }

  // If priority page, collect semantic info
  if (priorityPages.includes(page.page_number)) {
    auditedPages.push({
      page: page.page_number,
      title: page.title,
      image_path: page.image_path,
      exists,
      illustration_description: page.illustration_description,
      imageCaption: page.imageCaption,
      visual_continuity_context: page.visual_continuity_context
    });
  }
}

console.log(`🖼️ Total Pages Audited: ${pages.length}`);
console.log(`❌ Missing Assets: ${missingAssets.length}`);
if (missingAssets.length > 0) {
  missingAssets.forEach(m => console.error(`  - Page ${m.page}: ${m.path}`));
} else {
  console.log('✅ All 74 image assets physically exist in public/ directory!');
}

console.log('\n🔍 Priority Pages Semantic & Visual Alignment Report:');
console.log('---------------------------------------------------------');
for (const ap of auditedPages) {
  console.log(`\n📄 [Page ${ap.page}] ${ap.title}`);
  console.log(`   Image: ${ap.image_path} (Exists: ${ap.exists ? 'YES' : 'NO'})`);
  console.log(`   Caption: ${ap.imageCaption}`);
  console.log(`   Description: ${ap.illustration_description}`);
  console.log(`   Environment: ${ap.visual_continuity_context?.environment || 'N/A'}`);
  console.log(`   Mood: ${ap.visual_continuity_context?.mood || 'N/A'}`);
}
