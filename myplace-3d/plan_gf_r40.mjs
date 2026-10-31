// Revised REAR GROUND FLOOR (R34, from user R33 layout) (north up, metres).
// usage: node plan_gf_r34.mjs → plans/rear_GF_R44.{svg,png}
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

// ── context ──
R(-1.8, 22.2, 22.2, yS, { fill: '#fdf0d5' }); T(11, 23.9, 'ทางเดินหลังคอร์ท / back-of-court aisle (2.00 + slab edge)', 11, { fill: '#a07a30' });
R(-1.8, 22.2, 24.1, 30.1, { stroke: '#b44', sw: 1.4, dash: '12 5' }); T(19.6, 31.2, 'ขอบพื้น คสล. เดิม (ห้ามเจาะ)', 10, { fill: '#b44' }); T(19.6, 30.9, 'existing slab edge x −1.80…22.20 / y 24.10…30.10', 9, { fill: '#b44' });
R(3.4, 22.2, 30.2, 33.6, { fill: '#e3f0d8' }); T(12.9, 32.2, 'สนามหญ้า — พื้นที่จัดภูมิทัศน์ในอนาคต (ไม่มีสระ)', 10, { fill: COL.green }); T(12.9, 31.85, 'future landscape lawn · no pool (R44)', 9, { fill: COL.green });
P(`M${f(X(0.2))},${f(Y(33.85))} L${f(X(20.2))},${f(Y(36.85))}`, { stroke: COL.red, sw: 1.8, dash: '6 4' });
for (const [x, d] of [[0.2, '5.75'], [5.2, '6.50'], [10.2, '7.25'], [15.2, '8.00'], [20.2, '8.75']]) T(x, 33.85 + (x - 0.2) * 0.15 + 0.2, d, 9, { fill: COL.red });
T(10.2, 36.2, 'รั้วลาด / sloped fence (gross distance from line 5)', 10, { fill: COL.red, rot: -8 });

// ── S1 stair + lift (positions frozen) ──
const ST = '#b8731a';
R(-1.8, 3.2, 30.1, 32.8, { fill: '#fff4e2', stroke: ST, sw: 2 });
const yS1 = [30.15, 31.35], yN1 = [31.45, 32.65], xa = -0.6, xb = 1.74; // flights: 9 treads × 0.26, 10 risers × 0.175 each
// mid landing +1.75 (west) with pool store under it
R(-1.8, xa, 30.15, 32.65, { fill: 'url(#lease)', stroke: ST, sw: 1.4 }); T(-1.2, 31.75, 'ชานพัก', 9, { bold: true }); T(-1.2, 31.5, '+1.75', 9); T(-1.2, 30.85, 'ใต้ชานพัก:', 8); T(-1.2, 30.6, 'เก็บของสระ', 8.5, { bold: true }); T(-1.2, 30.35, 'pool store', 8);
// flight A (north row) — cut flight, solid
R(xa, xb, ...yN1, { fill: '#fff', stroke: ST, sw: 1.4 }); for (let x = xb; x > xa + 0.01; x -= 0.26) L(x, yN1[0], x, yN1[1], { stroke: ST, sw: 0.9 });
L(1.6, 32.05, -0.35, 32.05, { stroke: ST, sw: 2 }); P(`M${f(X(-0.5))},${f(Y(32.05))} l9,-5 v10 z`, { fill: ST, stroke: ST }); T(0.6, 32.25, 'ขึ้น UP 1–10', 8.5, { fill: ST, bold: true });
// flight B (south row) — above the GF walkway, dashed
R(xa, xb, ...yS1, { stroke: ST, sw: 1.2, dash: '5 3' }); for (let x = xa + 0.26; x < xb; x += 0.26) L(x, yS1[0], x, yS1[1], { stroke: ST, sw: 0.6, dash: '3 3' });
T(0.6, 31.1, 'ขึ้น 11–20 (เหนือศีรษะ)', 8, { fill: ST });
// top landing +3.50 → L2 slab (overhead, dashed) and start zone ±0.00
R(xb, 3.15, ...yS1, { stroke: ST, sw: 1.2, dash: '5 3' }); T(2.47, 30.95, 'ชานพักบน +3.50', 8, { fill: ST, bold: true }); T(2.47, 30.7, '→ พื้นชั้น 2', 8, { fill: ST });
R(xb, 3.15, ...yN1, { fill: '#e2f1dc', stroke: COL.green, sw: 1.2 }); T(2.47, 32.15, 'จุดเริ่มขึ้น', 8.5, { bold: true, fill: COL.green }); T(2.47, 31.9, 'START ±0.00', 8, { fill: COL.green });
// GF walking route: passage → under flight B (headroom ≥ 2.25) → start zone
P(`M${f(X(1.0))},${f(Y(29.6))} L${f(X(1.0))},${f(Y(30.45))} L${f(X(2.3))},${f(Y(30.45))} L${f(X(2.3))},${f(Y(31.75))}`, { stroke: COL.green, sw: 2.5, dash: '7 4' });
P(`M${f(X(2.3))},${f(Y(31.9))} l-5,-9 h10 z`, { fill: COL.green, stroke: COL.green });
T(0.7, 33.05, 'S1 บันได — ตำแหน่งเดิม · 20 ลูกตั้ง 0.175 · ลูกนอน 0.26 · กว้าง 1.20', 10, { fill: ST, bold: true });
R(-3.8, -1.8, 27.9, 29.8, { stroke: '#bbb', dash: '4 4' }); T(-2.8, 28.95, 'ลิฟต์ตัดออก', 9, { fill: '#999' }); T(-2.8, 28.65, '(lift removed)', 8.5, { fill: '#999' });


// ── shell ──
R(-1.8, 22.2, yS, yN, { fill: '#fbfaf7' });
wall(-1.8, -1.7, yS, yN); wall(22.1, 22.3, yS, yN); wall(-1.8, 22.3, yN, 30.1, '#bcd'); glass(-1.8, 22.2, 29.98, 30.12);

// ── rooms (fills) ──
const rm = (x0, x1, y0, y1, fill) => R(x0, x1, y0, y1, { fill });
const yA = 27.15; // accessible WC north wall = front of the WC rooms
R(-1.7, 22.1, yG, yN, { fill: '#dbe9f5' }); // zone behind grid 5 (no slab yet → buried drains)
rm(-1.8, 0.4, yS, yA, '#efe6f7'); rm(-1.8, 0.4, yA, yN, '#f8e6ee'); rm(0.4, 1.6, yS, yN, '#e9eef2'); rm(1.6, 3.6, yA, yN, '#e0ecf7');
R(1.6, 3.6, yS, yA, { fill: 'url(#lease)' });
rm(3.6, 5.5, yS, yN, '#f8e8ef'); rm(5.5, 7.4, yS, yN, '#e4eef8'); rm(7.4, 10.2, yS, yN, '#fcefd3'); rm(10.2, 15.2, yS, yN, '#e4f2e7');
R(15.2, 20.2, yS, yN, { fill: 'url(#lease)' }); rm(20.2, 22.1, yS, yN, '#e8edf0');
L(-1.8, yG, 22.2, yG, { stroke: '#2a5db0', sw: 2, dash: '10 4' });
for (const x of [0.4, 1.6, 3.6, 5.5, 7.4, 10.2, 15.2, 20.2]) wall(x - 0.05, x + 0.05, yS, yN);
L(17.7, yS + 0.1, 17.7, yN, { stroke: '#b8901a', sw: 2, dash: '8 5' });
wall(-1.8, 0.4, yA - 0.05, yA + 0.05); wall(1.6, 3.6, yA - 0.05, yA + 0.05);
// south wall with door gaps
const gaps = [[-1.2, -0.3], [0.5, 1.5], [1.9, 2.8], [3.9, 4.8], [6.3, 7.2], [8.2, 9.4], [11.6, 12.8], [16.0, 16.9], [18.5, 19.4], [21.25, 22.4]];
{ let x = -1.8; for (const [a, b] of gaps) { wall(x, a, yS - 0.1, yS + 0.1); x = b; } wall(x, 22.3, yS - 0.1, yS + 0.1); }
for (const [a, b] of [[7.6, 8.2], [9.4, 10.0], [15.4, 16.0], [16.9, 17.6], [17.8, 18.5], [19.4, 20.0]]) glass(a, b, yS - 0.07, yS + 0.07);
for (const [a, b] of gaps) { const w = b - a; if (w > 1.1) { door(a, yS + 0.1, w / 2, 0, Math.PI * 0.45); door(b, yS + 0.1, w / 2, Math.PI, Math.PI * 0.55); } else door(a, yS + 0.1, w, 0, Math.PI * 0.45); }
const sideDoor = (x, y0, y1, dir) => { L(x, y0, x, y1, { stroke: '#fff', sw: 7 }); door(x, y0, y1 - y0, Math.PI / 2, Math.PI / 2 + dir * Math.PI * 0.4); };
sideDoor(0.4, 27.3, 28.05, -1); sideDoor(1.6, 27.3, 28.05, 1);
const northDoor = (a, b) => { L(a, yN + 0.05, b, yN + 0.05, { stroke: '#fff', sw: 7 }); door(a, yN, b - a, 0, -Math.PI * 0.45); };
northDoor(0.5, 1.5);
// fixtures
const pan = (x, y) => { R(x - 0.19, x + 0.19, y - 0.3, y + 0.3, { fill: '#fff', stroke: '#555' }); C(x, y - 0.05, 0.13, { stroke: '#555' }); };
const basin = (x, y) => { R(x - 0.22, x + 0.22, y - 0.17, y + 0.17, { fill: '#fff', stroke: '#555' }); C(x, y, 0.08, { stroke: '#555' }); };
const shower = (x, y, w, h) => { R(x, x + w, y, y + h, { fill: '#b9d3f2', stroke: '#2a5db0' }); C(x + w / 2, y + h / 2, 0.13, { stroke: '#2a5db0' }); };
const lockers = (x0, x1, y0, y1) => { R(x0, x1, y0, y1, { fill: '#c9b99d', stroke: '#6b5a3a' }); for (let y = y0 + 0.3; y < y1; y += 0.3) L(x0, y, x1, y, { stroke: '#6b5a3a', sw: 0.6 }); };
const urinal = (x) => R(x - 0.2, x + 0.2, 29.65, 29.95, { fill: '#fff', stroke: '#555' });

// Accessible WC (approved) — pan pushed to its north wall, closest to grid 5
C(-0.7, 26.0, 0.75, { stroke: '#999', dash: '3 3' }); R(-0.45, -0.07, 26.55, 27.1, { fill: '#fff', stroke: '#555' }); C(-0.26, 26.75, 0.13, { stroke: '#555' }); basin(-1.5, 26.75); L(-0.9, 27.07, 0.3, 27.07, { stroke: '#222', sw: 2.2 });
T(-0.7, 25.95, 'WC อารยสถาปัตย์', 9, { bold: true }); T(-0.7, 25.65, 'Accessible 2.05×2.00', 8.5);
// Female WC (old pool-store spot): 2 WC behind grid 5
wall(-1.75, 0.35, 28.47, 28.53); wall(-0.7, -0.65, 28.5, yN);
pan(-1.25, 29.55); pan(-0.15, 29.55); L(-1.6, 28.5, -0.9, 28.5, { stroke: '#888', sw: 3 }); L(-0.5, 28.5, 0.2, 28.5, { stroke: '#888', sw: 3 });
basin(-1.4, 28.3 - 0.0); T(-0.6, 27.75, 'WC หญิง', 10, { bold: true }); T(-0.6, 27.45, '2 WC · 1 อ่าง · 6.3', 8.5);
// Male WC: 1 WC + 2 U behind grid 5
wall(2.6, 2.65, 28.5, yN); wall(1.65, 2.65, 28.47, 28.53); pan(2.1, 29.55); L(1.8, 28.5, 2.45, 28.5, { stroke: '#888', sw: 3 }); urinal(2.95); urinal(3.35); basin(3.35, 28.3);
T(2.6, 27.75, 'WC ชาย', 10, { bold: true }); T(2.6, 27.45, '1 WC · 2 U · 1 อ่าง · 5.7', 8.5);
// kiosk in front of male WC
T(2.6, 26.35, 'คีออสก์ให้เช่า', 9, { bold: true }); T(2.6, 26.05, 'kiosk · 4.1', 8.5);
// passage
T(1.0, 26.6, 'ทางเดิน → S1  1.20', 9.5, { bold: true, rot: -90 });
P(`M${f(X(1.0))},${f(Y(29.7))} l-4,8 h8 z`, { fill: COL.green, stroke: COL.green });
// Lockers F / M: 1.90 × 4.90, 2 showers each behind grid 5
for (const [x0, lab] of [[3.6, 'ล็อกเกอร์ หญิง'], [5.5, 'ล็อกเกอร์ ชาย']]) {
  const x1 = x0 + 1.9; shower(x0 + 0.05, 29.0, 0.9, 0.95); shower(x0 + 0.95, 29.0, 0.9, 0.95); L(x0 + 0.05, 28.95, x1 - 0.05, 28.95, { stroke: '#2a5db0', sw: 2, dash: '4 2' });
  lockers(x1 - 0.5, x1 - 0.05, 25.7, 28.0); R(x0 + 0.15, x0 + 0.5, 26.0, 27.9, { fill: '#e9d9c4', stroke: COL.furn });
  T(x0 + 0.95, 28.4, 'drying', 8, { fill: COL.dim }); T(x0 + 0.85, 25.75 + 0.0, '', 8);
  T(x0 + 0.9, 27.35, lab, 9, { bold: true, rot: 0 }); T(x0 + 0.9, 27.05, '2 SH · 9.3', 8.5);
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
// Lease units (now 15.2…20.2)
for (const [x0, x1, n] of [[15.2, 17.7, 'L1'], [17.7, 20.2, 'L2']]) { const cx = (x0 + x1) / 2; T(cx, 27.0, `ให้เช่า ${n}`, 11, { bold: true }); T(cx, 26.65, 'FOR LEASE 12.3', 10, { bold: true }); T(cx, 26.3, '2.50 × 4.90', 8.5); }
T(17.7, 29.4, 'L1+L2 รวมได้ 24.5 ตร.ม.', 8.5);
T(17.7, 28.35, 'หลังกริด 5: ยังไม่มีพื้น → ท่อฝังดิน', 8.5, { fill: '#2a5db0', bold: true });
// Staff WC at grid 4–5 / E — EXISTING: 2 WC rooms back-to-back, doors open INWARD, basin on the door wall between the doors,
// no outer walls (open to the aisle / slab edge), 2 urinals on the grid-5 wall facing north, privacy screen extending the door-wall line
R(21.18, 22.35, 24.98, 30.17, { fill: '#f6f2e6' }); R(20.25, 21.18, 28.13, 30.17, { fill: '#f6f2e6' });
L(22.2, 25.1, 22.2, 30.1, { stroke: '#b44', sw: 1.2, dash: '12 5' }); T(21.75, 29.75, 'เปิดโล่ง (ไม่มีผนังนอก)', 7.5, { fill: '#777' });
wall(20.25, 21.15, 26.6, 26.66); wall(20.25, 21.18, 28.07, 28.13); wall(21.12, 21.18, 25.9, 26.66); wall(21.12, 21.18, 26.66, 27.35); wall(20.25, 21.18, 25.0, 25.2);
R(20.5, 20.9, 26.4, 26.6, { fill: '#fff', stroke: '#555' }); C(20.7, 26.1, 0.2, { fill: '#fff', stroke: '#555' }); R(20.5, 20.9, 26.66, 26.86, { fill: '#fff', stroke: '#555' }); C(20.7, 27.16, 0.2, { fill: '#fff', stroke: '#555' });
door(21.15, 25.15, 0.75, Math.PI / 2, Math.PI * 0.92); door(21.15, 28.07, 0.72, -Math.PI / 2, -Math.PI * 0.92);
basin(21.4, 26.63);
wall(21.12, 21.18, 28.13, 29.1); // privacy screen on the door-wall line
R(20.4, 20.75, 28.13, 28.45, { fill: '#fff', stroke: '#555' }); R(20.8, 21.1, 28.13, 28.45, { fill: '#fff', stroke: '#555' }); L(20.77, 28.13, 20.77, 28.6, { stroke: '#888', sw: 2 });
T(20.7, 29.15, 'โถปัสสาวะ 2', 8.5, { bold: true }); T(20.7, 28.9, 'ที่กริด 5', 8); T(21.75, 28.7, 'ผนังบังตา', 7.5, { fill: '#555' });
T(20.7, 25.55, 'WC', 8.5, { bold: true }); T(20.7, 27.6, 'WC', 8.5, { bold: true }); T(21.7, 26.2, 'อ่าง', 8); T(21.7, 27.2, 'ห้องน้ำพนักงาน', 8.5, { bold: true }); T(21.7, 26.95, '(เดิม)', 8);
for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);

// dims
const chain = [[-1.8, 0.4], [0.4, 1.6], [1.6, 3.6], [3.6, 5.5], [5.5, 7.4], [7.4, 10.2], [10.2, 15.2], [15.2, 17.7], [17.7, 20.2], [20.2, 22.2]];
for (const [a, b] of chain) dimX(a, b, 22.55, (b - a).toFixed(2), 0);
dimX(-1.8, 22.2, 22.15, '24.00 m', 0); dimY(yS, yN, 23.0, '4.90', 0);
const rooms = [
  ['Accessible WC (left of A, 4–5)', 'WC อารยสถาปัตย์', '2.20×2.05', '4.5'], ['Female WC (old pool-store spot)', 'ห้องน้ำหญิง 2 WC', '2.20×2.85', '6.3'], ['Male WC', 'ห้องน้ำชาย 1 WC + 2 U', '2.00×2.85', '5.7'],
  ['Passage → S1', 'ทางเดิน', '1.20×4.90', '5.9'], ['Kiosk for lease', 'คีออสก์ให้เช่า', '2.00×2.05', '4.1'], ['Locker + 2 showers, Female', 'ล็อกเกอร์ หญิง', '1.90×4.90', '9.3'], ['Locker + 2 showers, Male', 'ล็อกเกอร์ ชาย', '1.90×4.90', '9.3'],
  ['Gift shop', 'ร้านของที่ระลึก', '2.80×4.90', '13.7'], ['Clinic', 'คลินิก', '5.00×4.90', '24.5'], ['FOR LEASE L1', 'พื้นที่ให้เช่า', '2.50×4.90', '12.3'], ['FOR LEASE L2', 'พื้นที่ให้เช่า', '2.50×4.90', '12.3'], ['Staff WC (grid 4–5 / E)', 'ห้องน้ำพนักงาน', '1.90×4.90', '9.3'],
  ['Pool store (under S1 mid-landing)', 'เก็บของสระใต้ชานพัก', '1.20×2.50', '(3.0)'],
];
const notes = [
  'WHAT CHANGED vs R39: existing staff WC at grid 4–5 / E — 2 WC rooms back-to-back, doors open inward, basin on the door wall between the two doors, no outer walls, 2 urinals on the grid-5 wall with a privacy screen extending the door-wall line. Lease L1/L2 2.50 m each (24.5 m² together).',
  'S1 STAIR (approved R38) — same footprint (x −1.80…3.20, y 30.10…32.80): U-stair, 2 flights × 10 risers 0.175 = 3.50, treads 0.26, width 1.20, mid-landing +1.75 at the west end. Route: passage → north door → walk east under the upper flight',
  '(headroom ≥ 2.25 m at the passage, ≥ 3.3 m under the top landing) → turn north to START → flight 1 west → landing +1.75 → flight 2 east → top landing +3.50 sits on the L2 slab edge (y 30.10). Pool store (≈3.0 m², 1.55 m high) under the mid-landing.',
  'DRAINS: new F/M urinals, WCs and all showers are behind grid 5. The staff WC is existing (drains already in place); only the accessible WC pan is in front of grid 5 → its drain must run through/under the existing floor.',
  'RENTABLE: L1 + L2 24.5 + gift shop 13.7 + kiosk 4.1 ≈ 42 m² (R37 52 m², the difference is the staff WC). Still to check: fire exits, exhaust fans for windowless WCs.',
];
const title = 'MY PLACE / R44 — Rear GF (= R40) · pool removed → future landscape (±0.00)';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#fff"/>
<text x="${MX}" y="56" font-size="30" font-weight="700" fill="#111">${title}</text>
<text x="${MX}" y="86" font-size="15" fill="#555">Rear ground floor, 7th pass · North up · metres · S1 U-stair 20 × 0.175 (pool store under landing) · no lift · wet fixtures behind grid 5 for buried drains · existing staff WC 4–5/E · kiosk + 2 lease units</text>
<g transform="translate(${W - 200},24)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111"/><text x="68" y="46" font-size="14" fill="#111">N</text></g>
${o.join('\n')}
<g transform="translate(${MX},${MY + HP + 30})" font-size="12.5" fill="#222">
<text font-weight="700" font-size="14">ROOM SCHEDULE</text>
${rooms.map((r, i) => `<text y="${22 + i * 19}">${i + 1}. ${r[0]} · ${r[1]}</text><text x="470" y="${22 + i * 19}">${r[2]} m</text><text x="640" y="${22 + i * 19}" text-anchor="end" font-weight="700">${r[3]} m²</text>`).join('')}
<text y="${22 + rooms.length * 19 + 4}" font-weight="700">TOTAL 117.7 m² inside the strip · rentable ≈ 12.3 + 12.3 + 13.7 + 4.1 = 42.4 m²</text>
<g transform="translate(700,0)"><text font-weight="700" font-size="14">NOTES</text>${notes.map((n, i) => `<text y="${22 + i * 31}" font-size="11.5">${n.replace(/(.{150,}?) /g, '$1\u0001').split('\u0001').map((l, k) => `<tspan x="0" dy="${k ? 14 : 0}">${l}</tspan>`).join('')}</text>`).join('')}</g>
</g>
</svg>`;
fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
fs.writeFileSync(path.join(here, 'plans', 'rear_GF_R44.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', 'rear_GF_R44.png') });
await browser.close();
console.log('ok', W, H);
