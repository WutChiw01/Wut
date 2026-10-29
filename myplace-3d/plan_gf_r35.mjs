// Revised REAR GROUND FLOOR (R34, from user R33 layout) (north up, metres).
// usage: node plan_gf_r34.mjs → plans/rear_GF_R35.{svg,png}
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
o.push('<defs><pattern id="lease" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="#fff3c4"/><line x1="0" y1="0" x2="0" y2="9" stroke="#e0b93a" stroke-width="2"/></pattern></defs>');
const rm = (x0, x1, y0, y1, fill) => R(x0, x1, y0, y1, { fill });
const yM = 27.55; // F / M module split (2.44 m each)
rm(-1.8, 0.4, 26.1, yG, '#efe6f7'); rm(-1.8, 0.4, yG, yN, '#e9eef2'); rm(-1.8, 0.4, yS, 26.1, '#e4e4e4'); rm(0.4, 1.9, yS, yN, '#e9eef2');
rm(1.9, 4.89, yS, yM, '#f8e6ee'); rm(1.9, 4.89, yM, yN, '#e0ecf7');
rm(4.9, 7.3, yS, yN, '#e4eef8'); rm(7.3, 9.7, yS, yN, '#f8e8ef'); rm(9.7, 12.6, yS, yN, '#fcefd3'); rm(12.6, 17.4, yS, yN, '#e4f2e7');
R(17.4, 20.6, yS, yN, { fill: 'url(#lease)' }); rm(20.6, 22.1, yS, yN, '#eeeeee');
// partitions
for (const x of [0.4, 1.9, 4.9, 7.3, 9.7, 12.6, 17.4, 20.6]) wall(x - 0.05, x + 0.05, yS, yN);
wall(-1.8, 0.4, yG - 0.05, yG + 0.05); wall(-1.8, 0.4, 26.05, 26.15); wall(1.9, 4.89, yM - 0.05, yM + 0.05);
// south wall with door gaps
const gaps = [[0.5, 1.8], [5.9, 6.8], [8.3, 9.2], [10.7, 11.6], [13.2, 14.4], [18.4, 19.3], [21.1, 22.0]];
{ let x = -1.8; for (const [a, b] of gaps) { wall(x, a, yS - 0.1, yS + 0.1); x = b; } wall(x, 22.3, yS - 0.1, yS + 0.1); }
glass(9.9, 10.7, yS - 0.07, yS + 0.07); glass(11.6, 12.4, yS - 0.07, yS + 0.07); glass(17.6, 18.4, yS - 0.07, yS + 0.07); glass(19.3, 20.4, yS - 0.07, yS + 0.07);
for (const [a, b] of gaps) { const w = b - a; if (w > 1.1) { door(a, yS + 0.1, w / 2, 0, Math.PI * 0.45); door(b, yS + 0.1, w / 2, Math.PI, Math.PI * 0.55); } else door(a, yS + 0.1, w, 0, Math.PI * 0.45); }
// fixtures
const pan = (x, y, h = false) => { if (h) { R(x - 0.3, x + 0.3, y - 0.19, y + 0.19, { fill: '#fff', stroke: '#555' }); C(x - 0.05, y, 0.13, { stroke: '#555' }); } else { R(x - 0.19, x + 0.19, y - 0.3, y + 0.3, { fill: '#fff', stroke: '#555' }); C(x, y - 0.05, 0.13, { stroke: '#555' }); } };
const basin = (x, y) => { R(x - 0.25, x + 0.25, y - 0.2, y + 0.2, { fill: '#fff', stroke: '#555' }); C(x, y, 0.09, { stroke: '#555' }); };
const shower = (x, y, w) => { R(x, x + w, y, y + 0.9, { fill: '#d6e6f8', stroke: '#2a5db0' }); C(x + w / 2, y + 0.45, 0.13, { stroke: '#2a5db0' }); };
const lockers = (x0, x1, y0, y1) => { R(x0, x1, y0, y1, { fill: '#c9b99d', stroke: '#6b5a3a' }); for (let y = y0 + 0.3; y < y1; y += 0.3) L(x0, y, x1, y, { stroke: '#6b5a3a', sw: 0.6 }); };

// Accessible WC 2.05 × 2.00 clear (left of A, between 4–5) + service closet
C(-0.55, 27.0, 0.75, { stroke: '#999', dash: '3 3' }); pan(-1.45, 27.1, true); basin(-1.0, 26.35); L(-1.75, 26.75, -1.75, 27.45, { stroke: '#222', sw: 2.2 });
T(-0.55, 26.62, 'WC อารยสถาปัตย์', 9, { bold: true }); T(-0.55, 26.4 - 0.1, 'Accessible 2.2×2.0', 8.5, { }); 
R(-1.1, -0.2, yG - 0.08, yG + 0.08, { fill: '#fff' }); door(-1.1, yG, 0.9, 0, -Math.PI * 0.45);
T(-0.7, 25.55, 'ห้องแม่บ้าน', 8.5); T(-0.7, 25.3, 'cleaner 2.0', 8.5); R(0.35, 0.45, 25.3, 26.0, { fill: '#fff' }); 
T(-0.7, 29.3, 'โถงลิฟต์', 10, { bold: true }); T(-0.7, 29.0, 'lift lobby', 9); R(-1.8, -1.7, 28.1, 29.4, { fill: '#fff' }); L(-1.75, 28.1, -1.75, 29.4, { stroke: '#222', sw: 1.2 });
// passage 1.50
T(1.15, 28.0, 'ทางเดิน  passage 1.50', 10, { bold: true, rot: -90 });
P(`M${f(X(1.15))},${f(Y(26.1))} l-4,8 h8 z M${f(X(1.15))},${f(Y(29.7))} l-4,-8 h8 z`, { fill: COL.green, stroke: COL.green });
// compact WC modules 2.99 × 2.44 (door on the passage side)
for (const [y0, y1, fem] of [[yS, yM, true], [yM, yN, false]]) {
  const dy = (y0 + y1) / 2; L(1.9, dy - 0.4, 1.9, dy + 0.4, { stroke: '#fff', sw: 7 }); door(1.9, dy - 0.4, 0.8, Math.PI / 2, Math.PI * 0.12);
  const rows = [y0 + 0.07, y0 + 0.87, y0 + 1.67];
  rows.forEach((yy, i) => { if (i) wall(3.3, 4.89, yy - 0.03, yy + 0.03); const isU = !fem && i === 2;
    if (isU) { R(4.4, 4.85, yy + 0.15, yy + 0.65, { fill: '#fff', stroke: '#555' }); T(3.9, yy + 0.45, 'U', 9); wall(3.3, 4.89, yy - 0.03, yy + 0.03); }
    else { pan(4.55, yy + 0.4, true); L(3.3, yy + 0.05, 3.3, yy + 0.8, { stroke: '#888', dash: '2 2' }); } });
  if (!fem) wall(3.3, 4.89, y1 - 0.02, y1 + 0.02);
  const by = fem ? y1 - 0.25 : y0 + 0.25; basin(2.5, by); basin(3.0 - 0.02, by);
  T(2.75, dy + (fem ? 0.05 : -0.05), fem ? 'WC หญิง' : 'WC ชาย', 10, { bold: true }); T(2.75, dy + (fem ? -0.25 : -0.35), fem ? '3 WC · 2 อ่าง' : '2 WC · 1 U · 2 อ่าง', 8.5);
  T(3.55, y0 - 0.0 + (fem ? 0.0 : 0.0) + 0.001, '', 8);
}
T(3.4, 24.8, 'โมดูลสำเร็จรูป 2.99 × 2.44 (7.3 ตร.ม. ×2)', 9, { fill: '#555' });
// Locker + shower, compact 2.4 × 4.9 each
const locker = (x0, lab) => { const x1 = x0 + 2.4;
  lockers(x1 - 0.5, x1 - 0.05, 25.6, 27.9); lockers(x0 + 0.05, x0 + 0.45, 27.0, 27.9); R(x0 + 0.6, x0 + 1.1, 25.55, 26.95, { fill: '#e9d9c4', stroke: COL.furn });
  wall(x0 + 0.05, x1 - 0.05, 28.05, 28.15); L(x0 + 0.9, 28.1, x0 + 1.5, 28.1, { stroke: '#fff', sw: 4 });
  for (let i = 0; i < 3; i++) shower(x0 + 0.05 + i * 0.77, 29.05, 0.77); for (let i = 1; i < 3; i++) L(x0 + 0.05 + i * 0.77, 28.95, x0 + 0.05 + i * 0.77, yN, { stroke: '#2a5db0', sw: 1.2 });
  T(x0 + 1.2, 27.7 - 0.5, lab, 9.5, { bold: true }); T(x0 + 1.2, 28.5, 'wet', 8, { fill: COL.dim }); };
locker(4.9, 'ล็อกเกอร์ ชาย'); locker(7.3, 'ล็อกเกอร์ หญิง');
T(6.1, 25.5 - 0.0, '', 8); T(6.1, 26.7 - 0.0, 'Male', 8.5); T(8.5, 26.7, 'Female', 8.5);
T(6.1, 24.8, '3 SH · 11.8', 9, { fill: '#555' }); T(8.5, 24.8, '3 SH · 11.8', 9, { fill: '#555' });
// Gift shop
R(9.75, 10.2, 26.0, 29.9, { fill: '#e9d9c4', stroke: COL.furn }); R(9.75, 12.55, 29.55, 29.95, { fill: '#e9d9c4', stroke: COL.furn }); R(12.1, 12.55, 26.0, 29.5, { fill: '#e9d9c4', stroke: COL.furn });
R(10.6, 11.7, 27.0, 27.7, { fill: '#f3d7a1', stroke: COL.furn }); R(10.6, 11.7, 28.3, 29.0, { fill: '#f3d7a1', stroke: COL.furn }); R(11.8, 12.5, 25.3, 25.8, { fill: '#d9b36b', stroke: '#6b4a1a', sw: 1.4 });
T(11.15, 26.4, 'ร้านของที่ระลึก', 10, { bold: true }); T(11.15, 26.1, 'Gift shop · 14.2', 8.5);
// Clinic
wall(12.65, 17.4, 27.25, 27.35); wall(15.0, 15.1, 27.35, yN);
R(13.0, 14.9, 25.35, 25.85, { fill: '#e9d9c4', stroke: COL.furn }); R(16.2, 17.2, 25.35, 25.85, { fill: '#e9d9c4', stroke: COL.furn }); R(12.8, 13.7, 26.45, 26.95, { fill: '#e9d9c4', stroke: COL.furn });
for (const [x0, x1, n] of [[12.7, 15.0, '1'], [15.1, 17.35, '2']]) { R(x0 + 0.15, x0 + 0.65, 28.2, 29.6, { fill: '#fff', stroke: COL.furn }); basin(x1 - 0.35, 29.7); T((x0 + x1) / 2 + 0.2, 28.0 - 0.15, `ตรวจ ${n}`, 10, { bold: true }); T((x0 + x1) / 2 + 0.2, 27.7, 'exam ' + n, 8.5); }
door(13.4, 27.3, 0.8, 0, Math.PI * 0.45); door(15.7, 27.3, 0.8, 0, Math.PI * 0.45);
T(15.0, 26.2, 'คลินิก Clinic · 23.5 ตร.ม.', 10, { bold: true, fill: '#2f6b3a' }); T(15.0, 26.65, 'reception / waiting', 8.5);
// Lease unit
T(19.0, 28.0, 'พื้นที่ให้เช่า', 11, { bold: true }); T(19.0, 27.7, 'FOR LEASE · 15.7', 10, { bold: true }); T(19.0, 27.4, 'shopfront on aisle', 8.5);
T(19.0, 29.2, 'ร้านค้า / นวด / บูลเดอร์ / กาแฟ', 8.5); T(19.0, 28.95, 'retail · massage · boulder · coffee', 8.5);
// Spare
T(21.4, 27.9, 'ห้องสำรอง', 10, { bold: true, rot: -90 }); T(21.75, 27.9, 'Spare · 7.8 ตร.ม.', 9, { rot: -90 });
for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);

// dims
const chain = [[-1.8, 0.4], [0.4, 1.9], [1.9, 4.9], [4.9, 7.3], [7.3, 9.7], [9.7, 12.6], [12.6, 17.4], [17.4, 20.6], [20.6, 22.2]];
for (const [a, b] of chain) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
dimX(-1.8, 22.2, 22.15, '24.00 m', 0); dimY(yS, yN, 23.0, '4.90', 0);
const rooms = [
  ['Accessible WC (left of A, lines 4–5)', 'WC อารยสถาปัตย์', '2.20×2.00', '4.4'], ['Cleaner closet', 'ห้องแม่บ้าน', '2.20×0.90', '2.0'], ['Lift lobby + passage', 'โถงลิฟต์ / ทางเดิน', '2.2×1.9 + 1.5×4.9', '11.5'],
  ['Female WC module', 'ห้องน้ำหญิง (3 WC)', '2.99×2.44', '7.3'], ['Male WC module', 'ห้องน้ำชาย (2 WC+U)', '2.99×2.44', '7.3'],
  ['Locker + 3 showers, Male', 'ล็อกเกอร์ ชาย', '2.40×4.90', '11.8'], ['Locker + 3 showers, Female', 'ล็อกเกอร์ หญิง', '2.40×4.90', '11.8'],
  ['Gift shop (also leasable)', 'ร้านของที่ระลึก', '2.90×4.90', '14.2'], ['Clinic', 'คลินิก', '4.80×4.90', '23.5'], ['FOR LEASE unit', 'พื้นที่ให้เช่า', '3.20×4.90', '15.7'], ['Spare room', 'ห้องสำรอง', '1.60×4.90', '7.8'],
];
const notes = [
  'WHAT CHANGED vs R34: toilets use compact prefab modules (2.99×2.44 m, like your reference) stacked along the passage, doors on the passage; accessible WC = 2.05×2.00 clear with Ø1.50 turning circle (your 2nd reference).',
  'WC block now only 3.0 m wide (was 5.4 m); lockers 2.4 m each (was 2.8 m). Wet cluster (WC + showers) is all at the west end → one drain/riser zone next to S1.',
  'SPACE GAINED: WC + lockers shrink from 59.8 m² (R34) to 44.6 m² → ≈ 15 m² freed → one 3.2×4.9 = 15.7 m² FOR-LEASE unit with shopfront on the aisle, plus the gift shop (14.2 m²) and spare (7.8 m²) can also be let: ≈ 38 m² rentable.',
  'FROZEN: S1 stair (x −1.80…3.20, y 30.10…32.80) and lift (x −3.80…−1.80, y 27.90…29.80). Passage narrowed to 1.50 m (x 0.40…1.90, still ≥ 1.20 m). Slab edge x −1.80…22.20 untouched; grid naming as your R33 (A–E x, 4–5 y).',
  'TO CONFIRM: (1) wet door to pool deck was dropped in the compact lockers — pool access via passage/rear door; (2) the Boulder room stays off the ground floor unless the lease unit is used for it; (3) fixtures are schematic, fire exits / drains / ventilation still to be checked.',
];
const title = 'MY PLACE / R35 — Compact toilets + lockers, leasable space (±0.00)';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#fff"/>
<text x="${MX}" y="56" font-size="30" font-weight="700" fill="#111">${title}</text>
<text x="${MX}" y="86" font-size="15" fill="#555">Rear ground floor, 2nd pass · North up · metres · S1 stair + lift unchanged · compact WC modules, compact lockers/showers, clinic, gift shop, FOR-LEASE unit, spare</text>
<g transform="translate(${W - 200},24)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111"/><text x="68" y="46" font-size="14" fill="#111">N</text></g>
${o.join('\n')}
<g transform="translate(${MX},${MY + HP + 30})" font-size="12.5" fill="#222">
<text font-weight="700" font-size="14">ROOM SCHEDULE</text>
${rooms.map((r, i) => `<text y="${22 + i * 19}">${i + 1}. ${r[0]} · ${r[1]}</text><text x="470" y="${22 + i * 19}">${r[2]} m</text><text x="640" y="${22 + i * 19}" text-anchor="end" font-weight="700">${r[3]} m²</text>`).join('')}
<text y="${22 + rooms.length * 19 + 4}" font-weight="700">TOTAL 117.3 m² of the 24.0 × 4.9 strip · rentable ≈ 15.7 + 14.2 + 7.8 = 37.7 m²</text>
<g transform="translate(700,0)"><text font-weight="700" font-size="14">NOTES</text>${notes.map((n, i) => `<text y="${22 + i * 31}" font-size="11.5">${n.replace(/(.{150,}?) /g, '$1\u0001').split('\u0001').map((l, k) => `<tspan x="0" dy="${k ? 14 : 0}">${l}</tspan>`).join('')}</text>`).join('')}</g>
</g>
</svg>`;
fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
fs.writeFileSync(path.join(here, 'plans', 'rear_GF_R35.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', 'rear_GF_R35.png') });
await browser.close();
console.log('ok', W, H);
