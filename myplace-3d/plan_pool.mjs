// 2D plan + section of the rear pool court (prefab pool 3 × 6 m, rim +0.80). usage: node plan_pool.mjs → plans/pool_court.{svg,png}
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const S = 70, X0 = 9.5, Y0 = 27.6, MX = 70, MY = 120; // plan: x east → right, y north → DOWN? (north up)
const W = 1900, H = 1000;
const px = (x) => MX + (x - X0) * S;
const py = (y) => MY + (Y0 + 9.2 - y) * S; // north at top
const f = (n) => n.toFixed(1);
const o = [];
const R = (x0, x1, y0, y1, a = {}) => o.push(`<rect x="${f(px(x0))}" y="${f(py(y1))}" width="${f((x1 - x0) * S)}" height="${f((y1 - y0) * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? 'none'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''} ${a.op ? `opacity="${a.op}"` : ''}/>`);
const L = (x0, y0, x1, y1, a = {}) => o.push(`<line x1="${f(px(x0))}" y1="${f(py(y0))}" x2="${f(px(x1))}" y2="${f(py(y1))}" stroke="${a.stroke ?? '#555'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
const C = (x, y, r, a = {}) => o.push(`<circle cx="${f(px(x))}" cy="${f(py(y))}" r="${f(r * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? '#555'}" stroke-width="${a.sw ?? 1}"/>`);
const T = (x, y, s, size = 13, a = {}) => o.push(`<text paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" x="${f(px(x))}" y="${f(py(y))}" font-size="${size}" fill="${a.fill ?? '#111'}" text-anchor="${a.anchor ?? 'middle'}" ${a.bold ? 'font-weight="700"' : ''} ${a.rot ? `transform="rotate(${a.rot} ${f(px(x))} ${f(py(y))})"` : ''}>${s}</text>`);
const dimX = (x0, x1, y, label, off = 0) => { const yy = py(y) + off; o.push(`<g stroke="#0b57d0" fill="#0b57d0"><line x1="${f(px(x0))}" y1="${f(yy)}" x2="${f(px(x1))}" y2="${f(yy)}"/><line x1="${f(px(x0))}" y1="${f(yy - 6)}" x2="${f(px(x0))}" y2="${f(yy + 6)}"/><line x1="${f(px(x1))}" y1="${f(yy - 6)}" x2="${f(px(x1))}" y2="${f(yy + 6)}"/><text x="${f((px(x0) + px(x1)) / 2)}" y="${f(yy - 5)}" font-size="12" text-anchor="middle" stroke="none">${label}</text></g>`); };
const dimY = (y0, y1, x, label, off = 0) => { const xx = px(x) + off; o.push(`<g stroke="#0b57d0" fill="#0b57d0"><line x1="${f(xx)}" y1="${f(py(y0))}" x2="${f(xx)}" y2="${f(py(y1))}"/><line x1="${f(xx - 6)}" y1="${f(py(y0))}" x2="${f(xx + 6)}" y2="${f(py(y0))}"/><line x1="${f(xx - 6)}" y1="${f(py(y1))}" x2="${f(xx + 6)}" y2="${f(py(y1))}"/><text x="${f(xx + 8)}" y="${f((py(y0) + py(y1)) / 2)}" font-size="12" stroke="none" transform="rotate(90 ${f(xx + 8)} ${f((py(y0) + py(y1)) / 2)})" text-anchor="middle">${label}</text></g>`); };

// site
R(X0 - 0.5, 25, Y0, 36.8, { fill: '#e9f1df' }); // lawn context
// rear fence (skewed): through (0.2,34.1) and (20.2,37.1)
L(X0 - 0.5, 34.1 + 0.15 * (X0 - 0.5 - 0.2), 24.9, 34.1 + 0.15 * (24.9 - 0.2), { stroke: '#333', sw: 3 }); T(23.8, 37.9 - 0.2, 'รั้วหลังเฉียง', 11, { fill: '#333', anchor: 'end' });
// building ground floor edge (y 25.1…30.1) with glass façade
R(X0 - 0.5, 22.2, Y0, 30.1, { fill: '#f7f7f4', stroke: '#444', sw: 2 });
R(X0 - 0.5, 22.2, 30.0, 30.12, { fill: '#7fb5d6', stroke: '#7fb5d6' });
// clinic zones
R(10.2, 18.4, Y0, 30.1, { fill: '#eef3f7', stroke: '#444', sw: 1.5 }); T(14.3, 28.8, 'คลินิกกายภาพบำบัด (GF) — ห้องฟื้นฟูหันหน้าสู่สระ', 13, { bold: true });
R(15.4, 17.4, 29.95, 30.25, { fill: '#cfe6f2', stroke: '#0b57d0', sw: 1.5 }); T(16.4, 29.6, 'ประตูกระจกเลื่อน 2.00 ม.', 11, { fill: '#0b57d0' });
R(18.4, 22.2, Y0, 30.1, { fill: '#f1ece3', stroke: '#444' }); T(20.3, 28.8, 'ห้องปีนผา', 12);
R(X0 - 0.5, 10.2, Y0, 30.1, { fill: '#f1f1ee', stroke: '#444' }); T(9.9, 28.8, 'ห้องแต่งตัว', 12, { anchor: 'start' });
// deck
R(11.4, 21.4, 30.1, 31.6, { fill: '#e2b886', stroke: '#9b6b33' }); R(11.4, 21.4, 34.6, 35.6, { fill: '#e2b886', stroke: '#9b6b33' }); R(11.4, 13.4, 31.6, 34.6, { fill: '#e2b886', stroke: '#9b6b33' }); R(19.4, 21.4, 31.6, 34.6, { fill: '#e2b886', stroke: '#9b6b33' });
for (let x = 11.4; x < 21.4; x += 0.1) L(x, 30.1, x, 31.6, { stroke: '#caa06a', sw: 0.5 });
// pool
R(13.34, 19.46, 31.54, 34.66, { fill: '#c9a46c', stroke: '#333', sw: 1.5 }); // cladding + capping
R(13.72, 19.08, 31.92, 34.28, { fill: '#7fd0ea', stroke: '#2a8fb3', sw: 1.5 });
R(13.52, 19.28, 31.72, 34.48, { stroke: '#8a6a2a', sw: 1, dash: '3 2' });
R(14.3, 18.5, 33.6, 34.0, { fill: '#9fe0f2', stroke: '#2a8fb3' }); T(16.4, 33.8, 'ม้านั่งในสระ (ลึก 0.45)', 10);
for (let i = 1; i <= 3; i++) R(15.8, 17.0, 31.6 - 0.32 * (4 - i), 31.6 - 0.32 * (3 - i), { fill: '#e0c08a', stroke: '#6a4a1a' });
for (let i = 1; i <= 4; i++) L(15.8, 31.9 + 0.3 * i, 17.0, 31.9 + 0.3 * i, { stroke: '#2a8fb3' });
T(16.4, 30.6, 'บันไดลงสระ 3 ขั้น (สูงขั้นละ 0.27) + ราวสแตนเลส', 11, { bold: true, fill: '#6a3' });
L(15.77, 30.6, 15.77, 32.4, { stroke: '#222', sw: 2 }); L(17.03, 30.6, 17.03, 32.4, { stroke: '#222', sw: 2 });
T(16.4, 33.1, 'สระสำเร็จรูป 3.00 × 6.00 ม.', 16, { bold: true, fill: '#04506b' }); T(16.4, 32.75, 'ขอบสูงจากพื้น +0.80 · ผิวน้ำต่ำกว่าขอบ 0.15 · ลึก 1.30', 12, { fill: '#04506b' });
for (const x of [14.4, 16.4, 18.4]) R(x - 0.1, x + 0.1, 34.2, 34.28, { fill: '#555' });
R(18.9, 19.3, 31.92, 31.95, { fill: '#222' }); T(19.1, 31.65, 'สกิมเมอร์', 9);
// east plant room + shower
R(21.1, 22.9, 31.6, 33.5, { fill: '#d0d3d6', stroke: '#111', sw: 2 }); T(22.0, 32.6, 'ห้องเครื่องสระ', 11, { bold: true }); T(22.0, 32.3, 'กรอง·UV·ฮีตเตอร์', 9);
C(20.4, 31.9, 0.35, { fill: '#ccc', stroke: '#555' }); T(20.4, 31.4, 'ฝักบัว', 10);
L(19.4, 32.9, 21.1, 32.9, { stroke: '#c0392b', sw: 2 }); T(20.25, 33.05, 'ท่อ (ใต้ดิน)', 9, { fill: '#c0392b' });
// planters, loungers, umbrella
R(14.0, 16.0, 34.95, 35.5, { fill: '#7aa55a', stroke: '#4a6f2f' }); R(16.6, 18.6, 34.95, 35.5, { fill: '#7aa55a', stroke: '#4a6f2f' }); T(16.3, 35.8, 'กระบะต้นไม้', 10);
for (const y of [32.2, 33.4]) R(11.7, 12.9, y - 0.3, y + 0.3, { fill: '#fff', stroke: '#777' });
C(12.3, 34.1, 1.3, { fill: 'rgba(200,190,170,0.5)', stroke: '#887' }); T(12.3, 34.1, 'ร่ม', 10); T(12.3, 32.8, 'เตียงอาบแดด', 9);
// dims
dimX(13.4, 19.4, 36.1, '6.00 ม.'); dimY(31.6, 34.6, 20.2, '3.00 ม.');
dimY(30.1, 31.6, 10.9, 'ชานไม้ 1.50 ม.'); dimX(11.4, 13.4, 36.0, '2.00'); dimX(19.4, 21.4, 36.0, '2.00'); dimY(34.6, 35.6, 14.0, '1.0');

// section A–A through the pool (north–south) drawn bottom-left
const sx0 = 1190, sy0 = 600, sc = 62; // section scale 90 px/m, y horizontal
const sY = (y) => sx0 + (y - 29.6) * sc, sZ = (z) => sy0 - z * sc;
o.push(`<g>
<text x="${sx0}" y="${sy0 - 3.7 * sc - 18}" font-size="16" font-weight="700" fill="#111">ภาคตัด A–A ผ่านกลางสระ (ทิศเหนือ → ขวา)</text>
<line x1="${sY(29.6)}" y1="${sZ(0)}" x2="${sY(36.9)}" y2="${sZ(0)}" stroke="#333" stroke-width="2"/>
<rect x="${sY(30.0)}" y="${sZ(3.5)}" width="${0.1 * sc}" height="${3.5 * sc}" fill="#cfe6f2" stroke="#7fb5d6"/>
<rect x="${sY(29.6)}" y="${sZ(0.07)}" width="${(31.6 - 29.6) * sc}" height="${0.07 * sc}" fill="#e2b886" stroke="#9b6b33"/>
<rect x="${sY(34.6)}" y="${sZ(0.07)}" width="${(35.6 - 34.6) * sc}" height="${0.07 * sc}" fill="#e2b886" stroke="#9b6b33"/>
<rect x="${sY(31.6)}" y="${sZ(0.87)}" width="${3 * sc}" height="${(0.87 + 0.55) * sc}" fill="#7fd0ea" stroke="#2a8fb3" stroke-width="2"/>
<rect x="${sY(31.6)}" y="${sZ(0.72)}" width="${3 * sc}" height="${(0.72 + 0.55) * sc}" fill="#9fe0f2" opacity="0.9"/>
<rect x="${sY(31.6)}" y="${sZ(0.87)}" width="${0.12 * sc}" height="${(0.87 + 0.55) * sc}" fill="#c9a46c" stroke="#333"/>
<rect x="${sY(34.48)}" y="${sZ(0.87)}" width="${0.12 * sc}" height="${(0.87 + 0.55) * sc}" fill="#c9a46c" stroke="#333"/>
<rect x="${sY(31.58)}" y="${sZ(0.87)}" width="${0.28 * sc}" height="${0.06 * sc}" fill="#e0c08a" stroke="#6a4a1a"/>
<rect x="${sY(34.32)}" y="${sZ(0.87)}" width="${0.28 * sc}" height="${0.06 * sc}" fill="#e0c08a" stroke="#6a4a1a"/>
<rect x="${sY(34.08)}" y="${sZ(0.17)}" width="${0.4 * sc}" height="${(0.17 + 0.0) * sc}" fill="#9fe0f2" stroke="#2a8fb3"/>
<rect x="${sY(31.6)}" y="${sZ(-0.55)}" width="${3 * sc}" height="${0.12 * sc}" fill="#bbb" stroke="#666"/>
<line x1="${sY(29.6)}" y1="${sZ(0.8 + 0.07)}" x2="${sY(36.9)}" y2="${sZ(0.8 + 0.07)}" stroke="#c0392b" stroke-dasharray="6 4"/>
<text x="${sY(36.9) - 4}" y="${sZ(0.87) - 6}" font-size="12" text-anchor="end" fill="#c0392b">ขอบสระ +0.87 (สูงจากชานไม้ 0.80)</text>
<text x="${sY(31.6)}" y="${sZ(-0.9) + 34}" font-size="12" fill="#333">ฐานบดอัด + ฐานรองสระ · พื้นสระ −0.55 (ฝังลึก 0.55 ม.)</text>
<text x="${sY(32.6)}" y="${sZ(0.4)}" font-size="12" fill="#04506b">น้ำ (ลึก 1.30)</text>
<text x="${sY(30.05)}" y="${sZ(3.5) - 6}" font-size="12">กระจกคลินิก</text>
<line x1="${sY(31.6)}" y1="${sZ(-0.9)}" x2="${sY(34.6)}" y2="${sZ(-0.9)}" stroke="#0b57d0"/><text x="${sY(33.1)}" y="${sZ(-0.9) + 14}" font-size="12" text-anchor="middle" fill="#0b57d0">3.00 ม.</text>
</g>`);
const title = `<text x="120" y="52" font-size="32" font-weight="700" fill="#111">ผังลานสระด้านหลัง — สระสำเร็จรูป 3 × 6 ม. ขอบสูง +0.80</text><text x="120" y="82" font-size="16" fill="#555">MY PLACE REV D.12 · ทิศเหนืออยู่ด้านบน · หน่วย เมตร · อยู่บนแกนประตูกระจกเลื่อนของคลินิก (x = 16.40)</text>`;
const notes = ['• สระตั้งเหนือพื้นดิน: ผิวขอบ +0.87 (สูง 0.80 จากชานไม้ +0.07) นั่งขอบแล้วหมุนตัวลงสระ/ขึ้นสระได้ง่าย · ฝังตัวสระลงดิน 0.55 ม. (ก้นสระ −0.55 · ลึก 1.30 ม.)', '• ทางลง: บันไดไม้ 3 ขั้นตรงประตูคลินิก (ลูกตั้ง 0.27 ม.) + ราวสแตนเลสสองข้าง + ขั้นใต้น้ำ 4 ขั้น (ผู้ป่วยกายภาพเดินจากประตู 2.00 ม. ลงสระได้เลย) · ขอบสระกว้าง 0.32 ม. ใช้เป็นที่นั่ง', '• ห้องเครื่อง (กรอง AFM, คลอรีนเกลือ, UV-C, ฮีตเตอร์ 30–32 °C) อยู่ทิศตะวันออกติดชานไม้ ท่อเข้า-ออกฝังใต้ชานไม้', '• รั้วหลังเฉียง: ชานฝั่งเหนือเหลือ ≈ 1.0 ม. ที่ปลายตะวันออก (สเปกระยะรั้ว ≥ 1.0 ม. จากสระ) · สระอยู่ห่างผนังอาคาร 1.50 ม.'];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif"><rect width="100%" height="100%" fill="#fff"/>${title}${o.join('\n')}<g transform="translate(70,860)" font-size="14" fill="#222">${notes.map((n, i) => `<text y="${i * 26}">${n}</text>`).join('')}</g></svg>`;
fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
fs.writeFileSync(path.join(here, 'plans', 'pool_court.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', 'pool_court.png') });
await browser.close();
console.log('plan pool_court');
