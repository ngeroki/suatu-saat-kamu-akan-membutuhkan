const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const MCP_PORT = 9010;

function sendJsonRpc(endpoint, postData, sessionId = null) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(postData);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'Content-Length': Buffer.byteLength(dataStr)
    };
    if (sessionId) {
      headers['mcp-session-id'] = sessionId;
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: MCP_PORT,
      path: endpoint,
      method: 'POST',
      headers
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const sid = res.headers['mcp-session-id'] || sessionId;
        const lines = body.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              return resolve({ data: parsed, sessionId: sid });
            } catch (e) {}
          }
        }
        try {
          const parsed = JSON.parse(body);
          resolve({ data: parsed, sessionId: sid });
        } catch (e) {
          resolve({ data: body, sessionId: sid });
        }
      });
    });

    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function extractCookies(targetEmail) {
  const initRes = await sendJsonRpc('/mcp', {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      clientInfo: { name: 'cookie-extractor', version: '1.0.0' },
      capabilities: {}
    }
  });

  const sessionId = initRes.sessionId;
  const cdpRes = await sendJsonRpc('/mcp', {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'run',
      arguments: {
        code: 'const res = await browser.cdp("Storage.getCookies", {}); return res;'
      }
    }
  }, sessionId);

  const rawText = cdpRes.data.result?.content?.[0]?.text;
  const match = rawText.match(/\{\s*"cookies":\s*\[.*\]\s*\}/s);
  if (!match) throw new Error('Failed to parse cookies');

  const parsed = JSON.parse(match[0]);
  const googleCookies = parsed.cookies.filter(c => c.domain.includes('google'));
  
  const cookieDict = {};
  for (const c of googleCookies) {
    cookieDict[c.name] = c.value;
  }

  console.log(`Extracted ${Object.keys(cookieDict).length} Google cookies.`);
  console.log('Has __Secure-1PSID:', !!cookieDict['__Secure-1PSID']);
  console.log('Has __Secure-1PSIDTS:', !!cookieDict['__Secure-1PSIDTS']);

  if (targetEmail) {
    const outFile = path.join(os.homedir(), '.gemini', 'config', `gemini_web_cookies_${targetEmail}.json`);
    fs.writeFileSync(outFile, JSON.stringify(cookieDict, null, 2), 'utf8');
    console.log(`Saved to: ${outFile}`);
  }
  return cookieDict;
}

const target = process.argv[2] || 'embobotbnbb@gmail.com';
extractCookies(target).catch(console.error);
