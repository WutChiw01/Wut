// Rear building upper floors R41 (L2 +3.50 wellness, L3 +7.00 fitness), matched to GF R40. usage: node plan_upper_r41.mjs 2|3
// usage: node plan_gf_r34.mjs → plans/rear_GF_R40.{svg,png}
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

o.push('<defs><pattern id="lease" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="#fff3c4"/><line x1="0" y1="0" x2="0" y2="9" stroke="#e0b93a" stroke-width="2"/></pattern></defs>');
const yS = 25.1, yN = 30.0, yG = 28.1; // south wall, north wall, grid line 5
// ── grid (user's R33 naming: A–E = x, 4–5 = y) ──
for (const [x, t] of [[0.2, 'A'], [5.2, 'B'], [10.2, 'C'], [15.2, 'D'], [20.2, 'E']]) { L(x, 22.3, x, 36.8, { stroke: '#cc5', sw: 0.6, dash: '10 4 2 4' }); bubble(x, 37.0, t); }
for (const [y, t] of [[yS, '4'], [yG, '5']]) { L(-4.4, y, 23.4, y, { stroke: '#cc5', sw: 0.6, dash: '10 4 2 4' }); bubble(-4.65, y, t); }

const LV = process.argv[2] === '3' ? 3 : 2;
const ST = '#b8731a';
// ── context: below = courts / aisle, slab outline ──
R(-1.8, 22.2, 22.2, 24.1, { fill: '#e7ecef' }); T(11, 23.0, LV === 2 ? 'ช่องเปิดเหนือทางเดินหลังคอร์ท (void) — คอร์ท B4–B6 ด้านล่าง' : 'void เหนือระเบียงชั้น 2 · มองลงคอร์ท', 11, { fill: '#667' });
R(-1.8, 22.2, 24.1, 30.1, { fill: '#fbfaf7' });
R(3.4, 22.2, 30.2, 33.6, { fill: '#e3f0d8' }); T(12.9, 32.0, 'สนามหญ้า — พื้นที่จัดภูมิทัศน์ในอนาคต (ไม่มีสระ)', 10, { fill: COL.green });
P(`M${f(X(0.2))},${f(Y(33.85))} L${f(X(20.2))},${f(Y(36.85))}`, { stroke: COL.red, sw: 1.8, dash: '6 4' }); T(10.2, 36.2, 'รั้วลาด / sloped fence', 10, { fill: COL.red, rot: -8 });

// ── S1 stacked U-stair (same footprint as GF R38–R40) ──
R(-1.8, 3.2, 30.1, 32.8, { fill: '#fff4e2', stroke: ST, sw: 2 });
const yS1 = [30.15, 31.35], yN1 = [31.45, 32.65], xa = -0.6, xb = 1.74;
const treads = (ya, yb, dash) => { R(xa, xb, ya, yb, { fill: dash ? 'none' : '#fff', stroke: ST, sw: 1.2, dash: dash ? '5 3' : '' }); for (let x = xa + 0.26; x < xb; x += 0.26) L(x, ya, x, yb, { stroke: ST, sw: 0.7, dash: dash ? '3 3' : '' }); };
R(-1.8, xa, 30.15, 32.65, { fill: '#f3dcb8', stroke: ST, sw: 1.4 }); T(-1.2, 31.6, 'ชานพัก', 9, { bold: true }); T(-1.2, 31.3, LV === 2 ? '+5.25' : '+5.25', 9);
const arrow = (x0, x1, y, lab) => { L(x0, y, x1, y, { stroke: ST, sw: 2 }); const d = x1 < x0 ? 1 : -1; P(`M${f(X(x1))},${f(Y(y))} l${9 * d},-5 v10 z`, { fill: ST, stroke: ST }); T((x0 + x1) / 2, y + 0.22, lab, 8.5, { fill: ST, bold: true }); };
if (LV === 2) {
  treads(...yN1, false); arrow(1.6, -0.4, 32.05, 'ขึ้น UP 21–30 → ชั้น 3');
  treads(...yS1, false); arrow(-0.4, 1.6, 30.75, 'ขึ้นจากชั้น 1 (11–20)');
  R(xb, 3.15, 30.15, 32.65, { fill: '#e2f1dc', stroke: COL.green, sw: 1.4 }); T(2.47, 31.55, 'ชานพักชั้น 2', 8.5, { bold: true, fill: COL.green }); T(2.47, 31.3, '+3.50', 8.5, { fill: COL.green });
} else {
  treads(...yS1, false); arrow(1.6, -0.4, 30.75, 'ลง DN 40–31');
  treads(...yN1, true); T(0.6, 32.05, '(ช่วง 21–30 ด้านล่าง)', 8, { fill: ST });
  R(xb, 3.15, ...yS1, { fill: '#e2f1dc', stroke: COL.green, sw: 1.4 }); T(2.47, 30.95, 'ชานพักชั้น 3', 8.5, { bold: true, fill: COL.green }); T(2.47, 30.7, '+7.00', 8.5, { fill: COL.green });
  R(xb, 3.15, ...yN1, { stroke: ST, dash: '4 3' }); T(2.47, 32.1, 'ช่องว่าง + ราวกันตก', 8, { fill: ST }); L(xb, 31.4, 3.15, 31.4, { stroke: '#222', sw: 2.5 });
}
T(0.7, 33.05, 'S1 บันไดหักกลับซ้อนชั้น · 0.175 × 0.26 · กว้าง 1.20 · ไม่มีลิฟต์', 10, { fill: ST, bold: true });
const northDoor = (a, b) => { L(a, yN + 0.05, b, yN + 0.05, { stroke: '#fff', sw: 7 }); door(a, yN, b - a, 0, -Math.PI * 0.45); };

// fixtures
const pan = (x, y) => { R(x - 0.19, x + 0.19, y - 0.3, y + 0.3, { fill: '#fff', stroke: '#555' }); C(x, y - 0.05, 0.13, { stroke: '#555' }); };
const basin = (x, y) => { R(x - 0.22, x + 0.22, y - 0.17, y + 0.17, { fill: '#fff', stroke: '#555' }); C(x, y, 0.08, { stroke: '#555' }); };
const shower = (x0, x1, y0, y1) => { R(x0, x1, y0, y1, { fill: '#b9d3f2', stroke: '#2a5db0' }); C((x0 + x1) / 2, (y0 + y1) / 2, 0.13, { stroke: '#2a5db0' }); };
const furn = (x0, x1, y0, y1, fill = '#e9d9c4') => R(x0, x1, y0, y1, { fill, stroke: COL.furn });
const room = (x0, x1, y0, y1, fill, name, sub) => { R(x0, x1, y0, y1, { fill }); T((x0 + x1) / 2, y0 + 0.75, name, 10, { bold: true }); if (sub) T((x0 + x1) / 2, y0 + 0.45, sub, 8.5); };
let rooms, notes, title, sub;

if (LV === 2) {
  const yC = 28.8; // corridor (north) / rooms (south) line
  // rooms full depth on the court side, corridor at the back
  R(-1.8, 22.2, 24.1, yN, { fill: '#fbfaf7' });
  R(0.4, 22.2, yC, yN, { fill: '#e6edf2' }); T(11.0, 29.35, 'ทางเดินด้านหลัง 1.20 ม. (back corridor) — ยกพื้น 150 มม. ใต้ทางเดินเป็นช่องท่อ', 9.5, { bold: true, fill: '#456' });
  room(-1.8, 3.6, 24.1, yC, '#f4efe4', '', ''); T(1.2, 26.6, 'ต้อนรับ + เลานจ์', 11, { bold: true }); T(1.2, 26.3, 'reception + lounge · 23.0 · มองลงคอร์ท', 8.5);
  furn(1.0, 2.6, 27.6, 28.1); T(1.8, 27.85, 'เคาน์เตอร์', 7.5); furn(-1.5, 0.0, 24.4, 25.0, '#d8cdee'); furn(1.2, 3.3, 24.4, 25.0, '#d8cdee'); T(0.9, 25.25, 'โซฟาชมแบด', 8);
  room(-1.8, 0.4, 27.9, yN, '#e0ecf7', '', ''); pan(-1.3, 29.55); basin(-0.6, 29.75); T(-0.7, 28.6, 'WC รวม', 9.5, { bold: true }); T(-0.7, 28.3, 'unisex 4.6', 8.5);
  const rr = [[3.6, 5.8, '#fde4e1', 'Red Light 1', '10.3'], [5.8, 8.0, '#fde4e1', 'Red Light 2', '10.3'], [8.0, 10.6, '#ececec', 'HBOT 1', '1.5–2.0 ATA · 12.2'], [10.6, 13.2, '#ececec', 'HBOT 2', '12.2'],
    [13.2, 17.6, '#e3f2fb', 'Contrast: ซาวน่า + น้ำเย็น', 'sauna · cold plunge · rinse · 20.7'], [17.6, 20.2, '#f1ecf7', 'Quiet Lounge', '12.2'], [20.2, 22.2, '#f7efe4', 'นวด/บำบัด', 'massage 9.4']];
  for (const [x0, x1, c, n, sb] of rr) { room(x0, x1, 24.1, yC, c, '', ''); T((x0 + x1) / 2, 24.75, n, 10, { bold: true }); T((x0 + x1) / 2, 24.45, sb, 8.5); }
  for (const x of [4.2, 6.4]) { furn(x, x + 0.8, 25.9, 27.9, '#fff'); } R(3.7, 5.7, 28.6, 28.7, { fill: COL.red }); R(5.9, 7.9, 28.6, 28.7, { fill: COL.red });
  for (const x of [8.4, 11.0]) { furn(x, x + 1.8, 25.9, 27.6, '#ccc'); furn(x + 0.2, x + 1.6, 26.1, 27.4, '#fff'); }
  R(13.3, 15.5, 26.5, 28.7, { fill: '#c98a4b', stroke: '#6b4a1a', sw: 1.4 }); T(14.4, 27.6, 'ซาวน่า 2.2×2.2', 8.5, { bold: true });
  R(15.7, 17.5, 27.3, 28.7, { fill: '#7fd0f0', stroke: '#2a5db0', sw: 1.4 }); T(16.6, 27.95, 'อ่างน้ำเย็น 3–5°C', 8, { bold: true }); shower(16.7, 17.5, 26.3, 27.15); T(16.1, 26.7, 'rinse', 8);
  furn(17.9, 19.9, 26.3, 26.9, '#d8cdee'); furn(17.9, 19.9, 27.4, 28.0, '#d8cdee'); furn(20.8, 21.5, 25.6, 27.6, '#fff');
  // façade: glass to the courts (frosted for treatment rooms), solid north wall
  wall(-1.8, -1.7, 24.1, yN); wall(22.1, 22.2, 24.1, yN); wall(-1.8, 22.2, yN, 30.1, '#bcd'); glass(-1.8, 22.2, 29.98, 30.12);
  glass(-1.8, 3.6, 24.05, 24.15); glass(17.6, 20.2, 24.05, 24.15); R(3.6, 17.6, 24.05, 24.15, { fill: '#e8eef2', stroke: '#9ab' }); R(20.2, 22.2, 24.05, 24.15, { fill: '#e8eef2', stroke: '#9ab' });
  T(10.6, 23.75, 'กระจกฝ้า (frosted) ห้องทรีตเมนต์', 8.5, { fill: '#678' });
  for (const x of [3.6, 5.8, 8.0, 10.6, 13.2, 17.6, 20.2]) wall(x - 0.05, x + 0.05, 24.1, yC); wall(-1.8, 0.4, 27.85, 27.95); wall(0.35, 0.45, 27.9, yN);
  const gaps = [[0.6, 3.4], [4.3, 5.1], [6.5, 7.3], [8.9, 9.8], [11.5, 12.4], [15.7, 16.5], [18.4, 19.3], [20.8, 21.6]];
  { let x = 0.4; for (const [a, b] of gaps) { wall(x, a, yC - 0.05, yC + 0.05); x = b; } wall(x, 22.2, yC - 0.05, yC + 0.05); }
  for (const [a, b] of gaps.slice(1)) door(a, yC, b - a, 0, -Math.PI * 0.45 + Math.PI * 0.9);
  L(0.4, 29.0, 0.4, 29.8, { stroke: '#fff', sw: 7 }); door(0.4, 29.0, 0.8, Math.PI / 2, Math.PI * 0.9); northDoor(1.85, 3.1);
  // entries: west-wing bridge (west end), east exit at the corridor end → new landing +3.50 → catwalk +4.50
  L(-1.8, 24.6, -1.8, 25.8, { stroke: '#fff', sw: 7 }); door(-1.8, 24.6, 1.2, Math.PI / 2, Math.PI * 0.1);
  P(`M${f(X(-3.0))},${f(Y(25.2))} L${f(X(-1.9))},${f(Y(25.2))}`, { stroke: COL.green, sw: 2.5 }); T(-3.1, 25.55, 'สะพานจากปีกตะวันตก', 8.5, { anchor: 'end', fill: COL.green }); T(-3.1, 25.3, 'west-wing bridge', 8, { anchor: 'end', fill: COL.green });
  L(22.15, 28.9, 22.15, 29.9, { stroke: '#fff', sw: 7 }); door(22.15, 28.9, 1.0, Math.PI / 2, Math.PI * 0.9);
  R(22.2, 23.6, 28.3, 30.1, { fill: '#ddd', stroke: '#555' }); T(22.9, 29.4, 'ชานพัก', 8.5, { bold: true }); T(22.9, 29.15, '+3.50', 8); T(22.9, 27.95, '↓ บันได → catwalk +4.50', 8, { fill: COL.red });
  for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);
  for (const [a, b] of [[-1.8, 3.6], [3.6, 5.8], [5.8, 8.0], [8.0, 10.6], [10.6, 13.2], [13.2, 17.6], [17.6, 20.2], [20.2, 22.2]]) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
  dimX(-1.8, 22.2, 22.15, '24.00 m (existing slab)', 0); dimY(24.1, yC, 24.3, '4.70', 0); dimY(yC, yN, 24.3, '1.20', 0);
  rooms = [['Reception + lounge (court view)', 'ต้อนรับ + เลานจ์', '5.40×4.70 − WC', '23.0'], ['Unisex WC', 'WC รวม', '2.20×2.10', '4.6'], ['Back corridor', 'ทางเดินด้านหลัง', '21.80×1.20', '26.2'],
    ['Red Light 1 + 2', 'ห้องแสงแดง ×2', '2.20×4.70 ×2', '20.6'], ['HBOT 1 + 2', 'ห้อง HBOT ×2', '2.60×4.70 ×2', '24.4'], ['Contrast: sauna + cold plunge + rinse', 'ซาวน่า+น้ำเย็น', '4.40×4.70', '20.7'],
    ['Quiet lounge', 'ห้องพัก', '2.60×4.70', '12.2'], ['Massage', 'นวด/บำบัด', '2.00×4.70', '9.4']];
  notes = [
    'WHAT CHANGED vs R41: the 1.80 m court-side balcony (43.2 m²) is gone. Circulation is now a 1.20 m corridor at the BACK (north) wall (26.2 m²), so every wellness room is 4.70 m deep (was 4.10) and gets the court-side façade.',
    'Net gain ≈ 17 m² of wellness space. Reception + lounge at the west end keeps a clear-glass view down to courts B4–B6; treatment rooms use frosted glass on the court side; the quiet lounge is clear glass.',
    'ARRIVAL: S1 (+3.50) opens straight onto the corridor; the west-wing bridge enters the reception. The east exit moves to the corridor end → new landing +3.50 (x 22.2…23.6, y 28.3…30.1) → short stair to the catwalk +4.50 — the old landing at y 24.2…25.8 must move north.',
    'DRAINS: sauna, plunge, rinse shower and WC sit against the corridor; pipes run in the 150 mm raised corridor floor and leave through the north façade into external downpipes (no coring of the existing slab).',
    'Still to check: HBOT/plunge loads (≤ 300 kg/m²) · 2 exits (S1 + bridge + east stair) · no lift.',
  ];
  title = 'MY PLACE / R42 — Rear building L2 (+3.50) · Wellness, corridor at the back'; sub = 'Balcony removed · rooms full depth on the court side · 1.20 m back corridor · S1 stacked U-stair · no lift';
} else {
  // L3 shell
  wall(-1.8, -1.7, 24.1, yN); wall(-1.8, 17.2, yN, 30.1, '#bcd'); glass(-1.8, 17.2, 29.98, 30.12); glass(0.4, 17.2, 24.05, 24.15); wall(-1.8, 0.4, 24.05, 24.15);
  room(-1.8, 0.4, 24.1, 27.6, '#eeeeee', 'ห้องเก็บของผู้เช่า', 'tenant store 7.7');
  room(-1.8, 0.4, 27.6, yN, '#e0ecf7', '', ''); pan(-1.3, 29.55); shower(-0.55, 0.35, 29.05, 29.95); basin(-1.35, 27.95); T(-0.75, 28.75, 'WC + ฝักบัว', 9.5, { bold: true }); T(-0.75, 28.45, 'WC + shower 5.3', 8.5);
  room(0.4, 4.2, 24.1, yN, '#f4efe4', 'โถง / ล็อบบี้', 'lobby · 22.4'); furn(0.7, 2.0, 25.6, 26.1); T(1.35, 25.85, 'เคาน์เตอร์', 7.5); furn(3.6, 4.1, 26.0, 28.4, '#c9b99d'); T(3.85, 27.2, 'ชั้นวางรองเท้า', 7.5, { rot: -90 }); furn(0.6, 1.4, 28.9, 29.3, '#cfe6f2'); T(1.0, 28.65, 'น้ำดื่ม', 7.5);
  room(4.2, 17.2, 24.1, yN, '#f3eee4', '', ''); T(10.7, 29.55, 'สตูดิโอฟิตเนสในร่ม (ให้เช่า) 78.0 ตร.ม.', 11, { bold: true }); T(10.7, 29.25, '13.00 × 6.00 · pilates reformer / functional / yoga', 8.5);
  furn(4.8, 9.2, 26.4, 28.6, '#b3c5e9'); T(7.0, 27.5, 'โซนเสื่อ/โยคะ', 9);
  for (let x = 10.0; x < 16.6; x += 1.6) furn(x, x + 0.6, 26.2, 28.9, '#fff'); T(12.6, 25.6, 'รีฟอร์มเมอร์ ×4–5', 8.5);
  for (let x = 4.8; x < 9.4; x += 1.1) furn(x, x + 0.8, 24.5, 25.6, '#555'); T(7.0, 25.85, 'คาร์ดิโอ', 8.5);
  // terrace
  R(17.2, 22.2, 24.1, 30.1, { fill: '#ead8b5' }); T(19.7, 29.45, 'ลานฟิตเนสกลางแจ้ง 30.0 ตร.ม.', 10, { bold: true }); T(19.7, 29.15, 'outdoor · rig / TRX / sled lane / plyo', 8.5);
  furn(17.6, 21.8, 24.5, 25.4, '#8cc79b'); T(19.7, 24.95, 'เลนสเลด/สปรินต์', 8.5); furn(17.8, 21.6, 27.6, 27.75, '#555'); T(19.7, 27.95, 'Rig บาร์โหน/ห่วง/TRX', 8.5); furn(18.0, 18.6, 26.2, 26.8, '#e2a95c'); furn(18.8, 19.4, 26.2, 26.8, '#e2a95c'); T(18.7, 26.0, 'กล่อง Plyo', 8);
  L(22.2, 24.1, 22.2, 30.1, { stroke: '#555', sw: 3 }); L(17.2, 24.1, 22.2, 24.1, { stroke: '#555', sw: 3 }); L(17.2, 30.1, 22.2, 30.1, { stroke: '#555', sw: 3 }); T(19.7, 30.35, 'ราวกันตก 1.10', 8, { fill: '#555' });
  wall(17.15, 17.25, 24.1, 25.0); glass(17.15, 17.25, 25.0, 29.2); wall(17.15, 17.25, 29.2, 30.1); T(17.4, 27.0, 'บานเลื่อนกระจก', 8, { rot: -90 });
  for (const x of [0.4, 4.2]) wall(x - 0.05, x + 0.05, 24.1, yN); wall(-1.8, 0.4, 27.55, 27.65);
  const sd = (x, y0, y1, dir) => { L(x, y0, x, y1, { stroke: '#fff', sw: 7 }); door(x, y0, y1 - y0, Math.PI / 2, Math.PI / 2 + dir * Math.PI * 0.4); };
  sd(0.4, 25.0, 25.8, 1); sd(0.4, 27.9, 28.7, 1); L(4.2, 26.5, 4.2, 28.1, { stroke: '#cfe6f2', sw: 7 }); door(4.2, 26.5, 0.8, Math.PI / 2, Math.PI * 0.1); door(4.2, 28.1, 0.8, -Math.PI / 2, -Math.PI * 0.1);
  northDoor(1.85, 3.1);
  for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);
  for (const [a, b] of [[-1.8, 0.4], [0.4, 4.2], [4.2, 17.2], [17.2, 22.2]]) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
  dimX(-1.8, 22.2, 22.15, '24.00 m', 0); dimY(24.1, 30.1, 23.0 + 0.8, '6.00', 0);
  rooms = [['Lobby + S1 arrival', 'โถง/ล็อบบี้', '3.80×5.90', '22.4'], ['WC + shower', 'WC + ฝักบัว', '2.20×2.40', '5.3'], ['Tenant store', 'ห้องเก็บของผู้เช่า', '2.20×3.50', '7.7'], ['Indoor fitness studio (lease)', 'สตูดิโอฟิตเนส', '13.00×6.00', '78.0'], ['Outdoor fitness terrace', 'ลานฟิตเนสกลางแจ้ง', '5.00×6.00', '30.0']];
  notes = [
    'L3 = FITNESS: one indoor studio for a single tenant (78.0 m², pilates reformer / functional / yoga — no heavy drop-lifting) + outdoor terrace 30.0 m² linked through a sliding glass wall. Same program as REV E.',
    'ARRIVAL: S1 continues in the same footprint (stacked U-stair, 40 risers × 0.175 = 7.00): flight 21–30 north row → landing +5.25 → flight 31–40 south row → floor landing +7.00 → north-wall door into the lobby. Open well beside the landing has a 1.10 guard.',
    'R44: Sky Trail (long stairs at E/5) REMOVED on request — terrace closed by a 1.10 m guard on all sides. S1 is the only stair of L3 (allowed: 3 storeys, no roof deck, ≤ 40 m travel, 1.20 m clear).',
    'WET: only the WC + shower at the north-west corner; its drain drops outside the north façade next to S1 (same riser line as the L2 WC). Old west core and lift are removed; tenant store takes their place.',
    'NO LIFT: L3 not wheelchair-accessible. Structure of L3 (new floor on top of the existing L2 slab) to be confirmed by the structural engineer.',
  ];
  title = 'MY PLACE / R44 — Rear building L3 (+7.00) · Fitness indoor + outdoor (no Sky Trail)'; sub = 'Matched to GF R40 / L2 R42 · North up · metres · S1 stacked U-stair · no lift';
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#fff"/>
<text x="${MX}" y="56" font-size="30" font-weight="700" fill="#111">${title}</text>
<text x="${MX}" y="86" font-size="15" fill="#555">${sub}</text>
<g transform="translate(${W - 200},24)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111"/><text x="68" y="46" font-size="14" fill="#111">N</text></g>
${o.join('\n')}
<g transform="translate(${MX},${MY + HP + 30})" font-size="12.5" fill="#222">
<text font-weight="700" font-size="14">ROOM SCHEDULE</text>
${rooms.map((r, i) => `<text y="${22 + i * 19}">${i + 1}. ${r[0]} · ${r[1]}</text><text x="470" y="${22 + i * 19}">${r[2]} m</text><text x="640" y="${22 + i * 19}" text-anchor="end" font-weight="700">${r[3]} m²</text>`).join('')}
<g transform="translate(700,0)"><text font-weight="700" font-size="14">NOTES</text>${notes.map((n, i) => `<text y="${22 + i * 31}" font-size="11.5">${n.replace(/(.{150,}?) /g, '$1\u0001').split('\u0001').map((l, k) => `<tspan x="0" dy="${k ? 14 : 0}">${l}</tspan>`).join('')}</text>`).join('')}</g>
</g>
</svg>`;
const name = LV === 3 ? 'rear_L3_R44' : 'rear_L2_R44';
fs.writeFileSync(path.join(here, 'plans', name + '.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', name + '.png') });
await browser.close();
console.log('ok', name);
