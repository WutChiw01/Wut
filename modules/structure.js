/**
 * structure.js โ€” Structural Assessment Module
 * เธงเธฑเธ”เนเธฅเธฐเธเธฃเธฐเน€เธกเธดเธเนเธเธฃเธเธชเธฃเนเธฒเธเธซเธฅเธฑเธเธเธฒเธชเธณเธซเธฃเธฑเธเธเธฒเธฃเธ•เธดเธ”เธ•เธฑเนเธเนเธเธฅเนเธฒเน€เธเธฅเธฅเน
 *
 * เธฃเธญเธเธฃเธฑเธเธเธฒเธฃเธงเธฑเธ”:
 *  - เนเธ (Purlins): spacing, size, material
 *  - เนเธเธฃเธเธ–เธฑเธ / เนเธเนเธเน€เธเธดเธเธเธฒเธข (Trusses / Rafters)
 *  - เน€เธชเธฒเนเธ / เธเธทเนเธญ (Collar Tie / Ridge Beam)
 *  - เธฃเธฐเธขเธฐเธเธฒเธ”เนเธ (Span between supports)
 *  - เธเธฃเธฐเน€เธกเธดเธเธเนเธณเธซเธเธฑเธเธเธฃเธฃเธ—เธธเธ (Load Assessment)
 */

// โ”€โ”€โ”€ เธกเธฒเธ•เธฃเธเธฒเธเธเนเธณเธซเธเธฑเธเธเธฃเธฃเธ—เธธเธเธญเนเธฒเธเธญเธดเธ โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€โ”€
export const LOAD_STANDARDS = {
  // เธเนเธณเธซเธเธฑเธเนเธเธเนเธเธฅเนเธฒเน€เธเธฅเธฅเนเธกเธฒเธ•เธฃเธเธฒเธ (kg/เธ•เธฃ.เธก.)
  solarPanelLoad: 15,        // ~15 kg/mยฒ (เนเธเธเธเธฃเนเธญเธกเนเธเธฃเธเธขเธถเธ”)
  // เธเนเธณเธซเธเธฑเธเธเธธเธเธเธฅเธ•เธดเธ”เธ•เธฑเนเธ (kg)
  workerLoad: 100,
  // เธฅเธก standard Thailand zone (kg/mยฒ) - เธ•เธฒเธก เธกเธขเธ.
  windLoad: {
    zone1: 50,   // พื้นที่ทั่วไป
    zone2: 65,   // ชายทะเล / ที่ราบสูง
    zone3: 80,   // พื้นที่เสี่ยงพายุ (ภาคใต้ฝั่งทะเล)
  },
  // ความสามารถรับน้ำหนัก แป ไม้/เหล็ก (อ้างอิงเบื้องต้น)
  purlinCapacity: {
    'steel_c100': { label: 'Steel C-100', maxSpanM: 2.5,  loadKgM: 40 },
    'steel_c75':  { label: 'Steel C-75',  maxSpanM: 1.8,  loadKgM: 30 },
    'wood_2x4':   { label: 'Wood 2"x4"',  maxSpanM: 1.5,  loadKgM: 25 },
    'other':      { label: 'Other',       maxSpanM: 1.0,  loadKgM: 15 }
  }
};
export function calcSolarLoad(panelCount, panelWeightKg, roofAreaM2) {
  const totalWeight = panelCount * panelWeightKg;
  const loadPerM2 = roofAreaM2 > 0 ? totalWeight / roofAreaM2 : 0;
  return {
    totalWeightKg: Math.round(totalWeight * 10) / 10,
    loadPerM2: Math.round(loadPerM2 * 10) / 10,
    standardLoad: LOAD_STANDARDS.solarPanelLoad,
    withinStandard: loadPerM2 <= LOAD_STANDARDS.solarPanelLoad * 1.2,
  };
}

/**
 * เธเธฃเธฐเน€เธกเธดเธเนเธ (Purlin Assessment)
 * @param {object} purlin - { type, spacingM, spanM, count }
 * @param {number} solarLoadKgM2 - Solar load เธ•เนเธญ เธ•เธฃ.เธก.
 * @returns {object} - { pass, rating, message, recommendation }
 */
export function assessPurlin(purlin, solarLoadKgM2 = 15) {
  const spec = LOAD_STANDARDS.purlinCapacity[purlin.type];
  if (!spec) return { pass: false, rating: 'unknown', message: 'เนเธกเนเธเธเธเนเธญเธกเธนเธฅเธเธเธดเธ”เนเธ' };

  const spanOk = purlin.spanM <= spec.maxSpanM;
  const spacingOk = purlin.spacingM <= 1.2; // เธฃเธฐเธขเธฐเธซเนเธฒเธเนเธเธกเธฒเธ•เธฃเธเธฒเธเธชเธณเธซเธฃเธฑเธเนเธเธฅเนเธฒ <= 1.2 เธก.
  const loadOk = solarLoadKgM2 <= spec.loadKgM;

  let rating, message, recommendation;
  const allOk = spanOk && spacingOk && loadOk;

  if (allOk) {
    rating = 'pass';
    message = 'โ… เนเธเธฃเธเธชเธฃเนเธฒเธเนเธเธเนเธฒเธเธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธ เธฃเธญเธเธฃเธฑเธเนเธเธฅเนเธฒเน€เธเธฅเธฅเนเนเธ”เน';
    recommendation = 'เธชเธฒเธกเธฒเธฃเธ–เธ•เธดเธ”เธ•เธฑเนเธเนเธเธฅเนเธฒเน€เธเธฅเธฅเนเนเธ”เนเนเธ”เธขเนเธกเนเธ•เนเธญเธเน€เธชเธฃเธดเธกเนเธเธฃเธเธชเธฃเนเธฒเธ';
  } else if (!spanOk || !loadOk) {
    rating = 'fail';
    message = 'โ เนเธเธฃเธเธชเธฃเนเธฒเธเนเธเนเธกเนเธเนเธฒเธ โ€” เธ•เนเธญเธเน€เธชเธฃเธดเธกเธซเธฃเธทเธญเน€เธเธฅเธตเนเธขเธเนเธ';
    recommendation = [
      !spanOk ? `เธฃเธฐเธขเธฐเธเธฒเธ” ${purlin.spanM} เธก. เน€เธเธดเธเธเธงเนเธฒเธ—เธตเนเนเธเธเธเธดเธ”เธเธตเนเธฃเธฑเธเนเธ”เน (${spec.maxSpanM} เธก.)` : '',
      !loadOk ? `เนเธซเธฅเธ”เธฃเธงเธกเน€เธเธดเธเธเนเธฒเธญเธญเธเนเธเธ เธเธฃเธธเธ“เธฒเธเธฃเธถเธเธฉเธฒเธงเธดเธจเธงเธเธฃ` : '',
    ].filter(Boolean).join(' | ');
  } else {
    rating = 'warn';
    message = 'โ ๏ธ เนเธเธเธญเธฃเธฑเธเนเธ”เน เนเธ•เนเธเธงเธฃเธ•เธฃเธงเธเธชเธญเธเธฃเธฐเธขเธฐเธซเนเธฒเธ';
    recommendation = spacingOk ? '' : `เธฃเธฐเธขเธฐเธซเนเธฒเธเนเธ ${purlin.spacingM} เธก. เธเธงเธฃเนเธกเนเน€เธเธดเธ 1.2 เธก. เธชเธณเธซเธฃเธฑเธเธเธฒเธเนเธเธฅเนเธฒ`;
  }

  return {
    pass: rating === 'pass',
    rating,
    message,
    recommendation,
    checks: { spanOk, spacingOk, loadOk },
    spec,
  };
}

/**
 * เธเธณเธเธงเธ“เธเธณเธเธงเธเนเธเธ—เธตเนเธ•เนเธญเธเนเธเนเธเธเธซเธฅเธฑเธเธเธฒ
 * @param {number} rafterLengthM  - เธเธงเธฒเธกเธขเธฒเธงเนเธเธงเน€เธกเธ•เธฃ (เธฃเธนเธเน€เธกเธ•เธฃ) เธเธญเธเธซเธฅเธฑเธเธเธฒ
 * @param {number} spacingM       - เธฃเธฐเธขเธฐเธซเนเธฒเธเธฃเธฐเธซเธงเนเธฒเธเนเธ (เน€เธกเธ•เธฃ)
 * @returns {number}
 */
export function calcPurlinCount(rafterLengthM, spacingM) {
  return Math.ceil(rafterLengthM / spacingM) + 1;
}

export const TRUSS_STANDARDS = {
  types: {
    main:    { label: 'เนเธเธฃเธเธซเธฅเธฑเธ (Main Truss)',    maxLd: 15, safetyFactor: 1.5 },
    sub:     { label: 'เนเธเธฃเธเธฃเธญเธ (Sub Truss)',     maxLd: 18, safetyFactor: 1.2 },
    support: { label: 'เนเธเธฃเธเธเธฑเธเธเธญเธฃเนเธ• (Support)',  maxLd: 20, safetyFactor: 1.1 },
  },
  members: {
    'C75x45x15x2.3':  { label: 'C-Channel 75mm', capacity: 'Medium' },
    'C100x50x20x2.3': { label: 'C-Channel 100mm', capacity: 'High' },
    'L50x50x5':       { label: 'Angle 50mm', capacity: 'Medium' },
    'Other':          { label: 'เธญเธทเนเธเน', capacity: 'Unknown' },
  }
};

/**
 * เธเธฃเธฐเน€เธกเธดเธเนเธเธฃเธเธ–เธฑเธเนเธเธเธฅเธฐเน€เธญเธตเธขเธ” (Detailed Truss Assessment)
 * @param {object} truss - { type, spacingM, spanM, depthM, topChord, bottomChord, hasRust, hasDeflection }
 * @returns {object}
 */
export function assessTruss(truss) {
  const typeSpec = TRUSS_STANDARDS.types[truss.type || 'main'];
  const label = typeSpec.label;
  
  // 1. เธ•เธฃเธงเธเธชเธญเธ L/d Ratio (Span to Depth) - เธชเธณเธเธฑเธเธกเธฒเธเธชเธณเธซเธฃเธฑเธเธเธงเธฒเธกเนเธเนเธเนเธฃเธเน€เธเธดเธเธกเธดเธ•เธด
  const Ld = truss.depthM > 0 ? truss.spanM / truss.depthM : 999;
  const LdOk = Ld <= typeSpec.maxLd;

  // 2. เธ•เธฃเธงเธเธชเธญเธเธฃเธฐเธขเธฐเธซเนเธฒเธ (Spacing)
  const spacingOk = truss.spacingM <= 2.5;

  // 3. เธเธฑเธเธเธฑเธขเธเธงเธฒเธกเน€เธชเธตเนเธขเธเธ เธฒเธขเธเธญเธ
  const riskCount = (truss.hasRust ? 1 : 0) + (truss.hasDeflection ? 1 : 0);
  
  let rating, message, recommendation;

  if (LdOk && spacingOk && riskCount === 0) {
    rating = 'pass';
    message = `โ… ${label} เนเธเนเธเนเธฃเธเธ•เธฒเธกเธกเธฒเธ•เธฃเธเธฒเธ (L/d = ${Ld.toFixed(1)})`;
    recommendation = 'เนเธเธฃเธเธชเธฃเนเธฒเธเธญเธขเธนเนเนเธเน€เธเธ“เธ‘เนเธ”เธต เธชเธฒเธกเธฒเธฃเธ–เธ•เธดเธ”เธ•เธฑเนเธเนเธ”เนเธ•เธฒเธกเธฃเธฐเน€เธเธตเธขเธเธงเธดเธจเธงเธเธฃเธฃเธก';
  } else if (riskCount > 0 || Ld > typeSpec.maxLd * 1.5) {
    rating = 'fail';
    message = `โ ${label} เนเธกเนเธเธฅเธญเธ”เธ เธฑเธขเธซเธฃเธทเธญเธกเธตเธเธงเธฒเธกเน€เธชเธตเนเธขเธเธชเธนเธ`;
    recommendation = truss.hasRust ? 'เธเธเธชเธเธดเธกเนเธเธชเนเธงเธเนเธเธฃเธเธชเธฃเนเธฒเธเธซเธฅเธฑเธ เธ•เนเธญเธเธเธฑเธ”เธฅเนเธฒเธเนเธฅเธฐเธ—เธฒเธชเธตเธเธฑเธเธชเธเธดเธกเนเธซเธกเน' : '';
    recommendation += truss.hasDeflection ? ' เธเธเธเธฒเธฃเธ•เธเธ—เนเธญเธเธเนเธฒเธเธญเธขเนเธฒเธเน€เธซเนเธเนเธ”เนเธเธฑเธ” เธซเนเธฒเธกเธ•เธดเธ”เธ•เธฑเนเธเนเธเธฅเนเธฒเน€เธเธฅเธฅเนเน€เธ”เนเธ”เธเธฒเธ”' : '';
    recommendation += !LdOk ? ` เธเธงเธฒเธกเธฅเธถเธเนเธเธฃเธ (${truss.depthM}เธก.) เธเนเธญเธขเน€เธเธดเธเนเธเน€เธกเธทเนเธญเน€เธ—เธตเธขเธเธเธฑเธเธเนเธงเธเธเธฒเธ” (${truss.spanM}เธก.)` : '';
  } else {
    rating = 'warn';
    message = `โ ๏ธ ${label} เธเธงเธฃเนเธ”เนเธฃเธฑเธเธเธฒเธฃเน€เธชเธฃเธดเธกเธเธงเธฒเธกเนเธเนเธเนเธฃเธ`;
    recommendation = `เธชเธฑเธ”เธชเนเธงเธ L/d (${Ld.toFixed(1)}) เน€เธเธดเธเธเนเธฒเนเธเธฐเธเธณ (${typeSpec.maxLd}) เน€เธฅเนเธเธเนเธญเธข เธซเธฃเธทเธญเธฃเธฐเธขเธฐเธซเนเธฒเธเธเธงเนเธฒเธเนเธ`;
  }

  return {
    pass: rating === 'pass',
    rating,
    message,
    recommendation,
    metrics: { Ld: Ld.toFixed(1), maxLd: typeSpec.maxLd },
    checks: { LdOk, spacingOk, noRisk: riskCount === 0 }
  };
}

/**
 * เธชเธฃเธธเธเธเธฅเธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธเนเธเธฃเธเธชเธฃเนเธฒเธเธ—เธฑเนเธเธซเธกเธ”
 * @param {object[]} purlinResults
 * @param {object} trussResult
 * @param {object} solarLoad
 * @returns {object}
 */
export function overallAssessment(purlinResults, trussResult, solarLoad) {
  const allPurlinPass = purlinResults.every(r => r.rating !== 'fail');
  const trussPass = !trussResult || trussResult.rating !== 'fail';
  const loadPass = solarLoad?.withinStandard !== false;

  const score = [allPurlinPass, trussPass, loadPass].filter(Boolean).length;

  let overall, color, summary;
  if (score === 3) {
    overall = 'PASS';
    color = 'green';
    summary = 'โ… เนเธเธฃเธเธชเธฃเนเธฒเธเธซเธฅเธฑเธเธเธฒเธเนเธฒเธเธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธเน€เธเธทเนเธญเธเธ•เนเธ เน€เธซเธกเธฒเธฐเธชเธกเธชเธณเธซเธฃเธฑเธเธเธฒเธฃเธ•เธดเธ”เธ•เธฑเนเธเนเธเธฅเนเธฒเน€เธเธฅเธฅเน';
  } else if (score === 2) {
    overall = 'WARN';
    color = 'amber';
    summary = 'โ ๏ธ เนเธเธฃเธเธชเธฃเนเธฒเธเธเนเธฒเธเธเธฒเธเธชเนเธงเธ เธเธงเธฃเธเธฃเธถเธเธฉเธฒเธงเธดเธจเธงเธเธฃเธเนเธญเธเธ•เธดเธ”เธ•เธฑเนเธ';
  } else {
    overall = 'FAIL';
    color = 'red';
    summary = 'โ เนเธเธฃเธเธชเธฃเนเธฒเธเธกเธตเธเธฑเธเธซเธฒเธชเธณเธเธฑเธ เธ•เนเธญเธเน€เธชเธฃเธดเธกเธซเธฃเธทเธญเธเธฃเธฑเธเธเธฃเธธเธเธเนเธญเธเธ•เธดเธ”เธ•เธฑเนเธ';
  }

  return { overall, score, color, summary };
}

/**
 * เธ•เธฃเธงเธเธชเธญเธเธเธงเธฒเธกเธ–เธนเธเธ•เนเธญเธเธ—เธฒเธเน€เธฃเธเธฒเธเธ“เธดเธ•เธเธญเธเนเธเธฃเธเธ–เธฑเธ (v1.4)
 * @param {string} pattern - warren, pratt, howe
 * @param {object} dims - { span, height, diagonal, bays }
 * @returns {object}
 */
export function validateTrussGeometry(pattern, dims) {
  const { span, height, diagonal, bays } = dims;
  if (!span || !height) return { valid: true }; // เธขเธฑเธเธเธฃเธญเธเนเธกเนเธเธฃเธ

  const results = [];
  
  // 1. เธ•เธฃเธงเธเธชเธญเธเธกเธธเธกเธฅเธฒเธ”เน€เธญเธตเธขเธเธเธญเธ Chord (Angle of top chord)
  const angleRad = Math.atan((height) / (span / 2));
  const angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 10) {
    results.push({ type: 'warn', message: `เธกเธธเธกเธซเธฅเธฑเธเธเธฒเธเธฑเธเธเนเธญเธขเนเธ (${angleDeg.toFixed(1)}ยฐ) เน€เธชเธตเนเธขเธเธ•เนเธญเธเนเธณเธเธฑเธ` });
  } else if (angleDeg > 45) {
    results.push({ type: 'warn', message: `เธกเธธเธกเธซเธฅเธฑเธเธเธฒเธเธฑเธเธกเธฒเธ (${angleDeg.toFixed(1)}ยฐ) เธฃเธฑเธเนเธฃเธเธฅเธกเธชเธนเธ` });
  }

  // 2. เธ•เธฃเธงเธเธชเธญเธเธเธงเธฒเธกเธ–เธนเธเธ•เนเธญเธเธเธญเธ Diagonal (เธเธฃเธ“เธตเธงเธฑเธ”เธกเธฒเธเธนเนเธเธฑเธ)
  if (diagonal && bays > 0) {
    const bayWidth = span / bays;
    const calcDiag = Math.sqrt(Math.pow(bayWidth, 2) + Math.pow(height, 2));
    const diff = Math.abs(diagonal - calcDiag);
    if (diff > 0.1) { // เธ•เนเธฒเธเธเธฑเธเน€เธเธดเธ 10 เธเธก.
      results.push({ type: 'error', message: `เธเนเธฒเธเนเธณเธขเธฑเธเธ—เธตเนเธงเธฑเธ”เนเธ”เน (${diagonal}เธก.) เธ•เนเธฒเธเธเธฒเธเธ—เธตเนเธเธณเธเธงเธ“เนเธ”เน (${calcDiag.toFixed(2)}เธก.) เนเธเธฃเธ”เธงเธฑเธ”เธเนเธณ` });
    }
  }

  return {
    valid: results.filter(r => r.type === 'error').length === 0,
    issues: results
  };
}
