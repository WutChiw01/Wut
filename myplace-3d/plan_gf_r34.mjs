// Revised REAR GROUND FLOOR (R34, from user R33 layout) (north up, metres).
// usage: node plan_gf_r34.mjs → plans/rear_GF_R34.{svg,png}
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const S = 55, XMIN = -4.9, XMAX = 24.2, YMIN = 22.0, YMAX = 37.4, MX = 80, MY = 170;
const COL = { wall: '#333', glass: '#7fb5d6', teak: '#c99a5b', dim: '#0b57d0', furn: '#555', red: '#c0392b', green: '#4c8a3a' };
const W = Math.round((XMAX - XMIN) * S + 2 * MX), HP = (YMAX - YMIN) * S, H = Math.round(MY + HP + 330);
const X = (x) => MX + (x - XMIN) * S, Y = (y) => MY + (YMAX - y) * S;
const o = [];
const f = (n) => n.toFixed(1);
const R = (x0, x1, y0, y1, a = {}) => o.push(`<rect x="${f(X(x0))}" y="${f(Y(y1))}" width="${f((x1 - x0) * S)}" height="${f((y1 - y0) * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? 'none'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''} ${a.op ? `opacity="${a.op}"` : ''}/>`);
const L = (x0, y0, x1, y1, a = {}) => o.push(`<line x1="${f(X(x0))}" y1="${f(Y(y0))}" x2="${f(X(x1))}" y2="${f(Y(y1))}" stroke="${a.stroke ?? COL.furn}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
const C = (x, y, r, a = {}) => o.push(`<circle cx="${f(X(x))}" cy="${f(Y(y))}" r="${f(r * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? COL.furn}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
const T = (x, y, s, size = 12, a = {}) => o.push(`<text paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" x="${f(X(x))}" y="${f(Y(y))}" font-size="${size}" fill="${a.fill ?? '#111'}" text-anchor="${a.anchor ?? 'middle'}" ${a.bold ? 'font-weight="700"' : ''} ${a.rot ? `transform="rotate(${a.rot} ${f(X(x))} ${f(Y(y))})"` : ''}>${s}</text>`);
const P = (d, a = {}) => o.push(`<path d="${d}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? COL.furn}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
const wall = (x0, x1, y0, y1, fill = COL.wall) => R(x0, x1, y0, y1, { fill, stroke: COL.wall, sw: 0.4 });
const glass = (x0, x1, y0, y1) => { R(x0, x1, y0, y1, { fill: '#cfe6f2', stroke: COL.glass, sw: 1 }); };
const col = (x, y) => R(x - 0.15, x + 0.15, y - 0.15, y + 0.15, { fill: '#222', stroke: '#000' });
const door = (hx, hy, len, a0, a1) => { const p0 = [hx + len * Math.cos(a0), hy + len * Math.sin(a0)], p1 = [hx + len * Math.cos(a1), hy + len * Math.sin(a1)]; L(hx, hy, p0[0], p0[1], { stroke: '#222', sw: 2 }); const sweep = a1 > a0 ? 0 : 1; P(`M${f(X(p0[0]))},${f(Y(p0[1]))} A${f(len * S)},${f(len * S)} 0 0 ${sweep} ${f(X(p1[0]))},${f(Y(p1[1]))}`, { stroke: '#888', dash: '3 3' }); };
const dimX = (x0, x1, y, label, off = 0) => { const yy = Y(y) + off; o.push(`<g stroke="${COL.dim}" fill="${COL.dim}"><line x1="${f(X(x0))}" y1="${f(yy)}" x2="${f(X(x1))}" y2="${f(yy)}"/><line x1="${f(X(x0))}" y1="${f(yy - 6)}" x2="${f(X(x0))}" y2="${f(yy + 6)}"/><line x1="${f(X(x1))}" y1="${f(yy - 6)}" x2="${f(X(x1))}" y2="${f(yy + 6)}"/><text x="${f((X(x0) + X(x1)) / 2)}" y="${f(yy - 5)}" font-size="12" text-anchor="middle" stroke="none">${label}</text></g>`); };
const dimY = (y0, y1, x, label, off = 0) => { const xx = X(x) + off; o.push(`<g stroke="${COL.dim}" fill="${COL.dim}"><line x1="${f(xx)}" y1="${f(Y(y0))}" x2="${f(xx)}" y2="${f(Y(y1))}"/><line x1="${f(xx - 6)}" y1="${f(Y(y0))}" x2="${f(xx + 6)}" y2="${f(Y(y0))}"/><line x1="${f(xx - 6)}" y1="${f(Y(y1))}" x2="${f(xx + 6)}" y2="${f(Y(y1))}"/><text x="${f(xx - 6)}" y="${f((Y(y0) + Y(y1)) / 2)}" font-size="12" text-anchor="middle" stroke="none" transform="rotate(-90 ${f(xx - 6)} ${f((Y(y0) + Y(y1)) / 2)})">${label}</text></g>`); };
const bubble = (x, y, t) => { o.push(`<circle cx="${f(X(x))}" cy="${f(Y(y))}" r="11" fill="#fff" stroke="#999"/><text x="${f(X(x))}" y="${f(Y(y) + 4)}" font-size="11" text-anchor="middle" fill="#666">${t}</text>`); };

const yS = 25.1, yN = 30.0, yG = 28.1; // south wall, north wall, grid line 5
// ── grid (user's R33 naming: A–E = x, 4–5 = y) ──
for (const [x, t] of [[0.2, 'A'], [5.2, 'B'], [10.2, 'C'], [15.2, 'D'], [20.2, 'E']]) { L(x, 22.3, x, 36.8, { stroke: '#cc5', sw: 0.6, dash: '10 4 2 4' }); bubble(x, 37.0, t); }
for (const [y, t] of [[yS, '4'], [yG, '5']]) { L(-4.4, y, 23.4, y, { stroke: '#cc5', sw: 0.6, dash: '10 4 2 4' }); bubble(-4.65, y, t); }

// ── context ──
R(-1.8, 22.2, 22.2, yS, { fill: '#fdf0d5' }); T(11, 23.9, 'ทางเดินหลังคอร์ท / back-of-court aisle (2.00 + slab edge)', 11, { fill: '#a07a30' });
R(-1.8, 22.2, 24.1, 30.1, { stroke: '#b44', sw: 1.4, dash: '12 5' }); T(19.6, 31.2, 'ขอบพื้น คสล. เดิม (ห้ามเจาะ)', 10, { fill: '#b44' }); T(19.6, 30.9, 'existing slab edge x −1.80…22.20 / y 24.10…30.10', 9, { fill: '#b44' });
R(10.4, 15.4, 30.8, 33.3, { fill: '#dcecf8', stroke: COL.dim, dash: '4 3' }); T(12.9, 32.0, 'สระ ตามแบบเดิม', 10, { fill: COL.dim }); T(12.9, 31.65, 'pool per D8 / R33 (unchanged)', 9, { fill: COL.dim });
P(`M${f(X(0.2))},${f(Y(33.85))} L${f(X(20.2))},${f(Y(36.85))}`, { stroke: COL.red, sw: 1.8, dash: '6 4' });
for (const [x, d] of [[0.2, '5.75'], [5.2, '6.50'], [10.2, '7.25'], [15.2, '8.00'], [20.2, '8.75']]) T(x, 33.85 + (x - 0.2) * 0.15 + 0.2, d, 9, { fill: COL.red });
T(10.2, 36.2, 'รั้วลาด / sloped fence (gross distance from line 5)', 10, { fill: COL.red, rot: -8 });

// ── S1 stair + lift (positions frozen) ──
R(-1.8, 3.2, 30.1, 32.8, { fill: '#fff4e2', stroke: '#b8731a', sw: 2 });
for (const [ya, yb] of [[30.25, 31.35], [31.55, 32.65]]) { R(-0.6, 2.0, ya, yb, { stroke: '#b8731a' }); for (let x = -0.6; x <= 2.0; x += 0.26) L(x, ya, x, yb, { stroke: '#b8731a', sw: 0.8 }); }
R(-1.7, -0.6, 30.25, 32.65, { stroke: '#b8731a' }); R(2.0, 3.1, 30.25, 32.65, { stroke: '#b8731a' });
L(-0.4, 30.8, 1.8, 30.8, { stroke: '#b8731a', sw: 2 }); L(1.8, 32.1, -0.4, 32.1, { stroke: '#b8731a', sw: 2 });
T(0.7, 33.05, 'S1 บันไดเดิม — คงตำแหน่ง (frozen)', 10, { fill: '#b8731a', bold: true });
L(1.0, 29.9, 1.0, 30.6, { stroke: '#b8731a', sw: 2.2 });
R(-3.8, -1.8, 27.9, 29.8, { fill: '#fff', stroke: COL.wall, sw: 2.5 }); L(-3.8, 27.9, -1.8, 29.8, { stroke: COL.wall }); L(-3.8, 29.8, -1.8, 27.9, { stroke: COL.wall }); T(-2.8, 29.95, 'ลิฟต์ / LIFT (frozen)', 9, { bold: true, fill: '#b8731a' });
R(-3.85, -3.75, 25.2, 27.9, { stroke: '#aaa', dash: '3 3' });

// ── shell ──
R(-1.8, 22.2, yS, yN, { fill: '#fbfaf7' });
wall(-1.8, -1.7, yS, yN); wall(22.1, 22.3, yS, yN); wall(-1.8, 22.3, yN, 30.1, '#bcd'); glass(-1.8, 22.2, 29.98, 30.12);

// ── rooms (fills) ──
const rm = (x0, x1, y0, y1, fill) => R(x0, x1, y0, y1, { fill });
rm(-1.8, 0.2, yS, yG, '#efe6f7'); rm(-1.8, 0.2, yG, yN, '#e9eef2'); rm(0.2, 1.9, yS, yN, '#e9eef2');
rm(1.9, 4.6, yS, yN, '#f8e6ee'); rm(4.6, 7.3, yS, yN, '#e0ecf7'); rm(7.3, 10.2, yS, yN, '#fcefd3');
rm(10.2, 13.0, yS, yN, '#e4eef8'); rm(13.0, 15.8, yS, yN, '#f8e8ef'); rm(15.8, 20.6, yS, yN, '#e4f2e7'); rm(20.6, 22.1, yS, yN, '#eeeeee');
// partitions
for (const x of [0.2, 1.9, 4.6, 7.3, 10.2, 13.0, 15.8, 20.6]) wall(x - 0.05, x + 0.05, yS, yN);
wall(-1.8, 0.2, yG - 0.05, yG + 0.05);
// south wall with door gaps
const gaps = [[0.5, 1.7], [2.1, 3.0], [5.6, 6.5], [7.5, 10.0], [11.0, 11.9], [14.0, 14.9], [16.4, 18.0], [21.1, 22.0]];
{ let x = -1.8; for (const [a, b] of gaps) { wall(x, a, yS - 0.1, yS + 0.1); x = b; } wall(x, 22.3, yS - 0.1, yS + 0.1); }
glass(7.5, 10.0, yS - 0.07, yS + 0.07);
for (const [a, b] of gaps) if (!(a === 7.5)) door(a, yS + 0.1, b - a > 1.1 ? (b - a) / 2 : b - a, 0, Math.PI * 0.45);
door(7.5, yS + 0.1, 1.25, 0, Math.PI * 0.45);
// ── fixtures ──
const pan = (x, y, rot = 0) => { R(x - 0.19, x + 0.19, y - 0.3, y + 0.3, { fill: '#fff', stroke: '#555' }); C(x, y - 0.05, 0.13, { stroke: '#555' }); };
const basin = (x, y) => { R(x - 0.25, x + 0.25, y - 0.2, y + 0.2, { fill: '#fff', stroke: '#555' }); C(x, y, 0.09, { stroke: '#555' }); };
const shower = (x, y, w = 0.9) => { R(x, x + w, y, y + 0.9, { fill: '#d6e6f8', stroke: '#2a5db0' }); C(x + w / 2, y + 0.45, 0.14, { stroke: '#2a5db0' }); };
const lockers = (x0, x1, y) => { R(x0, x1, y, y + 0.45, { fill: '#c9b99d', stroke: '#6b5a3a' }); for (let x = x0 + 0.3; x < x1; x += 0.3) L(x, y, x, y + 0.45, { stroke: '#6b5a3a', sw: 0.6 }); };
const bench = (x0, x1, y) => R(x0, x1, y, y + 0.35, { fill: '#e9d9c4', stroke: COL.furn });

// Accessible WC (left of A, between 4–5)
C(-0.8, 26.6, 0.75, { stroke: '#999', dash: '3 3' }); pan(-1.45, 27.5); basin(-0.25, 27.8); L(-1.8, 27.2, -1.0, 27.2, { stroke: '#222', sw: 2.2 });
T(-0.8, 26.05, 'WC อารยสถาปัตย์', 9, { bold: true }); T(-0.8, 25.75, 'Accessible 2.0×3.0', 9.5); T(-0.8, 25.45, '6.0 ตร.ม.', 9.5);
R(-1.0, -0.1, yG - 0.08, yG + 0.08, { fill: '#fff' }); door(-1.0, yG, 0.9, 0, -Math.PI * 0.45);
// lobby
T(-0.8, 29.3, 'โถงลิฟต์', 10, { bold: true }); T(-0.8, 29.0, 'lift lobby', 9);
R(-1.8, -1.7, 28.1, 29.4, { fill: '#fff' }); L(-1.75, 28.1, -1.75, 29.4, { stroke: '#222', sw: 1.2 });
// passage
T(1.05, 27.9, 'ทางเดิน', 10, { bold: true, rot: -90 }); T(1.05, 29.0, 'passage 1.70 m', 9, { rot: -90 });
for (const y of [26.0, 27.0, 28.0, 29.0]) { L(1.05, y - 0.3, 1.05, y + 0.3, { stroke: COL.green, sw: 1.5 }); }
P(`M${f(X(0.62))},${f(Y(26.3))} l-4,8 h8 z M${f(X(0.62))},${f(Y(29.7))} l-4,-8 h8 z`, { fill: COL.green, stroke: COL.green });
// Female WC
R(1.9, 2.4, 26.6, 27.8, { fill: '#fff', stroke: '#888', dash: '2 2' }); basin(2.15, 26.9); basin(2.15, 27.5);
for (const x of [2.35, 3.25, 4.15]) { wall(x - 0.03, x + 0.03, 28.5, yN); } wall(1.95, 4.6, 28.47, 28.53);
pan(2.0 + 0.0, 29.3); pan(2.8, 29.3); pan(3.7, 29.3); 
T(3.25, 26.25, 'WC หญิง', 11, { bold: true }); T(3.25, 25.95, 'Female · 13.2 ตร.ม.', 9.5); T(3.25, 27.55, '3 WC · 2 อ่าง', 9.5);
// Male WC
for (const x of [5.5, 6.4]) wall(x - 0.03, x + 0.03, 28.5, yN); wall(4.65, 7.3, 28.47, 28.53);
pan(5.05, 29.3); pan(5.95, 29.3); for (const y of [29.35]) { R(6.55, 6.95, 29.1, 29.7, { fill: '#fff', stroke: '#555' }); R(6.95, 7.25, 29.1, 29.7, { fill: '#fff', stroke: '#555' }); }
R(4.6, 5.1, 26.6, 27.8, { fill: '#fff', stroke: '#888', dash: '2 2' }); basin(4.85, 26.9); basin(4.85, 27.5);
T(6.0, 26.25, 'WC ชาย', 11, { bold: true }); T(6.0, 25.95, 'Male · 13.2 ตร.ม.', 9.5); T(6.0, 27.55, '2 WC · 1 U · 2 อ่าง', 9.5);
// Gift shop
R(7.45, 10.1, 25.3, 25.7, { fill: '#e9d9c4', stroke: COL.furn }); R(7.45, 7.9, 26.0, 29.9, { fill: '#e9d9c4', stroke: COL.furn }); R(7.45, 10.1, 29.55, 29.95, { fill: '#e9d9c4', stroke: COL.furn });
R(8.2, 9.3, 26.6, 27.3, { fill: '#f3d7a1', stroke: COL.furn }); R(8.2, 9.3, 28.0, 28.7, { fill: '#f3d7a1', stroke: COL.furn }); R(9.6, 10.1, 26.2, 27.4, { fill: '#d9b36b', stroke: '#6b4a1a', sw: 1.4 });
T(8.75, 27.7, 'ร้านของที่ระลึก', 10, { bold: true }); T(8.75, 27.4, 'Gift shop · 14.2', 9.5); T(9.85, 25.9, 'เคาน์เตอร์', 7.5);
// Locker M / F (dry south, wet north)
const locker = (x0, x1, lab, sub) => {
  const w = x1 - x0; wall(x0 + 0.05, x1 - 0.05, 27.95, 28.05);
  lockers(x0 + 0.1, x0 + 0.55, 26.0); R(x0 + 0.1, x0 + 0.55, 26.0, 27.7, { fill: '#c9b99d', stroke: '#6b5a3a' }); R(x1 - 0.55, x1 - 0.1, 26.0, 27.7, { fill: '#c9b99d', stroke: '#6b5a3a' });
  bench(x0 + 0.85, x1 - 0.85, 26.4); for (let i = 0; i < 3; i++) shower(x0 + 0.05 + i * ((w - 0.1) / 3), 29.05, (w - 0.1) / 3);
  T((x0 + x1) / 2, 27.3, lab, 11, { bold: true }); T((x0 + x1) / 2, 27.0, sub, 8.5);
  R(x0 + 0.9, x0 + 1.9, yN - 0.05, yN + 0.1, { fill: '#fff', stroke: COL.dim, sw: 1.5 });
};
locker(10.2, 13.0, 'ล็อกเกอร์ ชาย', 'Male · 3 SH · 13.7'); locker(13.0, 15.8, 'ล็อกเกอร์ หญิง', 'Female · 3 SH · 13.7');
T(13.0, 28.65, 'โซนเปียก (wet) · ประตูเปียก ▲ → ชานสระ', 8, { fill: COL.dim });
// Clinic
wall(15.85, 20.6, 27.25, 27.35); wall(18.2, 18.3, 27.35, yN);
R(16.2, 18.0, 25.35, 25.85, { fill: '#e9d9c4', stroke: COL.furn }); R(16.2, 17.0, 26.45, 26.95, { fill: '#e9d9c4', stroke: COL.furn }); R(19.0, 20.4, 25.3, 25.7, { fill: '#e9d9c4', stroke: COL.furn });
T(18.1, 26.65, 'ต้อนรับ/รอ reception', 9.5); T(19.7, 25.45, 'ม้านั่งรอ', 7.5);
for (const [x0, x1, n] of [[15.9, 18.2, '1'], [18.3, 20.55, '2']]) { R(x0 + 0.15, x0 + 0.65, 28.2, 29.6, { fill: '#fff', stroke: COL.furn }); basin(x1 - 0.35, 29.7); T((x0 + x1) / 2 + 0.15, 28.0 - 0.15, `ตรวจ ${n}`, 10, { bold: true }); T((x0 + x1) / 2 + 0.15, 27.7, 'exam ' + n, 8.5); }
door(16.6, 27.3, 0.8, 0, Math.PI * 0.45); door(18.9, 27.3, 0.8, 0, Math.PI * 0.45);
T(19.1, 26.15, 'คลินิก Clinic · 23.5 ตร.ม.', 10, { bold: true, fill: '#2f6b3a' });
// Spare
T(21.4, 27.9, 'ห้องสำรอง', 10, { bold: true, rot: -90 }); T(21.7, 27.9, 'Spare · 7.8 ตร.ม.', 9, { rot: -90 });
for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);

// dims
const chain = [[-1.8, 0.2], [0.2, 1.9], [1.9, 4.6], [4.6, 7.3], [7.3, 10.2], [10.2, 13.0], [13.0, 15.8], [15.8, 20.6], [20.6, 22.2]];
for (const [a, b] of chain) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
dimX(-1.8, 22.2, 22.15, '24.00 m', 0); dimY(yS, yN, 23.0, '4.90', 0);

const rooms = [
  ['Accessible WC (left of A)', 'WC อารยสถาปัตย์', '2.00×3.00', '6.0'], ['Lift lobby + S1 passage', 'โถงลิฟต์ / ทางเดิน', '2.0×1.9 + 1.7×4.9', '12.1'],
  ['Female WC', 'ห้องน้ำหญิง', '2.70×4.90', '13.2'], ['Male WC', 'ห้องน้ำชาย', '2.70×4.90', '13.2'], ['Gift shop', 'ร้านของที่ระลึก', '2.90×4.90', '14.2'],
  ['Locker + shower, Male', 'ล็อกเกอร์ ชาย', '2.80×4.90', '13.7'], ['Locker + shower, Female', 'ล็อกเกอร์ หญิง', '2.80×4.90', '13.7'], ['Clinic', 'คลินิก', '4.80×4.90', '23.5'], ['Spare room', 'ห้องสำรอง', '1.60×4.90', '7.8'],
];
const notes = [
  'GRID NAMING: A–E = east–west lines at x 0.20/5.20/10.20/15.20/20.20 · 4 and 5 = lines y 25.10 / 28.10 (as on your R33 sheet). Everything sits inside the existing slab (x −1.80…22.20); nothing added behind the slab.',
  'FROZEN FOR FUTURE BUILD: S1 stair (x −1.80…3.20, y 30.10…32.80, outside the slab) and the lift (x −3.80…−1.80, y 27.90…29.80). Lift door opens east onto the lobby; the 1.70 m passage x 0.20…1.90 links lobby ↔ S1 ↔ back-of-court aisle.',
  'TOILETS AT THE LEFT END: the accessible WC is exactly between lines 4–5, left of A; Female and Male WC follow immediately east of the passage. Cubicles on the north wall, basins + vestibule at the door side.',
  'LOCKER ROOMS: dry zone (lockers/bench) from the aisle on the south, wet zone (3 showers each) on the north with a wet door out to the pool deck. CLINIC takes the old BOULDER slot; SPARE room takes the old storage slot.',
  'ASSUMPTIONS TO CONFIRM: (1) the Boulder room (4.9×4.9) is moved to level 2/3 — ground floor cannot hold boulder + clinic + spare + 2 lockers + gift shop; (2) clinic 23.5 m² = reception + 2 exam rooms (rehab/balance room moves to L2 Wellness);',
  '(3) fixtures are schematic: sanitary counts ≈ your R33 (F 3 WC/2 basins, M 2 WC/1 U/2 basins, 3 showers per locker) · fire exits, plumbing risers/gravity drains and ventilation still to be checked (concept layout, not construction drawings).',
];
const title = 'MY PLACE / R34 — Revised rear ground floor (±0.00)';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#fff"/>
<text x="${MX}" y="56" font-size="30" font-weight="700" fill="#111">${title}</text>
<text x="${MX}" y="86" font-size="15" fill="#555">Re-plan of the R33 back-room strip · North up · metres · S1 stair and lift unchanged · toilets M / F / accessible at the west end, gift shop, locker + shower M/F, clinic, spare room</text>
<g transform="translate(${W - 200},24)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111"/><text x="68" y="46" font-size="14" fill="#111">N</text></g>
${o.join('\n')}
<g transform="translate(${MX},${MY + HP + 30})" font-size="12.5" fill="#222">
<text font-weight="700" font-size="14">ROOM SCHEDULE</text>
${rooms.map((r, i) => `<text y="${22 + i * 19}">${i + 1}. ${r[0]} · ${r[1]}</text><text x="470" y="${22 + i * 19}">${r[2]} m</text><text x="640" y="${22 + i * 19}" text-anchor="end" font-weight="700">${r[3]} m²</text>`).join('')}
<text y="${22 + rooms.length * 19 + 4}" font-weight="700">TOTAL 117.4 m² of 24.0 × 4.9 strip (incl. partitions, rounded)</text>
<g transform="translate(700,0)"><text font-weight="700" font-size="14">NOTES</text>${notes.map((n, i) => `<text y="${22 + i * 31}" font-size="11.5">${n.replace(/(.{150,}?) /g, '$1\u0001').split('\u0001').map((l, k) => `<tspan x="0" dy="${k ? 14 : 0}">${l}</tspan>`).join('')}</text>`).join('')}</g>
</g>
</svg>`;
fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
fs.writeFileSync(path.join(here, 'plans', 'rear_GF_R34.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', 'rear_GF_R34.png') });
await browser.close();
console.log('ok', W, H);
