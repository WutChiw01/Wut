/**
 * layout.js โ€” Solar Panel Layout Engine
 *
 * เธฃเธฑเธเธกเธดเธ•เธดเธซเธฅเธฑเธเธเธฒ โ’ เธเธณเธเธงเธ“เธเธฒเธฃเธเธฑเธ”เธงเธฒเธเนเธเธเนเธเธฅเนเธฒเน€เธเธฅเธฅเน
 * เนเธฅเธฐเธงเธฒเธ”เธ เธฒเธ Layout เธเธ HTML Canvas
 */

export class SolarLayoutEngine {
  /**
   * @param {object} roofDims  - { eaveLength, rafterLength }  (เน€เธกเธ•เธฃ)
   * @param {object} panel     - { width, height }  (เน€เธกเธ•เธฃ) เธ•เธฒเธกเธเนเธญเธเธณเธซเธเธ”เนเธเธ
   * @param {object} margins   - { top, bottom, left, right } (เน€เธกเธ•เธฃ) เธฃเธฐเธขเธฐเธฃเนเธ
   * @param {number} gap       - เธฃเธฐเธขเธฐเธซเนเธฒเธเธฃเธฐเธซเธงเนเธฒเธเนเธเธ (เน€เธกเธ•เธฃ)
   */
  constructor(roofDims, panel, margins, gap = 0.01) {
    this.roofDims = roofDims;
    this.panel = panel;
    this.margins = {
      top: margins?.top ?? 0.30,
      bottom: margins?.bottom ?? 0.30,
      left: margins?.left ?? 0.30,
      right: margins?.right ?? 0.30,
    };
    this.gap = gap;
  }

  /**
   * เธเธณเธเธงเธ“เธเธทเนเธเธ—เธตเนเธ—เธตเนเนเธเนเธงเธฒเธเนเธเธเนเธ”เน (เธซเธฑเธเธฃเนเธ)
   */
  get usableArea() {
    const w = this.roofDims.eaveLength - this.margins.left - this.margins.right;
    const h = this.roofDims.rafterLength - this.margins.top - this.margins.bottom;
    return { width: Math.max(0, w), height: Math.max(0, h) };
  }

  /**
   * เธเธณเธเธงเธ“เธเธณเธเธงเธเนเธเธเนเธเนเธซเธกเธ” Portrait (เนเธเธเธ•เธฑเนเธ: width ร— height)
   */
  calcPortrait() {
    const { width, height } = this.usableArea;
    const cols = Math.floor((width + this.gap) / (this.panel.width + this.gap));
    const rows = Math.floor((height + this.gap) / (this.panel.height + this.gap));
    const count = Math.max(0, cols * rows);
    const coveredArea = count * this.panel.width * this.panel.height;
    return {
      orientation: 'Portrait',
      cols: Math.max(0, cols),
      rows: Math.max(0, rows),
      count,
      coveredArea: Math.round(coveredArea * 100) / 100,
      usedWidth: cols * (this.panel.width + this.gap) - this.gap,
      usedHeight: rows * (this.panel.height + this.gap) - this.gap,
    };
  }

  /**
   * เธเธณเธเธงเธ“เธเธณเธเธงเธเนเธเธเนเธเนเธซเธกเธ” Landscape (เนเธเธเธเธญเธ: height ร— width)
   */
  calcLandscape() {
    const { width, height } = this.usableArea;
    const cols = Math.floor((width + this.gap) / (this.panel.height + this.gap));
    const rows = Math.floor((height + this.gap) / (this.panel.width + this.gap));
    const count = Math.max(0, cols * rows);
    const coveredArea = count * this.panel.width * this.panel.height;
    return {
      orientation: 'Landscape',
      cols: Math.max(0, cols),
      rows: Math.max(0, rows),
      count,
      coveredArea: Math.round(coveredArea * 100) / 100,
      usedWidth: cols * (this.panel.height + this.gap) - this.gap,
      usedHeight: rows * (this.panel.width + this.gap) - this.gap,
    };
  }

  /**
   * เนเธ”เนเธฃเธฑเธเธเธฅเธฅเธฑเธเธเนเธ—เธฑเนเธเธชเธญเธเนเธซเธกเธ”เนเธฅเธฐเธเธฅเธฅเธฑเธเธเนเธ—เธตเนเธ”เธตเธ—เธตเนเธชเธธเธ”
   */
  getBestLayout() {
    const portrait = this.calcPortrait();
    const landscape = this.calcLandscape();
    const best = portrait.count >= landscape.count ? portrait : landscape;
    return { portrait, landscape, best };
  }

  /**
   * เธเธณเธเธงเธ“ BOQ เธงเธฑเธชเธ”เธธเนเธเธฃเธเธขเธถเธ”
   * @param {object} layout    - เธเธฅเธฅเธฑเธเธเนเธเธฒเธ calcPortrait() เธซเธฃเธทเธญ calcLandscape()
   * @param {number} panelRows - เธเธณเธเธงเธเนเธ–เธง
   * @returns {object}         - BOQ เธงเธฑเธชเธ”เธธ
   */
  calcBOQ(layout) {
    const { cols, rows } = layout;
    const panelW = layout.orientation === 'Portrait' ? this.panel.width : this.panel.height;
    const panelH = layout.orientation === 'Portrait' ? this.panel.height : this.panel.width;

    // Rails: 2 เธฃเธฒเธ/เนเธ–เธง ร— เธเธณเธเธงเธเนเธ–เธง (เธ•เธฒเธกเนเธเธง Y)
    // Rail length = เธเธงเธฒเธกเธขเธฒเธงเธ•เธฒเธกเนเธเธง X เธเธญเธเนเธ–เธง
    const railsPerRow = 2;
    const totalRails = railsPerRow * rows;
    const railLength = cols * (panelW + this.gap);

    // L-feet: เธ—เธธเธ rail เธเธฅเธฒเธข 2 เธเธธเธ” + เธเธฅเธฒเธ (เธ—เธธเธ 1.2 เธก.)
    const lFeetPerRail = 2 + Math.max(0, Math.floor((railLength - 0.3) / 1.2));
    const totalLFeet = lFeetPerRail * totalRails;

    // Mid Clamp: เธฃเธฐเธซเธงเนเธฒเธเนเธเธ = (cols-1) ร— 2 rails ร— rows
    const midClamps = rows > 0 ? Math.max(0, (cols - 1)) * railsPerRow * rows : 0;

    // End Clamp: เธเธญเธเนเธ•เนเธฅเธฐเนเธ–เธง = 2 ร— 2 rails ร— rows
    const endClamps = rows > 0 ? 2 * railsPerRow * rows : 0;

    return {
      panels: layout.count,
      rails: { count: totalRails, length: Math.round(railLength * 100) / 100 },
      lFeet: totalLFeet,
      midClamps,
      endClamps,
    };
  }

  /**
   * เธงเธฒเธ” Layout เธเธ Canvas
   * @param {HTMLCanvasElement} canvas
   * @param {object} layout   - เธเธฅเธฅเธฑเธเธเน getBestLayout()
   */
  drawCanvas(canvas, layoutResult = null) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const layout = layoutResult || this.getBestLayout().best;

    ctx.clearRect(0, 0, W, H);

    // Scale: เนเธเน usable area เธ—เธฑเนเธเธซเธกเธ”
    const usable = this.usableArea;
    const totalRoofW = this.roofDims.eaveLength;
    const totalRoofH = this.roofDims.rafterLength;
    const padding = 40;
    const scaleX = (W - padding * 2) / totalRoofW;
    const scaleY = (H - padding * 2) / totalRoofH;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (W - totalRoofW * scale) / 2;
    const offsetY = (H - totalRoofH * scale) / 2;

    // เธงเธฒเธ”เธซเธฅเธฑเธเธเธฒ
    ctx.fillStyle = '#1a2035';
    ctx.fillRect(offsetX, offsetY, totalRoofW * scale, totalRoofH * scale);
    ctx.strokeStyle = '#4a6fa5';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, totalRoofW * scale, totalRoofH * scale);

    // เธงเธฒเธ”เธเธทเนเธเธ—เธตเนเธฃเนเธ (margins)
    ctx.fillStyle = 'rgba(255, 160, 0, 0.12)';
    ctx.fillRect(offsetX, offsetY, totalRoofW * scale, totalRoofH * scale);

    // เธงเธฒเธ”เธเธทเนเธเธ—เธตเน usable
    const ux = offsetX + this.margins.left * scale;
    const uy = offsetY + this.margins.top * scale;
    const uw = usable.width * scale;
    const uh = usable.height * scale;
    ctx.fillStyle = '#0f1a2e';
    ctx.fillRect(ux, uy, uw, uh);

    // เธเธเธฒเธ”เนเธเธเธ•เธฒเธก orientation
    const pw = (layout.orientation === 'Portrait' ? this.panel.width : this.panel.height) * scale;
    const ph = (layout.orientation === 'Portrait' ? this.panel.height : this.panel.width) * scale;

    // เธงเธฒเธ”เนเธเธ
    for (let r = 0; r < layout.rows; r++) {
      for (let c = 0; c < layout.cols; c++) {
        const px = ux + c * (pw + this.gap * scale);
        const py = uy + r * (ph + this.gap * scale);

        // เนเธเธเธเธทเนเธเธซเธฅเธฑเธ
        const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
        grad.addColorStop(0, '#1a3a6b');
        grad.addColorStop(1, '#0d2244');
        ctx.fillStyle = grad;
        ctx.fillRect(px, py, pw, ph);

        // เธเธฃเธญเธเนเธเธ
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, pw, ph);

        // เน€เธชเนเธเน€เธเธฅเธฅเน
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
        ctx.lineWidth = 0.5;
        const cellCols = 6, cellRows = 10;
        for (let ci = 1; ci < cellCols; ci++) {
          const cx2 = px + (pw / cellCols) * ci;
          ctx.beginPath(); ctx.moveTo(cx2, py); ctx.lineTo(cx2, py + ph); ctx.stroke();
        }
        for (let ri = 1; ri < cellRows; ri++) {
          const cy2 = py + (ph / cellRows) * ri;
          ctx.beginPath(); ctx.moveTo(px, cy2); ctx.lineTo(px + pw, cy2); ctx.stroke();
        }
      }
    }

    // Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `${Math.max(10, scale * 0.35)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${totalRoofW.toFixed(2)} เธก.`, offsetX + totalRoofW * scale / 2, offsetY + totalRoofH * scale + 20);
    ctx.save();
    ctx.translate(offsetX - 16, offsetY + totalRoofH * scale / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${totalRoofH.toFixed(2)} เธก.`, 0, 0);
    ctx.restore();

    // เธเธณเธเธงเธเนเธเธ
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText(`${layout.count} เนเธเธ (${layout.orientation})`, W / 2, H - 8);
  }
}
