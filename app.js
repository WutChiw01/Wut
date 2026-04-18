/**
 * app.js — Main Application Logic
 * Disto Survey App — Solar Roof Assessment System v3.8
 */

import { LeicaDistoBluetooth } from './modules/bluetooth.js';
import {
  sphericalToCartesian, distance3D, horizontalDistanceFromTilt,
  verticalHeight, slopeAngle, pitchLabel, roofFaceArea, round2
} from './modules/calculator.js';
import { SolarLayoutEngine } from './modules/layout.js';
import { ReportGenerator } from './modules/report.js';
import {
  assessPurlin, assessTruss, calcSolarLoad, overallAssessment, validateTrussGeometry
} from './modules/structure.js';
import { TRUSS_PATTERNS } from './modules/truss_patterns.js';
import { TelegramBot } from './modules/telegram.js';
import { VoiceAssistant } from './modules/voice.js';
import { TrussSVG } from './modules/truss_svgs.js';

// ─── Constants ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'disto_survey_state_v1.3';

// ─── App State ─────────────────────────────────────────────────────────────────────────────
const State = {
  bluetooth: null,
  connected: false,
  btMode: 'ble', // 'ble' or 'keyboard'

  project: { name: '', address: '', surveyor: '', date: '' },

  // Roof Points (4 main + optional)
  points: {
    A: { label: 'A', desc: 'มุมล่างซ้าย\n(เชิงชาย)', d: null, alpha: null, beta: 0, x: null, y: null, z: null, measured: false },
    B: { label: 'B', desc: 'สันซ้าย\n(ยอดหลังคา)',  d: null, alpha: null, beta: null, x: null, y: null, z: null, measured: false },
    C: { label: 'C', desc: 'มุมล่างขวา\n(เชิงชาย)', d: null, alpha: null, beta: null, x: null, y: null, z: null, measured: false },
    D: { label: 'D', desc: 'สันขวา\n(ยอดหลังคา)',  d: null, alpha: null, beta: null, x: null, y: null, z: null, measured: false },
  },
  activePoint: 'A',
  lastMeasurement: { d: null, alpha: null },

  // Results
  roofResult: null,
  layoutResult: null,
  boqResult: null,
  pointHistory: [], 
  
  // Panel Config
  panel: { width: 1.13, height: 2.28 },
  panelWatt: 570,
  margins: { top: 0.3, bottom: 0.3, left: 0.3, right: 0.3 },
  panelGap: 0.01,
  isTwoFace: true,

  // Truss Wizard State (v1.4+)
  wizard: {
    active: false,
    pattern: null, // 'warren', 'pratt', 'howe'
    activePart: 'span',
    data: {},
    lastInputTime: 0
  },

  // Telegram Config (v1.5+)
  telegram: {
    token: '',
    chatId: '',
    useProxy: true
  },

  // Bot Mode (v2.0+)
  botMode: {
    active: false,
    chatId: null,
    step: null
  },
  
  // Modules
  voice: null,
  _engine: null, // SolarLayoutEngine instance
  _lastCanvasLayout: null
};

// ─── Utility & UI ────────────────────────────────────────────────────────────────────────
function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}

function showToast(msg, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { info: 'ℹ️ ', success: '✅', error: '❌', warning: '⚠️ ' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️ '}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.25s forwards';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.page;
      tabs.forEach(t => t.classList.remove('active'));
      pages.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`page-${target}`)?.classList.add('active');

      if (target === 'layout' && State.layoutResult) {
        if (State._lastCanvasLayout !== State.layoutResult) {
          setTimeout(() => {
            drawCanvas();
            State._lastCanvasLayout = State.layoutResult;
          }, 100);
        }
      }
    });
  });
}

function isIOS() {
  return [
    'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

function checkStandalone() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                    || window.navigator.standalone 
                    || document.referrer.includes('android-app://');
  
  const btn = document.getElementById('install-btn');
  if (btn) btn.style.display = isStandalone || !('BeforeInstallPromptEvent' in window || /iphone|ipad|ipod|android/i.test(navigator.userAgent)) ? 'none' : 'flex';
}

// ─── Bluetooth & Voice ──────────────────────────────────────────────────────────────────
function initBluetooth() {
  State.voice = new VoiceAssistant();
  State.bluetooth = new LeicaDistoBluetooth(
    (data) => {
      State.lastMeasurement.d = data.distance;
      if (data.tilt !== null) State.lastMeasurement.alpha = data.tilt;

      // Update live display
      const liveDistEl = document.getElementById('live-distance');
      if (liveDistEl) liveDistEl.textContent = data.distance.toFixed(3);
      
      const liveTiltEl = document.getElementById('live-tilt');
      if (liveTiltEl && data.tilt !== null) liveTiltEl.textContent = `มุมเงย: ${data.tilt.toFixed(1)}°`;

      // Update Visual Input if wizard active
      if (State.wizard.active) {
         const visualInput = document.getElementById('visual-input');
         if (visualInput) {
            visualInput.value = data.distance;
            confirmVisualMeasurement();
         }
      }

      // Update Bot Mode input
      if (State.botMode.active) {
        sendDataToBot(data.distance);
      }

      // Feedback
      if (data.source === 'ble') State.voice.speakQuick(data.distance);
      if (navigator.vibrate) navigator.vibrate(30);
    },
    (msg, type) => {
      showToast(msg, type, type === 'success' ? 3000 : 5000);
      updateBTStatus(type);
    }
  );

  if (isIOS()) {
    console.log('[Disto] iOS Dynamic UI Optimization');
    const badge = document.getElementById('ios-badge'); if (badge) badge.style.display = 'block';
    const warn = document.getElementById('ios-warning'); if (warn) warn.style.display = 'block';
    
    const bleBtn = document.getElementById('btn-connect-ble');
    if (bleBtn) {
      bleBtn.classList.remove('btn-primary');
      bleBtn.classList.add('btn-ghost');
      bleBtn.innerHTML = '<span class="btn-icon">🚫</span> (ไม่รองรับบน iPhone)';
      bleBtn.disabled = true;
    }
    
    setTimeout(() => {
      showToast('ตรวจพบ iPhone: แนะนำให้ใช้ Keyboard Mode นะครับ', 'info', 6000);
    }, 1500);
  }
}

function updateBTStatus(type) {
  const pill = document.getElementById('bt-status');
  if (!pill) return;
  const label = pill.querySelector('.bt-label');
  pill.className = 'bt-status-pill';

  if (type === 'success') {
    pill.classList.add('connected');
    State.connected = true;
    if (label) label.textContent = 'เชื่อมต่อ';
  } else if (type === 'error') {
    pill.classList.add('error');
    State.connected = false;
    if (label) label.textContent = 'ผิดพลาด';
  } else {
    State.connected = false;
    if (label) label.textContent = 'BT';
  }
}

// ─── Measurement Logic ──────────────────────────────────────────────────────────────────
function selectPoint(pointKey) {
  State.activePoint = pointKey;
  document.querySelectorAll('.point-card').forEach(el => {
    el.classList.toggle('active', el.dataset.point === pointKey);
  });

  const bearingInput = document.getElementById('input-bearing');
  if (bearingInput && State.points[pointKey].beta !== null) {
    bearingInput.value = State.points[pointKey].beta;
  }
}

function updatePointGrid() {
  Object.keys(State.points).forEach(key => {
    const pt = State.points[key];
    const card = document.querySelector(`.point-card[data-point="${key}"]`);
    if (card) {
      card.classList.toggle('measured', !!pt.measured);
      const valEl = card.querySelector('.point-value');
      if (valEl) valEl.textContent = pt.measured ? `${pt.d} ม. / ${pt.alpha}°` : '';
    }
  });
}

function recordMeasurement() {
  const d = State.lastMeasurement.d;
  const alphaInput = document.getElementById('input-tilt');
  const bearingInput = document.getElementById('input-bearing');

  const distance = d ?? parseFloat(document.getElementById('manual-dist').value);
  const alpha = State.lastMeasurement.alpha ?? parseFloat(alphaInput?.value || '0');
  const beta = parseFloat(bearingInput?.value || '0');

  if (!distance || isNaN(distance) || distance <= 0 || distance > 200) {
    showToast('กรุณายิงเลเซอร์หรือกรอกระยะทางก่อน', 'warning');
    return;
  }

  const key = State.activePoint;
  const pt = State.points[key];
  const { x, y, z } = sphericalToCartesian(distance, alpha, beta);

  pt.d = round2(distance);
  pt.alpha = round2(alpha);
  pt.beta = round2(beta);
  pt.x = round2(x);
  pt.y = round2(y);
  pt.z = round2(z);
  pt.measured = true;

  State.pointHistory.push(key);
  const undoBtn = document.getElementById('btn-undo-point');
  if (undoBtn) undoBtn.disabled = false;

  showToast(`บันทึกจุด ${key} สำเร็จ!`, 'success', 2000);
  if (navigator.vibrate) navigator.vibrate([30, 50]);
  
  updatePointGrid();
  updateCalcButton();
  persistState();

  State.voice.speak(`บันทึกจุด ${key} ${pt.d} เมตร`);

  const order = ['A', 'B', 'C', 'D'];
  const idx = order.indexOf(key);
  if (idx < order.length - 1) {
    setTimeout(() => selectPoint(order[idx + 1]), 400);
  }
}

function undoLastPoint() {
  const lastPt = State.pointHistory.pop();
  if (!lastPt) return;

  State.points[lastPt].measured = false;
  State.points[lastPt].d = null;
  
  if (State.pointHistory.length === 0) {
    const undoBtn = document.getElementById('btn-undo-point');
    if (undoBtn) undoBtn.disabled = true;
  }

  showToast(`ยกเลิกการบันทึกจุด ${lastPt}`, 'info');
  updatePointGrid();
  updateCalcButton();
  persistState();
}

function clearPoint(key) {
  const pt = State.points[key];
  Object.assign(pt, { d: null, alpha: null, beta: 0, x: null, y: null, z: null, measured: false });
  updatePointGrid();
  updateCalcButton();
}

function updateCalcButton() {
  const measured = Object.values(State.points).filter(p => p.measured).length;
  const btn = document.getElementById('btn-calculate');
  if (btn) {
    btn.disabled = measured < 3;
    btn.innerHTML = measured < 3
      ? `<span class="btn-icon">📋 </span> คำนวณ (ยังต้องการอีก ${3 - measured} จุด)`
      : `<span class="btn-icon">📋 </span> คำนวณมิติหลังคา (${measured} จุด)`;
  }
}

// ─── Core Calculations ───────────────────────────────────────────────────────────────────
function calculateRoof() {
  const measuredPoints = Object.values(State.points).filter(p => p.measured);
  if (measuredPoints.length < 3) {
    showToast('ต้องการอย่างน้อย 3 จุด เพื่อคำนวณพื้นฐาน', 'warning');
    return;
  }

  const { A, B, C, D } = State.points;

  // 1. Calculate basics 3D
  const eavePoint1 = A.measured ? A : null;
  const eavePoint2 = C.measured ? C : (B.measured ? B : null);
  const eaveLength = (eavePoint1 && eavePoint2) ? distance3D(eavePoint1, eavePoint2) : 0;

  const eaveRef  = A.measured ? A : C;
  const ridgeRef = B.measured ? B : D;
  const rafterLength = (eaveRef && ridgeRef) ? distance3D(eaveRef, ridgeRef) : 0;

  const ridgeLength = (B.measured && D.measured) ? distance3D(B, D) : null;
  const slope = (eaveRef && ridgeRef) ? slopeAngle(eaveRef, ridgeRef) : 0;
  const pitch = pitchLabel(slope);

  const trueArea = rafterLength && eaveLength
    ? ((eaveLength + (ridgeLength ?? eaveLength)) / 2) * rafterLength
    : 0;

  const totalArea = State.isTwoFace ? trueArea * 2 : trueArea;

  State.roofResult = {
    eaveLength: round2(eaveLength),
    ridgeLength: round2(ridgeLength),
    rafterLength: round2(rafterLength),
    slopeAngle: round2(slope),
    pitchLabel: pitch,
    trueArea: round2(trueArea),
    totalArea: round2(totalArea),
    points: { A, B, C, D }
  };

  // 2. Exact Trapezoid if 4 points are measured
  if (A.measured && B.measured && C.measured && D.measured) {
    const res = roofFaceArea(A, B, C, D);
    State.roofResult = {
      ...State.roofResult,
      eaveLength: res.eaveLength,
      ridgeLength: res.ridgeLength,
      rafterLength: res.rafterLength,
      trueArea: res.trueArea,
      slopeAngle: res.slopeAngle,
      pitchLabel: pitchLabel(res.slopeAngle),
      totalArea: State.isTwoFace ? res.trueArea * 2 : res.trueArea
    };
  }

  // Update UI
  const R = State.roofResult;
  set('res-eave',   R.eaveLength   !== null ? `${R.eaveLength} ม.`   : '-');
  set('res-ridge',  R.ridgeLength  !== null ? `${R.ridgeLength} ม.`  : '-');
  set('res-rafter', R.rafterLength !== null ? `${R.rafterLength} ม.` : '-');
  set('res-slope',  R.slopeAngle   !== null ? `${R.slopeAngle}°`     : '-');
  set('res-pitch',  R.pitchLabel   ?? '-');
  set('res-area1',  R.trueArea     !== null ? `${R.trueArea} ตร.ม.`  : '-');
  set('res-area2',  R.totalArea    !== null ? `${R.totalArea} ตร.ม.` : '-');

  const resSection = document.getElementById('results-section');
  if (resSection) resSection.style.display = 'block';
  
  showToast('คำนวณมิติหลังคาสำเร็จ!', 'success');

  updateReportSummary();
  persistState();
  calculateLayout();

  setTimeout(() => {
    const layoutTab = document.querySelector('.nav-tab[data-page="layout"]');
    if (layoutTab) layoutTab.click();
  }, 800);
}

function calculateLayout() {
  if (!State.roofResult || !State.roofResult.eaveLength) return;

  const R = State.roofResult;
  const eave = R.eaveLength || 0;
  const rafter = R.rafterLength || (R.eaveLength * 0.7);

  const engine = new SolarLayoutEngine(
    { eaveLength: eave, rafterLength: rafter },
    State.panel,
    State.margins,
    State.panelGap
  );

  const { best } = engine.getBestLayout();
  State._engine = engine;
  State.layoutResult = best;

  const estPower = best.count * State.panelWatt;
  const boq = engine.calcBOQ(best);
  boq.estimatedPower = estPower;
  State.boqResult = boq;

  // UI
  set('layout-count', `${best.count} แผง`);
  set('layout-orient', best.orientation === 'Portrait' ? 'แนวตั้ง (Portrait)' : 'แนวนอน (Landscape)');
  set('layout-cols-rows', `${best.cols} × ${best.rows}`);
  set('layout-power', `${(estPower / 1000).toFixed(2)} kWp`);
  set('layout-area-cover', `${best.coveredArea} ตร.ม.`);

  set('boq-panels',    boq.panels);
  set('boq-rails',     `${boq.rails.count} เส้น (${boq.rails.length} ม./เส้น)`);
  set('boq-lfeet',     boq.lFeet);
  set('boq-midclamp',  boq.midClamps);
  set('boq-endclamp',  boq.endClamps);

  setTimeout(drawCanvas, 200);
}

function drawCanvas() {
  const canvas = document.getElementById('layout-canvas');
  if (!canvas || !State.layoutResult || !State._engine) return;
  const w = canvas.parentElement.clientWidth - 20;
  canvas.width = w;
  canvas.height = Math.round(w * 9 / 16);
  State._engine.drawCanvas(canvas, State.layoutResult);
}

// ─── Structural Assessment ───────────────────────────────────────────────────────────────
const structMeasurements = [];
const memberSizes = [];

const STRUCT_LABELS = {
  purlin_spacing: 'ระยะห่างแป',
  truss_spacing:  'ระยะห่างโครงถัก',
  truss_span:     'ช่วงพาดโครงถัก',
  purlin_span:    'ช่วงพาดแป',
  ridge_height:   'ความสูงสัน',
  eave_height:    'ความสูงเชิงชาย',
  overhang:       'ระยะยื่นเชิงชาย',
  other:          'อื่นๆ',
};

const MEMBER_LABELS = {
  purlin_depth:       'ความลึกแป (Purlin H)',
  truss_top_chord:    'โครงทรัสส่วนบน (Top Chord)',
  truss_bottom_chord: 'โครงทรัสส่วนล่าง (Bottom Chord)',
  rafter_depth:       'ความลึกแป้นรอด (Rafter)',
  other_member:       'ชิ้นส่วนอื่นๆ',
};

function recordStructMeasurement() {
  const d = State.lastMeasurement.d ?? parseFloat(document.getElementById('struct-manual')?.value);
  if (!d || isNaN(d) || d <= 0) {
    showToast('กรุณายิงเลเซอร์หรือกรอกระยะก่อน', 'warning');
    return;
  }

  const target = document.getElementById('struct-target')?.value || 'other';
  const customLabel = document.getElementById('struct-custom-label')?.value;
  const label = target === 'other' && customLabel ? customLabel : (STRUCT_LABELS[target] || 'วัดระยะ');

  const entry = {
    id: Date.now(),
    label,
    target,
    value: round2(d),
    time: new Date().toLocaleTimeString('th-TH'),
  };

  structMeasurements.push(entry);
  renderStructList();

  // Auto-fill form fields
  const fieldMap = {
    purlin_spacing: 'purlin-spacing',
    purlin_span: 'purlin-span',
    truss_spacing: 'truss-spacing',
    truss_span: 'truss-span'
  };
  if (fieldMap[target]) {
    const el = document.getElementById(fieldMap[target]);
    if (el) el.value = round2(d);
  }

  showToast(`บันทึก "${label}": ${round2(d)} ม.`, 'success', 2000);
}

function renderStructList() {
  const container = document.getElementById('struct-list');
  if (!container) return;
  if (structMeasurements.length === 0) {
    container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text3);font-size:13px">ยังไม่มีรายการวัด</div>';
    return;
  }
  const rows = structMeasurements.map((e, i) => `
    <tr>
      <td style="font-size:11px;color:var(--text3)">${e.time}</td>
      <td style="font-weight:600;color:var(--text)">${e.label}</td>
      <td class="num" style="color:var(--accent-l);font-weight:700">${e.value} ม.</td>
      <td style="text-align:center"><button onclick="deleteStructEntry(${i})" class="btn-del">×</button></td>
    </tr>
  `).join('');
  container.innerHTML = `<table class="boq-table"><tbody>${rows}</tbody></table>`;
}

function deleteStructEntry(i) {
  structMeasurements.splice(i, 1);
  renderStructList();
}

// 2-Shot Method
let _calcHeightTimeout = null;
function calcMemberHeight() {
  if (_calcHeightTimeout) clearTimeout(_calcHeightTimeout);
  _calcHeightTimeout = setTimeout(() => {
    const d1 = parseFloat(document.getElementById('shot1-dist')?.value);
    const a1 = parseFloat(document.getElementById('shot1-tilt')?.value);
    const d2 = parseFloat(document.getElementById('shot2-dist')?.value);
    const a2 = parseFloat(document.getElementById('shot2-tilt')?.value);
    const resultEl  = document.getElementById('height-result');
    const mmEl      = document.getElementById('calc-height-mm');
    const mEl       = document.getElementById('calc-height-m');
    const saveBtn   = document.getElementById('btn-save-height');

    if (!d1 || !d2 || isNaN(d1) || isNaN(d2)) {
      if (resultEl) resultEl.style.display = 'none';
      if (saveBtn) saveBtn.disabled = true;
      return;
    }

    const Z1 = d1 * Math.sin((a1 || 90) * Math.PI / 180);
    const Z2 = d2 * Math.sin((a2 || 90) * Math.PI / 180);
    const H  = Z2 - Z1;

    if (H > 0) {
      if (mmEl) mmEl.textContent = `${(H * 1000).toFixed(1)} มม.`;
      if (mEl) mEl.textContent = `= ${H.toFixed(3)} ม.`;
      if (resultEl) resultEl.style.display = 'block';
      if (saveBtn) saveBtn.disabled = false;
      window._pendingHeight = { Hmm: H * 1000, Hm: H, d1, d2, a1, a2 };
    } else {
      if (resultEl) resultEl.style.display = 'none';
      if (saveBtn) saveBtn.disabled = true;
    }
  }, 200);
}

function captureShot(num) {
  const d = State.lastMeasurement.d;
  const a = State.lastMeasurement.alpha;
  if (!d) return showToast('ยิงเลเซอร์ก่อนกดบันทึก', 'warning');
  
  const distEl = document.getElementById(`shot${num}-dist`);
  const tiltEl = document.getElementById(`shot${num}-tilt`);
  if (distEl) distEl.value = d;
  if (tiltEl && a !== null) tiltEl.value = round2(a);
  
  showToast(`Capture Shot ${num} สำเร็จ`, 'success', 1500);
  calcMemberHeight();
}

function saveMemberHeight() {
  const pending = window._pendingHeight;
  if (!pending) return;
  const saveAs = document.getElementById('height-save-as')?.value || 'other_member';
  const label = MEMBER_LABELS[saveAs];

  memberSizes.push({
    id: Date.now(), label, Hmm: pending.Hmm, Hm: pending.Hm, 
    time: new Date().toLocaleTimeString('th-TH')
  });

  if (saveAs === 'purlin_depth') {
    const el = document.getElementById('purlin-depth');
    if (el) el.value = Math.round(pending.Hmm);
  } else if (saveAs.includes('truss')) {
    const el = document.getElementById('truss-depth');
    if (el) el.value = round2(pending.Hm);
  }

  showToast(`บันทึก ${label} เรียบร้อย`, 'success');
  renderMemberSizeList();
  resetShots();
}

function renderMemberSizeList() {
  const container = document.getElementById('member-size-list');
  if (!container) return;
  if (memberSizes.length === 0) {
    container.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text3)">ยังไม่มีข้อมูล</div>';
    return;
  }
  const rows = memberSizes.map((e, i) => `
    <tr>
      <td><div style="font-weight:600">${e.label}</div></td>
      <td class="num" style="color:var(--green-l)">${Math.round(e.Hmm)} มม.</td>
      <td><button onclick="deleteMemberSize(${i})" class="btn-del">×</button></td>
    </tr>
  `).join('');
  container.innerHTML = `<table class="boq-table"><tbody>${rows}</tbody></table>`;
}

function resetShots() {
  ['shot1-dist', 'shot1-tilt', 'shot2-dist', 'shot2-tilt'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = id.includes('tilt') ? (id.includes('1') ? '88' : '89') : '';
  });
  const res = document.getElementById('height-result'); if (res) res.style.display = 'none';
  const btn = document.getElementById('btn-save-height'); if (btn) btn.disabled = true;
  window._pendingHeight = null;
}

// ─── Truss Wizard & Visual Hub ──────────────────────────────────────────────────────────
function openTrussSelector() {
  const container = document.getElementById('truss-pattern-grid');
  if (!container) return;
  container.innerHTML = Object.values(TRUSS_PATTERNS).map(p => `
    <div class="truss-pattern-item" onclick="selectTrussPattern('${p.id}')">
      <div class="truss-svg-thumb">${TrussSVG[p.svgKey] ? TrussSVG[p.svgKey]('none') : '📐'}</div>
      <div class="name">${p.label}</div>
    </div>
  `).join('');
  document.getElementById('modal-truss-selector').style.display = 'flex';
}

function selectTrussPattern(id) {
  State.wizard.active = true;
  State.wizard.pattern = id;
  State.wizard.activePart = 'span';
  State.wizard.data = {};
  document.getElementById('modal-truss-selector').style.display = 'none';
  document.getElementById('blueprint-placeholder').style.display = 'none';
  document.getElementById('blueprint-svg-container').style.display = 'block';
  document.getElementById('active-part-card').style.display = 'block';
  renderBlueprint();
}

function renderBlueprint() {
  const container = document.getElementById('blueprint-svg-container');
  if (!container || !State.wizard.pattern) return;
  const svgFunc = TrussSVG[State.wizard.pattern] || TrussSVG.warren;
  container.innerHTML = svgFunc(State.wizard.activePart);
  
  const label = document.getElementById('active-part-label');
  if (label) label.textContent = `กำลังวัด: ${State.wizard.activePart.toUpperCase()}`;
  
  const p = TRUSS_PATTERNS[State.wizard.pattern];
  const progress = (Object.keys(State.wizard.data).length / p.steps.length) * 100;
  const bar = document.getElementById('visual-progress-fill');
  if (bar) bar.style.width = `${progress}%`;
}

function selectBlueprintPart(partId) {
  State.wizard.activePart = partId;
  renderBlueprint();
}

function confirmVisualMeasurement() {
  const input = document.getElementById('visual-input');
  if (!input) return;
  const val = parseFloat(input.value);
  if (isNaN(val) || val <= 0) return;

  State.wizard.data[State.wizard.activePart] = val;
  const p = TRUSS_PATTERNS[State.wizard.pattern];
  const nextStep = p.steps.find(s => !State.wizard.data[s.id]);
  
  if (nextStep) {
    State.wizard.activePart = nextStep.id;
  } else {
    showToast('วัดครบทุกจุดแล้ว!', 'success');
    if (State.wizard.data.span) document.getElementById('truss-span').value = State.wizard.data.span;
    if (State.wizard.data.height) document.getElementById('truss-depth').value = State.wizard.data.height;
  }
  renderBlueprint();
}

// ─── Telegram Bot & Bot Mode ─────────────────────────────────────────────────────────────
function initBotMode() {
  const params = new URLSearchParams(window.location.search);
  const chatId = params.get('chatId');
  const step   = params.get('step');

  if (chatId && step) {
    State.botMode.active = true;
    State.botMode.chatId = chatId;
    State.botMode.step   = step;
    document.body.classList.add('is-bot-mode');

    if (step === 'REVIEW') {
      loadStateFromBot(chatId);
    } else {
      showToast(`โหมดเลเซอร์: ยิงระยะ ${step}`, 'info');
      const h = document.querySelector('.app-header'); if (h) h.style.display = 'none';
      const n = document.querySelector('.bottom-nav'); if (n) n.style.display = 'none';
    }
  }
}

async function loadStateFromBot(chatId) {
  try {
    const res = await fetch(`send_telegram.php?chatId=${chatId}`);
    const state = await res.json();
    if (state && state.data) {
      const d = state.data;
      State.project.name = d.projectName || '';
      
      const mapField = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) {
          el.value = val;
          return true;
        }
        return false;
      };

      mapField('proj-name', d.projectName);
      mapField('truss-span', d.MEASURE_SPAN);
      mapField('truss-depth', d.MEASURE_HEIGHT);
      mapField('purlin-depth', d.MEASURE_PURLIN_DEPTH ? parseFloat(String(d.MEASURE_PURLIN_DEPTH)) * 1000 : undefined); 
      mapField('purlin-spacing', d.MEASURE_PURLIN_SPACING);

      if (d.trussType) {
        State.wizard.pattern = d.trussType;
        const trType = document.getElementById('truss-type');
        if (trType) trType.value = d.trussType;
      }

      if (d.MEASURE_SPAN && d.MEASURE_HEIGHT) {
        showToast('โหลดข้อมูลสมบูรณ์ กำลังประเมินผล...', 'success');
        
        // Populate basic roof result as ESTIMATED
        State.roofResult = {
          span: parseFloat(String(d.MEASURE_SPAN)),
          height: parseFloat(String(d.MEASURE_HEIGHT)),
          trueArea: parseFloat(String(d.MEASURE_SPAN)) * 10,
          totalArea: parseFloat(String(d.MEASURE_SPAN)) * 10,
          slopeAngle: 30,
          pitchLabel: '1:1.7 (Estimated)',
          isEstimated: true
        };

        assessStructure();
        updateReportSummary();
        
        // Add "Estimated" badges to UI
        const addBadge = (id) => {
          const el = document.getElementById(id);
          if (el && !el.textContent.includes('Estimated')) {
            el.textContent += ' [Estimated]';
            el.style.color = 'var(--accent)';
          }
        };
        addBadge('res-area1');
        addBadge('res-area2');
        addBadge('res-slope');
        addBadge('res-pitch');

        persistState();
      } else {
        showToast('เชื่อมต่อบอทแล้ว รอข้อมูลการวัดเพิ่ม...', 'info');
      }
    }
  } catch (err) {
    console.error('Failed to load bot state', err);
    showToast('โหลดข้อมูลจากบอทไม่สำเร็จ', 'error');
  }
}

async function sendDataToBot(value) {
  if (!State.botMode.active) return;
  try {
    const { chatId, step } = State.botMode;
    const response = await fetch('send_telegram.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, step, text: String(value) })
    });
    if (response.ok) {
      showToast('ส่งค่าวัดกลับไปที่บอทแล้ว ✅', 'success');
    } else {
      throw new Error(`Server returned ${response.status}`);
    }
  } catch (err) {
    console.error('Bot send failed', err);
    showToast('ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่', 'error');
  }
}

async function testTelegram() {
  const config = State.telegram;
  if (!config.chatId) return showToast('ระบุ Chat ID ก่อนทดสอบ', 'warning');
  try {
    showToast('กำลังส่งข้อความทดสอบ...', 'info');
    const res = await TelegramBot.sendMessage(config, `🚀 <b>Disto Survey App</b>\nทดสอบการเชื่อมต่อ\nเวลา: ${new Date().toLocaleString()}`);
    if (res.ok) showToast('ส่งสำเร็จ!', 'success'); else throw new Error(res.description);
  } catch (err) {
    showToast(`ผิดพลาด: ${err.message}`, 'error');
  }
}

async function sendToTelegram() {
  if (!State.roofResult || !State.layoutResult) return showToast('คำนวณผลลัพธ์ก่อนส่งครับ', 'warning');
  try {
    showToast('กำลังเตรียม PDF...', 'info');
    const canvas = document.getElementById('layout-canvas');
    const gen = new ReportGenerator(State.project, State.roofResult, State.layoutResult, State.boqResult, canvas?.toDataURL(), State.assessmentResult);
    const doc = await gen.createDoc();
    const pdfBlob = doc.output('blob');
    const filename = `Report_${(State.project.name || 'Survey').replace(/\W/g, '_')}.pdf`;
    
    showToast('กำลังอัปโหลด...', 'info');
    const res = await TelegramBot.sendDocument(State.telegram, pdfBlob, filename, `📋 รายงานสำรวจ: ${State.project.name || '-'}`);
    if (res.ok) showToast('ส่งรายงานสำเร็จ!', 'success'); else throw new Error(res.description);
  } catch (err) {
    showToast(`ส่งไม่สำเร็จ: ${err.message}`, 'error');
  }
}

async function generatePDF() {
  if (!State.roofResult || !State.layoutResult) return showToast('กรุณาคำนวณข้อมูลก่อนออกรายงาน', 'warning');
  try {
    const canvas = document.getElementById('layout-canvas');
    const gen = new ReportGenerator(State.project, State.roofResult, State.layoutResult, State.boqResult, canvas?.toDataURL(), State.assessmentResult);
    await gen.generate();
    showToast('สร้างรายงานสำเร็จ!', 'success');
  } catch (err) {
    showToast('สร้าง PDF ไม่สำเร็จ', 'error');
    console.error(err);
  }
}

function updateTelegramState(shouldPersist = true) {
  State.telegram.token = document.getElementById('tg-token')?.value?.trim() || '';
  State.telegram.chatId = document.getElementById('tg-chat-id')?.value?.trim() || '';
  State.telegram.useProxy = document.getElementById('tg-use-proxy')?.classList.contains('on') || false;
  if (shouldPersist) persistState();
}

// ─── Persistence ──────────────────────────────────────────────────────────────────────────
function persistState() {
  try {
    updateTelegramState(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      project: State.project, 
      points: State.points, 
      activePoint: State.activePoint,
      roofResult: State.roofResult, 
      layoutResult: State.layoutResult, 
      boqResult: State.boqResult,
      pointHistory: State.pointHistory, 
      panel: State.panel, 
      panelWatt: State.panelWatt,
      margins: State.margins, 
      panelGap: State.panelGap, 
      isTwoFace: State.isTwoFace,
      wizard: State.wizard, 
      telegram: State.telegram,
      structMeasurements: structMeasurements,
      memberSizes: memberSizes,
      assessmentResult: State.assessmentResult
    }));
  } catch (e) { console.warn('Persist failed', e); }
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.project) State.project = { ...State.project, ...saved.project };
    if (saved.points) State.points = { ...State.points, ...saved.points };
    if (saved.telegram) State.telegram = { ...State.telegram, ...saved.telegram };
    if (saved.panel) State.panel = saved.panel;
    if (saved.panelWatt) State.panelWatt = saved.panelWatt;
    if (saved.roofResult) State.roofResult = saved.roofResult;
    if (saved.layoutResult) State.layoutResult = saved.layoutResult;
    if (saved.boqResult) State.boqResult = saved.boqResult;
    if (saved.pointHistory) State.pointHistory = saved.pointHistory;
    if (saved.margins) State.margins = saved.margins;
    if (saved.isTwoFace !== undefined) State.isTwoFace = saved.isTwoFace;
    if (saved.assessmentResult) State.assessmentResult = saved.assessmentResult;
    
    if (saved.structMeasurements) {
      structMeasurements.length = 0;
      structMeasurements.push(...saved.structMeasurements);
      renderStructList();
    }
    if (saved.memberSizes) {
      memberSizes.length = 0;
      memberSizes.push(...saved.memberSizes);
      renderMemberSizeList();
    }

    // Bind UI
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('proj-name', State.project.name);
    setVal('proj-addr', State.project.address);
    setVal('proj-surveyor', State.project.surveyor);
    setVal('proj-date', State.project.date);
    setVal('tg-token', State.telegram.token);
    setVal('tg-chat-id', State.telegram.chatId);
    setVal('set-panel-w', State.panel.width);
    setVal('set-panel-h', State.panel.height);
    setVal('set-panel-watt', State.panelWatt);
    setVal('set-margin-top', State.margins.top);
    setVal('set-margin-bot', State.margins.bottom);
    setVal('set-margin-lr', State.margins.left);
    
    const proxyToggle = document.getElementById('tg-use-proxy');
    if (proxyToggle) proxyToggle.classList.toggle('on', !!State.telegram.useProxy);
    
    const twoFaceToggle = document.getElementById('toggle-twoface');
    if (twoFaceToggle) twoFaceToggle.classList.toggle('on', !!State.isTwoFace);

    updatePointGrid();
    updateCalcButton();
    updateReportSummary();
    
    if (State.roofResult) {
       document.getElementById('results-section').style.display = 'block';
       const R = State.roofResult;
       set('res-eave',   R.eaveLength   !== null && R.eaveLength !== undefined ? `${R.eaveLength} ม.`   : '-');
       set('res-ridge',  R.ridgeLength  !== null && R.ridgeLength !== undefined ? `${R.ridgeLength} ม.`  : '-');
       set('res-rafter', R.rafterLength !== null && R.rafterLength !== undefined ? `${R.rafterLength} ม.` : '-');
       set('res-slope',  R.slopeAngle   !== null && R.slopeAngle !== undefined ? `${R.slopeAngle}°`     : '-');
       set('res-pitch',  R.pitchLabel   ?? '-');
       set('res-area1',  R.trueArea     !== null && R.trueArea !== undefined ? `${R.trueArea} ตร.ม.`  : '-');
       set('res-area2',  R.totalArea    !== null && R.totalArea !== undefined ? `${R.totalArea} ตร.ม.` : '-');
    }
  } catch (e) { console.warn('Load failed', e); }
}

// ─── Initialization ────────────────────────────────────────────────────────────────────────
function updateReportSummary() {
  set('rep-proj-name', State.project.name || '-');
  set('rep-date', State.project.date || '-');
  if (State.roofResult) {
    set('rep-area', `${State.roofResult.totalArea ?? State.roofResult.trueArea ?? '-'} ตร.ม.`);
  }
  if (State.layoutResult) {
    set('rep-panels', `${State.layoutResult.count} แผง`);
    const estimatedPower = State.boqResult?.estimatedPower || (State.layoutResult.count * State.panelWatt);
    set('rep-power', `${(estimatedPower / 1000).toFixed(2)} kWp`);
  } else {
    set('rep-panels', '-');
    set('rep-power', '-');
  }
}

function init() {
  console.log('[Disto] App Starting...');
  initNavigation();
  initBluetooth();
  initBotMode();
  loadPersistedState();

  const dateEl = document.getElementById('proj-date');
  if (dateEl && !dateEl.value) dateEl.value = new Date().toISOString().split('T')[0];

  const bt = document.getElementById('bt-status');
  if (bt) bt.addEventListener('click', () => State.connected ? window.disconnectBT() : window.connectBLE());

  document.getElementById('tg-token')?.addEventListener('change', () => updateTelegramState());
  document.getElementById('tg-chat-id')?.addEventListener('change', () => updateTelegramState());
  document.getElementById('tg-use-proxy')?.addEventListener('click', () => setTimeout(updateTelegramState, 0));

  selectPoint(State.activePoint || 'A');
  checkStandalone();
<<<<<<< HEAD
  console.log('[Disto Survey App] v3.5 Ready');
=======
  console.log('[Disto Survey App] v3.8 Ready');
>>>>>>> 4cf73ce (v3.8 Final deploy)
}

// ─── Exports ─────────────────────────────────────────────────────────────────────────────
window.State = State;
window.showToast = showToast;
window.connectBLE = () => State.bluetooth.connectBLE();
window.connectKeyboard = () => { State.bluetooth.enableKeyboardMode(); updateBTStatus('success'); };
window.disconnectBT = () => { State.bluetooth.disconnectBLE(); updateBTStatus('disconnected'); };
window.toggleVoice = () => { State.voice.setEnabled(!State.voice.enabled); document.getElementById('voice-toggle')?.classList.toggle('on'); };
window.saveProject = () => { 
  State.project.name = document.getElementById('proj-name').value;
  State.project.address = document.getElementById('proj-addr').value;
  State.project.surveyor = document.getElementById('proj-surveyor').value;
  State.project.date = document.getElementById('proj-date').value;
  persistState(); showToast('บันทึกข้อมูลโครงการแล้ว', 'success');
};
<<<<<<< HEAD
window.setManualDist = (v) => { State.lastMeasurement.d = parseFloat(v); document.getElementById('live-distance').textContent = State.lastMeasurement.d.toFixed(3); };
=======
window.setManualDist = (v) => { 
    State.lastMeasurement.d = parseFloat(v); 
    const liveDistEl = document.getElementById('live-distance');
    if (liveDistEl) liveDistEl.textContent = State.lastMeasurement.d.toFixed(3);
};
>>>>>>> 4cf73ce (v3.8 Final deploy)
window.selectPoint = selectPoint;
window.recordMeasurement = recordMeasurement;
window.undoLastPoint = undoLastPoint;
window.calculateRoof = calculateRoof;
window.calculateLayout = calculateLayout;
window.resetAll = () => { if (confirm('รีเซ็ตข้อมูลทั้งหมด?')) { localStorage.removeItem(STORAGE_KEY); location.reload(); } };
window.recordStructMeasurement = recordStructMeasurement;
window.deleteStructEntry = deleteStructEntry;
window.clearStructMeasurements = () => { structMeasurements.length = 0; renderStructList(); };
window.captureShot = captureShot;
window.calcMemberHeight = calcMemberHeight;
window.saveMemberHeight = saveMemberHeight;
window.resetShots = resetShots;
window.undoLastMember = () => { memberSizes.pop(); renderMemberSizeList(); };
window.clearMemberSizes = () => { memberSizes.length = 0; renderMemberSizeList(); };
window.openTrussSelector = openTrussSelector;
window.selectTrussPattern = selectTrussPattern;
window.closeTrussSelector = () => document.getElementById('modal-truss-selector').style.display = 'none';
window.selectBlueprintPart = selectBlueprintPart;
window.confirmVisualMeasurement = confirmVisualMeasurement;
window.openHidGuide = () => document.getElementById('modal-hid-guide').style.display = 'flex';
window.closeHidGuide = () => document.getElementById('modal-hid-guide').style.display = 'none';
window.testTelegram = testTelegram;
window.sendToTelegram = sendToTelegram;
window.showInstallGuide = () => document.getElementById('install-modal').style.display = 'flex';
window.closeInstallGuide = () => document.getElementById('install-modal').style.display = 'none';
window.generatePDF = generatePDF;
window.setPurlinPreset = (type, label, width, depth) => {
  const sel = document.getElementById('purlin-type'); if (sel) sel.value = type;
  const dep = document.getElementById('purlin-depth'); if (dep) dep.value = depth;
  const wid = document.getElementById('purlin-width'); if (wid) wid.value = width;
  showToast(`เลือก ${label}`, 'success');
  persistState();
};
window.toggleTwoFace = () => {
  State.isTwoFace = !State.isTwoFace;
  document.getElementById('toggle-twoface')?.classList.toggle('on');
  persistState();
  if (State.roofResult) calculateRoof();
};
window.updatePanelSettings = () => {
  State.panel.width = parseFloat(document.getElementById('set-panel-w')?.value) || 1.13;
  State.panel.height = parseFloat(document.getElementById('set-panel-h')?.value) || 2.28;
  State.panelWatt = parseFloat(document.getElementById('set-panel-watt')?.value) || 570;
  State.margins.top = parseFloat(document.getElementById('set-margin-top')?.value) || 0.3;
  State.margins.bottom = parseFloat(document.getElementById('set-margin-bot')?.value) || 0.3;
  State.margins.left = parseFloat(document.getElementById('set-margin-lr')?.value) || 0.3;
  State.margins.right = State.margins.left;
  persistState();
  showToast('บันทึกการตั้งค่าแผงแล้ว', 'success');
  if (State.roofResult) calculateLayout();
};
window.assessStructure = function () {
  // --- Solar Load (CALCULATE FIRST to provide loadPerM2 for Purlin check) ---
  const panelCount = State.layoutResult?.count || 0;
  const areaM2 = State.roofResult?.totalArea || 0;
  const solarLoad = calcSolarLoad(panelCount, 25, areaM2); // 25kg/panel approx

  // --- Purlin Assessment ---
  const purlinType = document.getElementById('purlin-type')?.value || 'steel_c100';
  const purlinSpacing = parseFloat(document.getElementById('purlin-spacing')?.value) || 0;
  const purlinSpan = parseFloat(document.getElementById('purlin-span')?.value) || 0;
  const purlinDepth = parseFloat(document.getElementById('purlin-depth')?.value) || 0;

  const purlinRes = assessPurlin({ 
    type: purlinType, 
    spacingM: purlinSpacing, 
    spanM: purlinSpan, 
    depthM: purlinDepth 
  }, solarLoad.loadPerM2 || 15);

  // --- Truss Assessment ---
  const trussSpacing = parseFloat(document.getElementById('truss-spacing')?.value) || 0;
  const trussSpan = parseFloat(document.getElementById('truss-span')?.value) || 0;
  const trussDepth = parseFloat(document.getElementById('truss-depth')?.value) || 0;
  const trussType = State.wizard.pattern || 'main';

  // New: Geometry Consistency Validation
  const geomVal = validateTrussGeometry(trussType, { span: trussSpan, height: trussDepth });
  
  const trussRes = assessTruss({ 
    type: trussType, 
    spacingM: trussSpacing, 
    spanM: trussSpan, 
    depthM: trussDepth,
    hasRust: false, 
    hasDeflection: false 
  });

  // Merge geometric issues into recommendation
  if (!geomVal.valid || geomVal.issues.length > 0) {
    const geomNote = geomVal.issues.map(i => i.message).join(' | ');
    trussRes.recommendation = (trussRes.recommendation ? trussRes.recommendation + ' | ' : '') + geomNote;
    if (!geomVal.valid) trussRes.rating = 'fail';
  }

  // --- Overall ---
  const overall = overallAssessment([purlinRes], trussRes, solarLoad);

  // Update UI
  document.getElementById('struct-result').style.display = 'block';
  
  const icons = { PASS: '✅', WARN: '⚠️', FAIL: '❌' };
  set('struct-verdict-icon', icons[overall.overall]);
  
  const verdText = document.getElementById('struct-verdict-text');
  if (verdText) {
    verdText.textContent = overall.summary;
    verdText.style.color = overall.overall === 'PASS' ? 'var(--green)' : overall.overall === 'WARN' ? 'var(--accent)' : 'var(--red)';
  }
  
  set('struct-purlin-status', purlinRes.rating === 'pass' ? '✅ ผ่าน' : '❌ ควรตรวจสอบ');
  set('struct-truss-status',  trussRes.rating === 'pass' ? '✅ ผ่าน' : '⚠️ ปานกลาง');
  set('struct-load-m2', `${solarLoad.loadPerM2} kg/m²`);
  
  const recEl = document.getElementById('struct-recommendation');
  if (recEl) recEl.textContent = [purlinRes.recommendation, trussRes.recommendation, overall.summary].filter(Boolean).join(' | ') || 'โครงสร้างมีความแข็งแรงเพียงพอ';

  State.assessmentResult = { purlinRes, trussRes, solarLoad, overall };
  persistState();
  showToast('ประเมินโครงสร้างเสร็จสิ้น', overall.overall === 'PASS' ? 'success' : 'warning');
};

// Start App
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
