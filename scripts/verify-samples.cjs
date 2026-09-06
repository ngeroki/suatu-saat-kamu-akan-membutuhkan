const data = require("../src/data/visual-narrative-74.json");
const testPages = [1, 15, 16, 30, 31, 45, 46, 60, 61, 74];

console.log("=== SAMPLE PAGE AUDIT ===");
for (const num of testPages) {
  const p = data.find(x => x.page_number === num);
  const words = p.side_a_text.trim().split(/\s+/).length;
  console.log(`\n[PAGE ${String(p.page_number).padStart(2, '0')}] ${p.chapter_code}: ${p.title}`);
  console.log(`Side A (${words} words): "${p.side_a_text}"`);
  console.log(`Visual Concept: ${p.visual_concept}`);
  console.log(`Prompt: ${p.image_prompt.substring(0, 120)}...`);
  console.log(`Reflection: ${p.self_reflection_check}`);
}
