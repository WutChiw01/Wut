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
const R2SHOTS = ['r2_aerial', 'r2_aerial_w', 'r2_garden', 'r2_pavilion', 'r2_climb', 'r2_cut_GF', 'r2_cut_L2', 'r2_cut_L3', 'r2_corridor', 'r2_yoga', 'r2_lab', 'r2_rear'];
const all = ['pool_in', 'pool_side', 'pool_plan', 'pool_aerial', 'cafe_in', 'cafe_courts', 'cafe_ledge', 'lobby_open', 'lobby_in', 'studio_up', 'studio_lounge', 'cafe_cut', 'lane_in', 'lane_hall', 'lane_w0', 'lane_plan', 'canopy_out', 'canopy_under', 'canopy_deck', 'garden_open', 'ww_G', 'ww_L2', 'ww_L2_north', 'ww_G_north_ob', 'ww_G_south', 'ww_G_north', 'studio_in', 'studio_cyc', 'stair_hall', 'stair_up', 'suite_in', 'garden_eye', 'garden_palm', 'garden_top', 'walkway_l2', 'pods', 'core_in', 'palm_crown', 'catwalk_stair', 'catwalk_door_int', 'east_elev', 'east_climb', 'rear_gf', 'rear_pool', 'rear_roof', 'left_nw', 'left_top', 'entrance_plan', 'entrance_pond', 'entrance_front', 'catwalk_ext', 'catwalk_aerial', 'catwalk_int', 'left_elev', 'left_oblique', 'left_garden', 'rear_elev', 'rear_wide', 'rear_ne', 'rear_nw', 's1', 's1_dusk', 's2', 's3', 's4', 's5', 's6', 's7', 'oblique', 'hall_aisle', 'hall_roof', 'gallery_l2', 'clinic', 'plan_gf', 'plan_l2', 'plan_l3'];
const W = 1600, H = 900;
const SCHEME = process.env.SCHEME || '';
const OUT = process.env.DAEFILE ? 'sketchup/check' : SCHEME ? `snapshots_${SCHEME}` : 'snapshots';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
fs.mkdirSync(path.join(here, OUT), { recursive: true });
for (const id of ids.length ? ids : process.env.SCHEME === 'r2' ? R2SHOTS : all) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log(`[${id}] ${m.text()}`));
  page.on('pageerror', (e) => { console.log(`[${id}] pageerror`, e.message); process.exit(1); });
  await page.goto(`http://localhost:${port}/viewer.html?shot=${id}&w=${W}&h=${H}${SCHEME ? '&scheme=' + SCHEME : ''}${process.env.DAEFILE ? '&dae=' + process.env.DAEFILE : ''}`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 300000 });
  await page.screenshot({ path: path.join(here, OUT, `${id}.png`) });
  console.log('rendered', id);
  await page.close();
}
if (process.env.DAE) {
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  page.on('pageerror', (e) => { console.log('dae pageerror', e.message); process.exit(1); });
  await page.goto(`http://localhost:${port}/viewer.html?shot=s7&w=640&h=360`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 300000 });
  const out = path.join(here, 'sketchup'); fs.mkdirSync(path.join(out, 'textures'), { recursive: true });
  const res = await page.evaluate(() => window.exportDAE());
  fs.writeFileSync(path.join(out, 'MyPlace_Master_vE1.dae'), res.dae);
  for (const t of res.textures) fs.writeFileSync(path.join(out, t.file), Buffer.from(t.url.split(',')[1], 'base64'));
  console.log('exported DAE', JSON.stringify(res.stats), (res.dae.length / 1e6).toFixed(1) + ' MB');
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
