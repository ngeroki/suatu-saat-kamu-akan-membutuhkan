const data = require("../src/data/book-pages.json");
const chaps = {};
data.forEach(p => {
  if (!chaps[p.chapter_code]) chaps[p.chapter_code] = { name: p.chapter_name, pages: [] };
  chaps[p.chapter_code].pages.push(p.page_number);
});
for (const k in chaps) {
  const info = chaps[k];
  console.log(`${k} ("${info.name}"): ${info.pages.length} pages (${info.pages[0]}..${info.pages[info.pages.length - 1]})`);
}
