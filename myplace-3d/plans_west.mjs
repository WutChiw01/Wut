// 2D plans of the west wing + coconut garden (REV D.9): ground floor and upper floor (+3.50).
// Plan is rotated 90° clockwise (north = right, west boundary = top) so the 39 m strip fits a landscape sheet.
// usage: node plans_west.mjs   → plans/west_wing_ground.{svg,png}, plans/west_wing_upper.{svg,png}
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const S = 72, MX = 150, YMIN = -9.6, XMIN = -8.6; // px per metre, left margin, plan origin
const W = Math.round((30.9 + 9.6) * S + 2 * MX), H = 1180;
const X = (y) => MX + (y - YMIN) * S; // spec y → screen x
const Y = (x) => 330 + (x - XMIN) * S - 160; // spec x → screen y (west on top)
const f = (n) => n.toFixed(1);

const COL = { wall: '#3a3a3a', wall2: '#6b6b6b', glass: '#7fb5d6', teak: '#b8793b', green: '#4c8a3a', greenL: '#bcd8a8', earth: '#d9c7a3', furn: '#555', dim: '#0b57d0', hatch: '#999', stair: '#222', red: '#c0392b' };

function plan(level) {
  const o = [];
  const R = (x0, x1, y0, y1, a = {}) => o.push(`<rect x="${f(X(y0))}" y="${f(Y(x0))}" width="${f((y1 - y0) * S)}" height="${f((x1 - x0) * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? 'none'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''} ${a.op ? `opacity="${a.op}"` : ''}/>`);
  const L = (x0, y0, x1, y1, a = {}) => o.push(`<line x1="${f(X(y0))}" y1="${f(Y(x0))}" x2="${f(X(y1))}" y2="${f(Y(x1))}" stroke="${a.stroke ?? COL.furn}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
  const C = (x, y, r, a = {}) => o.push(`<circle cx="${f(X(y))}" cy="${f(Y(x))}" r="${f(r * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? COL.furn}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''} ${a.op ? `opacity="${a.op}"` : ''}/>`);
  const T = (x, y, s, size = 13, a = {}) => o.push(`<text paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" x="${f(X(y))}" y="${f(Y(x))}" font-size="${size}" fill=""${a.fill ?? '#111'}" text-anchor="${a.anchor ?? 'middle'}" ${a.bold ? 'font-weight="700"' : ''} ${a.rot ? `transform="rotate(${a.rot} ${f(X(y))} ${f(Y(x))})"` : ''}>${s}</text>`);
  const P = (d, a = {}) => o.push(`<path d="${d}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? COL.furn}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
  // door leaf + swing arc: hinge at (hx,hy), leaf length len, pointing angle a0 → a1 (spec angles, x/y axes)
  const door = (hx, hy, len, a0, a1, a = {}) => {
    const p0 = [hx + len * Math.cos(a0), hy + len * Math.sin(a0)], p1 = [hx + len * Math.cos(a1), hy + len * Math.sin(a1)];
    L(hx, hy, p0[0], p0[1], { stroke: '#222', sw: 2 });
    const sweep = a1 > a0 ? 0 : 1; // screen is mirrored (x→down, y→right)
    P(`M${f(X(p0[1]))},${f(Y(p0[0]))} A${f(len * S)},${f(len * S)} 0 0 ${sweep} ${f(X(p1[1]))},${f(Y(p1[0]))}`, { stroke: '#888', dash: '3 3' });
    if (a.leaf2) L(hx, hy, p1[0], p1[1], { stroke: '#888', sw: 1 });
  };
  const wall = (x0, x1, y0, y1, a = {}) => R(x0, x1, y0, y1, { fill: a.fill ?? COL.wall, stroke: COL.wall, sw: 0.5 });
  const steps = (x0, x1, ya, yb, n) => { for (let i = 0; i <= n; i++) { const y = ya + ((yb - ya) * i) / n; L(x0, y, x1, y, { stroke: COL.stair, sw: 1 }); } R(x0, x1, Math.min(ya, yb), Math.max(ya, yb), { stroke: COL.stair, sw: 1.6 }); };
  const arrow = (x, y0, y1, label) => { L(x, y0, x, y1, { stroke: COL.red, sw: 2 }); const d = Math.sign(y1 - y0); const s = 0.14; P(`M${f(X(y1))},${f(Y(x))} L${f(X(y1 - d * s * 1.6))},${f(Y(x - s))} L${f(X(y1 - d * s * 1.6))},${f(Y(x + s))} Z`, { fill: COL.red, stroke: COL.red }); if (label) T(x - 0.27, (y0 + y1) / 2, label, 12, { fill: COL.red, bold: true }); };
  const dimY = (y0, y1, xline, label, up = false) => { const yy = Y(xline); o.push(`<g stroke="${COL.dim}" stroke-width="1" fill="${COL.dim}"><line x1="${f(X(y0))}" y1="${f(yy)}" x2="${f(X(y1))}" y2="${f(yy)}"/><line x1="${f(X(y0))}" y1="${f(yy - 6)}" x2="${f(X(y0))}" y2="${f(yy + 6)}"/><line x1="${f(X(y1))}" y1="${f(yy - 6)}" x2="${f(X(y1))}" y2="${f(yy + 6)}"/><text x="${f((X(y0) + X(y1)) / 2)}" y="${f(yy - 5)}" font-size="12" text-anchor="middle" stroke="none">${label}</text></g>`); };
  const palm = (x, y, id, crownR, trunk = 0.22) => {
    C(x, y, crownR, { stroke: COL.green, dash: '6 5', sw: 1.4 });
    for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; L(x, y, x + Math.cos(a) * crownR * 0.97, y + Math.sin(a) * crownR * 0.97, { stroke: COL.green, sw: 0.8, dash: '2 4' }); }
    C(x, y, trunk, { fill: '#8a6d4b', stroke: '#4a3920', sw: 1.5 });
    for (let k = 0; k < 7; k++) { const a = k * 0.9; C(x + Math.cos(a) * 0.11, y + Math.sin(a) * 0.11, 0.045, { fill: '#6b8f3a', stroke: '#33481a', sw: 0.6 }); }
    T(x - 0.55, y, id, 13, { bold: true, fill: '#1b4d10' });
  };

  // ── site context ──────────────────────────────────────────────
  L(-4.4, -9.6, -4.4, 30.8, { stroke: '#555', sw: 1.4, dash: '14 4 2 4' }); T(-4.62, -8.4, 'แนวเขตที่ดินตะวันตก x = −4.40', 11, { fill: '#555', anchor: 'start' });
  const SH = -3.65; // stair block slid 3.65 m south (REV D.10)
  const G = (dy, fn) => { o.push(`<g transform="translate(${f(dy * S)},0)">`); fn(); o.push('</g>'); };

  // ── solid boundary wall 0.50 m inside the plot line + louvre door at the wind lane ──
  const bw = (ya, yb) => wall(-3.9, -3.7, ya, yb);
  bw(-9.0, 6.35); bw(8.35, 25.3);
  // louvre door in the plot-line wall (ground): fins drawn open
  for (let i = 0; i < 10; i++) { const y = 6.45 + i * 0.2; L(-3.82, y - 0.09, -3.70, y + 0.09, { stroke: '#555', sw: 2 }); }
  R(-3.9, -3.7, 6.35, 8.35, { stroke: COL.dim, sw: 1, dash: '3 2' });

  // ── hall wall: kept only where there are rooms; open at the wind lane and along the garden ──
  const hw = (ya, yb) => wall(-1.05, -0.8, ya, yb);
  hw(-9.0, 1.6); hw(3.3, 6.35); hw(8.35, 10.0); hw(22.0, 24.1);
  // D3 opening y 1.6…3.3 (stair lobby)
  // front façade y = −9 with storefront opening
  wall(-3.9, -3.6, -9.0, -8.8); wall(-1.25, -0.8, -9.0, -8.8);
  R(-3.6, -1.25, -9.0, -8.8, { fill: '#e8f2f8', stroke: COL.glass, sw: 1 }); L(-3.6, -8.9, -1.25, -8.9, { stroke: COL.glass, sw: 1.5 });
  for (let x = -3.85; x <= -0.8; x += 0.3) L(x, -9.4, x, -9.15, { stroke: COL.teak, sw: 2 });
  // lane walls (south wall = stair-block north wall 6.15…6.35, north wall 8.35…8.55) and store block
  wall(-3.9, -0.8, 6.15, 6.35); wall(-3.9, -0.8, 8.35, 8.55); wall(-3.7, -1.05, 9.8, 10.0);
  // core walls with the 0.5 m notch for P1
  wall(-3.9, -3.7, 25.3, 30.1); wall(-3.9, -3.2, 22.0, 23.2); wall(-3.9, -3.2, 24.4, 25.3); wall(-3.4, -3.2, 23.2, 24.4); wall(-3.4, -1.8, 23.2, 23.4); wall(-3.4, -1.8, 24.2, 24.4);
  wall(-3.9, -1.8, 22.0, 22.2); wall(-1.9, -1.8, 22.0, 24.9); wall(-3.9, -1.8, 30.0, 30.1); wall(-3.9, -1.8, 28.05, 28.15);
  wall(-3.7, -1.8, 24.9, 25.0, { fill: COL.wall2 });
  // garden: relief bricks (V1–V4) on the inside of the solid wall
  R(-3.7, -3.55, 10.0, 22.0, { fill: '#f1d9c3', stroke: '#c0562b', sw: 0.8 }); for (let y = 10.0; y < 22.0; y += 0.38) L(-3.7, y, -3.55, y, { stroke: '#c0562b', sw: 0.8 });
  R(-3.7, -3.55, 15.01, 15.91, { fill: 'white', stroke: 'none' });

  if (level === 'G') {
    // ── ZONE 1 · G1 creative studio (y −8.8 … 1.15, shortened) ──
    R(-3.7, -1.05, -8.8, 1.15, { fill: '#faf7f0' });
    R(-3.7, -1.05, -1.25, 0.25, { fill: 'white', stroke: '#ccc' }); R(-3.7, -1.05, 0.25, 1.15, { fill: '#f0f0f0', stroke: '#bbb' }); L(-3.7, 0.25, -1.05, 0.25, { stroke: '#999', dash: '4 3' }); T(-2.4, 0.7, 'ไซโคลรามา R0.90', 11, { rot: -90 }); T(-2.4, -0.5, 'พื้นขาว', 11, { rot: -90 });
    wall(-3.7, -1.05, -7.3, -7.1, { fill: COL.wall2 });
    R(-2.9, -2.0, -7.32, -7.08, { fill: '#faf7f0' }); door(-2.9, -7.2, 0.9, 0, Math.PI / 2 * 0.95);
    door(-3.0, -8.9, 0.85, 0, Math.PI / 2 * 0.95); T(-2.6, -9.7, 'D1', 12, { bold: true });
    for (let y = -6.6; y < -1.5; y += 1.3) R(-3.7, -3.62, y, y + 1.1, { fill: '#39404a' });
    for (let y = -6.6; y < -2.6; y += 0.4) R(-1.13, -1.05, y, y + 0.25, { fill: COL.teak });
    L(-2.4, -6.9, -2.4, 0.9, { stroke: '#777', dash: '5 3' }); T(-2.28, -6.4, 'รางไฟเพดาน', 10, { fill: '#666' });
    for (const [x, y] of [[-3.15, -2.5], [-1.55, -1.9]]) { R(x - 0.35, x + 0.35, y - 0.35, y + 0.35, { fill: '#fff', stroke: COL.furn, sw: 1.2 }); L(x - 0.35, y - 0.35, x + 0.35, y + 0.35, { stroke: '#999' }); L(x - 0.35, y + 0.35, x + 0.35, y - 0.35, { stroke: '#999' }); }
    C(-1.4, -0.6, 0.5, { stroke: COL.furn }); C(-2.4, -3.2, 0.12, { fill: '#555' }); R(-1.6, -1.2, -2.9, -2.6, { stroke: COL.furn, fill: '#ddd' });
    R(-1.65, -1.05, -6.8, -5.4, { stroke: COL.furn, fill: '#e9d9c4' }); C(-2.0, -6.1, 0.2, { stroke: COL.furn });
    R(-3.6, -2.7, -5.6, -4.2, { fill: '#8fb3a1', stroke: COL.furn }); R(-3.35, -2.55, -5.75, -4.05, { stroke: '#a45', dash: '2 2' }); R(-2.5, -2.0, -5.1, -4.5, { stroke: COL.furn });
    for (let k = 0; k < 4; k++) R(-3.7, -3.3, -4.0 + k * 0.55, -4.0 + k * 0.55 + 0.45, { stroke: COL.furn, fill: '#e9d9c4' });
    R(-1.5, -1.1, -4.0, -3.3, { stroke: COL.furn, fill: '#ccc' });
    T(-4.75, -3.5, 'G1 สตูดิโอสร้างสรรค์  2.65 × 9.95 ม. · NC ≤ 30', 14, { bold: true });
    T(-2.4, -8.0, 'ห้องกันเสียง', 11); T(-3.0, -5.0, 'โซฟา', 10); T(-1.35, -6.1, 'แต่งหน้า', 10, { rot: -90 }); T(-3.5, -3.2, 'ชั้นวางพร็อพ', 10, { rot: -90 });
    // ── ZONE 2 · stair block (slid south) ──
    G(SH, () => {
      wall(-3.7, -3.5, 4.8, 5.2); wall(-2.7, -1.05, 4.8, 5.2); // party wall studio | stair (door to the lobby)
      R(-3.7, -1.05, 5.2, 9.8, { fill: '#fbfbfb' });
      steps(-3.7, -2.45, 5.95, 8.55, 10); arrow(-3.08, 6.2, 8.3, 'ขึ้น 10 ขั้น');
      R(-3.7, -1.05, 8.55, 9.8, { fill: '#e6e6e6', stroke: COL.stair, sw: 1.6 }); T(-2.4, 9.18, '+1.75', 10);
      steps(-2.3, -1.05, 8.55, 5.95, 10); L(-2.3, 5.95, -1.05, 8.55, { stroke: '#999', dash: '4 3' }); T(-1.7, 7.25, 'ช่วงที่ 2 → +3.50', 11, { rot: -90 });
      R(-2.45, -2.3, 5.95, 8.55, { fill: '#fff', stroke: '#999', dash: '2 2' });
      R(-2.3, -1.1, 6.95, 7.95, { fill: '#f4f4f4', stroke: COL.wall, sw: 1.2 }); R(-1.75, -1.45, 7.55, 7.85, { stroke: COL.furn }); C(-1.6, 7.6, 0.14, { stroke: COL.furn }); R(-2.2, -1.9, 7.7, 7.9, { stroke: COL.furn }); T(-1.7, 7.45, 'WC G2', 10, { rot: -90 });
      R(-3.7, -2.5, 8.6, 9.8, { stroke: '#999', dash: '3 3' });
      R(-3.55, -2.7, 5.35, 5.75, { stroke: COL.furn, fill: '#e9d9c4' }); T(-3.1, 5.5, 'ม้านั่ง', 9);
      door(-3.5, 5.0, 0.8, 0, Math.PI / 2 * 0.9);
      door(-1.3, 5.25, 0.85, -Math.PI / 2 * 0.02, -Math.PI * 0.45); door(-1.3, 6.95, 0.85, Math.PI / 2 * 0.02, Math.PI * 0.45);
      T(-0.55, 6.1, 'D3 1.70 ม.', 11, { bold: true });
    });
    T(-4.75, 3.2, 'G2 บันไดใหญ่ตัวยู + WC', 13, { bold: true });
    // ── WIND LANE ──
    R(-3.7, -0.8, 6.35, 8.35, { fill: '#e6f1fb', stroke: COL.dim, sw: 1.2, dash: '5 3' });
    for (let x = -3.6; x < -0.8; x += 0.4) L(x, 6.4, x, 8.3, { stroke: '#9aa', sw: 0.6 });
    for (let i = 0; i < 10; i++) { const y = 6.45 + i * 0.2; L(-0.98, y - 0.09, -0.86, y + 0.09, { stroke: '#555', sw: 2 }); }
    for (const y of [6.8, 7.35, 7.9]) { L(-6.6, y, -0.95, y, { stroke: '#1d7fe0', sw: 2.2 }); const ex = X(y), ey = Y(-0.75); P(`M${f(ex)},${f(ey)} L${f(ex - 6)},${f(ey - 14)} L${f(ex + 6)},${f(ey - 14)} Z`, { fill: '#1d7fe0', stroke: '#1d7fe0' }); }
    T(-4.95, 7.35, 'ลม', 12, { fill: '#1d7fe0', bold: true });
    T(-2.3, 7.35, 'แนวลู่รับลม 2.00 ม.', 13, { bold: true, fill: '#0b57d0' }); T(-2.05, 7.35, 'บานเกล็ดเปิด-ปิดได้ 2 ชั้น', 10, { fill: '#0b57d0' });
    R(-4.4, -3.9, 6.35, 8.35, { stroke: '#1d7fe0', sw: 1, dash: '2 2' });
    // W0 tower footprint (full), C0 / E0 direction
    C(0.2, 7.35, 0.6, { fill: '#e9b88f', stroke: '#8a3a12', sw: 1.6 }); C(0.2, 7.35, 0.3, { fill: '#b83d12', stroke: '#661a09' }); T(0.95, 7.35, 'W0', 12, { bold: true, fill: '#8a3a12' });
    L(0.2, 7.9, 0.2, 9.5, { stroke: '#8a3a12', dash: '6 4' }); T(0.55, 9.6, '→ C0 → E0', 11, { fill: '#8a3a12', anchor: 'start' });
    // store block
    R(-3.7, -1.05, 8.55, 9.8, { fill: '#f1f1ee' }); R(-3.65, -3.3, 8.7, 9.7, { stroke: COL.furn, fill: '#e9d9c4' }); R(-1.7, -1.25, 8.7, 9.7, { stroke: COL.furn, fill: '#444' }); T(-2.5, 9.2, 'ห้องเก็บของ', 10);
    // ── ZONE 3 · garden (open to the hall) ──
    R(-3.55, -0.8, 10.0, 22.0, { fill: '#f6f2ea' });
    for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) {
      const amax = Math.acos(Math.max(-1, Math.min(1, (-3.7 - px) / 1.5)));
      const pts = []; for (let i = 0; i <= 24; i++) { const a = -amax + (2 * amax * i) / 24; pts.push([px + 1.5 * Math.cos(a), py + 1.5 * Math.sin(a)]); }
      P('M' + [[px, py], ...pts].map(([x, y]) => `${f(X(y))},${f(Y(x))}`).join(' L') + ' Z', { fill: COL.earth, stroke: '#a8916a', sw: 1 });
      for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2, a2 = ((k + 0.85) / 14) * Math.PI * 2; if (px + Math.cos(a) * 1.35 < -3.5) continue; P(`M${f(X(py + Math.sin(a) * 1.35))},${f(Y(px + Math.cos(a) * 1.35))} L${f(X(py + Math.sin(a2) * 1.35))},${f(Y(px + Math.cos(a2) * 1.35))}`, { stroke: COL.teak, sw: 6 }); }
    }
    for (let y = 10.5; y < 21.8; y += 0.85) R(-2.0, -1.2, y, y + 0.7, { fill: '#cfcac0', stroke: '#8a8a82', sw: 0.8 });
    R(-1.45, -1.05, 12.6, 16.8, { fill: '#e9d9c4', stroke: COL.furn }); for (let y = 13.0; y < 16.7; y += 0.9) C(-1.85, y, 0.18, { stroke: COL.furn, fill: '#d7b98a' });
    T(-0.45, 14.7, 'บาร์นั่งทำงาน + สตูล', 11, { rot: -90 });
    R(-3.0, -2.2, 17.0, 17.9, { fill: '#e9d9c4', stroke: COL.furn }); for (const x of [-3.3, -2.0]) R(x - 0.2, x + 0.2, 17.25, 17.65, { stroke: COL.furn });
    C(-2.9, 20.9, 0.4, { fill: '#9fd3e0', stroke: COL.furn });
    L(-0.8, 10.0, -0.8, 22.0, { stroke: '#1d7fe0', sw: 2, dash: '10 5' }); T(-0.45, 19.5, 'เปิดโล่งสู่โถงแบด (ไม่มีผนัง)', 11, { fill: '#1d7fe0', bold: true });
    T(-4.75, 16.0, 'G3 สวน Co-Working มะพร้าว', 14, { bold: true }); T(-4.58, 16.0, 'พื้นชั้น 2 คสล. คลุมทั้งสวน · เจาะช่องรอบลำต้น', 11);
    palm(-3.67, 15.46, 'P2', 3.8); palm(-3.24, 12.08, 'P3', 3.5);
    // pods G4
    R(-3.55, -1.05, 18.0, 22.0, { fill: 'rgba(190,215,230,0.35)', stroke: '#6fa2c0', sw: 1.6 }); R(-3.35, -2.1, 19.0, 21.0, { fill: '#e9d9c4', stroke: COL.furn }); T(-2.4, 20.0, 'G4 ห้องโฟกัส', 12, { bold: true }); T(-2.15, 20.0, '2.65 × 4.00', 10);
    door(-1.05, 18.0, 0.8, Math.PI / 2, Math.PI / 2 - 0.9);
    // ── ZONE 4 · core ──
    palm(-4.0, 23.8, 'P1', 4.2);
    R(-3.7, -1.9, 22.2, 24.9, { fill: '#f2f5f7' });
    for (let k = 0; k < 4; k++) R(-3.35 + k * 0.42, -2.97 + k * 0.42, 22.25, 22.7, { fill: '#66707b', stroke: COL.furn }); R(-3.65, -3.0, 24.3, 24.85, { stroke: COL.furn, fill: '#ddd' }); C(-2.4, 24.5, 0.3, { stroke: COL.furn, fill: '#ccd' });
    T(-4.75, 25.5, 'G5 ห้อง MDB + ปั๊ม ≈ 5 ตร.ม.', 12, { bold: true });
    R(-3.7, -1.8, 25.0, 30.1, { fill: '#fbfbfb' });
    steps(-3.7, -2.78, 28.0, 26.0, 10); arrow(-3.24, 27.8, 26.2, 'ขึ้น'); R(-3.7, -1.8, 24.9, 26.0, { fill: '#e6e6e6', stroke: COL.stair, sw: 1.6 }); steps(-2.72, -1.8, 26.0, 28.0, 10);
    R(-3.85, -1.8, 28.05, 30.1, { fill: '#fff', stroke: COL.wall, sw: 3 }); L(-3.85, 28.05, -1.8, 30.1, { stroke: COL.wall }); L(-3.85, 30.1, -1.8, 28.05, { stroke: COL.wall }); T(-2.8, 29.1, 'MRL 2.05×2.05', 11, { bold: true });
    T(-2.75, 26.0, 'บันไดหนีไฟ', 11, { bold: true, rot: -90 });
  } else {
    // ── UPPER LEVEL (+3.50): RC canopy slab out to the plot line ──
    // slab outline + hatch strip beyond the wall (canopy 0.50 m)
    R(-4.4, -3.9, -9.0, 22.0, { fill: '#ddd', stroke: '#777', sw: 1.2 }); R(-4.4, -3.9, 24.5, 30.1, { fill: '#ddd', stroke: '#777', sw: 1.2 });
    for (let y = -9.0; y < 22.0; y += 0.6) L(-4.4, y, -3.9, y + 0.5, { stroke: '#999', sw: 0.6 }); for (let y = 24.5; y < 30.1; y += 0.6) L(-4.4, y, -3.9, y + 0.5, { stroke: '#999', sw: 0.6 });
    T(-4.65, 4.5, 'พื้นกันสาด คสล. ยื่นถึงเขตที่ดิน x = −4.40 (ตลอดแนว)', 11, { fill: '#555' });
    R(-3.7, -1.05, -8.8, 1.15, { fill: '#fbf6ee' });
    R(-3.55, -1.4, -7.6, -4.4, { fill: '#c9a07f', op: 0.5 }); R(-3.55, -2.45, -7.4, -5.3, { fill: '#c9a37a', stroke: COL.furn }); R(-2.4, -1.9, -6.6, -5.8, { stroke: COL.furn });
    for (const y of [-6.2, -5.4]) C(-1.7, y, 0.2, { stroke: COL.furn, fill: '#7aa08c' });
    R(-3.6, -1.1, -2.2, -1.6, { fill: '#b8793b', stroke: COL.furn }); for (const x of [-3.2, -2.6, -2.0, -1.4]) C(x, -1.2, 0.17, { stroke: COL.furn, fill: '#7aa08c' });
    R(-3.72, -3.64, -6.8, -4.6, { fill: '#22305a' });
    R(-3.4, -1.4, -0.6, 0.2, { fill: '#e9d9c4', stroke: COL.furn }); for (const x of [-3.1, -2.4, -1.7]) { C(x, -0.95, 0.2, { stroke: COL.furn }); C(x, 0.55, 0.2, { stroke: COL.furn }); }
    R(-3.6, -1.25, -9.0, -8.8, { fill: '#e8f2f8', stroke: COL.glass });
    T(-4.75, -3.5, 'L1 ห้องสวีท / VIP Lounge  +3.50  (2.65 × 9.95)', 14, { bold: true });
    T(-3.0, -5.4, 'ห้องรับแขก', 10); T(-3.0, -1.2, 'เคาน์เตอร์บาร์', 10); T(-2.4, -0.2, 'โต๊ะทำงานร่วม', 10);
    wall(-3.7, -2.9, 1.15, 1.55); wall(-1.9, -1.05, 1.15, 1.55); // party wall with door to the suite
    G(SH, () => {
      R(-3.7, -1.05, 5.2, 5.95, { fill: '#e9e9e9', stroke: COL.stair, sw: 1.6 }); T(-2.4, 5.58, 'หัวบันได +3.50', 10);
      L(-3.7, 5.95, -1.05, 5.95, { stroke: '#4aa3d6', sw: 2.5 });
      R(-3.7, -2.45, 5.95, 9.8, { fill: 'white', stroke: '#6a6', sw: 1.2, dash: '5 3' }); L(-3.7, 5.95, -2.45, 9.8, { stroke: '#bbb', dash: '3 3' }); L(-3.7, 9.8, -2.45, 5.95, { stroke: '#bbb', dash: '3 3' }); T(-3.08, 7.9, 'ช่องโล่งเหนือช่วงที่ 1', 11, { rot: -90 });
      steps(-2.3, -1.05, 5.95, 8.55, 10); arrow(-1.68, 8.3, 6.2, 'ลง ↓ 10 ขั้น'); R(-2.3, -1.05, 8.55, 9.8, { fill: '#e0e0e0', stroke: COL.stair, sw: 1.6 }); T(-1.7, 9.18, '+1.75', 10);
      R(-3.7, -1.05, 6.0, 9.0, { stroke: '#e8a', sw: 1.2, dash: '8 3' }); T(-3.35, 6.4, 'Skylight', 10, { fill: '#c36', anchor: 'start' });
    });
    T(-4.75, 3.2, 'โถงบันได (ชานพักหัวบันได +3.50 ติดห้องสวีท)', 13, { bold: true });
    // wind lane at upper level: slab above it (an open deck / canopy), hall edge guard
    R(-3.9, -0.8, 6.35, 8.35, { fill: '#e6eef4', stroke: '#6b8fa8', sw: 1.2, dash: '5 3' }); T(-2.4, 7.35, 'ดาดฟ้าเหนือแนวลู่รับลม (พื้น คสล. +3.50)', 11, { fill: '#0b57d0' });
    L(-0.86, 6.35, -0.86, 8.35, { stroke: '#4aa3d6', sw: 3 });
    R(-3.7, -1.05, 8.55, 9.8, { fill: '#f1f1ee', stroke: '#999', dash: '3 3' }); T(-2.4, 9.2, 'ห้องเก็บของ (ชั้นล่าง)', 9);
    // ── garden canopy slab with palm openings ──
    R(-3.9, -0.8, 10.0, 22.0, { fill: '#eef0f1', stroke: COL.stair, sw: 1.6 });
    for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) { C(px, py, 0.85, { fill: '#ffffff', stroke: COL.stair, sw: 1.6 }); C(px, py, 0.95, { stroke: '#4aa3d6', sw: 2.4 }); }
    L(-0.86, 10.0, -0.86, 22.0, { stroke: '#4aa3d6', sw: 3 });
    for (const y of [10.4, 14.4, 18.4, 21.6]) R(-1.7, -1.2, y - 0.25, y + 0.25, { fill: '#e9d9c4', stroke: COL.furn });
    T(-4.75, 16.0, 'พื้นชั้น 2 (+3.50): ดาดฟ้า/สะพานกว้าง 3.10 ม. คลุมทั้งสวน · ช่องเปิดรอบมะพร้าวรัศมี 0.85 + ราวกันตก', 13, { bold: true });
    palm(-3.67, 15.46, 'P2', 3.8); palm(-3.24, 12.08, 'P3', 3.5);
    R(-3.7, -2.65, 18.0, 22.0, { fill: 'rgba(190,215,230,0.45)', stroke: '#6fa2c0', sw: 1.6 }); R(-3.6, -2.9, 19.0, 21.0, { fill: '#e9d9c4', stroke: COL.furn }); T(-3.2, 20.0, 'L3 ห้องโฟกัส', 11, { bold: true });
    palm(-4.0, 23.8, 'P1', 4.2);
    R(-3.7, -1.9, 22.2, 24.9, { fill: '#f2f5f7' }); for (let k = 0; k < 5; k++) R(-3.65 + k * 0.33, -3.37 + k * 0.33, 22.25, 22.7, { fill: '#6b8fd0', stroke: COL.furn }); R(-3.0, -2.2, 23.3, 24.0, { fill: '#e9d9c4', stroke: COL.furn }); for (const y of [23.1, 24.2]) R(-2.9, -2.3, y - 0.2, y + 0.2, { stroke: COL.furn });
    R(-3.65, -3.4, 24.45, 24.85, { stroke: COL.furn, fill: '#fff' });
    T(-4.75, 25.5, 'L4 ห้องพักพนักงาน + ผ้า', 12, { bold: true });
    R(-3.7, -1.8, 25.0, 30.1, { fill: '#fbfbfb' }); steps(-3.7, -2.78, 28.0, 26.0, 10); arrow(-3.24, 27.8, 26.2, 'ขึ้น'); R(-3.7, -1.8, 24.9, 26.0, { fill: '#e6e6e6', stroke: COL.stair, sw: 1.6 }); steps(-2.72, -1.8, 26.0, 28.0, 10);
    R(-3.85, -1.8, 28.05, 30.1, { fill: '#fff', stroke: COL.wall, sw: 3 }); L(-3.85, 28.05, -1.8, 30.1, { stroke: COL.wall }); L(-3.85, 30.1, -1.8, 28.05, { stroke: COL.wall }); T(-2.8, 29.1, 'MRL', 11, { bold: true });
  }

  // zone bands + dimension strings (below the wing, on the hall side)
  const zy = [[-9.0, 1.55, 'ZONE 1 · สตูดิโอ/สวีท (10.55)'], [1.55, 6.15, 'บันได (4.60)'], [6.35, 8.35, 'ลู่ลม 2.00'], [8.55, 10.0, 'เก็บของ'], [10.0, 22.0, 'ZONE 3 · สวนมะพร้าว (12.00)'], [22.0, 30.1, 'ZONE 4 · แกนเหนือ (8.10)']];
  for (const [a, b, t] of zy) { dimY(a, b, 0.55, t); L(-4.2, a, 0.9, a, { stroke: '#bbb', sw: 0.6, dash: '2 6' }); }
  L(-4.2, 30.1, 0.9, 30.1, { stroke: '#bbb', sw: 0.6, dash: '2 6' });
  dimY(-9.0, 30.1, 1.25, 'ยาวรวม 39.10 ม.   (y = −9.00 … +30.10)');
  o.push(`<g stroke="${COL.dim}" fill="${COL.dim}"><line x1="${f(X(-9.0) - 40)}" y1="${f(Y(-3.9))}" x2="${f(X(-9.0) - 40)}" y2="${f(Y(-0.8))}"/><line x1="${f(X(-9.0) - 46)}" y1="${f(Y(-3.9))}" x2="${f(X(-9.0) - 34)}" y2="${f(Y(-3.9))}"/><line x1="${f(X(-9.0) - 46)}" y1="${f(Y(-0.8))}" x2="${f(X(-9.0) - 34)}" y2="${f(Y(-0.8))}"/><text x="${f(X(-9.0) - 50)}" y="${f(Y(-2.35))}" font-size="12" text-anchor="end" stroke="none">3.10 ม.</text></g>`);
  o.push(`<g stroke="#b00" fill="#b00"><line x1="${f(X(-9.0) - 82)}" y1="${f(Y(-4.4))}" x2="${f(X(-9.0) - 82)}" y2="${f(Y(-3.9))}"/><line x1="${f(X(-9.0) - 88)}" y1="${f(Y(-4.4))}" x2="${f(X(-9.0) - 76)}" y2="${f(Y(-4.4))}"/><line x1="${f(X(-9.0) - 88)}" y1="${f(Y(-3.9))}" x2="${f(X(-9.0) - 76)}" y2="${f(Y(-3.9))}"/><text x="${f(X(-9.0) - 92)}" y="${f(Y(-4.15) + 4)}" font-size="11" text-anchor="end" stroke="none">0.50 ม. ผนังทึบ</text></g>`);
  T(-0.1, 15.0, level === 'G' ? 'โถงแบดมินตัน — ไม่มีผนังกั้นช่วงสวน/ลู่ลม' : 'โถงแบดมินตัน', 11, { fill: '#777' });
  return o.join('\n');
}

function sheet(level) {
  const title = level === 'G' ? 'แปลนชั้นล่าง ±0.00 — ปีกตะวันตก + แนวลู่รับลม + สวนมะพร้าว' : 'แปลนชั้นบน +3.50 — พื้นกันสาด คสล. ถึงเขตที่ดิน + สวนมะพร้าว';
  const sub = 'MY PLACE REV D.10 · ผังหมุน 90° (ทิศเหนืออยู่ด้านขวา ทิศตะวันตก/เขตที่ดินอยู่ด้านบน) · หน่วย เมตร';
  const legend = [['#3a3a3a', 'ผนังทึบ คสล./อิฐ'], ['#f1d9c3', 'อิฐนูน (relief) ผนังทึบ'], ['#4c8a3a', 'ทรงพุ่มมะพร้าว (เส้นประ)'], ['#d9c7a3', 'ดินรอบโคน r 1.50'], ['#b8793b', 'ไม้สัก/ม้านั่ง'], ['#1d7fe0', 'ทิศลม / ลู่ลม']];
  const sc = 5 * S; // 5 m scale bar
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="${MX}" y="62" font-size="34" font-weight="700" fill="#111">${title}</text>
<text x="${MX}" y="92" font-size="16" fill="#555">${sub}</text>
<g transform="translate(${W - 330},40)"><circle cx="30" cy="40" r="26" fill="none" stroke="#111" stroke-width="2"/><path d="M30,12 L22,48 L30,40 L38,48 Z" fill="#111" transform="rotate(90 30 40)"/><text x="68" y="46" font-size="14" fill="#111">N (ทิศเหนือ →)</text></g>
<g transform="translate(${W - 330},110)"><line x1="0" y1="0" x2="${sc}" y2="0" stroke="#111" stroke-width="3"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#111" stroke-width="2"/><line x1="${sc}" y1="-6" x2="${sc}" y2="6" stroke="#111" stroke-width="2"/><text x="${sc / 2}" y="24" font-size="13" text-anchor="middle" fill="#111">5 ม.</text></g>
<g transform="translate(${MX},120)">${legend.map(([c, t], i) => `<g transform="translate(${i * 215},0)"><rect width="22" height="14" fill="${c}" stroke="#444"/><text x="30" y="12" font-size="13" fill="#222">${t}</text></g>`).join('')}</g>
${plan(level)}
<g transform="translate(${MX},${H - 150})" font-size="14" fill="#222">
${level === 'G'
  ? `<text y="0">• ผนังทึบแนวเขตที่ดิน: ห่างเขต 0.50 ม. (x = −3.90) ไม่มีช่องเปิด ยกเว้นบานเกล็ดเปิด-ปิดที่แนวลู่ลม · ผนังฝั่งโถงแบด (x = −0.80) ถูกเอาออกหมดช่วงลู่ลม (y 6.35–8.35) และช่วงสวน (y 10–22)</text><text y="24">• แนวลู่รับลม 2.00 ม. อยู่บนแกน W0–C0–E0 (y = 7.35): บานเกล็ด 2 ชุด (ผนังเขตที่ดิน + ขอบโถง) เปิดให้ลมวิ่งเข้าปะทะเสาดินเผา W0 (เปลี่ยนเป็นทรงเต็ม 360°) แล้วต่อไป C0 / E0 และปิดได้ตอนแข่ง</text><text y="48">• บันไดใหญ่ (20 ขั้น 175/260 มม.) ย้ายลงใต้ 3.65 ม. มาที่ y 1.55–6.15 เพื่อเว้นลู่ลม · สตูดิโอสั้นลงเหลือ 9.95 ม. · ห้องเก็บของใหม่ y 8.55–9.80 ทางเหนือของลู่ลม</text><text y="72">• สวน G3: P2 (−3.67, 15.46) / P3 (−3.24, 12.08) ดินรอบโคนถูกตัดที่แนวผนัง · P1 (−4.00, 23.80) อยู่ในช่องเว้านอกผนัง · เปิดโล่งสู่โถงแบด</text>`
  : `<text y="0">• พื้นชั้น 2 (+3.50) เป็นพื้นกันสาด คสล. ต่อเนื่องตลอดแนว ยื่นถึงเขตที่ดิน x = −4.40 (ยื่นพ้นผนัง 0.50 ม. มีคิ้วกันน้ำ) · ช่วงสวนเจาะช่องกลมรัศมี 0.85 ม. รอบต้นมะพร้าว P2/P3 + ราวกันตกกระจก · ขอบฝั่งโถงมีราวกระจก 1.10 ม.</text><text y="24">• ดาดฟ้าเหนือแนวลู่ลม และสวน ต่อเนื่องเป็นพื้นระดับ +3.50 กว้าง 3.10 ม. แต่ยังไม่มีทางเชื่อมจากหัวบันไดใหญ่ (ถูกบันไดช่วงที่ 1 ขวางใต้พื้น) — รอตัดสินใจ</text><text y="48">• L1 สวีท 2.65×9.95 ม. เข้าจากหัวบันได · L3 ห้องโฟกัส และ L4 ห้องพัก/ผ้า · ช่องโล่งเหนือบันไดช่วงที่ 1 และ Skylight</text><text y="72">• ผนังทึบชั้นบนอยู่ที่ x = −3.90 เช่นกัน (ไม่มีช่องเปิด) · ทรงพุ่มมะพร้าวเส้นประอยู่เหนือพื้นกันสาด</text>`}
</g>
</svg>`;
}

fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [lv, name] of [['G', 'west_wing_ground'], ['U', 'west_wing_upper']]) {
  const svg = sheet(lv);
  fs.writeFileSync(path.join(here, 'plans', `${name}.svg`), svg);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: path.join(here, 'plans', `${name}.png`) });
  const dpr = 2;
  const p2 = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: dpr });
  await p2.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  const cut = [['south', 0, X(10.3) + 20], ['north', X(9.7) - 20, W]];
  for (const [nm, x0, x1] of cut) await p2.screenshot({ path: path.join(here, 'plans', `${name}_${nm}.png`), clip: { x: x0, y: 170, width: x1 - x0, height: 690 } });
  await p2.close();
  await page.close();
  console.log('plan', name);
}
await browser.close();
