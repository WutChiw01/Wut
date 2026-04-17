/**
 * report.js — PDF Report Generator
 * ใช้ jsPDF library (โหลดจาก CDN) สร้าง PDF รายงานประเมินโครงสร้าง
 */

export class ReportGenerator {
  /**
   * @param {object} project   - ข้อมูลโครงการ { name, address, date, surveyor }
   * @param {object} roofData  - ข้อมูลหลังคาจาก calculator
   * @param {object} layoutData - ข้อมูล layout จาก SolarLayoutEngine
   * @param {object} boqData   - BOQ วัสดุ
   * @param {string} canvasDataUrl - ภาพ layout จาก canvas.toDataURL()
   * @param {object} assessmentResult - ผลการประเมินโครงสร้าง { purlinRes, trussRes, solarLoad, overall }
   */
  constructor(project, roofData, layoutData, boqData, canvasDataUrl, assessmentResult) {
    this.project = project;
    this.roofData = roofData;
    this.layoutData = layoutData;
    this.boqData = boqData;
    this.canvasDataUrl = canvasDataUrl;
    this.assessmentResult = assessmentResult;
  }

  async generate() {
    const doc = await this.createDoc();
    const filename = `SurveyReport_${(this.project.name || 'Disto').replace(/\W/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    return filename;
  }

  /**
   * สร้าง jsPDF document object
   * @returns {Promise<jsPDF>}
   */
  async createDoc() {
    // Load jsPDF from global (loaded via CDN script tag)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Thai Font Registration
    if (typeof doc.addFont === 'function' && window._thaiFontBase64) {
      doc.addFileToVFS('THSarabun.ttf', window._thaiFontBase64);
      doc.addFont('THSarabun.ttf', 'THSarabun', 'normal');
      doc.setFont('THSarabun');
    } else {
      doc.setFont('helvetica');
    }

    const pageW = 210;
    const pageH = 297;
    const margin = 15;
    let y = margin;

    // ─── HEADER ───────────────────────────────────────────────────────────────────────────
    doc.setFillColor(10, 25, 60);
    doc.rect(0, 0, pageW, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(doc.getFont().fontName, 'bold');
    doc.text('SOLAR ROOF SURVEY REPORT', pageW / 2, 14, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont(doc.getFont().fontName, 'normal');
    doc.text('Structural Assessment for Solar Panel Installation', pageW / 2, 21, { align: 'center' });
    doc.setFontSize(8);
    doc.text(`Surveyed by Leica Disto Laser Measurement System`, pageW / 2, 28, { align: 'center' });

    y = 42;

    // ─── PROJECT INFO ────────────────────────────────────────────────────────────────────
    this._sectionHeader(doc, 'PROJECT INFORMATION / ข้อมูลโครงการ', y);
    y += 7;

    const info = [
      ['Project Name / ชื่อ', this.project.name || '-'],
      ['Location / สถานที่', this.project.address || '-'],
      ['Date / วันที่', this.project.date || '-'],
      ['Surveyor / ผู้สำรวจ', this.project.surveyor || '-'],
    ];
    this._table(doc, info, margin, y);
    y += info.length * 7 + 8;

    // ─── ROOF DATA ───────────────────────────────────────────────────────────────────────
    this._sectionHeader(doc, 'ROOF DIMENSIONS / ข้อมูลหลังคา', y);
    y += 7;

    const rd = this.roofData || {};
    const roofRows = [
      ['Width at Eave / กว้างเชิงชาย', `${rd.eaveLength?.toFixed(2) ?? '-'} m`],
      ['Width at Ridge / กว้างสัน', `${rd.ridgeLength?.toFixed(2) ?? '-'} m`],
      ['Rafter Length / ยาวจันทัน', `${rd.rafterLength?.toFixed(2) ?? '-'} m`],
      ['Roof Angle / มุมลาดเอียง', `${rd.slopeAngle?.toFixed(1) ?? '-'} deg (${rd.pitchLabel ?? '-'})`],
      ['True Area / พื้นที่ระนาบเอียง', `${rd.trueArea?.toFixed(2) ?? '-'} m²`],
    ];
    this._table(doc, roofRows, margin, y);
    y += roofRows.length * 7 + 8;

    // ─── SOLAR LAYOUT ─────────────────────────────────────────────────────────────────────
    this._sectionHeader(doc, 'SOLAR PANEL LAYOUT / การจัดวางแผง', y);
    y += 7;

    const ld = this.layoutData || {};
    const solarRows = [
      ['Panel Size / ขนาดแผง', `${ld.panelWidth ?? '-'} × ${ld.panelHeight ?? '-'} m`],
      ['Layout (Cols × Rows)', `${ld.cols ?? '-'} × ${ld.rows ?? '-'} Panels`],
      ['Total Panels / จำนวนแผง', `${ld.count ?? '-'} Panels`],
      ['Coverage / พื้นที่แผง', `${ld.coveredArea?.toFixed(2) ?? '-'} m²`],
      ['Est. Power / กำลังผลิต', `${ld.estimatedPower ?? '-'} Wp`],
    ];
    this._table(doc, solarRows, margin, y);
    y += solarRows.length * 7 + 4;

    // ─── CANVAS LAYOUT IMAGE ──────────────────────────────────────────────────────────────
    if (this.canvasDataUrl) {
      if (y > pageH - 80) { doc.addPage(); y = margin; }
      this._sectionHeader(doc, 'LAYOUT DIAGRAM / แผนผัง', y);
      y += 5;
      const imgW = pageW - margin * 2;
      const imgH = imgW * 0.55;
      try {
        doc.addImage(this.canvasDataUrl, 'PNG', margin, y, imgW, imgH);
      } catch (e) { console.warn('PDF Image add failed', e); }
      y += imgH + 10;
    }

    // ─── BOQ ──────────────────────────────────────────────────────────────────────────────
    if (y > pageH - 60) { doc.addPage(); y = margin; }
    const bq = this.boqData || {};
    const boqRows = [
      ['Solar Panels / แผง', `${bq.panels ?? '-'} pcs`],
      ['Rails / ราง Aluminium', `${bq.rails?.count ?? '-'} x ${bq.rails?.length ?? '-'} m`],
      ['L-feet / Roof Hook', `${bq.lFeet ?? '-'} pcs`],
      ['Mid Clamp', `${bq.midClamps ?? '-'} pcs`],
      ['End Clamp', `${bq.endClamps ?? '-'} pcs`],
    ];
    this._table(doc, boqRows, margin, y, true);
    y += boqRows.length * 7 + 8;

    // ─── STRUCTURAL ASSESSMENT ───────────────────────────────────────────────────────────
    if (this.assessmentResult) {
       if (y > pageH - 80) { doc.addPage(); y = margin; }
       this._sectionHeader(doc, 'STRUCTURAL ASSESSMENT / ผลประเมินโครงสร้าง', y);
       y += 7;

       const ar = this.assessmentResult;
       const sl = ar.solarLoad || {};
       const pr = ar.purlinRes || {};
       const tr = ar.trussRes || {};

       const loadRows = [
         ['Solar Load (Total) / โหลดรวม', `${sl.totalWeightKg ?? '-'} kg`],
         ['Load per m² / โหลดต่อพื้นที่', `${sl.loadPerM2 ?? '-'} kg/m² (Std: ${sl.standardLoad ?? '-'})`],
         ['Purlin Assessment / ผลประเมินแป', pr.message || '-'],
         ['Truss Type / ประเภทโครงถัก', tr.message?.split(' ')[1] || 'Main Truss'],
         ['L/d Ratio / สัดส่วนความเสถียร', `${tr.metrics?.Ld ?? '-'} (Limit: ${tr.metrics?.maxLd ?? '-'})`],
         ['Structural Verdict / สรุปผล', ar.overall?.overall || '-'],
       ];

       this._table(doc, loadRows, margin, y, true);
       y += loadRows.length * 7 + 6;

       if (tr.details) {
         doc.setFontSize(8); doc.setTextColor(80); 
         doc.setFont(doc.getFont().fontName, 'bold');
         doc.text('BLUEPRINT MEASUREMENTS:', margin, y);
         y += 4;
         doc.setFont(doc.getFont().fontName, 'normal');
         const detailLines = Object.entries(tr.details).map(([k, v]) => `${k}: ${v}m`).join(' | ');
         doc.text(detailLines, margin, y);
         y += 6;
       }
       
       doc.setFontSize(8); doc.setTextColor(150, 0, 0);
       if (tr.recommendation) {
         doc.text(`* Recommendation: ${tr.recommendation}`, margin, y);
         y += 5;
       }
       y += 4;
    }

    // ─── NOTE ────────────────────────────────────────────────────────────────────────────
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.setFont(doc.getFont().fontName, 'italic');
    const note = 'Note: All data measured by laser precision instrument. Actual installation must be verified by a licensed engineer. / หมายเหตุ: ข้อมูลนี้เป็นผลจากการสำรวจเบื้องต้น โปรดตรวจสอบหน้างานจริง';
    const noteLines = doc.splitTextToSize(note, pageW - margin * 2);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 4 + 6;

    // ─── SIGNATURE ────────────────────────────────────────────────────────────────────────
    if (y < pageH - 35) {
      doc.setDrawColor(180);
      doc.line(margin, y, margin + 60, y);
      doc.line(pageW - margin - 60, y, pageW - margin, y);
      y += 4;
      doc.setTextColor(80);
      doc.setFontSize(8);
      doc.setFont(doc.getFont().fontName, 'normal');
      doc.text('Surveyor Signature / ผู้สำรวจ', margin, y);
      doc.text('Approved by / ผู้ตรวจสอบ', pageW - margin - 60, y);
    }

    // ─── FOOTER ───────────────────────────────────────────────────────────────────────────
    doc.setFillColor(10, 25, 60);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setTextColor(180, 200, 255);
    doc.setFontSize(7);
    doc.text(
      `Generated by Disto Survey App v3.8 Final Diamond | Surveyor: ${this.project.surveyor || 'System'} | Page 1`,
      pageW / 2, pageH - 3.5, { align: 'center' }
    );

    return doc;
  }

  _sectionHeader(doc, text, y) {
    doc.setFillColor(15, 40, 100);
    doc.rect(14, y - 4, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(doc.getFont().fontName, 'bold');
    doc.text(text, 16, y + 0.5);
    doc.setTextColor(30, 30, 30);
  }

  _table(doc, rows, x, y, highlight = false) {
    doc.setFontSize(8.5);
    rows.forEach(([label, val], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(240, 245, 255);
        doc.rect(x, y - 4, 182, 6.5, 'F');
      }
      doc.setFont(doc.getFont().fontName, 'bold');
      doc.setTextColor(50, 70, 120);
      doc.text(label, x + 2, y);
      doc.setFont(doc.getFont().fontName, 'normal');
      doc.setTextColor(30, 30, 30);
      doc.text(val, x + 100, y);
      y += 7;
    });
  }
}
