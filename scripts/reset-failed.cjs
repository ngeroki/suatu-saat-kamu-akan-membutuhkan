const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'generation_progress.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
data.failed = [];
fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
console.log(`Reset failed list. Total completed intact: ${data.completed.length} pages (${data.completed.join(', ')})`);
