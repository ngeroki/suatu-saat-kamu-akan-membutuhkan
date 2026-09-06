const fs = require('fs');
const path = require('path');
const os = require('os');

const c1 = path.join(os.homedir(), '.gemini', 'config', 'gemini_web_cookies.json');
const c2 = path.join(os.homedir(), '.gemini', 'config', 'gemini_web_cookies_ngempetbuko@gmail.com.json');

console.log('c1 (default):', fs.existsSync(c1));
if (fs.existsSync(c1)) {
  const d1 = JSON.parse(fs.readFileSync(c1, 'utf8'));
  console.log('c1 keys:', Object.keys(d1).length, 'has PSID:', !!d1['__Secure-1PSID'], 'has PSIDTS:', !!d1['__Secure-1PSIDTS']);
}

console.log('c2 (ngempetbuko):', fs.existsSync(c2));
if (fs.existsSync(c2)) {
  const d2 = JSON.parse(fs.readFileSync(c2, 'utf8'));
  console.log('c2 keys:', Object.keys(d2).length, 'has PSID:', !!d2['__Secure-1PSID'], 'has PSIDTS:', !!d2['__Secure-1PSIDTS']);
}

// Check other files in config
const cfgDir = path.join(os.homedir(), '.gemini', 'config');
const files = fs.readdirSync(cfgDir).filter(f => f.includes('cookies') || f.includes('embobot') || f.includes('ngempet'));
console.log('Matching config files:', files);
