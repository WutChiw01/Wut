/**
 * calculator.js โ€” P2P / 3D Roof Calculation Engine
 *
 * เธฃเธฑเธเธเธดเธเธฑเธ”เธ—เธฃเธเธเธฅเธก (เธฃเธฐเธขเธฐเธ—เธฒเธ, เธกเธธเธกเน€เธเธข, เธกเธธเธกเธฃเธฒเธ) เธเธฒเธเน€เธเธฃเธทเนเธญเธเน€เธฅเน€เธเธญเธฃเน
 * เนเธเธฅเธเน€เธเนเธเธเธดเธเธฑเธ” 3 เธกเธดเธ•เธด (Cartesian) เนเธฅเนเธงเธเธณเธเธงเธ“:
 *  - เธฃเธฐเธขเธฐเธซเนเธฒเธ P2P เธฃเธฐเธซเธงเนเธฒเธเธเธธเธ”เนเธ”เน
 *  - เธเธงเธฒเธกเธฅเธฒเธ”เธเธฑเธเธเธญเธเธซเธฅเธฑเธเธเธฒ (Slope Angle)
 *  - เธเธงเธฒเธกเธขเธฒเธงเน€เธเธดเธเธเธฒเธขเธ–เธถเธเธชเธฑเธ (Rafter Length)
 *  - เธเธทเนเธเธ—เธตเนเธเธฃเธดเธเธเธญเธเธซเธฅเธฑเธเธเธฒ (True Area)
 */

/**
 * เนเธเธฅเธเธเนเธฒเธเธฒเธเน€เธเธฃเธทเนเธญเธเน€เธฅเน€เธเธญเธฃเน (Spherical) โ’ เธเธดเธเธฑเธ” 3 เธกเธดเธ•เธด (Cartesian)
 * @param {number} d       - เธฃเธฐเธขเธฐเธ—เธฒเธ (เน€เธกเธ•เธฃ)
 * @param {number} alpha   - เธกเธธเธกเน€เธเธข/เธกเธธเธกเธเนเธก เธเธฒเธเนเธเธงเธฃเธฒเธ (เธญเธเธจเธฒ, เธเธงเธ=เน€เธเธขเธเธถเนเธ, เธฅเธ=เธเนเธกเธฅเธ)
 * @param {number} beta    - เธกเธธเธกเธฃเธฒเธ Bearing (เธญเธเธจเธฒ, 0=เธ—เธดเธจเน€เธซเธเธทเธญ, เธ•เธฒเธกเน€เธเนเธกเธเธฒเธฌเธดเธเธฒ)
 * @returns {{ x, y, z }} - เธเธดเธเธฑเธ” 3 เธกเธดเธ•เธด (เน€เธกเธ•เธฃ)
 */
export function sphericalToCartesian(d, alpha, beta) {
  const alphaRad = (alpha * Math.PI) / 180;
  const betaRad = (beta * Math.PI) / 180;
  return {
    x: d * Math.cos(alphaRad) * Math.cos(betaRad),
    y: d * Math.cos(alphaRad) * Math.sin(betaRad),
    z: d * Math.sin(alphaRad),
  };
}

/**
 * เธเธณเธเธงเธ“เธฃเธฐเธขเธฐเธซเนเธฒเธ P2P เธฃเธฐเธซเธงเนเธฒเธเธชเธญเธเธเธดเธเธฑเธ” 3 เธกเธดเธ•เธด
 */
export function distance3D(p1, p2) {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );
}

/**
 * เธเธณเธเธงเธ“เธฃเธฐเธขเธฐเธซเนเธฒเธเนเธเธฃเธฐเธเธฒเธเนเธเธงเธฃเธฒเธ (Horizontal Distance)
 */
export function horizontalDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2)
  );
}

/**
 * เธเธณเธเธงเธ“เธกเธธเธกเธฅเธฒเธ”เธเธฑเธเธซเธฅเธฑเธเธเธฒ (Slope Angle เนเธเธญเธเธจเธฒ)
 * เธเธฒเธเธเธธเธ” eave (เน€เธเธดเธเธเธฒเธข) เธ–เธถเธเธเธธเธ” ridge (เธชเธฑเธ)
 * @param {object} eave   - เธเธดเธเธฑเธ”เน€เธเธดเธเธเธฒเธข {x,y,z}
 * @param {object} ridge  - เธเธดเธเธฑเธ”เธชเธฑเธเธซเธฅเธฑเธเธเธฒ {x,y,z}
 * @returns {number} - เธกเธธเธกเธฅเธฒเธ”เธเธฑเธเนเธเธญเธเธจเธฒ
 */
export function slopeAngle(eave, ridge) {
  const dH = horizontalDistance(eave, ridge);
  const dZ = ridge.z - eave.z;
  return (Math.atan2(dZ, dH) * 180) / Math.PI;
}

/**
 * เธเธณเธเธงเธ“ Roof Pitch เนเธเธฃเธนเธเนเธเธ X:12 (เธกเธฒเธ•เธฃเธเธฒเธเธชเธฒเธเธฅ)
 * @param {number} angleDeg - เธกเธธเธกเธฅเธฒเธ”เธเธฑเธเนเธเธญเธเธจเธฒ
 * @returns {string} - เน€เธเนเธ "4:12"
 */
export function pitchLabel(angleDeg) {
  const rise = Math.tan((angleDeg * Math.PI) / 180) * 12;
  return `${rise.toFixed(1)}:12`;
}

/**
 * เธเธณเธเธงเธ“เธเธทเนเธเธ—เธตเนเธเธฃเธดเธเธเธญเธเธซเธฅเธฑเธเธเธฒเธซเธเธถเนเธเธ”เนเธฒเธ (True Slope Area)
 * @param {object} A - เธกเธธเธกเน€เธเธดเธเธเธฒเธขเธเนเธฒเธข
 * @param {object} B - เธชเธฑเธเธเนเธฒเธข (ridge)
 * @param {object} C - เธกเธธเธกเน€เธเธดเธเธเธฒเธขเธเธงเธฒ
 * @param {object} D - เธชเธฑเธเธเธงเธฒ (ridge)
 * @returns {object} - { rafterLength, ridgeLength, eaveLength, trueArea }
 */
export function roofFaceArea(A, B, C, D) {
  const eaveLength = distance3D(A, C);   // เธเธงเธฒเธกเธขเธฒเธงเน€เธเธดเธเธเธฒเธข
  const ridgeLength = distance3D(B, D);  // เธเธงเธฒเธกเธขเธฒเธงเธชเธฑเธ
  const rafterLeft = distance3D(A, B);   // เนเธเธงเน€เธกเธ•เธฃเธเนเธฒเธข
  const rafterRight = distance3D(C, D);  // เนเธเธงเน€เธกเธ•เธฃเธเธงเธฒ
  const avgRafter = (rafterLeft + rafterRight) / 2;

  // Trapezoid area (เธเธฒเธเนเธซเธเน+เธเธฒเธเน€เธฅเนเธ)/2 ร— เธชเธนเธ
  const trueArea = ((eaveLength + ridgeLength) / 2) * avgRafter;

  return {
    eaveLength: round2(eaveLength),
    ridgeLength: round2(ridgeLength),
    rafterLength: round2(avgRafter),
    trueArea: round2(trueArea),
    slopeAngle: round2(slopeAngle(A, B)),
  };
}

/**
 * เธเธณเธเธงเธ“เธเธทเนเธเธ—เธตเนเธซเธฅเธฑเธเธเธฒ 2 เธ”เนเธฒเธ (Hip Roof เธซเธฃเธทเธญ Gable)
 * @param {object} points - { A, B, C, D } (เธเธธเธ”เธกเธธเธกเธ—เธฑเนเธ 4)
 * @param {boolean} isTwoFace - เธซเธฅเธฑเธเธเธฒ 2 เธ”เนเธฒเธเธซเธฃเธทเธญ 1 เธ”เนเธฒเธ
 */
export function totalRoofArea(points, isTwoFace = true) {
  const { A, B, C, D } = points;
  const face1 = roofFaceArea(A, B, C, D);

  if (!isTwoFace) {
    return {
      face1,
      totalArea: face1.trueArea,
      isTwoFace: false,
    };
  }

  // เธชเธณเธซเธฃเธฑเธเธซเธฅเธฑเธเธเธฒ 2 เธ”เนเธฒเธเธชเธกเธกเธฒเธ•เธฃ เนเธซเนเธเธนเธ“ 2
  const totalArea = face1.trueArea * 2;
  return {
    face1,
    totalArea: round2(totalArea),
    isTwoFace: true,
  };
}

/**
 * เธเธณเธเธงเธ“เธฃเธฐเธขเธฐ P2P เธเธฒเธ 2 เธเธฒเธฃเธงเธฑเธ”เนเธ”เธขเนเธกเนเธ•เนเธญเธเธกเธตเธกเธธเธกเธฃเธฒเธ
 * (เธเธฃเธ“เธตเธ•เธฑเนเธเธเธฅเนเธญเธเธเธธเธ”เน€เธ”เธตเธขเธง เธฃเธนเนเนเธเนเธฃเธฐเธขเธฐ + เธกเธธเธกเน€เธเธขเธชเธญเธเธเธฃเธฑเนเธ + เธกเธธเธกเธฃเธฐเธซเธงเนเธฒเธเธชเธญเธเธเธฒเธฃเธขเธดเธ)
 * เนเธเน Law of Cosines: cยฒ = aยฒ + bยฒ - 2abยทcos(C)
 * @param {number} d1     - เธฃเธฐเธขเธฐเธ—เธฒเธเธขเธดเธเธเธฃเธฑเนเธเธ—เธตเน 1
 * @param {number} d2     - เธฃเธฐเธขเธฐเธ—เธฒเธเธขเธดเธเธเธฃเธฑเนเธเธ—เธตเน 2
 * @param {number} angle  - เธกเธธเธกเธ—เธตเนเธเธฒเธเธฃเธฐเธซเธงเนเธฒเธ 2 เธเธฒเธฃเธขเธดเธ (เธญเธเธจเธฒ) โ€” เธเธนเนเนเธเนเธซเธกเธธเธเธเธฒเธ•เธฑเนเธ
 * @returns {number} เธฃเธฐเธขเธฐ P2P
 */
export function p2pFromTwoShots(d1, d2, angle) {
  // Law of Cosines: cยฒ = aยฒ + bยฒ - 2abยทcos(C)
  const rad = (angle * Math.PI) / 180;
  return round2(Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(rad)));
}

/**
 * เธเธณเธเธงเธ“ Horizontal Distance เธเธฒเธเธฃเธฐเธขเธฐเธ—เธฒเธเนเธฅเธฐเธกเธธเธกเน€เธเธข
 * (Smart Horizontal Mode เธเธญเธ Leica Disto)
 * @param {number} d      - เธฃเธฐเธขเธฐเธ—เธฒเธ (เน€เธกเธ•เธฃ)
 * @param {number} alpha  - เธกเธธเธกเน€เธเธข (เธญเธเธจเธฒ)
 * @returns {number} เธฃเธฐเธขเธฐเนเธเธงเธฃเธฒเธ
 */
export function horizontalDistanceFromTilt(d, alpha) {
  return round2(d * Math.cos((alpha * Math.PI) / 180));
}

/**
 * เธเธณเธเธงเธ“เธเธงเธฒเธกเธชเธนเธ (Vertical Height) เธเธฒเธเธฃเธฐเธขเธฐเธ—เธฒเธเนเธฅเธฐเธกเธธเธกเน€เธเธข
 */
export function verticalHeight(d, alpha) {
  return round2(d * Math.sin((alpha * Math.PI) / 180));
}

// Helper: เธเธฑเธ”เน€เธฅเธเธ—เธจเธเธดเธขเธก 3 เธ•เธณเนเธซเธเนเธ
export function round3(n) {
  return Math.round(n * 1000) / 1000;
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}
