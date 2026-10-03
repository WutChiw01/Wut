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
  L(-4.4, -9.6, -4.4, 30.8, { stroke: '#555', sw: 1.2, dash: '14 4 2 4' }); T(-4.55, -8.4, 'แนวเขตที่ดินตะวันตก x = −4.40', 11, { fill: '#555', anchor: 'start' });
  L(-2.4, -9.6, -2.4, 30.8, { stroke: '#aaa', sw: 0.8, dash: '3 5' }); T(-2.55, 30.6, 'ระยะร่น 2.00 ม.', 10, { fill: '#999', anchor: 'end' });

  // ── ground-floor shell (both levels show the cut walls) ─────────
  const hallWallOpen = [[5.25, 6.95], [10.6, 12.3]];
  const hallWall = (ya, yb) => { let y = ya; for (const [a, b] of hallWallOpen) { if (a > y && a < yb) { wall(-1.05, -0.8, y, a); y = b; } } if (y < yb) wall(-1.05, -0.8, y, yb); };
  hallWall(-9.0, 24.1);
  wall(-3.9, -3.7, -9.0, 10.0); // west wall zones 1–2
  // front façade y = −9 with storefront opening
  wall(-3.9, -3.6, -9.0, -8.8); wall(-1.25, -0.8, -9.0, -8.8);
  R(-3.6, -1.25, -9.0, -8.8, { fill: '#e8f2f8', stroke: COL.glass, sw: 1 }); L(-3.6, -8.9, -1.25, -8.9, { stroke: COL.glass, sw: 1.5 });
  for (let x = -3.85; x <= -0.8; x += 0.3) L(x, -9.4, x, -9.15, { stroke: COL.teak, sw: 2 }); // teak fins
  // party wall zone 1 | zone 2 (y 4.8–5.2) and zone-2 north wall (y 9.8–10.0)
  if (level === 'G') { wall(-3.7, -3.5, 4.8, 5.2); wall(-2.7, -1.05, 4.8, 5.2); } else { wall(-3.7, -2.9, 4.8, 5.2); wall(-1.9, -1.05, 4.8, 5.2); }
  wall(-3.7, -1.05, 9.8, 10.0);
  // jali wall V1–V4 (garden west) and its notch around P2
  R(-3.9, -3.72, 10.0, 22.0, { fill: '#f1d9c3', stroke: '#c0562b', sw: 1 });
  for (let y = 10.0; y < 22.0; y += 0.19 * 2) L(-3.9, y, -3.72, y, { stroke: '#c0562b', sw: 1 });
  R(-3.9, -3.72, 15.01, 15.91, { fill: 'white', stroke: 'none' });
  // core walls with the 0.5 m notch for P1
  wall(-3.9, -3.7, 25.3, 30.1); wall(-3.9, -3.2, 22.0, 23.2); wall(-3.9, -3.2, 24.4, 25.3); wall(-3.4, -3.2, 23.2, 24.4); wall(-3.4, -1.8, 23.2, 23.4); wall(-3.4, -1.8, 24.2, 24.4);
  wall(-3.9, -1.8, 22.0, 22.2); wall(-1.9, -1.8, 22.0, 24.9); wall(-3.9, -1.8, 30.0, 30.1); wall(-3.9, -1.8, 28.05, 28.15);
  wall(-3.7, -1.8, 24.9, 25.0, { fill: COL.wall2 }); // G5 / fire-stair separation (partial height)

  if (level === 'G') {
    // ── ZONE 1 · G1 creative studio ──
    R(-3.7, -1.05, -8.8, 4.8, { fill: '#faf7f0' });
    R(-3.7, -1.05, 2.4, 3.9, { fill: 'white', stroke: '#ccc' }); R(-3.7, -1.05, 3.9, 4.8, { fill: '#f0f0f0', stroke: '#bbb' }); L(-3.7, 3.9, -1.05, 3.9, { stroke: '#999', dash: '4 3' }); T(-2.4, 4.35, 'ไซโคลรามา R0.90', 11, { rot: -90 }); T(-2.4, 3.15, 'พื้นขาว', 11, { rot: -90 });
    wall(-3.7, -1.05, -7.3, -7.1, { fill: COL.wall2 }); // vestibule partition y −7.25…−7.15 (with door)
    R(-2.9, -2.0, -7.32, -7.08, { fill: '#faf7f0' }); door(-2.9, -7.2, 0.9, 0, Math.PI / 2 * 0.95);
    door(-3.0, -8.9, 0.85, 0, Math.PI / 2 * 0.95); T(-2.6, -9.7, 'D1', 12, { bold: true });
    for (let y = -6.6; y < 3.0; y += 1.3) R(-3.7, -3.62, y, y + 1.1, { fill: '#39404a' });
    for (let y = -6.6; y < 1.2; y += 0.4) R(-1.13, -1.05, y, y + 0.25, { fill: COL.teak });
    L(-2.4, -6.9, -2.4, 2.9, { stroke: '#777', dash: '5 3' }); T(-2.28, -6.4, 'รางไฟเพดาน', 10, { fill: '#666' });
    for (const [x, y] of [[-3.15, 0.4], [-1.55, 1.3]]) { R(x - 0.35, x + 0.35, y - 0.35, y + 0.35, { fill: '#fff', stroke: COL.furn, sw: 1.2 }); L(x - 0.35, y - 0.35, x + 0.35, y + 0.35, { stroke: '#999' }); L(x - 0.35, y + 0.35, x + 0.35, y - 0.35, { stroke: '#999' }); }
    C(-1.4, -1.0, 0.5, { stroke: COL.furn }); C(-2.4, -3.2, 0.12, { fill: '#555' }); R(-1.6, -1.2, -2.9, -2.6, { stroke: COL.furn, fill: '#ddd' });
    R(-1.65, -1.05, -6.8, -5.4, { stroke: COL.furn, fill: '#e9d9c4' }); C(-2.0, -6.1, 0.2, { stroke: COL.furn });
    R(-3.6, -2.7, -5.6, -4.2, { fill: '#8fb3a1', stroke: COL.furn }); R(-3.35, -2.55, -5.75, -4.05, { stroke: '#a45', dash: '2 2' }); R(-2.5, -2.0, -5.1, -4.5, { stroke: COL.furn });
    for (let k = 0; k < 4; k++) R(-3.7, -3.3, -2.4 + k * 0.55, -2.4 + k * 0.55 + 0.45, { stroke: COL.furn, fill: '#e9d9c4' });
    R(-1.5, -1.1, -0.2, 0.5, { stroke: COL.furn, fill: '#ccc' });
    T(-4.75, -3.0, 'G1 สตูดิโอสร้างสรรค์เต็มหน้า  2.65 × 13.6 ม. · NC ≤ 30', 14, { bold: true });
    T(-2.4, -8.0, 'ห้องกันเสียง', 11); T(-3.0, -5.0, 'โซฟา', 10); T(-1.35, -6.1, 'แต่งหน้า', 10, { rot: -90 }); T(-3.5, -1.3, 'ชั้นวางพร็อพ', 10, { rot: -90 });
    // ── ZONE 2 · stair ──
    R(-3.7, -1.05, 5.2, 9.8, { fill: '#fbfbfb' });
    steps(-3.7, -2.45, 5.95, 8.55, 10); arrow(-3.08, 6.2, 8.3, 'ขึ้น 10 ขั้น');
    R(-3.7, -1.05, 8.55, 9.8, { fill: '#e6e6e6', stroke: COL.stair, sw: 1.6 }); T(-2.4, 9.18, '+1.75', 10);
    steps(-2.3, -1.05, 8.55, 5.95, 10); L(-2.3, 5.95, -1.05, 8.55, { stroke: '#999', dash: '4 3' }); T(-1.7, 7.25, 'ช่วงที่ 2 ขึ้น → +3.50', 11, { rot: -90 });
    R(-2.45, -2.3, 5.95, 8.55, { fill: '#fff', stroke: '#999', dash: '2 2' });
    R(-2.3, -1.1, 6.95, 7.95, { fill: '#f4f4f4', stroke: COL.wall, sw: 1.2 }); R(-1.75, -1.45, 7.55, 7.85, { stroke: COL.furn }); C(-1.6, 7.6, 0.14, { stroke: COL.furn }); R(-2.2, -1.9, 7.7, 7.9, { stroke: COL.furn }); T(-1.7, 7.45, 'WC G2', 10, { rot: -90 });
    R(-3.7, -2.5, 8.6, 9.8, { stroke: '#999', dash: '3 3' }); 
    R(-3.55, -2.7, 5.35, 5.75, { stroke: COL.furn, fill: '#e9d9c4' }); T(-3.1, 5.5, 'ม้านั่ง', 9);
    door(-3.5, 5.0, 0.8, 0, Math.PI / 2 * 0.9);
    // D3 on the hall wall (double 1.70 m recessed leaves)
    door(-1.3, 5.25, 0.85, -Math.PI / 2 * 0.02, -Math.PI * 0.45); door(-1.3, 6.95, 0.85, Math.PI / 2 * 0.02, Math.PI * 0.45);
    T(-0.6, 6.1, 'D3 1.70 ม.', 11, { bold: true, anchor: 'middle' });
    T(-4.75, 7.5, 'G2 บันไดใหญ่ตัวยู + WC', 13, { bold: true });
    // ── ZONE 3 · garden ──
    R(-3.72, -1.05, 10.0, 22.0, { fill: '#f6f2ea' });
    for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) {
      C(px, py, 1.5, { fill: COL.earth, stroke: '#a8916a', sw: 1 }); C(px, py, 1.05, { stroke: '#222', dash: '2 2' });
      for (let k = 0; k < 14; k++) { if (k === 4 || k === 5) continue; const a = (k / 14) * Math.PI * 2, a2 = ((k + 0.85) / 14) * Math.PI * 2; P(`M${f(X(py + Math.sin(a) * 1.35))},${f(Y(px + Math.cos(a) * 1.35))} L${f(X(py + Math.sin(a2) * 1.35))},${f(Y(px + Math.cos(a2) * 1.35))}`, { stroke: COL.teak, sw: 6 }); }
    }
    for (let y = 10.5; y < 21.8; y += 0.85) R(-2.0, -1.2, y, y + 0.7, { fill: '#cfcac0', stroke: '#8a8a82', sw: 0.8 });
    R(-1.45, -1.05, 12.6, 16.8, { fill: '#e9d9c4', stroke: COL.furn }); for (let y = 13.0; y < 16.7; y += 0.9) C(-1.85, y, 0.18, { stroke: COL.furn, fill: '#d7b98a' });
    T(-0.55, 14.7, 'บาร์นั่งทำงาน + สตูล', 11, { rot: -90 });
    R(-3.0, -2.2, 17.0, 17.9, { fill: '#e9d9c4', stroke: COL.furn }); for (const x of [-3.3, -2.0]) R(x - 0.2, x + 0.2, 17.25, 17.65, { stroke: COL.furn });
    C(-2.9, 20.9, 0.4, { fill: '#9fd3e0', stroke: COL.furn }); T(-2.9, 20.9, 'น้ำ', 9);
    for (let y = 10.0; y <= 22.0; y += 0.45) { if (Math.abs(y - 15.46) < 0.42 || Math.abs(y - 12.08) < 0.42) continue; L(-3.9, y, -0.8, y, { stroke: COL.teak, sw: 0.7, dash: '1 6' }); }
    T(-4.75, 16.0, 'G3 สวน Co-Working มะพร้าว', 14, { bold: true }); T(-4.58, 16.0, 'ลานดิน · ม้านั่งไม้สัก · หลังคาระแนง +7.00', 11);
    palm(-3.67, 15.46, 'P2', 3.8); palm(-3.24, 12.08, 'P3', 3.5);
    door(-1.2, 10.6, 0.8, 0, Math.PI * 0.45); door(-1.2, 12.3, 0.8, 0, -Math.PI * 0.45); T(-0.55, 11.45, 'D4', 11, { bold: true });
    // pods G4
    R(-3.7, -1.05, 18.0, 22.0, { fill: 'rgba(190,215,230,0.35)', stroke: '#6fa2c0', sw: 1.6 }); R(-3.35, -2.1, 19.0, 21.0, { fill: '#e9d9c4', stroke: COL.furn }); for (const y of [19.3, 19.9, 20.5]) C(-3.35 + 0.0, y, 0.0, {}); T(-2.4, 20.0, 'G4 ห้องโฟกัส', 12, { bold: true }); T(-2.15, 20.0, '2.65 × 4.00', 10);
    door(-1.05, 18.0, 0.8, Math.PI / 2, Math.PI / 2 - 0.9);
    // ── ZONE 4 · core ──
    palm(-4.0, 23.8, 'P1', 4.2);
    R(-3.7, -1.9, 22.2, 24.9, { fill: '#f2f5f7' });
    for (let k = 0; k < 4; k++) R(-3.35 + k * 0.42, -2.97 + k * 0.42, 22.25, 22.7, { fill: '#66707b', stroke: COL.furn }); R(-3.65, -3.0, 24.3, 24.85, { stroke: COL.furn, fill: '#ddd' }); C(-2.4, 24.5, 0.3, { stroke: COL.furn, fill: '#ccd' });
    T(-4.75, 25.5, 'G5 ห้อง MDB + ปั๊ม ≈ 5 ตร.ม.', 12, { bold: true });
    // fire stair + lift
    R(-3.7, -1.8, 25.0, 30.1, { fill: '#fbfbfb' });
    steps(-3.7, -2.78, 28.0, 26.0, 10); arrow(-3.24, 27.8, 26.2, 'ขึ้น'); R(-3.7, -1.8, 24.9, 26.0, { fill: '#e6e6e6', stroke: COL.stair, sw: 1.6 }); steps(-2.72, -1.8, 26.0, 28.0, 10);
    R(-3.85, -1.8, 28.05, 30.1, { fill: '#fff', stroke: COL.wall, sw: 3 }); L(-3.85, 28.05, -1.8, 30.1, { stroke: COL.wall }); L(-3.85, 30.1, -1.8, 28.05, { stroke: COL.wall }); T(-2.8, 29.1, 'MRL 2.05×2.05', 11, { bold: true });
    T(-2.75, 26.0, 'บันไดหนีไฟ', 11, { bold: true, rot: -90 });
  } else {
    // ── UPPER LEVEL (+3.50) ──
    R(-3.7, -1.05, -8.8, 4.8, { fill: '#fbf6ee' });
    R(-3.55, -1.4, -7.6, -4.4, { fill: '#c9a07f', op: 0.5 }); R(-3.55, -2.45, -7.4, -5.3, { fill: '#c9a37a', stroke: COL.furn }); R(-2.4, -1.9, -6.6, -5.8, { stroke: COL.furn });
    for (const y of [-6.2, -5.4]) C(-1.7, y, 0.2, { stroke: COL.furn, fill: '#7aa08c' });
    R(-3.6, -1.1, -2.2, -1.6, { fill: '#b8793b', stroke: COL.furn }); for (const x of [-3.2, -2.6, -2.0, -1.4]) C(x, -1.2, 0.17, { stroke: COL.furn, fill: '#7aa08c' });
    R(-3.72, -3.64, -6.8, -4.6, { fill: '#22305a' }); T(-3.45, -4.2, 'ทีวี', 9, { rot: -90, anchor: 'start' });
    R(-3.4, -1.4, 1.2, 2.0, { fill: '#e9d9c4', stroke: COL.furn }); for (const x of [-3.1, -2.4, -1.7]) { C(x, 0.8, 0.2, { stroke: COL.furn }); C(x, 2.4, 0.2, { stroke: COL.furn }); }
    for (let y = -8.2; y < 4.6; y += 2.4) C(-2.4, y, 0.14, { stroke: '#999', dash: '2 2' });
    R(-3.7, -1.05, -8.8, 4.8, { stroke: '#555', sw: 1 });
    R(-3.6, -1.25, -9.0, -8.8, { fill: '#e8f2f8', stroke: COL.glass });
    T(-4.75, -3.6, 'L1 ห้องสวีทสร้างสรรค์ / VIP Lounge  +3.50 · เปิดสู่ชานพักบันไดใหญ่', 14, { bold: true });
    T(-3.0, -5.4, 'ห้องรับแขก', 10); T(-3.0, -1.2, 'เคาน์เตอร์บาร์', 10); T(-2.4, 1.6, 'โต๊ะทำงานร่วม', 10);
    // ── stair head ──
    R(-3.7, -1.05, 5.2, 5.95, { fill: '#e9e9e9', stroke: COL.stair, sw: 1.6 }); T(-2.4, 5.58, 'ชานพักหัวบันได +3.50', 10);
    L(-3.7, 5.95, -1.05, 5.95, { stroke: '#4aa3d6', sw: 2.5 }); T(-1.5, 5.4, 'ราวกระจก', 9);
    R(-3.7, -2.45, 5.95, 9.8, { fill: 'white', stroke: '#6a6', sw: 1.2, dash: '5 3' }); L(-3.7, 5.95, -2.45, 9.8, { stroke: '#bbb', dash: '3 3' }); L(-3.7, 9.8, -2.45, 5.95, { stroke: '#bbb', dash: '3 3' }); T(-3.08, 7.9, 'ช่องโล่งเหนือช่วงที่ 1 (ลงชั้นล่าง)', 11, { rot: -90 });
    steps(-2.3, -1.05, 5.95, 8.55, 10); arrow(-1.68, 8.3, 6.2, 'ลง ↓ 10 ขั้น'); R(-2.3, -1.05, 8.55, 9.8, { fill: '#e0e0e0', stroke: COL.stair, sw: 1.6 }); T(-1.7, 9.18, 'ชานพัก +1.75', 10);
    R(-3.7, -1.05, 6.0, 9.0, { stroke: '#e8a', sw: 1.2, dash: '8 3' }); T(-3.35, 6.4, 'Skylight', 10, { fill: '#c36', anchor: 'start' });
    T(-0.55, 5.6, 'ทางเชื่อมสะพานสวน: ยังไม่มี (รอตัดสินใจ)', 11, { fill: COL.red, bold: true });
    // ── gallery walkway ──
    R(-3.72, -2.6, 10.0, 22.0, { fill: 'rgba(120,180,120,0.12)', stroke: '#8a8', dash: '4 4' }); T(-3.2, 13.3, 'ช่องโล่งสวน G3', 11, { fill: '#486' });
    R(-2.6, -0.8, 10.0, 22.0, { fill: '#eef0f1', stroke: COL.stair, sw: 1.6 }); L(-2.6, 10.0, -2.6, 22.0, { stroke: '#4aa3d6', sw: 3 }); T(-2.45, 21.6, 'ราวกระจก 1.10 + ตาข่ายกันมะพร้าวหล่นสูงถึง +6.10', 10, { anchor: 'end', fill: '#256' });
    for (const y of [10.4, 14.4, 18.4, 21.6]) R(-1.7, -1.2, y - 0.25, y + 0.25, { fill: '#e9d9c4', stroke: COL.furn });
    for (let y = 10.0; y <= 22.0; y += 1.0) L(-2.62, y, -0.85, y, { stroke: '#8bd', sw: 0.6, dash: '2 5' });
    T(-4.75, 16.0, 'L2 สะพานทางเดินชมสวน +3.50 (กว้าง 1.80) · หลังคาโพลีคาร์บอเนต +6.10', 14, { bold: true });
    palm(-3.67, 15.46, 'P2', 3.8); palm(-3.24, 12.08, 'P3', 3.5);
    // L3 pod + L4 staff
    R(-3.7, -2.65, 18.0, 22.0, { fill: 'rgba(190,215,230,0.45)', stroke: '#6fa2c0', sw: 1.6 }); R(-3.6, -2.9, 19.0, 21.0, { fill: '#e9d9c4', stroke: COL.furn }); T(-3.2, 20.0, 'L3 ห้องโฟกัส', 11, { bold: true });
    L(-3.9, 10.0, -0.8, 10.0, { stroke: COL.teak, sw: 1 });
    palm(-4.0, 23.8, 'P1', 4.2);
    R(-3.7, -1.9, 22.2, 24.9, { fill: '#f2f5f7' }); for (let k = 0; k < 5; k++) R(-3.65 + k * 0.33, -3.37 + k * 0.33, 22.25, 22.7, { fill: '#6b8fd0', stroke: COL.furn }); R(-3.0, -2.2, 23.3, 24.0, { fill: '#e9d9c4', stroke: COL.furn }); for (const y of [23.1, 24.2]) R(-2.9, -2.3, y - 0.2, y + 0.2, { stroke: COL.furn });
    R(-3.65, -3.4, 24.45, 24.85, { stroke: COL.furn, fill: '#fff' });
    T(-4.75, 25.5, 'L4 ห้องพักพนักงาน + ผ้า', 12, { bold: true });
    R(-3.7, -1.8, 25.0, 30.1, { fill: '#fbfbfb' }); steps(-3.7, -2.78, 28.0, 26.0, 10); arrow(-3.24, 27.8, 26.2, 'ขึ้น'); R(-3.7, -1.8, 24.9, 26.0, { fill: '#e6e6e6', stroke: COL.stair, sw: 1.6 }); steps(-2.72, -1.8, 26.0, 28.0, 10);
    R(-3.85, -1.8, 28.05, 30.1, { fill: '#fff', stroke: COL.wall, sw: 3 }); L(-3.85, 28.05, -1.8, 30.1, { stroke: COL.wall }); L(-3.85, 30.1, -1.8, 28.05, { stroke: COL.wall }); T(-2.8, 29.1, 'MRL', 11, { bold: true });
  }

  // zone bands + dimension strings (below the wing, on the hall side)
  const zy = [[-9.0, 5.0, 'ZONE 1 · G1 / L1  (14.00 ม.)'], [5.0, 10.0, 'ZONE 2 · บันได (5.00)'], [10.0, 22.0, 'ZONE 3 · สวนมะพร้าว (12.00)'], [22.0, 30.1, 'ZONE 4 · แกนเหนือ (8.10)']];
  for (const [a, b, t] of zy) { dimY(a, b, 0.55, t); L(-4.2, a, 0.9, a, { stroke: '#bbb', sw: 0.6, dash: '2 6' }); }
  L(-4.2, 30.1, 0.9, 30.1, { stroke: '#bbb', sw: 0.6, dash: '2 6' });
  dimY(-9.0, 30.1, 1.25, 'ยาวรวม 39.10 ม.   (y = −9.00 … +30.10)');
  // width dim (vertical) at the left
  o.push(`<g stroke="${COL.dim}" fill="${COL.dim}"><line x1="${f(X(-9.0) - 40)}" y1="${f(Y(-3.9))}" x2="${f(X(-9.0) - 40)}" y2="${f(Y(-0.8))}"/><line x1="${f(X(-9.0) - 46)}" y1="${f(Y(-3.9))}" x2="${f(X(-9.0) - 34)}" y2="${f(Y(-3.9))}"/><line x1="${f(X(-9.0) - 46)}" y1="${f(Y(-0.8))}" x2="${f(X(-9.0) - 34)}" y2="${f(Y(-0.8))}"/><text x="${f(X(-9.0) - 50)}" y="${f(Y(-2.35))}" font-size="12" text-anchor="end" stroke="none">3.10 ม.</text></g>`);
  // hall label, level tags
  T(-0.1, 0.5, level === 'G' ? 'โถงแบดมินตัน (ผนังฝั่งตะวันตก x = −0.80)' : 'โถงแบดมินตัน — ผนังฝั่งตะวันตก', 11, { fill: '#777' });
  return o.join('\n');
}

function sheet(level) {
  const title = level === 'G' ? 'แปลนชั้นล่าง ±0.00 — ปีกตะวันตก + สวนมะพร้าว' : 'แปลนชั้นบน +3.50 — ปีกตะวันตก + สะพานสวนมะพร้าว';
  const sub = 'MY PLACE REV D.9 · ผังหมุน 90° (ทิศเหนืออยู่ด้านขวา ทิศตะวันตก/เขตที่ดินอยู่ด้านบน) · หน่วย เมตร';
  const legend = [['#3a3a3a', 'ผนัง คสล./อิฐ'], ['#f1d9c3', 'ผนังอิฐช่องลม (jali)'], ['#4c8a3a', 'ทรงพุ่มมะพร้าว (เส้นประ)'], ['#d9c7a3', 'ดินรอบโคน r 1.50'], ['#b8793b', 'ไม้สัก/ม้านั่ง'], ['#c0392b', 'ทิศบันได']];
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
  ? `<text y="0">• G1 สตูดิโอ: ประตู D1 ด้านถนน, ห้องกันเสียงก่อนเข้า, ผนังซับเสียง, ไซโคลรามาปลายเหนือ (R0.90)</text><text y="24">• G2 บันได: ลูกตั้ง 175 มม. ลูกนอน 260 มม. 2 ช่วง ช่วงละ 10 ขั้น กว้าง 1.25 ม., ชานพักกลาง +1.75, WC G2 ใต้ช่วงที่ 2 (1.20×0.95)</text><text y="48">• D3 (1.70 ม.) และ D4 (1.70 ม.) เปิดจากโถงแบดมินตัน · สวน G3: ต้นมะพร้าว P2 (−3.67, 15.46) / P3 (−3.24, 12.08) · P1 (−4.00, 23.80) อยู่นอกผนังในช่องเว้า</text><text y="72">• แกนเหนือ: G5 ห้อง MDB+ปั๊ม, บันไดหนีไฟ 2 ช่วง ช่วงละ 0.95 ม. (ที่ว่าง 1.90 ม. — สเปก 1.20 ม./ช่วง ต้องตัดสินใจ), ลิฟต์ MRL 2.05×2.05</text>`
  : `<text y="0">• L1 ห้องสวีท +3.50: รับแขก, บาร์, โต๊ะทำงานร่วม — เข้าจากหัวบันไดใหญ่ (ราวกระจก 1.10 ม.)</text><text y="24">• สะพานทางเดินชมสวน L2: กว้าง 1.80 ม. ราวกระจก + ตาข่ายและหลังคากันมะพร้าวหล่น ไม่ต่อกับหัวบันไดโดยตรง (ติดข้อจำกัดความกว้างปีก 2.65 ม.)</text><text y="48">• L3 ห้องโฟกัส (ครึ่งความกว้าง) ต่อปลายสะพาน · ทรงพุ่ม P1/P2/P3 รัศมี ≈ 3.5–4.2 ม. อยู่เหนือหลังคาระแนง +7.00</text><text y="72">• L4 ห้องพักพนักงาน/ผ้า เหนือ G5 · ช่องโล่งเหนือบันไดช่วงที่ 1 และ Skylight เหนือโถงบันได</text>`}
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
