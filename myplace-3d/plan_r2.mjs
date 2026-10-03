// Concept sheet for REV R2 "Recovery Courtyard": GF + garden, L2, L3 as zoning plans (north up). → plans/r2_concept.{svg,png}
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const S = 34, W = 2300, H = 1480;
const f = (n) => n.toFixed(1);
const panel = (ox, oy, ymax) => { const X = (x) => ox + (x + 4.6) * S, Y = (y) => oy + (ymax - y) * S; return { X, Y }; };
const out = [];
const draw = (ox, oy, ymax, title, items) => {
  const { X, Y } = panel(ox, oy, ymax);
  out.push(`<text x="${ox}" y="${oy - 14}" font-size="22" font-weight="700">${title}</text>`);
  for (const it of items) {
    const [x0, x1, y0, y1, fill, label, sub, opt = {}] = it;
    out.push(`<rect x="${f(X(x0))}" y="${f(Y(y1))}" width="${f((x1 - x0) * S)}" height="${f((y1 - y0) * S)}" fill="${fill}" stroke="${opt.stroke ?? '#333'}" stroke-width="${opt.sw ?? 1.2}" ${opt.dash ? `stroke-dasharray="${opt.dash}"` : ''}/>`);
    if (label) out.push(`<text x="${f((X(x0) + X(x1)) / 2)}" y="${f((Y(y0) + Y(y1)) / 2 - (sub ? 3 : -4))}" font-size="${opt.fs ?? 12}" text-anchor="middle" font-weight="700" fill="${opt.tc ?? '#111'}" ${opt.rot ? `transform="rotate(-90 ${f((X(x0) + X(x1)) / 2)} ${f((Y(y0) + Y(y1)) / 2)})"` : ''}>${label}</text>`);
    if (sub) out.push(`<text x="${f((X(x0) + X(x1)) / 2)}" y="${f((Y(y0) + Y(y1)) / 2 + 12)}" font-size="10" text-anchor="middle" fill="${opt.tc ?? '#333'}">${sub}</text>`);
  }
  for (const y of [25.1, 28.1]) for (const x of [0.2, 5.2, 10.2, 15.2, 20.2]) out.push(`<rect x="${f(X(x) - 3)}" y="${f(Y(y) - 3)}" width="6" height="6" fill="#111"/>`);
  return { X, Y };
};
const C = { wet: '#bfe3f2', dry: '#f6efe2', med: '#e2f0e2', pub: '#eceff3', core: '#c9cdd2', open: '#f3e2c4', green: '#cfe6bf', hall: '#e7ecef' };
// GF + garden
const g = draw(60, 150, 37.6, '① ชั้นล่าง ±0.00 + ลานพักฟื้น (Recovery Courtyard)', [
  [-0.8, 22.3, 22.6, 25.0, C.hall, 'โถงแบด / ทางเดินหลังคอร์ท', '', { stroke: '#bbb' }],
  [-3.9, -1.8, 24.9, 30.1, C.core, 'บันไดหนีไฟ 1', '+ลิฟต์', { fs: 10 }],
  [-1.8, 5.2, 26.6, 30.0, C.pub, 'ล็อบบี้ + ต้อนรับ', 'เชื่อมลิฟต์ / ปีกตะวันตก'],
  [5.2, 10.2, 26.6, 30.0, C.wet, 'HBOT ×2', 'บนพื้นดิน (รับน้ำหนักได้)'],
  [10.2, 12.7, 26.6, 30.0, C.med, 'ตรวจ 1', '', { fs: 11 }], [12.7, 15.2, 26.6, 30.0, C.med, 'ตรวจ 2', '', { fs: 11 }],
  [15.2, 20.2, 26.6, 30.0, C.med, 'ยิมฟื้นฟู', 'ประตู 2.00 → สระ'], [20.2, 22.2, 26.6, 30.0, '#f6d6d6', 'Red', 'Light', { fs: 11 }],
  [-1.8, 22.2, 25.15, 26.6, '#e6e6e6', 'ทางเดินฟื้นฟู (Recovery Street) 1.40 ม. — ฝั่งโถงแบด กันเสียง', '', { fs: 11 }],
  [22.3, 25.1, 22.0, 28.0, C.core, 'แกนใหม่', 'บันไดหนีไฟ 2', { fs: 11 }],
  [25.15, 27.5, 22.2, 27.8, '#3f53a8', 'หลุมรับตก', '', { tc: '#fff', fs: 10 }],
  [23.2, 33.2, 28.6, 34.0, C.wet, 'ศาลาร้อน-เย็น (Thermal Pavilion)', 'เปลี่ยนชุด ช/ญ · ซาวน่า · สตีม · Cold Plunge ×2'],
  [23.0, 33.4, 34.0, 36.4, C.open, 'ลานพัก + เตียง', 'ใต้ชายคา'],
  [11.4, 21.4, 30.1, 35.6, C.open, '', ''], [13.4, 19.4, 31.6, 34.6, '#7fd0ea', 'สระ 3×6 ขอบ +0.80', '', { fs: 11 }],
  [-3.9, 11.3, 30.2, 34.0, C.green, 'สวนผู้สูงวัย + ราวจับ + สถานีบริหาร', ''],
  [5.0, 11.4, 30.1, 31.4, C.open, 'ลานนั่ง', '', { fs: 10 }],
]);
out.push(`<line x1="${f(g.X(-4.6))}" y1="${f(g.Y(34.1 + 0.15 * (-4.6 - 0.2)))}" x2="${f(g.X(34))}" y2="${f(g.Y(34.1 + 0.15 * (34 - 0.2)))}" stroke="#222" stroke-width="3"/>`);
out.push(`<text x="${f(g.X(26.0))}" y="${f(g.Y(26.0))}" font-size="11" fill="#c2561f" font-weight="700" transform="rotate(-90 ${f(g.X(25.25))} ${f(g.Y(25.0))})">กำแพงปีนผา 12 ม.</text>`);
out.push(`<rect x="${f(g.X(25.1))}" y="${f(g.Y(27.6))}" width="5" height="${f(5.2 * S)}" fill="#c2561f"/>`);
// L2
const l2 = draw(60, 760, 30.6, '② ชั้น 2 +3.50 (พื้นเดิม — ใช้งานเบาและแห้งเท่านั้น)', [
  [-1.8, 22.2, 24.1, 25.9, C.pub, 'ระเบียงชมแบด (สาธารณะ) 1.80 ม. — ผนังทึบกันเสียงกั้นห้อง', ''],
  [-1.8, 5.2, 25.9, 30.1, C.dry, 'เลานจ์สมาชิก + บาร์น้ำผลไม้', 'รับวิวสวน/มะพร้าว'],
  [5.2, 15.2, 25.9, 30.1, C.med, 'ห้องแล็บวิทยาศาสตร์การกีฬา', 'ลู่วิ่งวัดผล · Force plate · VO2 · จักรยาน'],
  [15.2, 17.7, 25.9, 30.1, C.dry, 'นวด 1', '', { fs: 11 }], [17.7, 20.2, 25.9, 30.1, C.dry, 'นวด 2', '', { fs: 11 }], [20.2, 22.2, 25.9, 30.1, C.dry, 'พนักงาน', 'ผ้า', { fs: 10 }],
  [22.3, 25.1, 22.0, 28.0, C.core, 'แกนใหม่', '→ ทางเดิน +4.50', { fs: 11 }],
  [-3.9, -1.8, 24.9, 30.1, C.core, 'บันได 1', '', { fs: 10 }],
  [-1.8, 22.2, 24.1, 30.1, 'none', '', '', { stroke: '#b44', dash: '10 5', sw: 1.6 }],
]);
// L3
const l3 = draw(1180, 760, 30.6, '③ ชั้น 3 +7.00', [
  [-1.8, 4.2, 24.1, 30.1, C.green, 'ลานโยคะ', 'ฝั่งตะวันตก · ใต้ทรงพุ่มมะพร้าว'],
  [4.2, 17.2, 24.1, 30.1, C.dry, 'สตูดิโอให้เช่า 78 ตร.ม.', 'กระจก 3 ด้าน เปิดสู่ลานโยคะ'],
  [17.2, 22.2, 24.1, 26.6, C.pub, 'WC อารย', '+ ล็อบบี้', { fs: 11 }], [17.2, 22.2, 26.6, 30.1, C.dry, 'ห้องเก็บของผู้เช่า', '', { fs: 11 }],
  [22.3, 25.1, 22.0, 28.0, C.core, 'แกนใหม่', '→ ดาดฟ้า +12', { fs: 11 }],
  [-3.9, -1.8, 24.9, 30.1, C.core, 'บันได 1', '', { fs: 10 }],
]);
const notes = [
  'แนวคิด R2 "Recovery Courtyard" — จัดใหม่ทั้งโซนหลังแบบไม่ยึดผังเดิม (เทียบกับ REV D.12)',
  '1. ของเปียกและหนักทั้งหมด (ซาวน่า สตีม Cold Plunge ฝักบัว HBOT) ลงพื้นดิน → พื้น คสล. เดิมชั้น 2 รับแค่ใช้งานเบา/แห้ง ไม่ต้องเดินท่อน้ำบนพื้นเดิม',
  '2. ทางเดินฟื้นฟูวิ่งตลอดแนวฝั่งโถงแบด (กันเสียง) ทุกห้องหันหน้าออกสวนทิศเหนือ แสงนุ่ม เงียบ · ระเบียงชมแบดสาธารณะ แยกจากห้องด้วยผนังทึบ',
  '3. แกนใหม่ทิศตะวันออก = บันไดหนีไฟชุดที่ 2 (แก้ปัญหาบันได 0.95 ม.) + ทางขึ้นทางเดิน +4.50 + ผนังปีนผา 12 ม. หน้าตาอาคาร · ยกเลิกชานพัก/บันไดลอยเดิม',
  '4. ศาลาร้อน-เย็นชั้นเดียว หลังคาสวน ปิดลานด้านตะวันออก: วงจร ซาวน่า → อาบน้ำเย็น → พักบนลาน → สระ → ยิมฟื้นฟู ครบในวงเดียว',
  '5. ลานโยคะย้ายไปฝั่งตะวันตกที่เงียบ ใต้ทรงพุ่มมะพร้าว · ห้องน้ำ/เก็บของชั้น 3 อยู่ข้างแกนใหม่ (ไม่ต้องเดินผ่านสตูดิโอ)',
  'ต้องตรวจ: ศาลาและแกนใหม่เป็นอาคารใหม่ (ฐานราก/ระยะร่น/พื้นที่ก่อสร้างเพิ่ม ≈ 70 ตร.ม.) · ห้องเปลี่ยนชุดในศาลาไกลจากโถงแบด (ผู้เล่นแบดใช้ห้องในปีกตะวันตก/ล็อบบี้แทน)',
];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Loma, 'Noto Sans Thai', sans-serif"><rect width="100%" height="100%" fill="#fff"/>
<text x="60" y="56" font-size="34" font-weight="700">ทางเลือกใหม่ R2 — "Recovery Courtyard" ผังแบ่งโซนอาคารด้านหลัง</text>
<text x="60" y="88" font-size="16" fill="#555">MY PLACE · ข้อเสนอแนวคิด (Concept) · ทิศเหนืออยู่ด้านบน · ขนาดตามโมเดล 3 มิติ snapshots_r2/</text>
${out.join('\n')}
<g transform="translate(60,1210)" font-size="15" fill="#222">${notes.map((n, i) => `<text y="${i * 36}" ${i === 0 ? 'font-weight="700" font-size="17"' : ''}>${n}</text>`).join('')}</g>
<g transform="translate(1180,1140)" font-size="13">${Object.entries({ 'เปียก/ร้อน-เย็น': C.wet, 'แห้ง/พักผ่อน': C.dry, 'การแพทย์/ฟื้นฟู': C.med, 'สาธารณะ/ทางเดิน': C.pub, 'แกนบันได/ลิฟต์': C.core, 'ลาน/ชานไม้': C.open, 'สวน/สีเขียว': C.green }).map(([t, c], i) => `<g transform="translate(${(i % 4) * 250},${Math.floor(i / 4) * 30})"><rect width="22" height="16" fill="${c}" stroke="#333"/><text x="30" y="13">${t}</text></g>`).join('')}</g>
</svg>`;
fs.writeFileSync(path.join(here, 'plans', 'r2_concept.svg'), svg);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, 'plans', 'r2_concept.png') });
await browser.close();
console.log('plan r2_concept');
