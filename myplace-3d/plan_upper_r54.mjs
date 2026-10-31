// Rear building upper floors R41 (L2 +3.50 wellness, L3 +7.00 fitness), matched to GF R40. usage: node plan_upper_r41.mjs 2|3
// usage: node plan_gf_r34.mjs → plans/rear_GF_R40.{svg,png}
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const S = 55, XMIN = -4.9, XMAX = 24.2, YMIN = 19.6, YMAX = 37.4, MX = 80, MY = 170;
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
R(-1.8, 22.2, 19.8, 23.1, { fill: '#e7ecef' }); for (const x0 of [-1.8, 5.55, 12.85]) R(x0, x0 + 6.1, 19.8, 21.95, { stroke: '#7aa87a', dash: '5 4' }); T(9.4, 20.6, 'คอร์ทแถวหลังด้านล่าง (void) — ขอบคอร์ท y 21.95', 9, { fill: '#667' }); R(20.35, 21.15, 19.8, 23.1, LV === 2 ? { fill: '#cfe0fb', stroke: '#1d4ed8' } : { stroke: '#1d4ed8', dash: '5 3' }); T(21.6, 21.3, LV === 2 ? 'catwalk +3.50' : 'catwalk (ล่าง)', 8.5, { fill: '#1d4ed8', anchor: 'start', bold: LV === 2 });
R(-1.8, 22.2, 23.1, 30.1, { fill: '#fbfaf7' }); L(-1.8, 24.1, 22.2, 24.1, { stroke: '#b44', sw: 1, dash: '6 4' });
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
  const yK = 24.3; // R54: corridor on the court side y 23.10…24.30, rooms 24.30…30.00
  R(-1.8, 22.2, 23.1, yN, { fill: '#fbfaf7' });
  R(0.4, 22.2, 23.1, yK, { fill: '#e6edf2' }); T(9.9, 23.62, 'ทางเดิน/ระเบียงชมแบด 1.20 ม. ด้านสนาม (court-side corridor) — กระจกใสตลอดแนว', 9.5, { bold: true, fill: '#345' });
  T(9.9, 23.3, 'พื้นยื่นใหม่ 1.00 ม. (y 23.10–24.10) บนคานเหล็กยื่นจากเสาแถว 4', 8, { fill: '#b44' });
  room(-1.8, 3.6, 23.1, yN, '#f4efe4', '', ''); T(1.2, 26.4, 'ต้อนรับ + เลานจ์ + นวด', 11, { bold: true }); T(1.2, 26.1, 'reception · lounge · massage chairs', 8.5);
  furn(1.0, 2.6, 27.0, 27.5); T(1.8, 27.25, 'เคาน์เตอร์', 7.5); furn(-1.5, 0.0, 23.4, 24.0, '#d8cdee'); furn(1.2, 3.3, 23.4, 24.0, '#d8cdee'); T(0.9, 24.25, 'โซฟาชมแบด', 8); furn(-1.4, -0.6, 25.6, 26.6, '#bcd'); furn(-1.4, -0.6, 26.8, 27.6, '#bcd');
  room(-1.8, 0.4, 27.9, yN, '#e0ecf7', '', ''); pan(-1.3, 29.55); basin(-0.6, 29.75); T(-0.7, 28.6, 'WC รวม', 9.5, { bold: true }); T(-0.7, 28.3, 'unisex 4.6', 8.5);
  const rr = [[3.6, 5.8, '#fde4e1', 'Red Light 1', '12.5'], [5.8, 8.0, '#fde4e1', 'Red Light 2', '12.5'], [8.0, 10.6, '#ececec', 'HBOT 1', '1.5–2.0 ATA · 14.8'], [10.6, 13.2, '#ececec', 'HBOT 2', '14.8'],
    [13.2, 17.6, '#e3f2fb', 'Contrast: ซาวน่า + น้ำเย็น', 'sauna · cold plunge · rinse · 25.1'], [21.2, 22.2, '#eeeeee', '', '']];
  for (const [x0, x1, c, n, sb] of rr) { room(x0, x1, yK, yN, c, '', ''); if (n) { T((x0 + x1) / 2, 26.0, n, 10, { bold: true }); T((x0 + x1) / 2, 25.7, sb, 8.5); } }
  R(17.6, 21.2, yK, yN, { fill: 'url(#lease)' }); T(19.4, 26.9, 'ห้องให้เช่า W', 11, { bold: true }); T(19.4, 26.55, 'wellness suite · 20.5 ตร.ม.', 9, { bold: true }); T(19.4, 26.25, '3.60 × 5.70 (physio / aesthetic)', 8.5);
  T(21.7, 27.2, 'ผ้า/ของ linen 5.7', 8.5, { rot: -90 });
  for (const x of [4.2, 6.4]) { furn(x, x + 0.8, 25.6, 27.6, '#fff'); } R(3.7, 5.7, 29.8, 29.9, { fill: COL.red }); R(5.9, 7.9, 29.8, 29.9, { fill: COL.red });
  for (const x of [8.4, 11.0]) { furn(x, x + 1.8, 26.6, 28.4, '#ccc'); furn(x + 0.2, x + 1.6, 26.8, 28.2, '#fff'); }
  R(13.3, 15.5, 27.7, 29.9, { fill: '#c98a4b', stroke: '#6b4a1a', sw: 1.4 }); T(14.4, 28.8, 'ซาวน่า 2.2×2.2', 8.5, { bold: true });
  R(15.7, 17.5, 28.5, 29.9, { fill: '#7fd0f0', stroke: '#2a5db0', sw: 1.4 }); T(16.6, 29.2, 'อ่างน้ำเย็น', 8, { bold: true }); shower(16.7, 17.5, 27.4, 28.3); T(16.1, 27.8, 'rinse', 8); furn(13.6, 15.2, 24.45, 24.85);
  // façades
  wall(-1.8, -1.7, 23.1, yN); wall(22.1, 22.2, 23.1, yN); wall(-1.8, 22.2, yN, 30.1, '#bcd'); glass(-1.8, 1.85, 29.98, 30.12); glass(3.1, 22.2, 29.98, 30.12);
  glass(-1.8, 20.25, 23.06, 23.14); glass(21.15, 22.2, 23.06, 23.14); L(20.3, 23.1, 21.1, 23.1, { stroke: '#fff', sw: 7 }); door(20.3, 23.1, 0.8, 0, Math.PI * 0.45); T(20.7, 22.75, 'ประตูจาก catwalk', 8, { fill: '#1d4ed8' });
  for (const x of [3.6, 5.8, 8.0, 10.6, 13.2, 17.6, 21.2]) wall(x - 0.05, x + 0.05, yK, yN); wall(-1.8, 0.4, 27.85, 27.95); wall(0.35, 0.45, 27.95, yN);
  const gaps = [[4.3, 5.1], [6.5, 7.3], [8.9, 9.8], [11.5, 12.4], [15.7, 16.5], [18.6, 19.5], [21.4, 22.0]];
  { let x = 3.6; for (const [a, b] of gaps) { wall(x, a, yK - 0.05, yK + 0.05); x = b; } wall(x, 22.2, yK - 0.05, yK + 0.05); }
  for (const [a, b] of gaps) door(a, yK, b - a, 0, Math.PI * 0.45);
  door(0.4, 28.0, 0.8, Math.PI / 2, Math.PI * 0.9); northDoor(1.85, 3.1);
  for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);
  for (const [a, b] of [[-1.8, 3.6], [3.6, 5.8], [5.8, 8.0], [8.0, 10.6], [10.6, 13.2], [13.2, 17.6], [17.6, 21.2], [21.2, 22.2]]) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
  dimX(-1.8, 22.2, 20.1, '24.00 m', 0); dimY(23.1, yK, 23.0, '1.20', 0); dimY(yK, yN, 23.0, '5.70', 0); dimY(21.95, 23.1, 23.6, '1.15', 0);
  rooms = [['Court-side corridor / viewing walkway', 'ทางเดินชมแบด', '21.80×1.20', '26.2'], ['Reception + lounge + massage chairs', 'ต้อนรับ/เลานจ์', '5.40×6.90 − WC', '32.7'], ['Unisex WC', 'WC รวม', '2.20×2.10', '4.6'],
    ['Red Light 1 + 2', 'ห้องแสงแดง ×2', '2.20×5.70 ×2', '25.1'], ['HBOT 1 + 2', 'ห้อง HBOT ×2', '2.60×5.70 ×2', '29.6'], ['Contrast: sauna + plunge + rinse', 'ซาวน่า+น้ำเย็น', '4.40×5.70', '25.1'],
    ['Wellness suite FOR LEASE', 'ห้องให้เช่า W', '3.60×5.70', '20.5'], ['Linen store', 'ผ้า/ของ', '1.00×5.70', '5.7']];
  notes = [
    'R54: corridor moved to the COURT side (y 23.10…24.30) — it sits mostly on the new 1.00 m slab strip and is a 21.8 m viewing walkway with clear glass and a lean rail; the +3.50 catwalk enters it at x 20.30…21.10.',
    'Rooms 5.70 m deep behind it, all against the north wall → sauna, plunge, rinse shower and WC drain straight out through the north façade (no pipes across the corridor, no coring).',
    'Arrival: S1 (+3.50) opens into the reception at the north wall; the reception spans the full depth and opens onto the corridor. Old east exit, landing and link passage are no longer needed.',
    'RENTABLE L2: wellness suite 20.5 m² (x 17.6…21.2). Structure: steel cantilever beams 2.0 m off the row-4 columns carry the new strip — to be checked with the existing columns/footings.',
  ];
  title = 'MY PLACE / R54 — Rear building L2 (+3.50) · corridor on the court side'; sub = 'Wellness · rooms 5.70 m deep on the north wall · viewing corridor over the new 1.0 m slab · catwalk link · S1 · no lift';
} else {
  // L3 shell
  wall(-1.8, -1.7, 23.1, yN); wall(-1.8, 17.2, yN, 30.1, '#bcd'); glass(-1.8, 17.2, 29.98, 30.12); glass(0.4, 17.2, 23.05, 23.15); wall(-1.8, 0.4, 23.05, 23.15);
  room(-1.8, 0.4, 23.1, 27.6, '#eeeeee', 'ห้องเก็บของผู้เช่า', 'tenant store 9.9');
  room(-1.8, 0.4, 27.6, yN, '#e0ecf7', '', ''); pan(-1.3, 29.55); shower(-0.55, 0.35, 29.05, 29.95); basin(-1.35, 27.95); T(-0.75, 28.75, 'WC + ฝักบัว', 9.5, { bold: true }); T(-0.75, 28.45, 'WC + shower 5.3', 8.5);
  room(0.4, 4.2, 23.1, yN, '#f4efe4', 'โถง / ล็อบบี้', 'lobby · 26.2'); furn(0.7, 2.0, 25.6, 26.1); T(1.35, 25.85, 'เคาน์เตอร์', 7.5); furn(3.6, 4.1, 26.0, 28.4, '#c9b99d'); T(3.85, 27.2, 'ชั้นวางรองเท้า', 7.5, { rot: -90 }); furn(0.6, 1.4, 28.9, 29.3, '#cfe6f2'); T(1.0, 28.65, 'น้ำดื่ม', 7.5);
  R(4.2, 17.2, 23.1, yN, { fill: 'url(#lease)' }); T(10.7, 29.55, 'สตูดิโอฟิตเนสในร่ม (ให้เช่า) 91.0 ตร.ม.', 11, { bold: true }); T(10.7, 29.25, '13.00 × 7.00 · pilates reformer / functional / yoga', 8.5);
  furn(4.8, 9.2, 26.4, 28.6, '#b3c5e9'); T(7.0, 27.5, 'โซนเสื่อ/โยคะ', 9);
  for (let x = 10.0; x < 16.6; x += 1.6) furn(x, x + 0.6, 26.2, 28.9, '#fff'); T(12.6, 25.6, 'รีฟอร์มเมอร์ ×4–5', 8.5);
  for (let x = 4.8; x < 9.4; x += 1.1) furn(x, x + 0.8, 23.6, 24.7, '#555'); T(7.0, 24.95, 'คาร์ดิโอ (มองลงคอร์ท)', 8.5);
  // terrace
  R(17.2, 22.2, 23.1, 30.1, { fill: '#ead8b5' }); T(19.7, 29.45, 'ลานฟิตเนสกลางแจ้ง 35.0 ตร.ม.', 10, { bold: true }); T(19.7, 29.15, 'outdoor · rig / TRX / sled lane / plyo', 8.5);
  furn(17.6, 21.8, 23.5, 24.4, '#8cc79b'); T(19.7, 23.95, 'เลนสเลด/สปรินต์', 8.5); furn(17.8, 21.6, 27.6, 27.75, '#555'); T(19.7, 27.95, 'Rig บาร์โหน/ห่วง/TRX', 8.5); furn(18.0, 18.6, 26.2, 26.8, '#e2a95c'); furn(18.8, 19.4, 26.2, 26.8, '#e2a95c'); T(18.7, 26.0, 'กล่อง Plyo', 8);
  L(22.2, 23.1, 22.2, 30.1, { stroke: '#555', sw: 3 }); L(17.2, 23.1, 22.2, 23.1, { stroke: '#555', sw: 3 }); L(17.2, 30.1, 22.2, 30.1, { stroke: '#555', sw: 3 }); T(19.7, 30.35, 'ราวกันตก 1.10', 8, { fill: '#555' });
  wall(17.15, 17.25, 23.1, 25.0); glass(17.15, 17.25, 25.0, 29.2); wall(17.15, 17.25, 29.2, 30.1); T(17.4, 27.0, 'บานเลื่อนกระจก', 8, { rot: -90 });
  for (const x of [0.4, 4.2]) wall(x - 0.05, x + 0.05, 23.1, yN); wall(-1.8, 0.4, 27.55, 27.65);
  const sd = (x, y0, y1, dir) => { L(x, y0, x, y1, { stroke: '#fff', sw: 7 }); door(x, y0, y1 - y0, Math.PI / 2, Math.PI / 2 + dir * Math.PI * 0.4); };
  sd(0.4, 25.0, 25.8, 1); sd(0.4, 27.9, 28.7, 1); L(4.2, 26.5, 4.2, 28.1, { stroke: '#cfe6f2', sw: 7 }); door(4.2, 26.5, 0.8, Math.PI / 2, Math.PI * 0.1); door(4.2, 28.1, 0.8, -Math.PI / 2, -Math.PI * 0.1);
  northDoor(1.85, 3.1);
  for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);
  for (const [a, b] of [[-1.8, 0.4], [0.4, 4.2], [4.2, 17.2], [17.2, 22.2]]) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
  dimX(-1.8, 22.2, 20.1, '24.00 m', 0); dimY(23.1, 30.1, 23.8, '7.00', 0);
  rooms = [['Lobby + S1 arrival', 'โถง/ล็อบบี้', '3.80×6.90', '26.2'], ['WC + shower', 'WC + ฝักบัว', '2.20×2.40', '5.3'], ['Tenant store', 'ห้องเก็บของผู้เช่า', '2.20×4.50', '9.9'], ['Indoor fitness studio FOR LEASE', 'สตูดิโอฟิตเนส', '13.00×7.00', '91.0'], ['Outdoor fitness terrace', 'ลานฟิตเนสกลางแจ้ง', '5.00×7.00', '35.0']];
  notes = [
    'R54: L3 extends to y 23.10 like L2 → studio 91.0 m² (was 78.0), terrace 35.0 m² (was 30.0), lobby 26.2 m², tenant store 9.9 m². The studio\'s glass front now looks straight down onto the courts; cardio row along it.',
    'ARRIVAL: S1 stacked U-stair (40 risers × 0.175 = 7.00) → north-wall door into the lobby. Hall roof / trusses end at y 23.10; the studio roof extends to the new front.',
    'WET: only the WC + shower at the north-west corner (drain outside the north façade next to S1). No Sky Trail (removed R44); S1 is the only stair (3 storeys, no roof deck, ≤ 40 m travel).',
    'RENTABLE L3: studio 91.0 m² (single tenant). NO LIFT. New L3 floor + its 1.0 m extension to be confirmed by the structural engineer.',
  ];
  title = 'MY PLACE / R54 — Rear building L3 (+7.00) · Fitness studio 91 m² + terrace'; sub = 'Front line y 23.10 (1.0 m over the courts\' back walkway) · S1 stacked U-stair · no lift';
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
const name = LV === 3 ? 'rear_L3_R54' : 'rear_L2_R54';
fs.writeFileSync(path.join(here, 'plans', name + '.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', name + '.png') });
await browser.close();
console.log('ok', name);
