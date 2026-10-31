// R46 summary: whole building, 3 floors, with the column layout as understood from the spec (vD6 grids) + the user's R33 marks.
// usage: node plan_summary_r46.mjs → plans/summary_GF_R46, summary_L2_R46, summary_L3_R46 (.svg/.png)
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
  const notch = [[11.45, 12.75], [14.8, 16.1]];
  if (lv === 'G') {
    R(-3.7, 22.3, -10.15, 24.1, { fill: '#f4f7f4' });
    { let y = -10.4; for (const [a, b] of notch) { R(-3.9, -3.7, y, a, { fill: '#555' }); R(-3.9, -2.7, a - 0.2, a, { fill: '#555' }); R(-3.9, -2.7, b, b + 0.2, { fill: '#555' }); R(-2.9, -2.7, a, b, { fill: '#555' }); y = b; } R(-3.9, -3.7, y, 24.1, { fill: '#555' }); }
    R(-3.9, 22.3, -10.4, -10.15, { fill: '#555' }); R(22.25, 22.35, -10.15, 24.1, { fill: '#9cc9e3' });
    T(-5.3, 5, 'ผนังทึบเขตที่ดิน (โถงชนผนัง)', 9, { rot: -90, fill: '#555' });
    // courts
    for (const [x0, y0, n] of [[5.55, -8.4, 'B2'], [12.85, -8.4, 'B3'], [-1.8, 9.7, 'B4'], [5.55, 9.7, 'B5'], [12.85, 9.7, 'B6']]) { R(x0, x0 + 6.1, y0, y0 + 13.4, { fill: '#cfe8cf', stroke: '#4c8a3a' }); L(x0, y0 + 6.7, x0 + 6.1, y0 + 6.7, { stroke: '#333' }); T(x0 + 3.05, y0 + 3.3, n, 13, { bold: true, fill: '#2f6b2f' }); }
    R(-1.8, 4.25, -8.7, -1.22, { fill: '#c7d3f0' }); R(-3.72, 4.08, -1.22, 6.58, { fill: '#5b7fe0', stroke: '#1d3c99' }); R(-2.82, 3.18, -0.32, 5.68, { stroke: '#fff', sw: 1.5 }); T(0.18, 2.9, 'เวทีมวยหลัก 6×6 (+0.90)', 10, { bold: true, fill: '#10235e' });
    R(-1.33, 2.67, -7.7, -3.7, { fill: '#e57373', stroke: '#8b1d1d' }); T(0.67, -5.8, 'เวทีซ้อม 3×3', 9, { bold: true });
    T(10.2, 5.6, 'ทางเดินกลาง (cross-aisle)', 9, { fill: '#777' });
    // catwalk (overhead) + pickleball
    R(22.5, 23.7, -9.2, 30.1, { stroke: '#1d4ed8', dash: '5 3' }); T(23.1, 4, 'catwalk +4.50 (เหนือศีรษะ)', 8, { rot: -90, fill: '#1d4ed8' });
    for (const y0 of [-8.0, 6.4]) { R(24.5, 31.1, y0 - 1, y0 + 14.4, { fill: '#dbe7f7', stroke: '#5b7fb0' }); T(27.8, y0 + 6.7, 'Pickleball', 9, { fill: '#345' }); }
    // front: entrance court + C1 / C2 towers
    R(1.4, 20.1, -13.4, -10.4, { fill: '#e8f3f8' }); T(10.75, -12.9, 'ลานทางเข้า + บ่อปลาคาร์ฟ', 8.5, { fill: '#456' });
    // rear GF (R40)
    for (const [x0, x1, y0, y1, n, c] of [[-1.8, 0.4, 25.1, 27.15, 'WC พิการ', '#efe6f7'], [-1.8, 0.4, 27.15, 30, 'WC ญ', '#f8e6ee'], [0.4, 1.6, 25.1, 30, '', '#e9eef2'], [1.6, 3.6, 25.1, 27.15, 'คีออสก์', '#fff3c4'], [1.6, 3.6, 27.15, 30, 'WC ช', '#e0ecf7'], [3.6, 5.5, 25.1, 30, 'ล็อกเกอร์ ญ', '#f8e8ef'], [5.5, 7.4, 25.1, 30, 'ล็อกเกอร์ ช', '#e4eef8'], [7.4, 10.2, 25.1, 30, 'ร้านของที่ระลึก', '#fcefd3'], [10.2, 15.2, 25.1, 30, 'คลินิก', '#e4f2e7'], [15.2, 17.7, 25.1, 30, 'ให้เช่า L1', '#fff3c4'], [17.7, 20.2, 25.1, 30, 'ให้เช่า L2', '#fff3c4'], [20.2, 22.2, 25.1, 30, 'WC พนง.', '#e8edf0']]) room(x0, x1, y0, y1, c, n, 7);
    R(3.4, 22.2, 30.3, 33.4, { fill: '#e3f0d8' }); T(13, 32.0, 'สนามหญ้า — ภูมิทัศน์ในอนาคต', 9, { fill: '#2f6b2f' });
  } else {
    // upper floors: hall below = void, roof outline
    R(-3.9, 22.3, -10.4, 24.1, { stroke: '#999', dash: '6 4' }); T(9.2, 8.0, lv === 'U' ? 'โถงสนาม (ความสูง 2 ชั้น) — void' : 'หลังคาโถง (space frame)', 12, { fill: '#999' });
    if (lv === 'U') { R(22.5, 23.7, -9.2, 21.85, { fill: '#cfe0fb', stroke: '#1d4ed8' }); R(22.3, 23.7, 23.4, 30.1, { fill: '#cfe0fb', stroke: '#1d4ed8' }); T(23.1, 4, 'catwalk +4.50 (กริด E–พิกเกิลบอล)', 9, { rot: -90, fill: '#1d4ed8', bold: true }); T(23.1, 26.6, 'ชานพัก +3.50', 8, { rot: -90, fill: '#1d4ed8' }); }
    if (lv === 'U') {
      R(0.4, 22.2, 28.8, 30, { fill: '#e6edf2' }); T(11, 29.3, 'ทางเดินด้านหลัง 1.20', 8);
      for (const [x0, x1, n, c] of [[-1.8, 3.6, 'ต้อนรับ+เลานจ์', '#f4efe4'], [3.6, 5.8, 'Red Light 1', '#fde4e1'], [5.8, 8.0, 'Red Light 2', '#fde4e1'], [8.0, 10.6, 'HBOT 1', '#ececec'], [10.6, 13.2, 'HBOT 2', '#ececec'], [13.2, 17.6, 'ซาวน่า+น้ำเย็น', '#e3f2fb'], [17.6, 20.2, 'Quiet Lounge', '#f1ecf7'], [20.2, 22.2, 'นวด', '#f7efe4']]) room(x0, x1, 24.1, 28.8, c, n, 7);
      room(-1.8, 0.4, 27.9, 30, '#e0ecf7', 'WC', 7);
    } else {
      for (const [x0, x1, y0, y1, n, c] of [[-1.8, 0.4, 24.1, 27.6, 'เก็บของ', '#eee'], [-1.8, 0.4, 27.6, 30, 'WC+ฝักบัว', '#e0ecf7'], [0.4, 4.2, 24.1, 30, 'ล็อบบี้', '#f4efe4'], [4.2, 17.2, 24.1, 30, 'สตูดิโอฟิตเนส 78 ตร.ม.', '#f3eee4'], [17.2, 22.2, 24.1, 30.1, 'ลานฟิตเนส 30 ตร.ม.', '#ead8b5']]) room(x0, x1, y0, y1, c, n, 8);
    }
  }
  // S1 stair (all levels)
  R(-1.8, 3.2, 30.1, 32.9, { fill: '#fff4e2', stroke: C.tw, sw: 1.5 }); for (let x = -0.6; x < 1.74; x += 0.26) L(x, 30.15, x, 32.85, { stroke: C.tw, sw: 0.5 }); T(0.7, 33.4, 'บันได S1', 9, { bold: true, fill: C.tw });
  // palms
  for (const [x, y, n] of [[-4.0, 23.8, 'P1'], [-3.67, 15.46, 'P2'], [-3.24, 12.08, 'P3']]) { Ci(x, y, 0.45, { fill: '#7fb36a', stroke: '#2f6b2f' }); T(x - 1.0, y - 0.15, n, 9, { bold: true, fill: '#2f6b2f' }); }
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
  // hall portal frame lines A & E (spec: portal frames on grid 1 / 5) — existing, full height to the roof
  add('GUT', 0.2, -10.15, 'ex', 'A0', 'portal เดิม (แนวหน้าโถง)');
  add('GUT', 0.2, -1.65, 'q', 'A1?', 'portal เดิม — R33 ใส่ ? · ชิดขอบเวทีหลัก 0.43 ม.');
  add('GUT', 0.2, 7.35, 'ex', 'A2', 'portal เดิม + หอ W0');
  add('GUT', 0.2, 16.35, 'rm', 'A3', 'R33 ✕ — อยู่กลางคอร์ท B4 · รื้อ แล้วถ่ายแรงไป W3');
  add('GUT', 20.2, -10.15, 'ex', 'E0', 'portal เดิม');
  add('GUT', 20.2, -1.65, 'ex', 'E1', 'portal เดิม · ยึด catwalk');
  add('GUT', 20.2, 7.35, 'ex', 'E2', 'portal เดิม + หอ E0 · ยึด catwalk');
  add('GUT', 20.2, 16.35, 'ex', 'E3', 'R33 คงเดิม · ยึด catwalk');
  add('GUT', 10.2, 7.35, 'q', 'C2?', 'เสาเหล็กกลมเดิมใต้หอ C0 (สเปก) — R33 ใส่ ?');
  // new west line (R33: W-line, W3 moved out 0.90)
  add('GUT', -2.23, -1.65, 'nw', 'W1', 'ใหม่ (R33) · รับหลังคาส่วนขยายฝั่งตะวันตก');
  add('GUT', -3.13, 16.35, 'nw', 'W3', 'ใหม่ (R33) ขยับออก 0.90 ให้พ้นคอร์ท B4 · รับแทน A3');
  add('GUT', -2.23, -10.15, 'q', 'W0?', 'ผมเสนอ: ปลายหลังคาด้านหน้า');
  add('GUT', -2.23, 7.35, 'q', 'W2?', 'ผมเสนอ: แนวกริด 2 (นอกเวทีหลัก)');
  add('GUT', -2.23, 24.1, 'q', 'W4?', 'ผมเสนอ: มุมผนังหลังโถง');
  // rear building rows 4 & 5: existing to +3.50, new above
  for (const [x, l] of GX) { add('G', x, 25.1, 'ex', l + '4', 'RC เดิม (GF→+3.50)'); add('G', x, 28.1, 'ex', l + '5', 'RC เดิม (GF→+3.50)'); add('U', x, 25.1, 'ex', l + '4', ''); add('U', x, 28.1, 'ex', l + '5', ''); add('T', x, 25.1, 'nw', l + '4', ''); add('T', x, 28.1, 'nw', l + '5', ''); }
  // S1 corners, catwalk landing posts, front towers
  for (const [x, y, i] of [[-1.75, 30.2, 1], [-1.75, 32.8, 2], [3.15, 32.8, 3], [3.15, 30.2, 4]]) add('GUT', x, y, 'nw', 'S' + i, i === 1 ? 'ใหม่ · เสา 4 มุมบันได S1 GF→หลังคา' : '');
  for (const [x, y, i] of [[22.5, 23.45, 1], [23.6, 23.45, 2], [22.5, 26.3, 3], [23.6, 26.3, 4], [22.5, 29.95, 5], [23.6, 29.95, 6]]) add('GU', x, y, 'nw', i === 1 ? 'K1–6' : '', i === 1 ? 'ใหม่ · เสาเหล็กชานพัก +3.50' : '');
  add('G', 7.35, -11.3, 'nw', 'C1', 'ใหม่ · แกน H250 หอ C1 (สเปก)'); add('G', 14.15, -11.3, 'nw', 'C2t', 'ใหม่ · แกน H250 หอ C2 (สเปก)');
  for (const c of COLS) if (c.lvls.includes(lv)) col(c.x, c.y, c.kind, c.id);

  // legend + schedule
  const lx = X(XMAX) + 30; let ly = MY + 10; const tl = [];
  const tt = (s, size = 12, a = '') => { tl.push(`<text x="${lx}" y="${ly}" font-size="${size}" ${a}>${s}</text>`); ly += size + 7; };
  tt('สัญลักษณ์เสา', 15, 'font-weight="700"');
  for (const [k, s] of [['ex', 'เสาเดิม — คงไว้'], ['rm', 'เสาเดิม — รื้อ (R33 ✕)'], ['nw', 'เสาใหม่'], ['q', 'ต้องยืนยัน (R33 "?" / ผมเสนอ)']]) { tl.push(`<rect x="${lx}" y="${ly - 11}" width="12" height="12" fill="${k === 'ex' || k === 'nw' ? C[k] : '#fff'}" stroke="${C[k]}" stroke-width="2" ${k === 'q' ? 'stroke-dasharray="3 2"' : ''}/><text x="${lx + 20}" y="${ly}" font-size="12">${s}</text>`); ly += 20; }
  ly += 8; tt('ตารางเสา (ชั้นนี้)', 15, 'font-weight="700"');
  for (const c of COLS.filter((c) => c.lvls.includes(lv) && c.note)) { tl.push(`<text x="${lx}" y="${ly}" font-size="11"><tspan font-weight="700" fill="${C[c.kind]}">${c.id || ''}</tspan><tspan x="${lx + 50}">(${c.x.toFixed(2)}, ${c.y.toFixed(2)})</tspan><tspan x="${lx + 155}">${c.note}</tspan></text>`); ly += 17; }
  const notes = lv === 'G' ? ['ชั้น 1: โถงสนามยาวถึงผนังทึบเขตที่ดิน · คอร์ท B2–B6 + เวทีมวย (R33)', 'อาคารหลัง GF ตาม R40 · ด้านหลังเป็นสนามหญ้า (ไม่มีสระ)', 'ช่วงคานหลังคา A–E = 20.0 ม. (space frame) · ส่วนขยายฝั่งตะวันตก 3.9 ม. ต้องมีแนวเสา W', 'ทุกเสาใหม่ต้องให้วิศวกรโครงสร้างตรวจฐานราก/ทรัสก่อน']
    : lv === 'U' ? ['ชั้น 2 (+3.50): Wellness บนพื้น คสล. เดิม (R42) · ทางเดินอยู่ด้านหลัง', 'catwalk +4.50 ยึดเสาแนว E (E1–E3) · ชานพัก +3.50 บนเสาเหล็กใหม่ K1–6', 'เสาแถว 4/5: เดิมถึง +3.50 · ห้ามเจาะพื้นเดิม', 'ไม่มีสะพานจากปีกตะวันตก (ลบแล้ว)']
    : ['ชั้น 3 (+7.00): ฟิตเนส (R44) — ชั้นใหม่ทั้งชั้น', 'เสาแถว 4/5 ช่วง +3.50→หลังคา = เสาใหม่ต่อจากเสาเดิม', 'ต้องตรวจว่าเสา/ฐานรากเดิมรับเพิ่มอีก 1 ชั้น + หลังคาได้หรือไม่', 'ไม่มี Sky Trail (ลบแล้ว) · S1 เป็นบันไดเดียว'];
  ly += 10; tt('หมายเหตุ', 15, 'font-weight="700"'); for (const n of notes) tt('• ' + n, 11.5);

  const title = lv === 'G' ? 'MY PLACE / R46 — สรุปผัง ชั้น 1 (±0.00) + ตำแหน่งเสา' : lv === 'U' ? 'MY PLACE / R46 — สรุปผัง ชั้น 2 (+3.50) + ตำแหน่งเสา' : 'MY PLACE / R46 — สรุปผัง ชั้น 3 (+7.00) + ตำแหน่งเสา';
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
  const svg = sheet(lv); const name = `summary_${n}_R46`;
  fs.writeFileSync(path.join(here, 'plans', name + '.svg'), svg);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: path.join(here, 'plans', name + '.png') }); await page.close(); console.log('ok', name, W, H);
}
await browser.close();
