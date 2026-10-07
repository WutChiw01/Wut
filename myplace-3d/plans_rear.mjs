// 2D plans of the REAR COMPLEX (REV D.12): GF ±0.00, L2 +3.50, L3 +7.00 (north up, metres).
// usage: node plans_rear.mjs → plans/rear_GF.{svg,png}, rear_L2, rear_L3, rear_GF_clinic (zoomed)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const S = 60, XMIN = -4.6, MX = 80;
const COL = { wall: '#333', glass: '#7fb5d6', teak: '#c99a5b', dim: '#0b57d0', furn: '#555', red: '#c0392b', green: '#4c8a3a' };

function sheet(level) {
  const YMAX = level === 'G' ? 36.9 : 31.4, YMIN = level === 'G' ? 21.4 : 21.4;
  const W = Math.round(((level === 'G' ? 39.6 : 26.4) - XMIN) * S + 2 * MX), HP = (YMAX - YMIN) * S, H = Math.round(HP + 360);
  const MY = 190;
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

  // ── grid ──
  for (const [x, t] of [[0.2, '1'], [5.2, '2'], [10.2, '3'], [15.2, '4'], [20.2, '5']]) { L(x, YMIN + 0.2, x, 31.0, { stroke: '#cc5', sw: 0.6, dash: '10 4 2 4' }); bubble(x, 31.15 + (level === 'G' ? 0 : 0.0), t); }
  for (const [y, t] of [[25.1, 'A'], [28.1, 'B']]) { L(-4.2, y, 25.2, y, { stroke: '#cc5', sw: 0.6, dash: '10 4 2 4' }); bubble(-4.45, y, t); }

  // ── context: hall aisle (south) ──
  R(-0.8, 22.3, 22.0, 25.1, { fill: '#e7ecef' }); T(10.5, 22.62, 'ทางเดินหลังคอร์ทแบด (2.00 ม.) / คอร์ท B4–B6', 12, { fill: '#667' });
  for (const x0 of [0.4, 7.15, 13.9]) R(x0, x0 + 6.1, 21.4, 23.1, { fill: '#8cc79b', stroke: '#fff', sw: 1, op: 0.55 });

  // ── west core (x −3.9…−1.8, y 22…30.1): stair + lift ──
  const stairs = (x0, x1, ya, yb, n) => { for (let i = 0; i <= n; i++) L(x0, ya + ((yb - ya) * i) / n, x1, ya + ((yb - ya) * i) / n, { stroke: '#222' }); R(x0, x1, Math.min(ya, yb), Math.max(ya, yb), { stroke: '#222', sw: 1.4 }); };
  const core = () => {
    wall(-3.9, -3.7, 25.3, 30.1); wall(-3.9, -1.8, 30.0, 30.1); wall(-3.9, -3.7, 22.0, 25.3, '#999');
    R(-3.7, -1.8, 24.9, 30.0, { fill: '#fbfbfb' });
    stairs(-3.7, -2.78, 26.0, 28.0, 10); stairs(-2.72, -1.8, 28.0, 26.0, 10); R(-3.7, -1.8, 24.9, 26.0, { fill: '#e6e6e6', stroke: '#222', sw: 1.4 });
    L(-3.24, 26.2, -3.24, 27.8, { stroke: COL.red, sw: 2 }); P(`M${f(X(-3.24))},${f(Y(27.95))} l-5,10 h10 z`, { fill: COL.red, stroke: COL.red }); T(-2.8, 24.6, 'บันไดหนีไฟ 0.95/ช่วง', 10, { bold: true });
    R(-3.85, -1.8, 28.05, 30.1, { fill: '#fff', stroke: COL.wall, sw: 3 }); L(-3.85, 28.05, -1.8, 30.1, { stroke: COL.wall }); L(-3.85, 30.1, -1.8, 28.05, { stroke: COL.wall });
  };

  // ── RC existing slab outline (L2) ──
  if (level === 'U') { R(-1.8, 22.2, 24.1, 30.1, { stroke: '#b44', sw: 1.6, dash: '12 5' }); T(11.0, 30.55, 'ขอบพื้น คสล. เดิม 24.00 × 6.00 = 144 ตร.ม. — ห้ามเจาะ/สกัด', 11, { fill: '#b44' }); }

  if (level === 'G') {
    // outer shell
    R(-1.8, 22.2, 25.1, 30.1, { fill: '#fbfaf7' });
    wall(-1.8, 22.3, 30.0, 30.1, '#bcd'); glass(-1.8, 22.2, 29.98, 30.12);
    wall(22.1, 22.3, 25.1, 30.1);
    // south façade y 25.1: solid / glazed / doors
    wall(-1.8, 1.9, 25.0, 25.2); wall(4.2, 5.0, 25.0, 25.2); wall(10.2, 12.7, 25.0, 25.2); wall(18.4, 22.2, 25.0, 25.2);
    glass(5.0, 10.2, 25.05, 25.15); glass(1.9, 4.2, 25.05, 25.15); glass(12.7, 18.4, 25.05, 25.15);
    // west lobby / corridor C1 / lift
    R(-1.8, 1.9, 25.1, 30.0, { fill: '#e9eef2' }); T(0.05, 27.6, 'โถงลิฟต์', 12, { bold: true }); T(0.05, 27.25, 'ทางเดิน C1 1.50 ม.', 10); core();
    L(-1.8, 25.1, -1.8, 30.1, { stroke: '#333', sw: 2 }); door(-1.8, 28.4, 0.9, 0, -0.5);
    // accessible WC
    wall(1.9, 2.0, 25.1, 27.4); wall(1.9, 4.2, 27.4, 27.5); R(2.0, 4.2, 25.1, 27.4, { fill: '#f2f6f8' }); C(3.3, 26.2, 0.3, { stroke: '#555' }); R(2.2, 2.6, 26.6, 27.3, { stroke: '#555' }); R(2.1, 4.1, 25.15, 25.45, { stroke: '#555', fill: '#fff' });
    T(3.05, 26.9, 'WC/อาบน้ำ อารยสถาปัตย์', 10, { bold: true }); T(3.05, 26.6, '2.30×2.30 · ประตูเลื่อน 0.95', 9); door(2.0, 25.15, 0.95, 0, 0.5);
    // changing rooms M/F
    wall(4.2, 4.3, 27.5, 30.1); wall(7.2, 7.3, 25.1, 30.1); wall(10.1, 10.3, 25.1, 30.1); wall(4.3, 10.1, 27.4, 27.5);
    for (const [x0, x1, lab] of [[4.3, 7.2, 'ห้องเปลี่ยน ชาย'], [7.3, 10.1, 'ห้องเปลี่ยน หญิง']]) { R(x0, x1, 27.5, 30.0, { fill: '#f3f1ee' }); T((x0 + x1) / 2, 28.7, lab, 11, { bold: true }); T((x0 + x1) / 2, 28.4, '15.0 ตร.ม.', 9); R(x0 + 0.1, x1 - 0.1, 29.65, 30.0, { fill: '#6c8fd0', stroke: '#444' }); R(x0 + 0.3, x1 - 0.3, 28.4 - 0.45, 28.8 - 0.45, { stroke: COL.furn, fill: '#e9d9c4', op: 0 }); R(x0 + 0.3, x1 - 0.3, 27.75, 28.0, { stroke: COL.furn, fill: '#e9d9c4' }); }
    T(7.2, 26.2, 'ทางเข้าแห้ง (Dry) จากโถงคอร์ท', 11, { fill: '#555' }); T(7.2, 29.2 - 0.0, '', 9);
    T(7.25, 30.35, 'ประตูเปียก (Wet) สู่ชานสระ', 10, { fill: COL.dim });
    // clinic
    R(10.3, 18.3, 25.1, 30.0, { fill: '#f1f6fa' }); wall(10.2, 18.5, 26.85, 26.95); wall(12.75, 12.85, 26.95, 30.1); wall(15.35, 15.45, 26.95, 30.1); wall(18.3, 18.5, 25.1, 30.1);
    T(12.9, 25.45, 'ต้อนรับ 14.76 ตร.ม.', 10, { bold: true }); R(11.0, 14.2, 26.0 - 0.0, 26.5, { fill: '#e9d9c4', stroke: COL.furn, op: 0 }); R(11.0, 14.2, 26.35, 26.8, { fill: '#e9d9c4', stroke: COL.furn }); T(12.6, 26.55, 'เคาน์เตอร์', 9); R(15.0, 17.8, 25.3, 25.8, { fill: '#e9d9c4', stroke: COL.furn }); T(16.4, 25.5, 'ม้านั่งรอ', 9);
    door(14.5, 25.1, 0.7, Math.PI * 0.5, Math.PI * 0.05); door(15.9, 25.1, 0.7, Math.PI * 0.5, Math.PI * 0.95); T(15.2, 24.8, 'ประตูกระจกคู่ 1.40 ม.', 9, { fill: COL.dim });
    R(10.5, 11.4, 27.7, 29.6, { fill: '#fff', stroke: COL.furn }); R(12.0, 12.5, 29.4, 29.9, { stroke: COL.furn, fill: '#ccc' }); T(11.5, 28.15, 'TR1', 11, { bold: true }); T(11.5, 27.55, 'เตียง Plinth · Laser/US', 8, { rot: 0 }); T(11.5, 30.28 - 0.0, '', 9);
    R(13.1, 14.0, 27.7, 29.6, { fill: '#cfe0f8', stroke: COL.furn }); R(14.6, 15.1, 29.4, 29.9, { stroke: COL.furn, fill: '#ccc' }); T(14.1, 28.15, 'TR2', 11, { bold: true });
    T(11.5, 27.2, 'ห้องตรวจ 1 · 8.32', 9); T(14.1, 27.2, 'ห้องตรวจ 2 · 8.32 · ESWT/TENS', 8.5);
    R(15.6, 18.3, 27.2, 30.0, { fill: '#cfe8c8', stroke: '#4c8a3a' }); for (let y = 27.3; y < 29.8; y += 0.3) L(18.2, y, 18.3, y, { stroke: COL.teak, sw: 2 }); T(17.0, 28.7, 'ห้องฟื้นฟู/ทรงตัว 9.60', 11, { bold: true }); T(17.0, 28.35, 'หญ้าเทียม · Bosu · บาร์ไม้สวีเดน', 9);
    glass(15.4, 17.4, 29.95, 30.25); R(15.4, 17.4, 29.95, 30.25, { stroke: COL.dim, sw: 1.6 }); T(16.4, 29.62, '', 9);
    wall(15.4, 15.45, 29.4, 30.0); T(16.4, 30.45 + 0.0, 'ประตูกระจกเลื่อน 2.00 ม. → สระ', 10, { fill: COL.dim, bold: true });
    // climbing room
    R(18.5, 22.1, 25.1, 30.0, { fill: '#f1ece3' }); R(18.6, 22.0, 25.4, 29.9, { fill: '#8aa0d8', stroke: '#2c3e8c', op: 0.55 }); T(20.3, 27.8, 'ห้องปีนผาในร่ม 19.0 ตร.ม.', 11, { bold: true }); T(20.3, 27.45, 'เบาะ 300 มม. บนพื้นเดิม ±0.00', 9);
    // columns
    for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);
    // ── outdoor: pool court ──
    R(11.4, 21.4, 30.1, 31.6, { fill: '#e2c294', stroke: '#9b6b33' }); R(11.4, 21.4, 34.6, 35.6, { fill: '#e2c294', stroke: '#9b6b33' }); R(11.4, 13.4, 31.6, 34.6, { fill: '#e2c294', stroke: '#9b6b33' }); R(19.4, 21.4, 31.6, 34.6, { fill: '#e2c294', stroke: '#9b6b33' });
    R(13.34, 19.46, 31.54, 34.66, { fill: '#c9a46c', stroke: '#333', sw: 1.4 }); R(13.72, 19.08, 31.92, 34.28, { fill: '#7fd0ea', stroke: '#2a8fb3' });
    for (let i = 1; i <= 3; i++) R(15.8, 17.0, 31.6 - 0.32 * (4 - i), 31.6 - 0.32 * (3 - i), { fill: '#e0c08a', stroke: '#6a4a1a' });
    T(16.4, 33.2, 'สระสำเร็จรูป 3.00 × 6.00 ม.', 13, { bold: true, fill: '#04506b' }); T(16.4, 32.85, 'ขอบสูง +0.80 · ลึก 1.30', 10, { fill: '#04506b' });
    R(21.1, 22.9, 31.6, 33.5, { fill: '#d0d3d6', stroke: '#111', sw: 1.6 }); T(22.0, 32.6, 'ห้องเครื่องสระ', 9, { bold: true }); C(20.4, 31.9, 0.3, { fill: '#ccc' });
    R(14.0, 16.0, 34.95, 35.5, { fill: '#7aa55a', stroke: '#4a6f2f' }); R(16.6, 18.6, 34.95, 35.5, { fill: '#7aa55a', stroke: '#4a6f2f' }); for (const y of [32.2, 33.4]) R(11.7, 12.9, y - 0.3, y + 0.3, { fill: '#fff', stroke: '#777' });
    C(12.3, 34.1, 1.3, { fill: 'rgba(200,190,170,0.4)', stroke: '#887' });
    L(-1.8, 34.1 + 0.15 * (-1.8 - 0.2), 17.0, 34.1 + 0.15 * (17.0 - 0.2), { stroke: '#222', sw: 3 }); T(-1.6, 33.5, 'รั้วหลังเฉียง (0.20, 34.10) → (20.20, 37.10)', 11, { anchor: 'start' });
    // SKY TRAIL (REV E): L3 deck bridge (+7.00) → 4 switch-back runs → trailhead on the ground. Footprint of the decks (they pass above the garden).
    {
      const YC = [30.7, 32.5, 34.3, 36.1], zs = [7.0, 5.25, 3.5, 1.75, 0];
      R(24.3, 26.0, 29.35, 31.5, { fill: '#f1d9b0', stroke: '#8a5a1a', sw: 1.4 }); R(22.2, 24.3, 29.35, 30.65, { fill: '#f1d9b0', stroke: '#8a5a1a', sw: 1.4, dash: '4 3' });
      YC.forEach((yc, i) => { R(26.0, 36.0, yc - 0.65, yc + 0.65, { fill: '#f6e3c0', stroke: '#8a5a1a', sw: 1.4 }); for (let x = 26.4; x < 36; x += 0.55) L(x, yc - 0.6, x, yc + 0.6, { stroke: '#8a5a1a', sw: 0.5 }); const dir = i % 2 === 0 ? 1 : -1; const xm = i % 2 === 0 ? 33.5 : 28.5; L(xm - dir * 1.2, yc, xm + dir * 1.2, yc, { stroke: '#c0392b', sw: 2 }); P(`M${f(X(xm + dir * 1.5))},${f(Y(yc))} l${-dir * 12},-6 v12 z`, { fill: '#c0392b', stroke: '#c0392b' }); T(31.0, yc + 0.12, 'ทางเดินเขา ' + (i + 1) + ': +' + zs[i].toFixed(2) + ' → +' + zs[i + 1].toFixed(2), 10, { fill: '#6a3b00', bold: true }); });
      R(36.0, 37.6, 30.05, 33.15, { fill: '#f1d9b0', stroke: '#8a5a1a', sw: 1.4 }); R(24.4, 26.0, 31.85, 34.95, { fill: '#f1d9b0', stroke: '#8a5a1a', sw: 1.4 }); R(36.0, 37.6, 33.65, 36.75, { fill: '#f1d9b0', stroke: '#8a5a1a', sw: 1.4 });
      R(23.4, 26.0, 35.45, 36.75, { fill: '#d9d5cc', stroke: '#444', sw: 1.2 }); T(24.7, 36.95, 'Trailhead ±0.00', 10, { bold: true });
      T(31.0, 29.45, 'SKY TRAIL 48 ม. · ลาด 17.5% · กว้าง 1.30 ม. · ต่อจากลานฟิตเนสชั้น 3 (+7.00) ลงพื้นดิน', 11, { bold: true, fill: '#6a3b00' });
    }
    // outdoor climbing wall + crash pit (shifted 1.30 m north in REV D.8)
    R(22.55, 22.85, 25.6, 28.9, { fill: '#c2561f', stroke: '#222', sw: 1.4 }); T(22.7, 30.8, 'กำแพงปีนผา 3.30×10.50', 9, { anchor: 'start' });
    R(22.85, 25.05, 24.9, 29.2, { fill: '#2c3e8c', stroke: '#111', sw: 1.4, op: 0.65 }); R(22.85, 25.5, 24.45, 24.9, { fill: '#bbb', stroke: '#555' }); R(22.85, 25.5, 29.2, 29.65, { fill: '#bbb', stroke: '#555' }); R(25.2, 25.65, 26.1, 29.65, { fill: '#bbb', stroke: '#555' }); R(25.05, 25.2, 24.9, 29.2, { fill: '#999' });
    T(23.95, 27.2, 'หลุมรับตก −0.60', 10, { fill: '#fff', bold: true }); T(23.95, 26.9, '2.20×4.30', 9, { fill: '#fff' }); R(23.7, 24.3, 26.7, 27.3, { fill: '#222' }); T(25.45, 25.4, 'ช่องบันได 1.20', 9, { anchor: 'start' });
    // north-west tower etc: palms (P1)
    C(-4.0, 23.8, 0.22, { fill: '#8a6d4b', stroke: '#4a3920' }); T(-4.0, 23.2, 'P1', 10, { bold: true });
    // dims
    dimX(-1.8, 22.2, 21.55, 'ความยาวอาคาร 24.00 ม. (x −1.80 … +22.20)', 0);
    R(1.9, 4.2, 27.5, 30.0, { fill: '#f0f0f0', stroke: '#bbb', dash: '4 3' }); T(3.05, 28.7, 'พื้นที่ว่าง/เทคนิค', 9, { fill: '#777' }); T(3.05, 28.4, '(ไม่ได้ใช้ในโมเดล)', 8, { fill: '#777' });
    T(10.3, 36.1 - 0.0, '', 9);
    // zone labels
    T(-0.4, 25.7, '', 9);
  }

  if (level === 'U') {
    // ── L2: gallery + 7 wellness zones ──
    R(-1.8, 22.2, 24.1, 25.9, { fill: '#eef0f1' }); R(-1.8, 22.2, 25.9, 30.1, { fill: '#fbfaf7' });
    L(-1.8, 24.1, 22.2, 24.1, { stroke: '#4aa3d6', sw: 3.5 }); T(10.3, 25.55, 'ระเบียงชมแบดมินตันทิศใต้ 43.20 ตร.ม. (กว้าง 1.80) · ราวกระจกลามิเนต 1.10 ม. มองลงคอร์ท B4–B6', 11, { bold: true });
    for (const x of [3, 9, 15, 19.5]) R(x - 0.3, x + 0.3, 24.3, 24.9, { fill: '#7aa55a', stroke: '#4a6f2f' });
    wall(-1.8, 22.2, 30.0, 30.1, '#bcd'); glass(-1.8, 22.2, 29.98, 30.12); wall(22.1, 22.3, 25.2, 30.1); wall(22.1, 22.3, 24.1, 25.2, '#999'); glass(-1.8, 22.2, 25.86, 25.94); 
    const px = [0.0, 2.05, 4.25, 7.05, 9.55, 12.05, 15.05, 17.05, 20.2];
    for (const x of px) wall(x - 0.06, x + 0.06, 25.9, 30.1);
    const zone = (x0, x1, name, area, fill = '#f6f4ef', extra = '') => { R(x0 + 0.06, x1 - 0.06, 25.94, 30.0, { fill }); T((x0 + x1) / 2, 26.38, name, 9.5, { bold: true }); T((x0 + x1) / 2, 26.14, area + ' ตร.ม.', 8.5); };
    zone(-1.8, 0.0, 'West Cross', '7.56', '#eef2f5'); zone(0.0, 2.05, 'Red Light 1', '8.61'); zone(2.05, 4.25, 'Red Light 2', '9.24'); zone(4.25, 7.05, 'HBOT 1', '11.76'); zone(7.05, 9.55, 'HBOT 2', '10.50'); zone(9.55, 12.05, 'Cold Plunge', '10.50', '#eaf3f8'); zone(12.05, 15.05, 'Dual Sauna', '12.60'); zone(15.05, 17.05, 'Quiet Lounge', '8.40'); zone(17.05, 20.2, 'นวด / บำบัดมือ', '9.5', '#f6f4ef'); zone(20.2, 22.2, 'เก็บผ้า', '8.4', '#f1ece3');
    // equipment
    R(0.3, 1.8, 29.9, 30.0, { fill: '#d22', stroke: '#600' }); R(2.3, 4.0, 29.9, 30.0, { fill: '#d22', stroke: '#600' }); R(0.3, 1.7, 28.2, 29.3, { fill: '#fff', stroke: COL.furn }); T(1.0, 28.75, 'เตียง', 8);
    for (const [xa, xb] of [[4.5, 6.8], [7.3, 9.3]]) { R(xa + 0.1, xb - 0.1, 27.1, 29.1, { fill: '#555', op: 0.25, stroke: COL.furn }); R(xa + 0.25, xb - 0.25, 27.6, 28.6, { fill: '#f5f7fa', stroke: '#444', sw: 1.4 }); }
    T(5.65, 29.45, 'ตู้ HBOT 1.5–2.0 ATA', 8); R(9.8, 11.8, 27.3, 29.0, { fill: '#7dd3fc', stroke: '#2a8fb3' }); T(10.8, 28.1, 'อ่าง 3–5 °C', 9);
    R(12.4, 14.6, 26.5, 29.7, { fill: '#c98a4b', stroke: '#6a4a1a' }); T(13.5, 28.0, 'ซาวน่า', 9); R(14.65, 14.95, 26.5, 29.7, { fill: '#333' });
    for (const y of [27.4, 28.8]) R(15.4, 16.8, y - 0.35, y + 0.35, { fill: '#3b82f6', stroke: COL.furn }); for (const y of [26.9, 28.7]) R(18.0, 19.6, y - 0.4, y + 0.4, { fill: '#fff', stroke: COL.furn }); L(17.4, 27.8, 19.9, 27.8, { stroke: '#8bd', sw: 2, dash: '4 3' }); R(20.5, 21.9, 26.2, 29.9, { fill: '#c98a4b', stroke: '#6a4a1a' });
    for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);
    T(10.3, 30.85, '', 9);
    // east door + landing + stair to the +4.50 catwalk
    R(22.3, 23.7, 23.4, 25.25, { fill: '#cfd3d6', stroke: '#333', sw: 1.4 }); for (let i = 1; i <= 6; i++) R(22.5, 23.7, 23.4 - 0.26 * i, 23.4 - 0.26 * (i - 1), { fill: '#e0e0e0', stroke: '#444' });
    L(23.1, 23.3, 23.1, 21.9, { stroke: COL.red, sw: 2 }); P(`M${f(X(23.1))},${f(Y(21.8))} l-5,-10 h10 z`, { fill: COL.red, stroke: COL.red }); T(23.1, 21.5, 'ขึ้นทางเดิน +4.50', 9, { fill: COL.red, bold: true });
    glass(22.1, 22.3, 24.17, 25.15); T(22.9, 25.7, 'ประตูกระจก 1.05 → ชานพัก +3.50', 9, { anchor: 'start' });
    // west cross passage and corner stair at L2
    core(); wall(-3.9, -3.7, 25.3, 30.1); R(-1.8, 0.0, 24.1, 25.9, { fill: '#eef0f1' }); T(-0.9, 25.1, 'ทางเดินเชื่อมสะพานปีกตะวันตก', 8);
    L(-3.7, 25.0, -3.7, 24.1, { stroke: '#4aa3d6', sw: 2 });
    C(-4.0, 23.8, 0.22, { fill: '#8a6d4b', stroke: '#4a3920' }); T(-4.0, 23.2, 'P1', 10, { bold: true });
    dimX(-1.8, 22.2, 23.55, 'พื้น คสล. เดิม 24.00 ม.', 0); dimY(24.1, 30.1, -2.6, '6.00 ม.', -6); 
    T(11.0, 22.05, 'ระยะหนีไฟไกลสุด: ห้องเก็บผ้า → ระเบียง → บันไดมุม = 31.80 ม. (≤ 40 ม.)', 11, { fill: COL.red, bold: true });
  }

  if (level === 'T') {
    // ── L3 studio + terrace ──
    R(-1.8, 22.2, 24.1, 30.1, { fill: '#fbfaf7' });
    // services zone x −1.8…4.2
    R(-1.8, 4.2, 24.1, 30.1, { fill: '#eef2f5' }); core();
    R(1.9, 4.2, 24.1, 26.4, { fill: '#f5f7f9', stroke: '#777', dash: '5 3' }); T(3.05, 25.2, 'WC อารยสถาปัตย์ 2.30×2.30', 9); T(3.05, 24.9, '(ตามสเปก · ไม่มีในโมเดล 3D)', 8, { fill: '#a33' });
    R(-1.8, 1.9, 26.4, 30.1, { fill: '#f5f7f9', stroke: '#777', dash: '5 3' }); T(0.05, 29.4, 'ห้องเก็บของผู้เช่า 10.35 ตร.ม.', 9); T(0.05, 29.1, '(ตามสเปก · ไม่มีในโมเดล 3D)', 8, { fill: '#a33' });
    // studio
    R(4.3, 17.1, 24.1, 30.1, { fill: '#f4ede3' }); wall(4.1, 4.3, 24.1, 30.1); glass(17.1, 17.3, 24.1, 30.1);
    glass(4.2, 17.2, 24.06, 24.14); glass(4.2, 17.2, 30.06, 30.14);
    for (let x = 5.0; x < 10; x += 1.2) R(x, x + 0.8, 24.8, 26.4, { fill: '#555', stroke: '#222' }); T(7.5, 26.7, 'คาร์ดิโอเลียบแนวเสา A', 10);
    for (let k = 0; k < 4; k++) R(10.8 + k * 1.5, 11.3 + k * 1.5, 26.5, 29.0, { fill: '#fff', stroke: COL.furn }); T(13.8, 26.22, 'รีฟอร์มเมอร์ ×4', 10);
    R(5.0, 9.0, 27.5, 29.8, { fill: '#9db8f0', stroke: COL.furn, op: 0.7 }); T(7.0, 28.65, 'โซนเสื่อ/โยคะ', 10);
    T(10.9, 29.78, 'สตูดิโอฟิตเนสให้เช่า 78.0 ตร.ม. (13.00 × 6.00)', 13, { bold: true }); T(10.9, 29.45, 'ผู้เช่ารายเดียว · กระจกรับวิวสนามแบตทิศใต้และสระทิศเหนือ · ห้ามดร็อปเดดลิฟต์', 9);
    // terrace
    R(17.2, 22.2, 24.1, 30.1, { fill: '#e8cfa8' }); for (let x = 17.2; x < 22.2; x += 0.1) L(x, 24.1, x, 30.1, { stroke: '#d9b98a', sw: 0.4 });
    R(17.2, 22.2, 24.0, 24.1, { fill: '#cfe6f2', stroke: COL.glass }); R(17.2, 22.2, 30.1, 30.2, { fill: '#cfe6f2', stroke: COL.glass }); R(22.1, 22.2, 24.1, 30.1, { fill: '#cfe6f2', stroke: COL.glass });
    for (const x of [17.7, 22.0]) for (const y of [24.3, 29.9]) R(x - 0.08, x + 0.08, y - 0.08, y + 0.08, { fill: '#b57', stroke: '#524' });
    R(17.7, 22.0, 26.0, 28.4, { fill: 'rgba(240,240,250,0.6)', stroke: '#99a', dash: '6 3' }); T(19.85, 28.55, 'หลังคาผ้าใบเลื่อนพับได้', 9);
    for (const [x, y] of [[18.0, 24.5], [18.0, 29.6], [21.6, 29.6]]) R(x - 0.3, x + 0.3, y - 0.3, y + 0.3, { fill: '#7aa55a', stroke: '#4a6f2f' });
    R(17.6, 22.0, 25.0, 26.1, { fill: '#8fd08a', stroke: '#2a7a2a' }); T(19.8, 25.45, 'เลนสเลด/สปรินต์', 9); R(18.4, 19.4, 25.3, 25.8, { fill: '#333' });
    R(18.1, 21.3, 28.34, 28.46, { fill: '#555', stroke: '#222' }); T(19.7, 28.75, 'Rig: บาร์โหน · ห่วง · TRX', 9);
    for (const [x0, h] of [[18.0, 0.5], [18.8, 0.6], [19.7, 0.75]]) R(x0, x0 + 0.7, 26.6, 27.2, { fill: '#e0b070', stroke: COL.furn }); T(19.0, 27.45, 'กล่อง Plyo', 9);
    R(21.2, 21.9, 26.5, 27.9, { fill: '#444' }); T(21.55, 28.0, 'KB', 8, { fill: '#fff' }); L(22.2, 29.2, 22.2, 30.1, { stroke: COL.red, sw: 3 });
    T(19.7, 24.6, 'ลานฟิตเนสกลางแจ้ง 30.0 ตร.ม.', 11, { bold: true }); T(19.7, 24.3, '5.00 × 6.00 · +7.00', 9);
    // top-out gate to the climbing tower
    R(22.2, 22.55, 26.6, 27.9, { fill: '#999', stroke: '#222' }); R(22.55, 22.85, 25.6, 28.9, { fill: '#c2561f', stroke: '#222', sw: 1.4 }); T(23.0, 27.3, 'Top-out +7.00', 10, { anchor: 'start', bold: true }); T(23.0, 26.95, 'ประตู/สะพานเหล็ก 1.30', 9, { anchor: 'start' });
    R(22.2, 24.3, 29.35, 30.65, { fill: '#f1d9b0', stroke: '#8a5a1a', sw: 1.4 }); R(24.3, 26.0, 29.35, 31.5, { fill: '#f1d9b0', stroke: '#8a5a1a', sw: 1.4 }); T(25.2, 31.75, '→ Sky Trail ลงชั้นล่าง', 10, { anchor: 'start', bold: true, fill: '#6a3b00' });
    for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) col(x, y);
    C(-4.0, 23.8, 0.22, { fill: '#8a6d4b', stroke: '#4a3920' }); T(-4.0, 23.2, 'P1', 10, { bold: true });
    T(11.0, 22.62, 'ช่องว่าง (Void) เหนือระเบียงชั้น 2 · ผนังกระจกสตูดิโออยู่ที่ y = 24.10', 11, { fill: '#667' });
    R(-1.8, 22.2, 24.1, 30.1, { stroke: '#b44', sw: 1.2, dash: '12 5' });
    dimX(-1.8, 22.2, 23.55, 'พื้น 24.00 ม.', 0); dimX(4.2, 17.2, 31.9 - 0.0, 'สตูดิโอ 13.00', 0); dimX(17.2, 22.2, 31.9, 'ลาน 5.00', 0); dimY(24.1, 30.1, -2.6, '6.00', -6);
  }

  // titles
  const title = level === 'G' ? 'แปลนอาคารด้านหลัง ชั้น 1 (GF ±0.00)' : level === 'U' ? 'แปลนอาคารด้านหลัง ชั้น 2 (+3.50) — ระเบียงชมแบด + ศูนย์เวลเนส 7 โซน' : 'แปลนอาคารด้านหลัง ชั้น 3 (+7.00) — ฟิตเนสในร่ม + ลานฟิตเนสกลางแจ้ง + Sky Trail';
  const notes = level === 'G' ? [
    '• คลินิกกายภาพ 41.0 ตร.ม. (x 10.20–18.40, y 25.10–30.10) ผนังอิฐมวลเบา 100 มม. NC ≤ 30 · ประตู 2.00 ม. ที่ปลายห้องฟื้นฟูเปิดสู่ชานไม้และสระสำเร็จรูป 3×6 ม. (ธาราบำบัด)',
    '• ห้องเปลี่ยนชาย/หญิง 2 × 15.0 ตร.ม. มีประตูแห้งจากโถงคอร์ทและประตูเปียกสู่ชานสระ · ห้องน้ำอารยสถาปัตย์ 2.30×2.30 · ห้องปีนผา 19.0 ตร.ม. ระดับ ±0.00 บนพื้นเดิม ห้ามดรอปพื้น',
    '• บันไดหนีไฟมุมอาคาร + ลิฟต์ MRL 2.05×2.05 อยู่นอกแนวพื้น คสล. เดิม (x −3.90…−1.80) · เสาแถว A (y 25.10) และ B (y 28.10) ที่ x 0.20, 5.20, 10.20, 15.20, 20.20',
    '• กำแพงปีนผากลางแจ้ง 3.30×10.50 ม. + หลุมรับตก −0.60 (2.20×4.30) ย้ายขึ้นเหนือ 1.30 ม. เพื่อให้ชานพัก/บันไดจากชั้น 2 ไปทางเดิน +4.50 พอดี'
  ] : level === 'U' ? [
    '• ชั้น 2 = ศูนย์ Wellness ทั้งชั้น · ระเบียงชมแบดมินตัน กว้าง 1.80 ม. ยาว 24.00 ม. ต่อเนื่องจากสะพานปีกตะวันตก ไปสิ้นสุดที่ห้องเก็บผ้า ออกทางประตูกระจกด้านตะวันออกสู่ชานพัก +3.50 และบันได 6 ขั้นขึ้นทางเดิน +4.50',
    '• เสาแถว B (y 28.10) ฝังอยู่ในผนังกั้นห้องทรีตเมนต์ · เสาแถว A (y 25.10) อยู่ในระเบียง เว้นทางเดินเคลียร์ ≥ 1.80 ม.',
    '• ตู้ HBOT 2 ชุด และอ่าง Cold Plunge วางถ่ายน้ำหนักลงแนวคานเดิม (เสา A/B) · น้ำหนักบรรทุกจรออกแบบ ≤ 300 กก./ตร.ม. · ท่อสุขาภิบาลเดินในพื้นยก/แขวนใต้พื้นเท่านั้น',
    '• ทางหนีไฟ 2 ชุด: บันไดมุมอาคาร (x −3.9…−1.8) และบันไดใหญ่ Grid B ปีกตะวันตก · ระยะหนีไฟไกลสุด 31.80 ม. (≤ 40 ม.) · ห้องนวด/บำบัดมือ (x 17.05–20.20) เพิ่มจากสเปก 7 โซน · ชิลเลอร์/คอนเดนเซอร์ย้ายขึ้นหลังคา'
  ] : [
    '• สตูดิโอ 78.0 ตร.ม. สำหรับผู้เช่ารายเดียว (พิลาทิสรีฟอร์มเมอร์/ฟิตเนส/โยคะ) ห้ามวางอุปกรณ์ดร็อปเดดลิฟต์หนัก ใช้ดัมเบล เคเบิล และเสื่อ',
    '• ชั้น 3 = ฟิตเนสในร่ม (สตูดิโอ 78.0 ตร.ม.) + กลางแจ้ง: ลานฟิตเนส 30.0 ตร.ม. มี Rig/ห่วง/TRX เลนสเลด กล่อง Plyo ชั้นวางเคทเทิลเบลล์ พร้อมซุ้มระแนง · ประตูกระจกตะวันตกของลานเปิดเชื่อมสตูดิโอ · Top-out Ledge ของกำแพงปีนผา (ประตูเหล็ก 1.30 ม. ที่ +7.00)',
    '• Sky Trail: สะพานไม้ 1.30 ม. ที่มุมตะวันออกเฉียงเหนือของลาน (+7.00) → 4 ช่วง zigzag 10 ม. ลาด 17.5% → Trailhead ที่ลานสระ (±0.00) · ใช้ฝึกวิ่ง/เดินเขา · ลิฟต์ MRL เป็นทางเลือกไร้ขั้น',
    '• ส่วนบริการชั้น 3 (WC อารยสถาปัตย์ 2.30×2.30 และห้องเก็บของผู้เช่า 10.35 ตร.ม.) ตามสเปก แต่ยังไม่ได้ใส่ในโมเดล 3 มิติ — เป็นผังเสนอแนะเท่านั้น',
    '• ใช้บันไดหนีไฟมุมอาคารและลิฟต์ MRL ตัวเดียวกับชั้นอื่น · ชั้น 2+3 รวม 316 ตร.ม. > 300 ตร.ม. ต้องมีบันไดหนีไฟกว้าง ≥ 1.20 ม. 2 ชุด'
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#fff"/>
<text x="${MX}" y="56" font-size="32" font-weight="700" fill="#111">${title}</text>
<text x="${MX}" y="86" font-size="16" fill="#555">MY PLACE REV E · ทิศเหนืออยู่ด้านบน · หน่วย เมตร · ผังตามโมเดล 3 มิติ (ไม่ใช่แบบก่อสร้าง)</text>
<g transform="translate(${W - 260},30)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111"/><text x="68" y="46" font-size="14" fill="#111">N</text></g>
<g transform="translate(${W - 260},120)"><line x1="0" y1="0" x2="${5 * S}" y2="0" stroke="#111" stroke-width="3"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#111" stroke-width="2"/><line x1="${5 * S}" y1="-6" x2="${5 * S}" y2="6" stroke="#111" stroke-width="2"/><text x="${(5 * S) / 2}" y="22" font-size="13" text-anchor="middle" fill="#111">5 ม.</text></g>
${o.join('\n')}
<g transform="translate(${MX},${MY + HP + 40})" font-size="14" fill="#222">${notes.map((n, i) => `<text y="${i * 26}">${n}</text>`).join('')}</g>
</svg>`;
  return { svg, W, H, MX, MY, S, X, Y };
}

fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [lv, name] of [['G', 'rear_GF'], ['U', 'rear_L2'], ['T', 'rear_L3']]) {
  const { svg, W, H, X, Y } = sheet(lv);
  fs.writeFileSync(path.join(here, 'plans', `${name}.svg`), svg);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: path.join(here, 'plans', `${name}.png`) });
  if (lv === 'G') { // zoom on the clinic + changing rooms
    const p2 = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
    await p2.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await p2.screenshot({ path: path.join(here, 'plans', 'rear_GF_clinic.png'), clip: { x: X(-2.2), y: Y(31.0), width: (23.0 - -2.2) * 60 * 0.62 + 600, height: (31.0 - 21.4) * 60 * 0.6 + 120 } });
    await p2.close();
  }
  await page.close();
  console.log('plan', name);
}
await browser.close();
