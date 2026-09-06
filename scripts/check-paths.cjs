const bp = require('../src/data/book-pages.json');
[1, 15, 16, 30, 31, 45, 46, 59, 60, 74].forEach(pNum => {
  const p = bp.find(x => x.page_number === pNum);
  console.log(`Page ${p.page_number} (${p.chapter_code}): ${p.image_path}`);
});
