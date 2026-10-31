// R53 summary: whole building, 3 floors, with the column layout as understood from the spec (vD6 grids) + the user's R33 marks.
// usage: node plan_summary_r46.mjs → plans/summary_GF_R53, summary_L2_R53, summary_L3_R53 (.svg/.png)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const S = 24, XMIN = -7.5, XMAX = 33.5, YMIN = -16.5, YMAX = 38.5, MX = 70, MY = 150, TBL = 640;
const W = Math.round((XMAX - XMIN) * S + 2 * MX + TBL), HP = (YMAX - YMIN) * S, H = Math.round(MY + HP + 60);
const X = (x) => MX + (x - XMIN) * S, Y = (y) => MY + (YMAX - y) * S, f = (n) => n.toFixed(1);
// user's R33 naming: letters = x lines, numbers = y lines
const GX = [[0.2, 'A'], [5.2, 'B'], [10.2, 'C'], [15.2, 'D'], [20.2, 'E']];
const GY = [[-10.15, '0'], [-1.65, '1'], [7.35, '2'], [16.35, '3'], [25.1, '4'], [28.1, '5']];
const C6 = true; // R53: 6th court adopted
const C = { ex: '#333', rm: '#c0392b', nw: '#1e8a3a', q: '#e08a00', tw: '#b8731a' };

function sheet(lv) {
  const o = [];
  const R = (x0, x1, y0, y1, a = {}) => o.push(`<rect x="${f(X(x0))}" y="${f(Y(y1))}" width="${f((x1 - x0) * S)}" height="${f((y1 - y0) * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? 'none'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
  const L = (x0, y0, x1, y1, a = {}) => o.push(`<line x1="${f(X(x0))}" y1="${f(Y(y0))}" x2="${f(X(x1))}" y2="${f(Y(y1))}" stroke="${a.stroke ?? '#555'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
  const Ci = (x, y, r, a = {}) => o.push(`<circle cx="${f(X(x))}" cy="${f(Y(y))}" r="${f(r * S)}" fill="${a.fill ?? 'none'}" stroke="${a.stroke ?? '#555'}" stroke-width="${a.sw ?? 1}" ${a.dash ? `stroke-dasharray="${a.dash}"` : ''}/>`);
  const T = (x, y, s, size = 10, a = {}) => o.push(`<text paint-order="stroke" stroke="#fff" stroke-width="3" x="${f(X(x))}" y="${f(Y(y))}" font-size="${size}" fill="${a.fill ?? '#222'}" text-anchor="${a.anchor ?? 'middle'}" ${a.bold ? 'font-weight="700"' : ''} ${a.rot ? `transform="rotate(${a.rot} ${f(X(x))} ${f(Y(y))})"` : ''}>${s}</text>`);
  const room = (x0, x1, y0, y1, fill, name, size = 8.5) => { R(x0, x1, y0, y1, { fill, stroke: '#666', sw: 0.8 }); if (name) T((x0 + x1) / 2, (y0 + y1) / 2 - 0.15, name, size); };
  // grids
  for (const [x, t] of GX) { L(x, YMIN + 1, x, YMAX - 1.6, { stroke: '#cc5', sw: 0.7, dash: '9 4 2 4' }); o.push(`<circle cx="${f(X(x))}" cy="${f(Y(YMAX - 1))}" r="11" fill="#fff" stroke="#888"/><text x="${f(X(x))}" y="${f(Y(YMAX - 1) + 4)}" font-size="12" text-anchor="middle" font-weight="700">${t}</text>`); }
  for (const [y, t] of GY) { L(XMIN + 1.2, y, XMAX - 0.5, y, { stroke: '#cc5', sw: 0.7, dash: '9 4 2 4' }); o.push(`<circle cx="${f(X(XMIN + 0.7))}" cy="${f(Y(y))}" r="11" fill="#fff" stroke="#888"/><text x="${f(X(XMIN + 0.7))}" y="${f(Y(y) + 4)}" font-size="12" text-anchor="middle" font-weight="700">${t}</text>`); }
  // site: fence, sloped rear fence, road
  L(-4.4, -13.55, -4.4, 33.85, { stroke: '#c0392b', sw: 1.5, dash: '7 4' }); L(0.2, 33.85, 20.2, 36.85, { stroke: '#c0392b', sw: 1.5, dash: '7 4' }); L(-4.4, 33.85, 0.2, 33.85, { stroke: '#c0392b', sw: 1.5, dash: '7 4' });
  R(-7, 33, -16.2, -13.55, { fill: '#ddd' }); T(13, -15.0, 'ถนน / road', 10, { fill: '#777' });
  // hall shell (GF): boundary wall west (with palm notches), glass east, front + rear walls
  const notch = []; // R53: hall NW corner ends at y 23.10, P1 outside
  if (lv === 'G') {
    R(-3.7, 20.2, -10.15, 24.1, { fill: '#f4f7f4' }); R(20.2, 22.3, -10.15, 24.1, { fill: '#eee' });
    { let y = -10.4; for (const [a, b] of notch) { R(-3.9, -3.7, y, a, { fill: '#555' }); R(-3.9, -2.7, a - 0.2, a, { fill: '#555' }); R(-3.9, -2.7, b, b + 0.2, { fill: '#555' }); R(-2.9, -2.7, a, b, { fill: '#555' }); y = b; } R(-3.9, -3.7, y, 23.1, { fill: '#555' }); R(-3.9, -1.8, 22.9, 23.1, { fill: '#555' }); }
    R(-3.9, 20.2, -10.4, -10.15, { fill: '#555' }); for (let y = -10.15; y < 24.0; y += 0.9) L(20.2 + ((Math.round((y + 10.15) / 0.9)) % 2 ? 0.12 : -0.12), y, 20.2 + ((Math.round((y + 10.15) / 0.9)) % 2 ? -0.12 : 0.12), y + 0.9, { stroke: '#b5651d', sw: 1.6 });
    T(19.4, 20.5, 'บานเฟี่ยม (ต่ำกว่า +3.50) แนวศูนย์กลางเสา E', 8.5, { rot: -90, fill: '#b5651d', bold: true });
    T(-5.3, 5, 'ผนังทึบเขตที่ดิน (โถงชนผนัง)', 9, { rot: -90, fill: '#555' });
    // courts
    for (const [x0, y0, n] of [[5.55, -7.25, 'B2'], [12.85, -7.25, 'B3'], [-1.8, 8.55, 'B4'], [5.55, 8.55, 'B5'], [12.85, 8.55, 'B6'], [-1.8, -7.25, 'B1']]) { R(x0, x0 + 6.1, y0, y0 + 13.4, { fill: '#cfe8cf', stroke: '#4c8a3a' }); L(x0, y0 + 6.7, x0 + 6.1, y0 + 6.7, { stroke: '#333' }); T(x0 + 3.05, y0 + 3.3, n, 13, { bold: true, fill: '#2f6b2f' }); }
    { const dm = (x, ya, yb, t) => { L(x, ya, x, yb, { stroke: '#0b57d0', sw: 1.5 }); L(x - 0.25, ya, x + 0.25, ya, { stroke: '#0b57d0', sw: 1.5 }); L(x - 0.25, yb, x + 0.25, yb, { stroke: '#0b57d0', sw: 1.5 }); T(x + 0.35, (ya + yb) / 2 - 0.15, t, 9, { fill: '#0b57d0', anchor: 'start', bold: true }); };
      for (const x of [3.0, 9.0, 16.0]) { dm(x, 6.15, 7.35, '1.20'); dm(x, 7.35, 8.55, '1.20'); }
      dm(9.0, -10.15, -7.25, '2.90 ทางเข้า'); dm(9.0, 21.95, 24.1, '2.15 ด้านหลัง'); }
    if (!C6) {
    R(-1.8, 4.25, -8.7, -1.22, { fill: '#c7d3f0' }); R(-3.72, 4.08, -1.22, 6.58, { fill: '#5b7fe0', stroke: '#1d3c99' }); R(-2.82, 3.18, -0.32, 5.68, { stroke: '#fff', sw: 1.5 }); T(0.18, 2.9, 'เวทีมวยหลัก 6×6 (+0.90)', 10, { bold: true, fill: '#10235e' });
    R(-1.33, 2.67, -7.7, -3.7, { fill: '#e57373', stroke: '#8b1d1d' }); T(0.67, -5.8, 'เวทีซ้อม 3×3', 9, { bold: true });
    }
    T(10.2, 5.6, 'ทางเดินกลาง (cross-aisle)', 9, { fill: '#777' });
    // catwalk (overhead) + pickleball
    R(20.35, 21.15, -10.15, 24.1, { stroke: '#1d4ed8', dash: '5 3' }); T(20.75, 0, 'catwalk 0.80 @ +3.50 (เหนือศีรษะ)', 8, { rot: -90, fill: '#1d4ed8' });
    R(21.35, 29.45, -9.0, 23.7, { fill: '#e6f0e0', stroke: '#222', sw: 2 }); L(21.35, 7.35, 29.45, 7.35, { stroke: '#222', sw: 2.5 }); T(25.4, 7.75, 'รั้ว chain-link แนวกริด 2', 9, { bold: true });
    L(29.45, -12.5, 29.45, 38.5, { stroke: '#c0392b', sw: 1.6, dash: '7 4' }); T(30.3, 0, 'แนวเขตที่ดินตะวันออก (ห่างสนาม 1.50 ม.)', 9, { rot: -90, fill: '#c0392b', bold: true });
    L(27.95, -8.0, 29.45, -8.0, { stroke: '#0b57d0' }); T(28.7, -7.75, '1.50', 9, { fill: '#0b57d0', bold: true });
    for (const y0 of [-8.4, 9.7]) { R(21.85, 27.95, y0, y0 + 13.4, { fill: '#dbe7f7', stroke: '#5b7fb0' }); L(21.85, y0 + 6.7, 27.95, y0 + 6.7, { stroke: '#333' }); T(24.9, y0 + 3.3, 'Pickleball', 10, { fill: '#345', bold: true }); }
    L(20.35, -9.6, 21.85, -9.6, { stroke: '#0b57d0' }); T(21.1, -9.35, '1.50', 9, { fill: '#0b57d0', bold: true });
    // front: entrance court + C1 / C2 towers
    R(1.4, 20.1, -13.4, -10.4, { fill: '#e8f3f8' }); T(10.75, -12.9, 'ลานทางเข้า + บ่อปลาคาร์ฟ', 8.5, { fill: '#456' });
    // rear GF (R40)
    for (const [x0, x1, y0, y1, n, c] of [[-1.8, 0.4, 24.1, 27.15, 'WC พิการ', '#efe6f7'], [-1.8, 0.4, 27.15, 30, 'WC ญ', '#f8e6ee'], [0.4, 1.6, 24.1, 30, '', '#e9eef2'], [1.6, 3.6, 24.1, 27.15, 'คีออสก์ 6.1', '#fff3c4'], [1.6, 3.6, 27.15, 30, 'WC ช', '#e0ecf7'], [3.6, 5.5, 24.1, 30, 'ล็อกเกอร์ ญ', '#f8e8ef'], [5.5, 7.4, 24.1, 30, 'ล็อกเกอร์ ช', '#e4eef8'], [7.4, 10.2, 24.1, 30, 'ของที่ระลึก 16.5', '#fcefd3'], [10.2, 15.2, 24.1, 30, 'คลินิก 29.5', '#e4f2e7'], [15.2, 17.7, 24.1, 30, 'เช่า L1 14.8', '#fff3c4'], [17.7, 20.2, 24.1, 30, 'เช่า L2 14.8', '#fff3c4'], [20.2, 22.2, 25.1, 30, 'WC พนง.', '#e8edf0']]) room(x0, x1, y0, y1, c, n, 7);
    R(3.4, 22.2, 30.3, 33.4, { fill: '#e3f0d8' }); T(13, 32.0, 'สนามหญ้า — ภูมิทัศน์ในอนาคต', 9, { fill: '#2f6b2f' });
  } else {
    // upper floors: hall below = void, roof outline
    R(-3.9, 22.3, -10.4, 23.1, { stroke: '#999', dash: '6 4' }); T(9.2, 8.0, lv === 'U' ? 'โถงสนาม (ความสูง 2 ชั้น) — void' : 'หลังคาโถง (space frame)', 12, { fill: '#999' });
    if (lv === 'U') { R(20.35, 21.15, -10.15, 23.1, { fill: '#cfe0fb', stroke: '#1d4ed8' }); T(20.75, 4, 'catwalk 0.80 ม. @ +3.50 — ชิดเสา E ด้านนอก → เข้าทางเชื่อมชั้น 2', 9, { rot: -90, fill: '#1d4ed8', bold: true }); for (const y0 of [-8.4, 9.7]) R(21.85, 27.95, y0, y0 + 13.4, { stroke: '#9ab', dash: '4 3' }); L(21.15, -10.15, 21.15, 24.1, { stroke: '#7fb5d6', sw: 3 }); T(21.6, 4, 'ผนังกระจก/บานเกล็ดเหนือ +3.50 อยู่ขอบนอก catwalk', 8, { rot: -90, fill: '#2a6f9a' }); }
    if (lv === 'U') {
      R(0.4, 22.2, 28.8, 30, { fill: '#e6edf2' }); T(11, 29.3, 'ทางเดินด้านหลัง 1.20', 8);
      for (const [x0, x1, n, c] of [[-1.8, 3.6, 'ต้อนรับ+เลานจ์+นวด', '#f4efe4'], [3.6, 5.8, 'Red Light 1', '#fde4e1'], [5.8, 8.0, 'Red Light 2', '#fde4e1'], [8.0, 10.6, 'HBOT 1', '#ececec'], [10.6, 13.2, 'HBOT 2', '#ececec'], [13.2, 17.6, 'ซาวน่า+น้ำเย็น', '#e3f2fb'], [17.6, 20.2, 'เช่า W 14.8', '#fff3c4']]) room(x0, x1, 23.1, 28.8, c, n, 7);
      L(-1.8, 24.1, 22.2, 24.1, { stroke: '#b44', dash: '6 4' }); T(9.5, 23.55, 'พื้นยื่นใหม่ 1.00 ม. (y 23.10–24.10) · ขอบพื้นเดิม 24.10', 7.5, { fill: '#b44' });
      room(20.25, 21.15, 23.1, 28.8, '#cfe0fb', '', 7); T(20.7, 26.4, 'ทางเชื่อม', 7, { rot: -90 }); room(21.15, 22.2, 23.1, 28.8, '#eee', '', 7); T(21.7, 26.4, 'ผ้า/ของ', 7, { rot: -90 });
      room(-1.8, 0.4, 27.9, 30, '#e0ecf7', 'WC', 7);
    } else {
      for (const [x0, x1, y0, y1, n, c] of [[-1.8, 0.4, 23.1, 27.6, 'เก็บของ', '#eee'], [-1.8, 0.4, 27.6, 30, 'WC+ฝักบัว', '#e0ecf7'], [0.4, 4.2, 23.1, 30, 'ล็อบบี้', '#f4efe4'], [4.2, 17.2, 23.1, 30, 'สตูดิโอให้เช่า 91 ตร.ม.', '#fff3c4'], [17.2, 22.2, 23.1, 30.1, 'ลานฟิตเนส 35 ตร.ม.', '#ead8b5']]) room(x0, x1, y0, y1, c, n, 8);
    }
  }
  // S1 stair (all levels)
  R(-1.8, 3.2, 30.1, 32.9, { fill: '#fff4e2', stroke: C.tw, sw: 1.5 }); for (let x = -0.6; x < 1.74; x += 0.26) L(x, 30.15, x, 32.85, { stroke: C.tw, sw: 0.5 }); T(0.7, 33.4, 'บันได S1', 9, { bold: true, fill: C.tw });
  // palms
  for (const [x, y, n] of [[-4.0, 23.8, 'P1']]) { Ci(x, y, 2.0, { stroke: '#2f6b2f', dash: '4 3' }); Ci(x, y, 0.45, { fill: '#7fb36a', stroke: '#2f6b2f' }); T(x - 1.0, y - 0.15, n, 9, { bold: true, fill: '#2f6b2f' }); }
  // cyclone towers (GF only) on their columns
  if (lv === 'G') for (const [x, y, n] of [[0.2, 7.35, 'W0'], [10.13, 7.35, 'C0'], [20.2, 7.35, 'E0'], [7.35, -11.3, 'C1'], [14.15, -11.3, 'C2']]) { Ci(x, y, 0.65, { fill: '#e9b28a', stroke: C.tw, sw: 1.2 }); T(x + 1.1, y + 0.55, n, 8.5, { fill: C.tw, anchor: 'start', bold: true }); }

  // ── columns ──
  const col = (x, y, kind, id, s = 0.3) => {
    const c = C[kind];
    if (kind === 'rm') { R(x - s / 2, x + s / 2, y - s / 2, y + s / 2, { fill: '#fff', stroke: c, sw: 2 }); L(x - 0.45, y - 0.45, x + 0.45, y + 0.45, { stroke: c, sw: 2.5 }); L(x - 0.45, y + 0.45, x + 0.45, y - 0.45, { stroke: c, sw: 2.5 }); }
    else R(x - s / 2, x + s / 2, y - s / 2, y + s / 2, { fill: kind === 'q' ? '#fff' : c, stroke: c, sw: kind === 'q' ? 2 : 1, dash: kind === 'q' ? '3 2' : '' });
    if (id) T(x + 0.35, y - 0.75, id, 8, { fill: c, anchor: 'start', bold: true });
  };
  const COLS = [];
  const add = (lvls, x, y, kind, id, note) => COLS.push({ lvls, x, y, kind, id, note });
  // hall portal frame lines A & E (spec) — R53 per user
  add('GUT', 0.2, -10.15, 'ex', 'A0', 'portal เดิม (แนวหน้าโถง)');
  add('GUT', 0.2, -1.65, C6 ? 'rm' : 'ex', 'A1', C6 ? 'รื้อ (อยู่ในคอร์ท B1) → ถ่ายแรงไป W1' : 'portal เดิม — คงไว้ (ผู้ใช้ยืนยัน)');
  add('GUT', 0.2, 7.35, 'ex', 'A2', 'portal เดิม + หอ W0');
  add('GUT', 0.2, 16.35, 'rm', 'A3', 'รื้อ (กลางคอร์ท B4) → รับแทนด้วย W3');
  add('GUT', 20.2, -10.15, 'ex', 'E0', 'portal เดิม · ยึด catwalk');
  add('GUT', 20.2, -1.65, 'ex', 'E1', 'portal เดิม · ยึด catwalk');
  add('GUT', 20.2, 7.35, 'ex', 'E2', 'portal เดิม + หอ E0 · ยึด catwalk');
  add('GUT', 20.2, 16.35, 'ex', 'E3', 'คงเดิม · ยึด catwalk');
  add('GUT', 10.2, 7.35, 'q', 'C2?', 'เสาเหล็กกลมเดิมใต้หอ C0 (สเปก) — ยังต้องยืนยัน');
  // new west line — all on x −3.13 (user: align with W3)
  add('GUT', -3.13, -8.15, 'nw', 'W0', 'ใหม่ · ขยับขึ้น 2.0 ม. หลบแนวเสาสัญญาณโทรศัพท์');
  add('GUT', -3.13, -1.65, 'nw', 'W1', 'ใหม่ · แนวเดียวกับ W3');
  add('GUT', -3.13, 7.35, 'nw', 'W2', 'ใหม่ · แนวเดียวกับ W3');
  add('GUT', -3.13, 16.35, 'nw', 'W3', 'ใหม่ · รับแทน A3 · กลับมาอยู่บนกริด 3 (ย้าย P2 ออกแล้ว)');
  add('GUT', -2.4, 25.1, 'nw', 'W4', 'ใหม่ · กริด 4 · ขยับเข้า 0.73 ม. ให้ห่าง P1 2.1 ม.');
  // rear building rows 4 & 5: existing to +3.50, new above
  for (const [x, l] of GX) { add('G', x, 25.1, 'ex', l + '4', 'RC เดิม (GF→+3.50)'); add('G', x, 28.1, 'ex', l + '5', 'RC เดิม (GF→+3.50)'); add('U', x, 25.1, 'ex', l + '4', ''); add('U', x, 28.1, 'ex', l + '5', ''); add('T', x, 25.1, 'nw', l + '4', ''); add('T', x, 28.1, 'nw', l + '5', ''); }
  // S1 corners, catwalk landing posts, front towers
  for (const [x, y, i] of [[-1.75, 30.2, 1], [-1.75, 32.8, 2], [3.15, 32.8, 3], [3.15, 30.2, 4]]) add('GUT', x, y, 'nw', 'S' + i, i === 1 ? 'ใหม่ · เสา 4 มุมบันได S1 GF→หลังคา' : '');
  add('G', 7.35, -11.3, 'nw', 'C1', 'ใหม่ · แกน H250 หอ C1 (สเปก)'); add('G', 14.15, -11.3, 'nw', 'C2t', 'ใหม่ · แกน H250 หอ C2 (สเปก)');
  for (const c of COLS) if (c.lvls.includes(lv)) col(c.x, c.y, c.kind, c.id);

  // legend + schedule
  const lx = X(XMAX) + 30; let ly = MY + 10; const tl = [];
  const tt = (s, size = 12, a = '') => { tl.push(`<text x="${lx}" y="${ly}" font-size="${size}" ${a}>${s}</text>`); ly += size + 7; };
  tt('สัญลักษณ์เสา', 15, 'font-weight="700"');
  for (const [k, s] of [['ex', 'เสาเดิม — คงไว้'], ['rm', 'เสาเดิม — รื้อ (R33 ✕)'], ['nw', 'เสาใหม่'], ['q', 'ต้องยืนยัน (R33 "?" / ผมเสนอ)']]) { tl.push(`<rect x="${lx}" y="${ly - 11}" width="12" height="12" fill="${k === 'ex' || k === 'nw' ? C[k] : '#fff'}" stroke="${C[k]}" stroke-width="2" ${k === 'q' ? 'stroke-dasharray="3 2"' : ''}/><text x="${lx + 20}" y="${ly}" font-size="12">${s}</text>`); ly += 20; }
  ly += 8; tt('ตารางเสา (ชั้นนี้)', 15, 'font-weight="700"');
  for (const c of COLS.filter((c) => c.lvls.includes(lv) && c.note)) { tl.push(`<text x="${lx}" y="${ly}" font-size="11"><tspan font-weight="700" fill="${C[c.kind]}">${c.id || ''}</tspan><tspan x="${lx + 50}">(${c.x.toFixed(2)}, ${c.y.toFixed(2)})</tspan><tspan x="${lx + 155}">${c.note}</tspan></text>`); ly += 17; }
  const notes = lv === 'G' ? [(C6 ? 'R53: ทุกคอร์ทห่างกริด 2 ข้างละ 1.20 ม. (เหมือน B1) · หน้า 2.90 / หลัง 2.15 ม. · ทางเดินกลาง 2.40 ม.' : 'ชั้น 1: โถงสนามยาวถึงผนังทึบเขตที่ดิน · คอร์ท B2–B6 + เวทีมวย (R33)'), 'R53 อาคารหลัง GF: ผนังหน้าขยับมา y 24.10 (ใต้พื้นเดิม) · ห้องลึกขึ้น 1.00 ม. · พื้นที่เช่ารวม 3 ชั้น ≈ 158 ตร.ม. (เดิม ≈ 120)', 'พิกเกิลบอล: รั้ว chain-link แนวกริด 2 (ท้ายคอร์ทเหลือ 2.35 ม.) · ขอบตะวันออก 1.50 ม. = แนวเขตที่ดิน x 29.45', 'ย้ายมะพร้าว P2, P3 ออก (ทำผนังเขตไม่ได้) · ผนังทึบตรงตลอดแนว · เหลือ P1 ด้านหลัง (วงประ 2.0 ม.)', 'ทุกเสาใหม่ต้องให้วิศวกรโครงสร้างตรวจฐานราก/ทรัสก่อน']
    : lv === 'U' ? ['R53 ชั้น 2: พื้นยื่นใหม่ 1.00 ม. (y 23.10) ด้วยคานเหล็กยื่นจากเสาแถว 4 · ห้องลึก 5.70 ม. · ห้อง x 17.6–20.2 เป็นห้องให้เช่า 14.8 ตร.ม.', 'catwalk 0.80 ม. ที่ +3.50 ยึดหน้านอกเสา E0–E3 + เหล็กแขวนจากขอบหลังคา · เข้าอาคารหลังทางห้องเชื่อม (เดิมห้องนวด)', 'เสาแถว 4/5: เดิมถึง +3.50 · ห้ามเจาะพื้นเดิม', 'ไม่มีสะพานจากปีกตะวันตก (ลบแล้ว)']
    : ['R53 ชั้น 3: พื้นยื่นถึง y 23.10 · สตูดิโอให้เช่า 91 ตร.ม. (เดิม 78) · ลาน 35 ตร.ม. (เดิม 30)', 'เสาแถว 4/5 ช่วง +3.50→หลังคา = เสาใหม่ต่อจากเสาเดิม', 'ต้องตรวจว่าเสา/ฐานรากเดิมรับเพิ่มอีก 1 ชั้น + หลังคาได้หรือไม่', 'ไม่มี Sky Trail (ลบแล้ว) · S1 เป็นบันไดเดียว'];
  ly += 10; tt('หมายเหตุ', 15, 'font-weight="700"'); for (const n of notes) tt('• ' + n, 11.5);

  const title = lv === 'G' ? 'MY PLACE / R53 — สรุปผัง ชั้น 1 (±0.00) + ตำแหน่งเสา' + ' · 6 คอร์ทแบด' : lv === 'U' ? 'MY PLACE / R53 — สรุปผัง ชั้น 2 (+3.50) + ตำแหน่งเสา' : 'MY PLACE / R53 — สรุปผัง ชั้น 3 (+7.00) + ตำแหน่งเสา';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif">
<rect width="100%" height="100%" fill="#fff"/>
<text x="${MX}" y="52" font-size="28" font-weight="700">${title}</text>
<text x="${MX}" y="82" font-size="14" fill="#555">ตามที่ผมเข้าใจจากสเปก vD6 (กริดเสา) + ผัง R33 ของคุณ · กริดตัวอักษร A–E = แนวตั้ง (x) · ตัวเลข 0–5 = แนวนอน (y) · ทิศเหนือขึ้นบน · เมตร · ไม่ใช่แบบก่อสร้าง</text>
${o.join('\n')}
${tl.join('\n')}
</svg>`;
}
fs.mkdirSync(path.join(here, 'plans'), { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [lv, n] of [['G', 'GF'], ['U', 'L2'], ['T', 'L3']]) {
  const svg = sheet(lv); const name = `summary_${n}_R53`;
  fs.writeFileSync(path.join(here, 'plans', name + '.svg'), svg);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: path.join(here, 'plans', name + '.png') }); await page.close(); console.log('ok', name, W, H);
}
await browser.close();
