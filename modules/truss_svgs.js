/**
 * truss_svgs.js โ€” Interactive SVG Diagrams for Distro Survey v3.0
 */

export const TrussSVG = {
  /**
   * Generates an Interactive Howe Truss SVG
   */
  howe: (selectedPart) => {
    const activeColor = 'var(--accent-l)';
    const baseColor = 'rgba(255,255,255,0.4)';
    const getColor = (id) => (id === selectedPart ? activeColor : baseColor);
    const getStroke = (id) => (id === selectedPart ? '3' : '1.5');

    return `
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" class="interactive-svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Grid -->
        <path d="M0 0h400v200H0z" fill="var(--bg3)" fill-opacity="0.3"/>
        <path d="M40 160h320" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        
        <!-- Span (L) -->
        <g class="part-group" onclick="selectBlueprintPart('span')">
          <path d="M60 180h280" stroke="${getColor('span')}" stroke-width="${getStroke('span')}" marker-start="url(#arrow)" marker-end="url(#arrow)" />
          <text x="200" y="195" fill="${getColor('span')}" text-anchor="middle" font-size="12" font-weight="bold">SPAN (L)</text>
          <rect x="60" y="170" width="280" height="30" fill="transparent" />
        </g>

        <!-- Main Structure -->
        <path d="M60 160 L200 60 L340 160 Z" fill="none" stroke="white" stroke-width="1" stroke-dasharray="4"/>
        
        <!-- Height (H) -->
        <g class="part-group" onclick="selectBlueprintPart('height')">
          <path d="M200 60v100" stroke="${getColor('height')}" stroke-width="${getStroke('height')}" stroke-dasharray="${selectedPart === 'height' ? '0' : '3'}" />
          <text x="210" y="110" fill="${getColor('height')}" font-size="12" font-weight="bold">HEIGHT (H)</text>
          <rect x="180" y="60" width="40" height="100" fill="transparent" />
        </g>

        <!-- Diagonal / Web -->
        <g class="part-group" onclick="selectBlueprintPart('diagonal')">
          <path d="M130 110 L130 160" stroke="${getColor('diagonal')}" stroke-width="${getStroke('diagonal')}" />
          <text x="100" y="140" fill="${getColor('diagonal')}" font-size="10" font-weight="bold">WEB</text>
          <rect x="100" y="110" width="60" height="50" fill="transparent" />
        </g>

        <!-- Nodes -->
        <circle cx="60" cy="160" r="4" fill="white"/>
        <circle cx="340" cy="160" r="4" fill="white"/>
        <circle cx="200" cy="60" r="5" fill="var(--primary-l)"/>
        
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-fill" />
          </marker>
        </defs>
      </svg>
    `;
  },

  /**
   * Generates an Interactive Warren Truss SVG
   */
  warren: (selectedPart) => {
    const activeColor = 'var(--accent-l)';
    const baseColor = 'rgba(255,255,255,0.4)';
    const getColor = (id) => (id === selectedPart ? activeColor : baseColor);
    
    return `
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" class="interactive-svg">
        <!-- Span -->
        <g class="part-group" onclick="selectBlueprintPart('span')">
          <path d="M40 170h320" stroke="${getColor('span')}" stroke-width="2" marker-start="url(#arrow)" marker-end="url(#arrow)" />
          <text x="200" y="188" fill="${getColor('span')}" text-anchor="middle" font-size="12" font-weight="bold">SPAN (L)</text>
        </g>
        
        <!-- Height -->
        <g class="part-group" onclick="selectBlueprintPart('height')">
          <path d="M40 60v100" stroke="${getColor('height')}" stroke-width="2" stroke-dasharray="4"/>
          <text x="15" y="110" fill="${getColor('height')}" font-size="12" font-weight="bold" transform="rotate(-90 15,110)">HEIGHT</text>
        </g>

        <!-- ZigZag Structure -->
        <path d="M40 160 L120 60 L200 160 L280 60 L360 160" fill="none" stroke="white" stroke-width="1.5" stroke-opacity="0.2"/>
        
        <!-- Diagonal -->
        <g class="part-group" onclick="selectBlueprintPart('diagonal')">
          <path d="M120 60 L200 160" stroke="${getColor('diagonal')}" stroke-width="4" stroke-linecap="round"/>
          <text x="160" y="100" fill="${getColor('diagonal')}" font-size="12" font-weight="bold">DIAGONAL</text>
        </g>

        <circle cx="40" cy="160" r="4" fill="white"/>
        <circle cx="120" cy="60" r="4" fill="white"/>
        <circle cx="200" cy="160" r="4" fill="white"/>
        <circle cx="280" cy="60" r="4" fill="white"/>
        <circle cx="360" cy="160" r="4" fill="white"/>
      </svg>
    `;
  }
};
