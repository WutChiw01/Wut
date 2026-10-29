// Revised REAR GROUND FLOOR (R34, from user R33 layout) (north up, metres).
// usage: node plan_gf_r34.mjs → plans/rear_GF_R36.{svg,png}
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
R(-3.8, -1.8, 27.9, 29.8, { stroke: '#bbb', dash: '4 4' }); T(-2.8, 28.95, 'ลิฟต์ตัดออก', 9, { fill: '#999' }); T(-2.8, 28.65, '(lift removed)', 8.5, { fill: '#999' });


// ── shell ──
R(-1.8, 22.2, yS, yN, { fill: '#fbfaf7' });
wall(-1.8, -1.7, yS, yN); wall(22.1, 22.3, yS, yN); wall(-1.8, 22.3, yN, 30.1, '#bcd'); glass(-1.8, 22.2, 29.98, 30.12);

// ── rooms (fills) ──
o.push('<defs><pattern id="lease" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="#fff3c4"/><line x1="0" y1="0" x2="0" y2="9" stroke="#e0b93a" stroke-width="2"/></pattern></defs>');
const rm = (x0, x1, y0, y1, fill) => R(x0, x1, y0, y1, { fill });
const yM = 27.55, yA = 27.15; // F/M split · accessible WC north wall
rm(-1.8, 0.4, yS, yA, '#efe6f7'); rm(-1.8, 0.4, yA, yN, '#e4e4e4');
rm(0.4, 3.2, yS, yM, '#f8e6ee'); rm(0.4, 3.2, yM, yN, '#e0ecf7'); rm(3.2, 4.4, yS, yN, '#e9eef2');
rm(4.4, 7.4, yS, yM, '#f8e8ef'); rm(4.4, 7.4, yM, yN, '#e4eef8'); rm(7.4, 10.2, yS, yN, '#fcefd3'); rm(10.2, 15.2, yS, yN, '#e4f2e7');
R(15.2, 22.1, yS, yN, { fill: 'url(#lease)' });
for (const x of [0.4, 3.2, 4.4, 7.4, 10.2, 15.2]) wall(x - 0.05, x + 0.05, yS, yN);
L(18.7, yS + 0.1, 18.7, yN, { stroke: '#b8901a', sw: 2, dash: '8 5' });
wall(-1.8, 0.4, yA - 0.05, yA + 0.05); wall(0.45, 3.15, yM - 0.05, yM + 0.05); wall(4.45, 7.35, yM - 0.05, yM + 0.05);
// south wall with door gaps
const gaps = [[-1.2, -0.3], [3.3, 4.3], [8.2, 9.4], [11.6, 12.8], [16.4, 17.4], [19.0, 19.9]];
{ let x = -1.8; for (const [a, b] of gaps) { wall(x, a, yS - 0.1, yS + 0.1); x = b; } wall(x, 22.3, yS - 0.1, yS + 0.1); }
for (const [a, b] of [[7.6, 8.2], [9.4, 10.0], [15.4, 16.4], [17.4, 18.6], [18.8, 19.0], [19.9, 22.0]]) glass(a, b, yS - 0.07, yS + 0.07);
for (const [a, b] of gaps) { const w = b - a; if (w > 1.1) { door(a, yS + 0.1, w / 2, 0, Math.PI * 0.45); door(b, yS + 0.1, w / 2, Math.PI, Math.PI * 0.55); } else door(a, yS + 0.1, w, 0, Math.PI * 0.45); }
// side doors: on passage walls (x 3.2 / 4.4) and north façade
const sideDoor = (x, y0, y1, dir) => { L(x, y0, x, y1, { stroke: '#fff', sw: 7 }); door(x, y0, y1 - y0, Math.PI / 2, Math.PI / 2 + dir * Math.PI * 0.4); };
sideDoor(3.2, 25.75, 26.55, 1); sideDoor(3.2, 28.75, 29.55, 1); sideDoor(4.4, 26.45, 27.25, -1); sideDoor(4.4, 27.85, 28.65, -1);
const northDoor = (a, b) => { L(a, yN + 0.05, b, yN + 0.05, { stroke: '#fff', sw: 7 }); door(a, yN, b - a, 0, -Math.PI * 0.45); };
northDoor(3.35, 4.25); northDoor(-1.2, -0.3); northDoor(4.6, 5.4);
// fixtures
const pan = (x, y, h = false) => { if (h) { R(x - 0.3, x + 0.3, y - 0.19, y + 0.19, { fill: '#fff', stroke: '#555' }); C(x + 0.05, y, 0.13, { stroke: '#555' }); } else { R(x - 0.19, x + 0.19, y - 0.3, y + 0.3, { fill: '#fff', stroke: '#555' }); C(x, y - 0.05, 0.13, { stroke: '#555' }); } };
const basin = (x, y) => { R(x - 0.25, x + 0.25, y - 0.2, y + 0.2, { fill: '#fff', stroke: '#555' }); C(x, y, 0.09, { stroke: '#555' }); };
const shower = (x, y, w, h) => { R(x, x + w, y, y + h, { fill: '#d6e6f8', stroke: '#2a5db0' }); C(x + w / 2, y + h / 2, 0.13, { stroke: '#2a5db0' }); };
const lockers = (x0, x1, y0, y1) => { R(x0, x1, y0, y1, { fill: '#c9b99d', stroke: '#6b5a3a' }); for (let x = x0 + 0.3; x < x1; x += 0.3) L(x, y0, x, y1, { stroke: '#6b5a3a', sw: 0.6 }); };

// Accessible WC — left of A, lines 4–5, door straight onto the aisle
C(-0.75, 26.15, 0.75, { stroke: '#999', dash: '3 3' }); pan(0.0, 26.75, true); basin(-1.5, 26.7); L(0.35, 26.2, 0.35, 26.95, { stroke: '#222', sw: 2.2 });
T(-0.7, 25.95, 'WC อารยสถาปัตย์', 9, { bold: true }); T(-0.7, 25.65, 'Accessible 2.05×2.00', 8.5);
T(-0.7, 28.75, 'ห้องสำรอง / เก็บของสระ', 9, { bold: true }); T(-0.7, 28.45, 'spare · pool store 6.3', 8.5); T(-0.7, 28.15, 'door to pool deck', 8, { fill: COL.dim });
// WC F / M — same side as accessible WC, doors on the passage
for (const [y0, y1, fem] of [[yS, yM, true], [yM, yN, false]]) {
  const rows = [y0 + 0.05, y0 + 0.85, y0 + 1.65];
  rows.forEach((yy, i) => { if (i) wall(0.45, 1.95, yy - 0.03, yy + 0.03);
    if (!fem && i === 2) { R(0.5, 0.9, yy + 0.15, yy + 0.65, { fill: '#fff', stroke: '#555' }); T(1.3, yy + 0.35, 'U', 9); }
    else { pan(0.8, yy + 0.4, true); L(1.95, yy + 0.05, 1.95, yy + 0.75, { stroke: '#888', dash: '2 2' }); } });
  const by = fem ? y0 + 0.25 : y1 - 0.25; basin(2.35, by); basin(2.9, by);
  const dy = (y0 + y1) / 2; T(2.55, dy + 0.2, fem ? 'WC หญิง' : 'WC ชาย', 10, { bold: true }); T(2.55, dy - 0.1, fem ? '3 WC · 2 อ่าง' : '2 WC · 1 U · 2 อ่าง', 8.5); T(2.55, dy - 0.38, '2.8×2.45 = 6.9', 8.5);
}
// passage 1.20 → S1 east landing
T(3.8, 27.6, 'ทางเดิน → S1  1.20', 9.5, { bold: true, rot: -90 });
P(`M${f(X(3.8))},${f(Y(29.7))} l-4,8 h8 z`, { fill: COL.green, stroke: COL.green });
// Lockers F / M: 2 showers each, 3.0 × 2.45
for (const [y0, y1, fem] of [[yS, yM, true], [yM, yN, false]]) {
  shower(6.45, y0 + 0.1, 0.9, 1.05); shower(6.45, y0 + 1.2, 0.9, 1.05); L(6.45, y0 + 0.1, 6.45, y0 + 2.25, { stroke: '#2a5db0', sw: 2, dash: '4 2' });
  if (fem) lockers(4.5, 6.35, y0 + 0.05, y0 + 0.5); else lockers(4.5, 6.35, y1 - 0.5, y1 - 0.05);
  R(4.9, 6.1, fem ? y0 + 1.25 : y0 + 0.85, fem ? y0 + 1.6 : y0 + 1.2, { fill: '#e9d9c4', stroke: COL.furn });
  const dy = (y0 + y1) / 2; T(5.35, dy + (fem ? 0.55 : 0.55), fem ? 'ล็อกเกอร์ หญิง' : 'ล็อกเกอร์ ชาย', 9.5, { bold: true }); T(5.9, fem ? y1 - 0.25 : y0 + 0.25, '2 SH · 7.4', 8.5);
}
// Gift shop
R(7.45, 7.9, 26.0, 29.9, { fill: '#e9d9c4', stroke: COL.furn }); R(7.45, 10.15, 29.55, 29.95, { fill: '#e9d9c4', stroke: COL.furn }); R(9.7, 10.15, 26.0, 29.5, { fill: '#e9d9c4', stroke: COL.furn });
R(8.3, 9.3, 27.2, 27.9, { fill: '#f3d7a1', stroke: COL.furn }); R(8.3, 9.3, 28.4, 29.1, { fill: '#f3d7a1', stroke: COL.furn }); R(9.5, 10.1, 25.3, 25.8, { fill: '#d9b36b', stroke: '#6b4a1a', sw: 1.4 });
T(8.8, 26.6, 'ร้านของที่ระลึก', 10, { bold: true }); T(8.8, 26.3, 'Gift shop · 13.7', 8.5);
// Clinic
wall(10.25, 15.15, 27.25, 27.35); wall(12.65, 12.75, 27.35, yN);
R(10.6, 11.4, 25.35, 25.85, { fill: '#e9d9c4', stroke: COL.furn }); R(13.2, 15.0, 25.35, 25.85, { fill: '#e9d9c4', stroke: COL.furn }); R(13.6, 14.5, 26.45, 26.95, { fill: '#e9d9c4', stroke: COL.furn });
for (const [x0, x1, n] of [[10.3, 12.65, '1'], [12.75, 15.1, '2']]) { R(x0 + 0.15, x0 + 0.65, 28.2, 29.6, { fill: '#fff', stroke: COL.furn }); basin(x1 - 0.35, 29.7); T((x0 + x1) / 2 + 0.2, 27.85, `ตรวจ ${n}`, 10, { bold: true }); T((x0 + x1) / 2 + 0.2, 27.55, 'exam ' + n, 8.5); }
door(11.0, 27.3, 0.8, 0, Math.PI * 0.45); door(13.4, 27.3, 0.8, 0, Math.PI * 0.45);
T(12.7, 26.55, 'คลินิก Clinic · 24.5 ตร.ม.', 10, { bold: true, fill: '#2f6b3a' }); T(12.7, 26.25, 'reception / waiting', 8.5);
// Lease units
for (const [x0, x1, n] of [[15.2, 18.7, 'L1'], [18.7, 22.2, 'L2']]) { const cx = (x0 + x1) / 2; T(cx, 27.0, `พื้นที่ให้เช่า ${n}`, 11, { bold: true }); T(cx, 26.65, 'FOR LEASE · 17.2 ตร.ม.', 10, { bold: true }); T(cx, 26.3, '3.50 × 4.90 · shopfront', 8.5); }
T(18.7, 29.4, 'L1+L2 รวมเป็นห้องเดียวได้ 34.3 ตร.ม. (ร้านค้า/นวด/บูลเดอร์/กาแฟ)', 8.5);
for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);

// dims
const chain = [[-1.8, 0.4], [0.4, 3.2], [3.2, 4.4], [4.4, 7.4], [7.4, 10.2], [10.2, 15.2], [15.2, 18.7], [18.7, 22.2]];
for (const [a, b] of chain) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
dimX(-1.8, 22.2, 22.15, '24.00 m', 0); dimY(yS, yN, 23.0, '4.90', 0);
const rooms = [
  ['Accessible WC (left of A, 4–5)', 'WC อารยสถาปัตย์', '2.20×2.05', '4.5'], ['Female WC', 'ห้องน้ำหญิง 3 WC', '2.80×2.45', '6.9'], ['Male WC', 'ห้องน้ำชาย 2 WC+U', '2.80×2.45', '6.9'],
  ['Passage → S1', 'ทางเดิน', '1.20×4.90', '5.9'], ['Locker + 2 showers, Female', 'ล็อกเกอร์ หญิง', '3.00×2.45', '7.4'], ['Locker + 2 showers, Male', 'ล็อกเกอร์ ชาย', '3.00×2.45', '7.4'],
  ['Spare / pool store', 'ห้องสำรอง/เก็บของสระ', '2.20×2.85', '6.3'], ['Gift shop', 'ร้านของที่ระลึก', '2.80×4.90', '13.7'], ['Clinic', 'คลินิก', '5.00×4.90', '24.5'],
  ['FOR LEASE L1', 'พื้นที่ให้เช่า', '3.50×4.90', '17.2'], ['FOR LEASE L2', 'พื้นที่ให้เช่า', '3.50×4.90', '17.2'],
];
const notes = [
  'WHAT CHANGED vs R35: lift removed (lobby gone) · accessible, female and male WC all on the WEST side of the passage · lockers cut to 2 showers each and stacked F/M back-to-back (3.0 × 2.45 each).',
  'Whole wet block (3 WC rooms + 2 locker rooms + passage) now x −1.80…7.40 = 9.2 m wide (R35: 11.5 m incl. lift lobby) → wet + service area 45.3 m² vs 56.1 m²; all drains in one zone between grid A and B.',
  'RENTABLE: L1 + L2 = 34.3 m² (can merge or split, shopfront on the aisle) + gift shop 13.7 m² ≈ 48 m² (R35: 37.7 m²). Clinic grows to 5.0 m (between grid C and D).',
  'S1 stair kept in place: the 1.20 m passage (x 3.20…4.40) ends with a door beside the S1 east landing. Accessible WC opens straight onto the aisle; F/M WC and F/M lockers open onto the passage; male locker has a wet door to the pool deck.',
  'TO CONFIRM: no lift now → upper floors (future) are not wheelchair-accessible; passage 1.20 m is the minimum; fixtures schematic — fire exits, drains, ventilation still to be checked.',
];
const title = 'MY PLACE / R36 — No lift · all WCs on one side · 2-shower lockers (±0.00)';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#fff"/>
<text x="${MX}" y="56" font-size="30" font-weight="700" fill="#111">${title}</text>
<text x="${MX}" y="86" font-size="15" fill="#555">Rear ground floor, 3rd pass · North up · metres · S1 stair kept · lift removed · accessible + F + M WC together west of the passage · lockers 2 showers each · 2 lease units</text>
<g transform="translate(${W - 200},24)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111"/><text x="68" y="46" font-size="14" fill="#111">N</text></g>
${o.join('\n')}
<g transform="translate(${MX},${MY + HP + 30})" font-size="12.5" fill="#222">
<text font-weight="700" font-size="14">ROOM SCHEDULE</text>
${rooms.map((r, i) => `<text y="${22 + i * 19}">${i + 1}. ${r[0]} · ${r[1]}</text><text x="470" y="${22 + i * 19}">${r[2]} m</text><text x="640" y="${22 + i * 19}" text-anchor="end" font-weight="700">${r[3]} m²</text>`).join('')}
<text y="${22 + rooms.length * 19 + 4}" font-weight="700">TOTAL 117.9 m² · rentable ≈ 17.2 + 17.2 + 13.7 = 48.1 m²</text>
<g transform="translate(700,0)"><text font-weight="700" font-size="14">NOTES</text>${notes.map((n, i) => `<text y="${22 + i * 31}" font-size="11.5">${n.replace(/(.{150,}?) /g, '$1\u0001').split('\u0001').map((l, k) => `<tspan x="0" dy="${k ? 14 : 0}">${l}</tspan>`).join('')}</text>`).join('')}</g>
</g>
</svg>`;
fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
fs.writeFileSync(path.join(here, 'plans', 'rear_GF_R36.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', 'rear_GF_R36.png') });
await browser.close();
console.log('ok', W, H);
