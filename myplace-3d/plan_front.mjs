// Layout of the two FRONT towers C1/C2 (+ C0/E0/W0) with the ground-floor column grid. → plans/front_towers_grid.{svg,png}
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const S = 26, XMIN = -6.5, YMAX = 37.8, ML = 70, MT = 150, W = 2700, H = 1830;
const X = (x) => ML + (x - XMIN) * S, Y = (y) => MT + (YMAX - y) * S, f = (n) => n.toFixed(1);
const o = [];
const R = (x0, x1, y0, y1, a = {}) => o.push(`<rect x="${f(X(x0))}" y="${f(Y(y1))}" width="${f((x1 - x0) * S)}" height="${f((y1 - y0) * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? 'none'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''} ${a.rx ? `rx="${a.rx * S}"` : ''}/>`);
const L = (x0, y0, x1, y1, a = {}) => o.push(`<line x1="${f(X(x0))}" y1="${f(Y(y0))}" x2="${f(X(x1))}" y2="${f(Y(y1))}" stroke="${a.stroke ?? '#555'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
const C = (x, y, r, a = {}) => o.push(`<circle cx="${f(X(x))}" cy="${f(Y(y))}" r="${f(r * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? '#555'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
const E = (x, y, a_, b_, a = {}) => o.push(`<ellipse cx="${f(X(x))}" cy="${f(Y(y))}" rx="${f(a_ * S)}" ry="${f(b_ * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? '#555'}" stroke-width="${a.sw ?? 1}"/>`);
const T = (x, y, s, size = 12, a = {}) => o.push(`<text paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" x="${f(X(x))}" y="${f(Y(y))}" font-size="${size}" fill="${a.fill ?? '#111'}" text-anchor="${a.anchor ?? 'middle'}" ${a.bold ? 'font-weight="700"' : ''} ${a.rot ? `transform="rotate(${a.rot} ${f(X(x))} ${f(Y(y))})"` : ''}>${s}</text>`);
const bub = (x, y, t) => o.push(`<circle cx="${f(X(x))}" cy="${f(Y(y))}" r="12" fill="#fff" stroke="#8a7a00" stroke-width="1.4"/><text x="${f(X(x))}" y="${f(Y(y) + 4.5)}" font-size="12" font-weight="700" text-anchor="middle" fill="#6a5d00">${t}</text>`);
const col = (x, y, s = 0.3, k = 'conf') => { const st = { conf: ['#111', '#000'], assume: ['#fff', '#b00'], wall: ['#d9d9d9', '#777'] }[k]; R(x - s / 2, x + s / 2, y - s / 2, y + s / 2, { fill: st[0], stroke: st[1], sw: k === 'conf' ? 1 : 1.6, dash: k === 'assume' ? '3 2' : '' }); };
const dimX = (x0, x1, y, label, off = 0) => { const yy = Y(y) + off; o.push(`<g stroke="#0b57d0" fill="#0b57d0"><line x1="${f(X(x0))}" y1="${f(yy)}" x2="${f(X(x1))}" y2="${f(yy)}"/><line x1="${f(X(x0))}" y1="${f(yy - 6)}" x2="${f(X(x0))}" y2="${f(yy + 6)}"/><line x1="${f(X(x1))}" y1="${f(yy - 6)}" x2="${f(X(x1))}" y2="${f(yy + 6)}"/><text x="${f((X(x0) + X(x1)) / 2)}" y="${f(yy - 5)}" font-size="12" text-anchor="middle" stroke="none">${label}</text></g>`); };
const dimY = (y0, y1, x, label, off = 0) => { const xx = X(x) + off; o.push(`<g stroke="#0b57d0" fill="#0b57d0"><line x1="${f(xx)}" y1="${f(Y(y0))}" x2="${f(xx)}" y2="${f(Y(y1))}"/><line x1="${f(xx - 6)}" y1="${f(Y(y0))}" x2="${f(xx + 6)}" y2="${f(Y(y0))}"/><line x1="${f(xx - 6)}" y1="${f(Y(y1))}" x2="${f(xx + 6)}" y2="${f(Y(y1))}"/><text x="${f(xx - 6)}" y="${f((Y(y0) + Y(y1)) / 2)}" font-size="12" text-anchor="middle" stroke="none" transform="rotate(-90 ${f(xx - 6)} ${f((Y(y0) + Y(y1)) / 2)})">${label}</text></g>`); };

// ── context ──
R(XMIN, 34.5, -23, YMAX, { fill: '#f3f6ee' });
R(-4.4, 34.5, -22, -10.15, { fill: '#ebe6da' }); T(-1.0, -21.8, 'ลานหน้าอาคาร / ทางเข้าจากถนน', 12, { fill: '#777' });
L(-4.4, -23, -4.4, YMAX, { stroke: '#666', sw: 1.4, dash: '14 4 2 4' }); T(-4.55, 33.0, 'เขตที่ดินตะวันตก −4.40', 11, { fill: '#555', rot: -90 });
// hall + west wing + rear complex outlines
R(-3.9, -0.8, -9.0, 30.1, { fill: '#f6efe2', stroke: '#777', sw: 1.2 }); T(-2.35, 2.0, 'ปีกตะวันตก', 11, { fill: '#777', rot: -90 });
R(-0.8, 22.3, -10.15, 24.1, { fill: '#eef2f0', stroke: '#222', sw: 2.4 });
for (const [x0, y0] of [[0.4, -8.4], [7.15, -8.4], [13.9, -8.4], [0.4, 9.7], [7.15, 9.7], [13.9, 9.7]]) R(x0, x0 + 6.1, y0, y0 + 13.4, { fill: '#cfe6d3', stroke: '#8fbf9a', sw: 0.8 });
T(10.7, 7.35, 'โถงแบดมินตัน 6 คอร์ท · ทางเดินกลาง 4.70 ม.', 11, { fill: '#666' });
R(-1.8, 22.2, 24.1, 30.1, { fill: '#f7f4ee', stroke: '#444', sw: 1.6 }); T(10.2, 27.6, 'อาคารหลัง (คลินิก · เปลี่ยนชุด · ปีนผา)', 11, { fill: '#777' });
R(-3.9, -1.8, 22.0, 30.1, { fill: '#e6e8ea', stroke: '#666' });
R(24.5, 31.1, -9, 5.4, { fill: '#cfdcf0', stroke: '#8aa' }); R(24.5, 31.1, 5.4, 19.8, { fill: '#cfdcf0', stroke: '#8aa' }); T(27.8, 0, 'พิกเคิลบอล', 11, { fill: '#678', rot: -90 });
// front ribbon + plinth + ponds + path
o.push(`<path d="M${f(X(3.8))},${f(Y(-10.4))} L${f(X(3.8))},${f(Y(-13.6))} Q${f(X(3.8))},${f(Y(-15.4))} ${f(X(5.6))},${f(Y(-15.4))} L${f(X(15.9))},${f(Y(-15.4))} Q${f(X(17.7))},${f(Y(-15.4))} ${f(X(17.7))},${f(Y(-13.6))} L${f(X(17.7))},${f(Y(-10.4))} Z" fill="#e6dcc6" stroke="#9a8a66" stroke-width="1.2"/>`);
R(9.3, 12.2, -15.4, -10.4, { fill: '#b9b2a2' }); T(10.75, -14.2, 'ทางเข้า', 10, { fill: '#555' });
R(4.25, 17.25, -12.5, -10.15, { fill: 'rgba(40,50,70,0.10)', stroke: '#1e293b', sw: 1.4, dash: '8 4' }); T(10.75, -12.95, 'หลังคา Solar Ribbon (สันจั่ว +10.75)', 10, { fill: '#1e293b' });
for (const cx of [7.35, 14.15]) { E(cx, -12.0, 2.1, 2.05, { fill: '#d8cdb8', stroke: '#8a7a55', sw: 1.2 }); E(cx, -12.0, 1.6, 1.55, { fill: '#7fb0b8', stroke: '#4a7f88', sw: 1 }); }
R(5.3, 9.3, -14.95, -14.45, { fill: '#c9b89a', stroke: '#8a7a55' }); R(12.2, 16.2, -14.95, -14.45, { fill: '#c9b89a', stroke: '#8a7a55' });
L(-0.8, -10.15, 22.3, -10.15, { stroke: '#222', sw: 3 }); R(9.55, 11.95, -10.45, -10.0, { fill: '#cfe6f2', stroke: '#0b57d0', sw: 1.4 }); T(10.75, -9.6, 'ประตูอัตโนมัติ 2.40 ม.', 10, { fill: '#0b57d0' });
for (const [a, b] of [[1.4, 6.6], [14.9, 20.1]]) R(a, b, -10.4, -10.0, { fill: '#cfe6f2', stroke: '#7fb5d6' });
// palms
for (const [x, y, t] of [[-4.0, 23.8, 'P1'], [-3.67, 15.46, 'P2'], [-3.24, 12.08, 'P3']]) { C(x, y, 0.22, { fill: '#8a6d4b', stroke: '#4a3920' }); T(x - 0.7, y, t, 9, { fill: '#4a3920' }); }

// ── GRID ──
const GX = [[0.2, '1'], [5.2, '2'], [10.2, '3'], [15.2, '4'], [20.2, '5']];
const GY = [[-1.65, 'A'], [7.35, 'B'], [16.35, 'C'], [25.1, 'D'], [28.1, 'E']];
for (const [x, t] of GX) { L(x, -11.2, x, 31.2, { stroke: '#b3a000', sw: 0.9, dash: '14 4 2 4' }); bub(x, 32.0, t); bub(x, -17.0, t); }
for (const [y, t] of GY) { L(-5.2, y, 24.5, y, { stroke: '#b3a000', sw: 0.9, dash: '14 4 2 4' }); bub(-5.9, y, t); bub(25.2, y, t); }
// C1/C2 axis lines (not on the 5 m grid)
L(7.35, -17.5, 7.35, -9.5, { stroke: '#b3a000', sw: 0.8, dash: '6 3' }); L(14.15, -17.5, 14.15, -9.5, { stroke: '#b3a000', sw: 0.8, dash: '6 3' }); L(2.0, -11.3, 19.5, -11.3, { stroke: '#b3a000', sw: 0.8, dash: '6 3' });
bub(7.35, -18.4, 'C1'); bub(14.15, -18.4, 'C2'); bub(19.9, -11.3, 'F');

// ── COLUMNS ──
const wallCols = [-8.0, -3.0, 2.0, 12.5, 17.5, 22.0];
for (const y of wallCols) { col(-0.65, y, 0.3, 'wall'); col(22.15, y, 0.3, 'wall'); }
for (const x of [0.2, 20.2]) for (const y of [-1.65, 16.35]) col(x, y, 0.4, 'assume');
for (const [x] of GX) for (const y of [25.1, 28.1]) col(x, y, 0.3, 'conf');
// tower cores on the B line and the two front cores
for (const [x, y, nm] of [[0.2, 7.35, 'W0'], [10.13, 7.35, 'C0'], [20.2, 7.35, 'E0']]) { C(x, y, nm === 'W0' ? 0.6 : 0.62, { fill: '#e9b88f', stroke: '#8a3a12', sw: 1.6 }); C(x, y, 0.16, { fill: '#222' }); T(x, y - 1.15, nm, 12, { bold: true, fill: '#8a3a12' }); }
for (const [x, nm] of [[7.35, 'C1'], [14.15, 'C2']]) { C(x, -11.3, 0.72, { fill: '#e9b88f', stroke: '#8a3a12', sw: 1.8 }); C(x, -11.3, 0.45, { fill: '#c7683a', stroke: '#661a09', sw: 1.2 }); R(x - 0.125, x + 0.125, -11.425, -11.175, { fill: '#111' }); T(x, -9.1, nm, 14, { bold: true, fill: '#8a3a12' }); C(x, -11.3, 0.9, { stroke: '#4a7f88', dash: '3 2', sw: 1 }); R(x - 0.8, x + 0.8, -12.1, -10.5, { stroke: '#0b57d0', sw: 1, dash: '4 3' }); }

// ── DIMENSIONS ──
dimX(0.2, 5.2, -19.6, '5.00'); dimX(5.2, 10.2, -19.6, '5.00'); dimX(10.2, 15.2, -19.6, '5.00'); dimX(15.2, 20.2, -19.6, '5.00'); dimX(0.2, 20.2, -20.8, '20.00 ม. (กริด 1–5)');
dimX(7.35, 14.15, -15.9, 'C1–C2 = 6.80 ม. (กึ่งกลาง x = 10.75)');
dimY(-1.65, 7.35, 24.7, '9.00', 30); dimY(7.35, 16.35, 24.7, '9.00', 30); dimY(16.35, 25.1, 24.7, '8.75', 30); dimY(25.1, 28.1, 24.7, '3.00', 30);
dimY(-11.3, -10.15, 23.4, '1.15', 0); dimY(-10.15, -1.65, -5.5, '8.50 (ผนังหน้า → A)', 0);
// legend
const lg = [[2, 'เสาตามสเปก (แถว D/E · 10 ต้น 0.30×0.30)', 'conf'], [3, 'ไส้เหล็กหอ C1/C2 (H250) และเสาแกน W0/C0/E0', 'core'], [4, 'เสาพอร์ทัล Grid 1 และ 5 — สมมติ ต้องยืนยัน', 'assume'], [5, 'เสาริมผนังโถงตามโมเดล (ใช้ยึดทางเดิน +4.50) — ต้องยืนยัน', 'wall']];
o.push(`<g transform="translate(1220,125)" font-size="13">${lg.map(([i, t, k], n) => `<g transform="translate(0,${n * 24})">${k === 'core' ? `<circle cx="9" cy="8" r="8" fill="#e9b88f" stroke="#8a3a12"/>` : `<rect width="16" height="16" fill="${{ conf: '#111', assume: '#fff', wall: '#d9d9d9' }[k]}" stroke="${{ conf: '#000', assume: '#b00', wall: '#777' }[k]}" ${k === 'assume' ? 'stroke-dasharray="3 2"' : ''} stroke-width="1.6"/>`}<text x="26" y="13">${t}</text></g>`).join('')}</g>`);

// ── schedule table ──
const rows = [['D1–D5', 'D / 1–5', '0.20 · 5.20 · 10.20 · 15.20 · 20.20', '25.10', 'เสา คสล. 0.30 (แถว A อาคารหลัง)', 'สเปก §3.2'], ['E1–E5', 'E / 1–5', '0.20 … 20.20', '28.10', 'เสา คสล. 0.30 ฝังในผนังห้อง', 'สเปก §3.2'], ['W0', 'B / 1', '0.20', '7.35', 'แกนหอ W0 (ครึ่งซีก→ใช้เต็มวงกลมในโมเดล)', 'สเปก §2.3'], ['C0', 'B / 3 (−0.07)', '10.13', '7.35', 'แกนกลมหอ C0 (เปียก)', 'สเปก §2.3'], ['E0', 'B / 5', '20.20', '7.35', 'แกนหอ E0', 'สเปก §2.3'], ['C1', 'F / —', '7.35', '−11.30', 'H250 + ฐานรากเฉพาะ (ฐานแผ่/เสาเข็ม)', 'สเปก §3.3'], ['C2', 'F / —', '14.15', '−11.30', 'H250 + ฐานรากเฉพาะ', 'สเปก §3.3'], ['พอร์ทัล', 'A,C / 1,5', '0.20 · 20.20', '−1.65 · 16.35', 'เสาพอร์ทัล (สมมติ)', 'ยืนยัน'], ['ริมผนัง', '— / ขอบ', '−0.65 · 22.15', '−8, −3, 2, 12.5, 17.5, 22', 'เสาริมผนังตามโมเดล', 'ยืนยัน']];
const tx = 1220, ty = 300;
o.push(`<g transform="translate(${tx},${ty})" font-size="12"><text x="0" y="-14" font-size="18" font-weight="700">ตารางเสา/หอ (พิกัด x, y เมตร)</text>${['รหัส', 'กริด', 'x', 'y', 'ชนิด', 'ที่มา'].map((h, i) => `<text x="${[0, 70, 160, 400, 560, 860][i]}" y="0" font-weight="700">${h}</text>`).join('')}<line x1="0" y1="6" x2="960" y2="6" stroke="#333"/>${rows.map((r, n) => r.map((c, i) => `<text x="${[0, 70, 160, 400, 560, 860][i]}" y="${26 + n * 26}" ${r[5] === 'ยืนยัน' ? 'fill="#b00"' : ''}>${c}</text>`).join('')).join('')}</g>`);

// ── front detail: elevation of C1/C2 + ribbon + hall gable (scale 56 px/m) ──
const ES = 50, ex0 = 1260, ez0 = 1290; // ground baseline y px
const EX = (x) => ex0 + (x - 3.0) * ES, EZ = (z) => ez0 - z * ES;
const ribZ = (x) => 10.75 - Math.abs(x - 10.75) * 0.2275;
o.push(`<text x="${ex0}" y="${ez0 - 12.4 * ES - 10}" font-size="18" font-weight="700">ด้านหน้า (Front elevation) — หอ C1 / C2 + Solar Ribbon</text>`);
o.push(`<line x1="${EX(2.5)}" y1="${EZ(0)}" x2="${EX(18.2)}" y2="${EZ(0)}" stroke="#333" stroke-width="2.5"/>`);
// hall gable behind
o.push(`<path d="M${EX(-0.8)},${EZ(0)} L${EX(-0.8)},${EZ(8.6)} L${EX(10.75)},${EZ(11.25)} L${EX(22.3)},${EZ(8.6)} L${EX(22.3)},${EZ(0)} Z" fill="#eef0ee" stroke="#555" stroke-width="1.5"/>`);
o.push(`<rect x="${EX(9.55)}" y="${EZ(3.0)}" width="${2.4 * ES}" height="${3.0 * ES}" fill="#cfe6f2" stroke="#0b57d0"/>`);
o.push(`<text x="${EX(10.75)}" y="${EZ(1.4)}" font-size="11" text-anchor="middle" fill="#0b57d0">ประตู 2.40</text>`);
// ribbon (two slopes) with thickness
o.push(`<path d="M${EX(4.25)},${EZ(ribZ(4.25))} L${EX(10.75)},${EZ(10.75)} L${EX(17.25)},${EZ(ribZ(17.25))} L${EX(17.25)},${EZ(ribZ(17.25) - 0.14)} L${EX(10.75)},${EZ(10.61)} L${EX(4.25)},${EZ(ribZ(4.25) - 0.14)} Z" fill="#1e293b" stroke="#000"/>`);
for (const [cx, nm] of [[7.35, 'C1'], [14.15, 'C2']]) {
  const rr = (z) => 0.45 + 0.27 * ((z - 0.85) / 7.75), zc = ribZ(cx) - 0.14;
  o.push(`<rect x="${EX(cx - 0.125)}" y="${EZ(zc)}" width="${0.25 * ES}" height="${zc * ES}" fill="#2b3544"/>`);
  o.push(`<path d="M${EX(cx - rr(0.85))},${EZ(0.85)} L${EX(cx - rr(8.6))},${EZ(8.6)} L${EX(cx + rr(8.6))},${EZ(8.6)} L${EX(cx + rr(0.85))},${EZ(0.85)} Z" fill="#c7683a" stroke="#661a09" stroke-width="1.2"/>`);
  for (let k = -3; k <= 3; k++) { const dir = cx < 10 ? 1 : -1; o.push(`<line x1="${EX(cx + k * 0.1 - 0.35 * dir)}" y1="${EZ(0.85)}" x2="${EX(cx + k * 0.1 + 0.35 * dir)}" y2="${EZ(8.6)}" stroke="#7a2a0a" stroke-width="0.8" opacity="0.6"/>`); }
  for (const h of [2.0, 3.5, 4.9, 6.4, 7.9]) o.push(`<line x1="${EX(cx - rr(h) - 0.07)}" y1="${EZ(h)}" x2="${EX(cx + rr(h) + 0.07)}" y2="${EZ(h)}" stroke="#aaa" stroke-width="2"/>`);
  o.push(`<rect x="${EX(cx - 0.6)}" y="${EZ(0.82)}" width="${1.2 * ES}" height="${0.67 * ES}" fill="#8e9296" stroke="#444"/>`);
  o.push(`<rect x="${EX(cx - 2.1)}" y="${EZ(0.6)}" width="${4.2 * ES}" height="${0.45 * ES}" fill="#d8cdb8" stroke="#8a7a55"/>`);
  o.push(`<rect x="${EX(cx - 1.6)}" y="${EZ(0.36)}" width="${3.2 * ES}" height="${0.21 * ES}" fill="#7fb0b8" opacity="0.8"/>`);
  o.push(`<text x="${EX(cx)}" y="${EZ(-0.45)}" font-size="14" font-weight="700" text-anchor="middle" fill="#8a3a12">${nm}</text>`);
}
// level dimensions at the left
const lev = (z, t) => o.push(`<g stroke="#0b57d0" fill="#0b57d0"><line x1="${EX(2.6)}" y1="${EZ(z)}" x2="${EX(3.6)}" y2="${EZ(z)}" stroke-dasharray="4 3"/><text x="${EX(2.55)}" y="${EZ(z) + 4}" font-size="11" text-anchor="end" stroke="none">${t}</text></g>`);
lev(0, '±0.00'); lev(0.85, '+0.85 เริ่มกระเบื้อง'); lev(2.0, 'ห่วงรัด'); lev(8.6, '+8.60 ยอดกระเบื้อง'); lev(ribZ(7.35) - 0.14, '+9.84 ยอดไส้ H250'); lev(10.75, '+10.75 สัน Ribbon'); lev(11.25, '+11.25 สันโถง');
o.push(`<g stroke="#0b57d0" fill="#0b57d0" font-size="12"><line x1="${EX(7.35)}" y1="${EZ(-0.9)}" x2="${EX(14.15)}" y2="${EZ(-0.9)}"/><line x1="${EX(7.35)}" y1="${EZ(-0.8)}" x2="${EX(7.35)}" y2="${EZ(-1.0)}"/><line x1="${EX(14.15)}" y1="${EZ(-0.8)}" x2="${EX(14.15)}" y2="${EZ(-1.0)}"/><text x="${EX(10.75)}" y="${EZ(-0.9) - 5}" text-anchor="middle" stroke="none">6.80</text></g>`);
o.push(`<text x="${ex0}" y="${ez0 + 85}" font-size="12" fill="#444">หอ C1/C2: ทรงกรวยบิดเกลียว ±128°, r 0.45 → 0.72, กระเบื้อง +0.85 … +8.60 (22 เส้น × 24 แผ่น), ไส้ H250 ขึ้นถึงใต้ Ribbon รับแรงลมที่ปลาย</text>`);

// ── notes ──
const notes = ['หมายเหตุ', '1. "เสาส่งสัญญาณด้านหน้า" ตีความว่าคือหอดินเผา C1/C2 หน้าอาคาร (เสาสองต้นหน้า) — ถ้าหมายถึงเสาอากาศ/เสาโทรคมนาคม แจ้งเพื่อทำแบบใหม่', '2. กริด 1–5 = x 0.20…20.20 (ห่าง 5.00); A, B, C = y −1.65, 7.35, 16.35; D, E = เสาแถว A/B อาคารหลัง y 25.10, 28.10 (สเปก §1.2)', '3. เสาที่ "ตามสเปก" มีเพียงแถว D/E ของอาคารหลัง (10 ต้น) กับแกนหอ — ตำแหน่งเสาโถงพอร์ทัลจริงสเปกไม่ระบุ เสาสีแดงเส้นประเป็นสมมติ', '4. ฐานราก C1/C2: สเปกระบุฐานแผ่หรือเสาเข็มเฉพาะตัว ไม่ฝากน้ำหนักกับโถง · ขนาดฐานรากต้องให้วิศวกรโครงสร้างกำหนด (ในผังไม่ได้วาด)', '5. ไส้ H250 ยึดโยงยอดเข้าทรัสหน้าจั่ว (สเปก §3.3) และรับ Solar Ribbon (REV D.7) · พิกัดอ้างอิง origin = ขอบสนามซ้าย B1/B4 ที่แนวเสา 1'];
o.push(`<g transform="translate(1220,1560)" font-size="13" fill="#222">${notes.map((n, i) => `<text y="${i * 30}" ${i === 0 ? 'font-weight="700" font-size="17"' : ''}>${n}</text>`).join('')}</g>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif"><rect width="100%" height="100%" fill="#fff"/>
<text x="70" y="62" font-size="34" font-weight="700">ผังตำแหน่งหอคอยด้านหน้า C1 / C2 + กริดเสาชั้นล่าง</text>
<text x="70" y="94" font-size="16" fill="#555">MY PLACE REV E · ทิศเหนืออยู่ด้านบน · หน่วย เมตร · ผังตามโมเดล 3 มิติ (ไม่ใช่แบบก่อสร้าง)</text>
<g transform="translate(2550,30)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111"/><text x="66" y="46" font-size="14">N</text></g>
<g transform="translate(70,120)"><line x1="0" y1="0" x2="${5 * S}" y2="0" stroke="#111" stroke-width="3"/><text x="${2.5 * S}" y="-6" font-size="12" text-anchor="middle">5 ม.</text></g>
${o.join('\n')}</svg>`;
fs.writeFileSync(path.join(here, 'plans', 'front_towers_grid.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', 'front_towers_grid.png') });
await browser.close();
console.log('plan front_towers_grid');
