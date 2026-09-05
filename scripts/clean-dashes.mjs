import fs from 'fs';
import path from 'path';

const patchesDir = './scripts/patches';
const files = fs.readdirSync(patchesDir).filter(f => f.endsWith('.json'));

let replacedTotal = 0;
for (const file of files) {
  const fullPath = path.join(patchesDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  const emMatches = (content.match(/—/g) || []).length;
  const enMatches = (content.match(/–/g) || []).length;
  if (emMatches > 0 || enMatches > 0) {
    console.log(`Cleaning ${file}: ${emMatches} em-dashes, ${enMatches} en-dashes`);
    // Replace em-dash with colon or comma
    content = content.replace(/ — /g, ': ').replace(/—/g, ': ');
    // Replace en-dash with " sampai " or hyphen
    content = content.replace(/4–8 Hz/g, '4 sampai 8 Hz').replace(/–/g, '-');
    fs.writeFileSync(fullPath, content, 'utf8');
    replacedTotal += (emMatches + enMatches);
  }
}
console.log(`Done! Replaced total ${replacedTotal} dashes in patches.`);
