// Renders every camera preset to snapshots/*.png with headless Chromium (SwiftShader WebGL).
// usage: node render.mjs [shot ...]   (needs `playwright` + the local http server below)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const f = path.join(here, decodeURIComponent(req.url.split('?')[0]).replace(/^\/$/, '/viewer.html'));
  fs.readFile(f, (e, d) => (e ? (res.writeHead(404), res.end()) : (res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }), res.end(d))));
}).listen(0);
const port = server.address().port;

const ids = process.argv.slice(2);
const all = ['entrance_plan', 'entrance_pond', 'entrance_front', 'catwalk_ext', 'catwalk_aerial', 'catwalk_int', 'left_elev', 'left_oblique', 'left_garden', 'rear_elev', 'rear_wide', 'rear_ne', 'rear_nw', 's1', 's1_dusk', 's2', 's3', 's4', 's5', 's6', 's7', 'oblique', 'hall_aisle', 'hall_roof', 'gallery_l2', 'clinic', 'plan_gf', 'plan_l2', 'plan_l3'];
const W = 1600, H = 900;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
fs.mkdirSync(path.join(here, 'snapshots'), { recursive: true });
for (const id of ids.length ? ids : all) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log(`[${id}] ${m.text()}`));
  page.on('pageerror', (e) => { console.log(`[${id}] pageerror`, e.message); process.exit(1); });
  await page.goto(`http://localhost:${port}/viewer.html?shot=${id}&w=${W}&h=${H}`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 300000 });
  await page.screenshot({ path: path.join(here, 'snapshots', `${id}.png`) });
  console.log('rendered', id);
  await page.close();
}
if (process.env.GLB) {
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  await page.goto(`http://localhost:${port}/viewer.html?shot=s7&w=640&h=360`);
  await page.waitForFunction('window.__ready === true');
  const b64 = await page.evaluate(() => window.exportGLB());
  fs.writeFileSync(path.join(here, 'MyPlace_Master_vD6.glb'), Buffer.from(b64, 'base64'));
  console.log('exported GLB');
}
await browser.close();
server.close();
