// MY PLACE — Master model REV D.6 (parametric, built directly from the spec)
// Spec coordinates: x = east, y = north (towards the rear of the site), z = up, metres.
// Three.js is Y-up, so every spec point (x, y, z) is placed at Three (x, z, -y).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const V = (x, y, z) => new THREE.Vector3(x, z, -y);
const TAU = Math.PI * 2;
const rad = (d) => (d * Math.PI) / 180;

// ───────────────────────────── materials ─────────────────────────────
const std = (o) => new THREE.MeshStandardMaterial(o);
export const M = {
  grass: std({ color: 0x6f8f55, roughness: 1 }),
  asphalt: std({ color: 0x3d4045, roughness: 0.95 }),
  paving: std({ color: 0xc9c2b4, roughness: 0.9 }),
  concrete: std({ color: 0xb9bcbf, roughness: 0.92 }),
  concreteDark: std({ color: 0x8e9296, roughness: 0.95 }),
  plaster: std({ color: 0xece8df, roughness: 0.92 }),
  plasterWarm: std({ color: 0xdcd2c0, roughness: 0.92 }),
  charcoal: std({ color: 0x1e293b, roughness: 0.45, metalness: 0.4 }),
  steel: std({ color: 0xa9b0b8, roughness: 0.35, metalness: 0.85 }),
  ss316: std({ color: 0xc8ccd0, roughness: 0.25, metalness: 0.95 }),
  truss: std({ color: 0xd6dade, roughness: 0.5, metalness: 0.5 }),
  roofSheet: std({ color: 0xcfd3d6, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide }),
  roofUnder: std({ color: 0xe8eaec, roughness: 0.8, side: THREE.DoubleSide }),
  skylight: std({ color: 0xf4f7ff, roughness: 0.4, emissive: 0xdfe9ff, emissiveIntensity: 0.55, side: THREE.DoubleSide }),
  glass: std({ color: 0x9cc7d8, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }),
  glassFrost: std({ color: 0xdfe8ec, roughness: 0.3, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }),
  teak: std({ color: 0xb45309, roughness: 0.55 }),
  teakLight: std({ color: 0xc98a4b, roughness: 0.6 }),
  terracotta: std({ color: 0xea752b, roughness: 0.85 }),
  brick: std({ color: 0xb83d12, roughness: 0.88 }),
  tiles: std({ vertexColors: true, roughness: 0.85, metalness: 0, emissive: 0xff7a2a, emissiveIntensity: 0 }),
  collarBlue: std({ color: 0x1d4ed8, roughness: 0.9 }),
  court: null, // canvas texture material, set below
  poolWater: std({ color: 0x38bdf8, roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.78 }),
  poolTile: std({ color: 0x1fa7d4, roughness: 0.4 }),
  solar: null,
  earth: std({ color: 0x6b4a2f, roughness: 1 }),
  mat: std({ color: 0x1e3a8a, roughness: 0.95 }),
  matFoam: std({ color: 0x111827, roughness: 0.95 }),
  white: std({ color: 0xf8fafc, roughness: 0.5 }),
  rubber: std({ color: 0x2b2f36, roughness: 0.9 }),
  led: std({ color: 0xfff4de, emissive: 0xfff0d0, emissiveIntensity: 2.2, roughness: 0.4 }),
  leaf: null,
  trunk: std({ color: 0x8a6d4b, roughness: 1 }),
  hedge: std({ color: 0x3f6b3a, roughness: 1 }),
  treeCrown: std({ color: 0x4f7d44, roughness: 1 }),
  wallInt: std({ color: 0xf1efe9, roughness: 0.95 }),
  floorInt: std({ color: 0xd9d2c4, roughness: 0.7 }),
  floorWet: std({ color: 0x9fb1ba, roughness: 0.5 }),
  bedWhite: std({ color: 0xf3f4f6, roughness: 0.6 }),
  bedBlue: std({ color: 0x3b82f6, roughness: 0.6 }),
  hbot: std({ color: 0xf5f7fa, roughness: 0.25, metalness: 0.3 }),
  plunge: std({ color: 0x7dd3fc, roughness: 0.15, transparent: true, opacity: 0.85 }),
  turf: std({ color: 0x3f9142, roughness: 1 }),
  pickle: std({ color: 0x2e6aa8, roughness: 0.75 }),
  pickleOut: std({ color: 0x2f7d4f, roughness: 0.8 }),
  holdY: std({ color: 0xfacc15, roughness: 0.6 }),
  holdR: std({ color: 0xef4444, roughness: 0.6 }),
  holdB: std({ color: 0x2563eb, roughness: 0.6 }),
  holdK: std({ color: 0x111111, roughness: 0.6 }),
  climbPanel: std({ color: 0xc2561f, roughness: 0.92 }),
  net: null,
  soffit: std({ color: 0xb97a3e, roughness: 0.55, side: THREE.DoubleSide }),
  travertine: std({ color: 0xd8cdb8, roughness: 0.85 }),
  pathStone: std({ color: 0x8a8379, roughness: 0.9 }),
  pebble: std({ color: 0x4d5560, roughness: 1 }),
  pondWater: std({ color: 0x3a8f9a, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.55 }),
  koiOrange: std({ color: 0xff6a1a, roughness: 0.4 }),
  koiWhite: std({ color: 0xf5f1e6, roughness: 0.4 }),
  koiDark: std({ color: 0x1a1a1a, roughness: 0.4 }),
  koiGold: std({ color: 0xf3b43a, roughness: 0.4 }),
  louvre: std({ color: 0xd5dade, roughness: 0.35, metalness: 0.65 }),
  grating: std({ color: 0x59626b, roughness: 0.6, metalness: 0.5 }),
};

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

// BWF court texture (6.10 x 13.40 m, 40 mm white lines, tournament green)
function courtTexture() {
  const S = 120; // px / m
  return canvasTex(Math.round(6.1 * S), Math.round(13.4 * S), (g, w, h) => {
    g.fillStyle = '#15803d';
    g.fillRect(0, 0, w, h);
    // light sand grain
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    g.strokeStyle = '#f8fafc';
    g.lineWidth = 0.04 * S;
    const L = (x1, y1, x2, y2) => {
      g.beginPath();
      g.moveTo(x1 * S, y1 * S);
      g.lineTo(x2 * S, y2 * S);
      g.stroke();
    };
    const W = 6.1, H = 13.4, ins = 0.02;
    g.strokeRect(ins * S, ins * S, (W - 2 * ins) * S, (H - 2 * ins) * S);
    L(0.46, 0, 0.46, H); L(W - 0.46, 0, W - 0.46, H); // singles side lines
    L(0, 0.76, W, 0.76); L(0, H - 0.76, W, H - 0.76); // doubles long service
    L(0, H / 2 - 1.98, W, H / 2 - 1.98); L(0, H / 2 + 1.98, W, H / 2 + 1.98); // short service
    L(W / 2, 0, W / 2, H / 2 - 1.98); L(W / 2, H / 2 + 1.98, W / 2, H); // centre line
  });
}
M.court = std({ map: courtTexture(), roughness: 0.65 });

function pickleTexture() {
  const S = 80;
  return canvasTex(Math.round(6.1 * S), Math.round(13.4 * S), (g, w, h) => {
    g.fillStyle = '#2e6aa8';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#2f7d4f'; // 2.1 m kitchen zones lighter
    g.strokeStyle = '#f8fafc';
    g.lineWidth = 0.05 * S;
    g.strokeRect(0.5 * S, 0.5 * S, w - S, h - S);
    const L = (a, b, c, d) => { g.beginPath(); g.moveTo(a * S, b * S); g.lineTo(c * S, d * S); g.stroke(); };
    L(0.5, h / S / 2 - 2.1, 6.1 - 0.5, h / S / 2 - 2.1);
    L(0.5, h / S / 2 + 2.1, 6.1 - 0.5, h / S / 2 + 2.1);
    L(3.05, 0.5, 3.05, h / S / 2 - 2.1);
    L(3.05, h / S / 2 + 2.1, 3.05, h / S - 0.5);
  });
}
M.pickleTex = std({ map: pickleTexture(), roughness: 0.75 });

M.solar = std({
  map: canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#0b1220';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(120,140,170,0.35)';
    g.lineWidth = 1.2;
    for (let i = 0; i <= 6; i++) { g.beginPath(); g.moveTo((i * w) / 6, 0); g.lineTo((i * w) / 6, h); g.stroke(); }
    for (let i = 0; i <= 10; i++) { g.beginPath(); g.moveTo(0, (i * h) / 10); g.lineTo(w, (i * h) / 10); g.stroke(); }
    g.strokeStyle = 'rgba(10,10,10,0.9)';
    g.lineWidth = 3;
    g.strokeRect(0, 0, w, h);
  }),
  roughness: 0.18,
  metalness: 0.6,
  side: THREE.DoubleSide,
});
M.solar.map.wrapS = M.solar.map.wrapT = THREE.RepeatWrapping;

M.leaf = std({
  map: canvasTex(128, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = '#4d6b2a';
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(w / 2, h); g.lineTo(w / 2, 0); g.stroke();
    g.fillStyle = '#4a8a2e';
    for (let i = 0; i < 38; i++) {
      const y = h - 6 - i * 6.2, len = (w / 2) * (0.35 + 0.65 * Math.sin((i / 38) * Math.PI * 0.9 + 0.2));
      for (const s of [-1, 1]) {
        g.beginPath();
        g.moveTo(w / 2, y);
        g.lineTo(w / 2 + s * len, y - 10);
        g.lineTo(w / 2 + s * len * 0.9, y - 5);
        g.closePath();
        g.fill();
      }
    }
  }),
  alphaTest: 0.45,
  roughness: 0.9,
  side: THREE.DoubleSide,
});

M.net = new THREE.MeshStandardMaterial({
  map: canvasTex(128, 32, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(15,15,15,0.9)';
    g.lineWidth = 1;
    for (let x = 0; x <= w; x += 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += 4) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.fillStyle = '#f8fafc';
    g.fillRect(0, 0, w, 5);
  }),
  transparent: true,
  alphaTest: 0.2,
  side: THREE.DoubleSide,
  roughness: 1,
});

// ───────────────────────────── builder ─────────────────────────────
class B {
  constructor(name) {
    this.group = new THREE.Group();
    this.group.name = name;
    this.map = new Map();
  }
  add(mat, geo) {
    if (geo.index) geo = geo.toNonIndexed(); // Extrude/Shape geometries are non-indexed; merge needs one convention
    for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) geo.deleteAttribute(k);
    if (!this.map.has(mat)) this.map.set(mat, []);
    this.map.get(mat).push(geo);
  }
  box(x0, x1, y0, y1, z0, z1, mat) {
    const g = new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(z1 - z0), Math.abs(y1 - y0));
    g.translate((x0 + x1) / 2, (z0 + z1) / 2, -(y0 + y1) / 2);
    this.add(mat, g);
  }
  // box by centre + size (spec axes)
  cbox(cx, cy, cz, sx, sy, sz, mat, rotZ = 0) {
    const g = new THREE.BoxGeometry(sx, sz, sy);
    if (rotZ) g.rotateY(rotZ);
    g.translate(cx, cz, -cy);
    this.add(mat, g);
  }
  cyl(x, y, z0, z1, rBot, rTop, mat, seg = 28, open = false) {
    const g = new THREE.CylinderGeometry(rTop, rBot, z1 - z0, seg, 1, open);
    g.translate(x, (z0 + z1) / 2, -y);
    this.add(mat, g);
  }
  torus(x, y, z, R, tube, mat, seg = 40) {
    const g = new THREE.TorusGeometry(R, tube, 8, seg);
    g.rotateX(Math.PI / 2);
    g.translate(x, z, -y);
    this.add(mat, g);
  }
  member(a, b, r, mat, seg = 6) {
    const p = V(...a), q = V(...b);
    const d = q.clone().sub(p);
    const len = d.length();
    const g = new THREE.CylinderGeometry(r, r, len, seg, 1);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    g.applyMatrix4(new THREE.Matrix4().compose(p.clone().add(q).multiplyScalar(0.5), quat, new THREE.Vector3(1, 1, 1)));
    this.add(mat, g);
  }
  quad(mat, p0, p1, p2, p3, uvScale) {
    const pts = [p0, p1, p2, p3].map((p) => V(...p));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flatMap((p) => [p.x, p.y, p.z]), 3));
    const us = uvScale || [1, 1];
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, us[0], 0, us[0], us[1], 0, us[1]], 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    this.add(mat, g);
  }
  geo(mat, g) { this.add(mat, g); }
  flush() {
    for (const [mat, geos] of this.map) {
      const g = mergeGeometries(geos, false);
      const mesh = new THREE.Mesh(g, mat);
      const transparent = mat.transparent && !mat.alphaTest;
      mesh.castShadow = !transparent;
      mesh.receiveShadow = true;
      mesh.name = `${this.group.name}:${mat.name || 'mesh'}`;
      this.group.add(mesh);
    }
    this.map.clear();
    return this.group;
  }
}

// ───────────────────────────── cyclone tiles ─────────────────────────────
const KILN = [0xea752b, 0xb83d12, 0x661a09, 0x300d05].map((h) => new THREE.Color(h));
function kilnColor(s) {
  const w = (1 - Math.abs(2 * (s - Math.floor(s)) - 1)) * 3;
  const i = Math.min(2, Math.floor(w));
  return KILN[i].clone().lerp(KILN[i + 1], w - i);
}
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function cyclone(b, o) {
  const { cx, cy, z0, z1, r0, r1, rw = 0, twist, nRods, nTiles, a0 = 0, arc = TAU, tw = 0.2, th = 0.34, phase = 0 } = o;
  const pt = (a, t) => {
    const r = r0 + (r1 - r0) * t + rw * Math.sin(Math.PI * t);
    const f = a + twist * t;
    return new THREE.Vector3(cx + r * Math.cos(f), cy + r * Math.sin(f), z0 + (z1 - z0) * t);
  };
  const geos = [];
  const full = arc >= TAU - 1e-6;
  for (let i = 0; i < nRods; i++) {
    const a = a0 + arc * (full ? i / nRods : i / (nRods - 1));
    for (let j = 0; j < nTiles; j++) {
      const t = (j + 0.5) / nTiles;
      const p = pt(a, t);
      const d = pt(a, t + 0.01).sub(pt(a, t - 0.01)).normalize();
      const rad3 = new THREE.Vector3(p.x - cx, p.y - cy, 0).normalize();
      const n = rad3.clone().sub(d.clone().multiplyScalar(rad3.dot(d))).normalize();
      const w = new THREE.Vector3().crossVectors(d, n).normalize();
      const m = new THREE.Matrix4().makeBasis(V(w.x, w.y, w.z), V(d.x, d.y, d.z), V(n.x, n.y, n.z));
      m.setPosition(V(p.x, p.y, p.z));
      const g = new THREE.BoxGeometry(tw, th, 0.014);
      g.applyMatrix4(m);
      const c = kilnColor((i / nRods) * 2 + t * 1.15 + phase + (rnd() - 0.5) * 0.12);
      const col = new Float32Array(g.attributes.position.count * 3);
      for (let k = 0; k < g.attributes.position.count; k++) { col[3 * k] = c.r; col[3 * k + 1] = c.g; col[3 * k + 2] = c.b; }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geos.push(g);
    }
  }
  b.add(M.tiles, mergeGeometries(geos, false));
  return pt;
}

function towerHardware(b, o) {
  const { cx, cy, trayZ = 2.55, zTop, coreW = 0.25, coreRound = false, collar = true, hoops = [], rAt } = o;
  if (coreRound) b.cyl(cx, cy, 0, zTop, 0.16, 0.16, M.charcoal, 16);
  else b.cbox(cx, cy, zTop / 2, coreW, coreW, zTop, M.charcoal);
  if (collar) b.cyl(cx, cy, 0.1, 2.2, 0.32, 0.32, M.collarBlue, 28);
  b.cyl(cx, cy, trayZ - 0.03, trayZ + 0.04, 0.86, 0.86, M.ss316, 48);
  b.torus(cx, cy, trayZ + 0.04, 0.86, 0.025, M.ss316, 48);
  for (const h of hoops) b.torus(cx, cy, h, rAt(h), 0.022, M.steel, 36);
}

// ───────────────────────────── model ─────────────────────────────
export function buildModel(opts = {}) {
  const R2 = opts.scheme === 'r2';
  const C6 = opts.scheme !== 'boxing'; // REV R50: 6th badminton court (B1) is now the main scheme; the boxing rings stay as ?scheme=boxing
  const XEAST = 20.2 + 0.15 + 1.5 + 6.1 + 1.5; // REV R49: east plot line 1.50 m beyond the pickleball courts (x 29.45) // REV R2 'Recovery Courtyard' scheme for the rear zone (see README)
  const root = new THREE.Group();
  root.name = 'MyPlace_Master_vD6';
  const G = {}; // named layers
  const layer = (name) => (G[name] = new B(name));

  // geometry constants (spec §1.2)
  const HALL = { x0: -0.8, x1: 22.3, y0: -10.15, y1: 24.1, eave: 8.6, ridge: 11.25, ridgeX: 10.75 };
  const SLAB = { x0: -1.8, x1: 22.2, y0: 24.1, y1: 30.1 };
  const Z2 = 3.5, Z3 = 7.0, ZR = 10.5;
  // REV R45 (user's R33): the hall runs west to the solid boundary wall (x −3.90…−3.70); palms P2 / P3 stand in open notches of that wall
  const XWALL = -3.7, PALM_NOTCH = [[22.6, 24.1]]; // REV R51: palms P2 / P3 removed → straight solid wall; only the hall's NW corner steps in round palm P1 (trunk 0.1 m from the wall line otherwise)
  // REV R47 (user): hall east wall on grid E (x 20.20): bi-fold doors below +3.50 on the column centreline; catwalk 0.80 m at +3.50 on the outer face of the E columns
  const XE = 20.2, CW = 0.8, ZCW = 3.5;
  const zRoofW = (x) => 11.25 - Math.abs(x - 10.75) * ((11.25 - 8.6) / (10.75 + 0.8)) - 0.05;
  // column schedule R47 (summary R46 + user's corrections): W-line all at x −3.13; W0 moved 2.0 m north (telecom tower); A3 removed
  // R50: A1 removed (load to W1); W4 at x −2.40 (≥ 2.0 m from palm P1) · R51: P2/P3 gone → W3 back on grid 3
  const COLS_HALL = [[-3.13, -8.15, 'W0'], [-3.13, -1.65, 'W1'], [-3.13, 7.35, 'W2'], [-3.13, 16.35, 'W3'], [-2.4, 25.1, 'W4'], [0.2, -10.15, 'A0'], ...(C6 ? [] : [[0.2, -1.65, 'A1']]), [0.2, 7.35, 'A2'], [XE, -10.15, 'E0'], [XE, -1.65, 'E1'], [XE, 7.35, 'E2'], [XE, 16.35, 'E3']];

  // ── site ────────────────────────────────────────────────────────
  {
    const b = layer('site');
    layer('fences');
    // ground with holes for the sunk crash pit and the pool
    const shape = new THREE.Shape();
    const gx0 = -70, gx1 = 90, gy0 = -80, gy1 = 80;
    shape.moveTo(gx0, gy0); shape.lineTo(gx1, gy0); shape.lineTo(gx1, gy1); shape.lineTo(gx0, gy1); shape.lineTo(gx0, gy0);
    const hole = (x0, x1, y0, y1) => {
      const h = new THREE.Path();
      h.moveTo(x0, y0); h.lineTo(x0, y1); h.lineTo(x1, y1); h.lineTo(x1, y0); h.lineTo(x0, y0);
      shape.holes.push(h);
    };
    if (R2) hole(25.15, 27.5, 22.2, 27.8); else hole(22.85, 25.05, 24.9, 29.2);
    hole(13.4, 19.4, 31.6, 34.6); // prefab pool pit 6.0 × 3.0
    const gg = new THREE.ShapeGeometry(shape);
    gg.rotateX(-Math.PI / 2);
    gg.translate(0, -0.02, 0);
    b.add(M.grass, gg);
    // road, kerb, footpath
    b.box(-70, 90, -38, -24.5, -0.03, 0.0, M.asphalt);
    for (let x = -66; x < 88; x += 8) b.box(x, x + 3.5, -31.1, -30.9, 0.0, 0.012, M.white);
    b.box(-70, 90, -24.5, -22, -0.02, 0.12, M.concrete);
    // front plaza + side paths + rear yard paving
    b.box(-4.4, 38.5, -22, -10.15, -0.02, 0.02, M.paving);
    b.box(XE, 21.4, -10.15, 24.1, -0.02, 0.02, M.paving);
    b.box(-4.4, -3.9, -10.15, 30.1, -0.02, 0.02, M.paving);
    // concrete floor under hall + aisle
    b.box(XWALL, HALL.x1, HALL.y0, 25.1, -0.02, 0.0, M.concrete);
    // plot boundary: west fence (x = -4.4), skewed rear fence, east + front low hedge
    const fence = (x0, y0, x1, y1, h = 1.8) => {
      const len = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
      const g = new THREE.BoxGeometry(len, h, 0.08);
      g.rotateY(ang);
      g.translate((x0 + x1) / 2, h / 2, -(y0 + y1) / 2);
      G.fences.add(M.charcoal, g);
    };
    fence(-4.4, -12.5, -4.4, 33.45, 0.9);
    fence(-4.4, 33.45, XEAST, 33.45 + (XEAST + 4.4) * 0.15, 0.5); // slope 3/20 through (0.2,34.1) and (20.2,37.1)
    fence(XEAST, 33.45 + (XEAST + 4.4) * 0.15, XEAST, 23.7); fence(XEAST, -9.0, XEAST, -12.5); // east plot line (the pickleball chain-link takes y −9.0…23.7)
    b.box(-4.4, 3.2, -12.6, -12.4, 0, 0.6, M.hedge); b.box(18.3, XEAST, -12.6, -12.4, 0, 0.6, M.hedge);
    // boundary markers (setbacks)
    b.box(-4.45, -4.35, -12.5, 34, 0.0, 0.03, M.holdY);
  }

  // ── Badminton hall shell ───────────────────────────────────────
  {
    const b = layer('hall_shell');
    const t = 0.25;
    // west wall (x=-0.8) – solid to 7.4, louvre band above
    // REV R45 (user's R33): the west wing is gone — the hall's west wall IS the solid boundary wall x −3.90…−3.70 (full length, to the roof),
    // with two open notches (1.0 × 1.3 m, open to the sky) where palms P2 / P3 stand; the old wall at x −0.8 is removed
    { let y = HALL.y0 - 0.25; for (const [n0, n1] of PALM_NOTCH) { b.box(XWALL - 0.2, XWALL, y, n0, 0, 7.4, M.plaster); b.box(XWALL - 0.2, -2.7, n0 - 0.2, n0, 0, 7.4, M.plaster); b.box(XWALL - 0.2, -2.7, n1, n1 + 0.2, 0, 7.4, M.plaster); b.box(-2.9, -2.7, n0, n1, 0, 7.4, M.plaster); y = n1; } b.box(XWALL - 0.2, XWALL, y, HALL.y1 + 0.1, 0, 7.4, M.plaster); }
    b.box(XWALL - 0.2, HALL.x0, HALL.y0 - 0.25, HALL.y0, 0, 8.4, M.plaster); // front wall extension
    b.box(XWALL - 0.2, -1.8, HALL.y1 - 0.1, HALL.y1 + 0.1, 0, 8.4, M.plaster); b.box(-1.8, HALL.x0, HALL.y1 - 0.1, HALL.y1 + 0.1, 7.0, 8.4, M.plaster); // rear wall extension
    // REV R47 east wall on grid E (x 20.20): bi-fold (บานเฟี่ยม) door leaves 0.90 m below +3.50 on the column centreline, fixed glass + louvre band above up to the roof
    { const zT = ZCW, zR = 9.0;
      b.box(XE - 0.06, XE + 0.06, HALL.y0, HALL.y1, zT - 0.1, zT + 0.15, M.charcoal); // head beam / catwalk ledger
      let k = 0;
      for (let y = HALL.y0 + 0.1; y < HALL.y1 - 0.1; y += 0.9, k++) {
        const bay = Math.floor((y - HALL.y0) / 4.5);
        const open = bay === 3 || bay === 6; // two bays shown folded open
        if (open) { if (k % 5 === 0) for (let j = 0; j < 4; j++) b.box(XE + 0.05 + j * 0.06, XE + 0.1 + j * 0.06, y, y + 0.12, 0.05, zT - 0.12, M.teak); continue; }
        const g = new THREE.BoxGeometry(0.05, zT - 0.17, 0.88); g.rotateY(k % 2 ? 0.12 : -0.12); g.translate(XE, (zT - 0.17) / 2 + 0.05, -(y + 0.45)); b.add(M.glassFrost, g);
        b.box(XE - 0.04, XE + 0.04, y - 0.02, y + 0.02, 0.05, zT - 0.12, M.teak);
      }
      b.box(XE - 0.05, XE + 0.05, HALL.y0, HALL.y1, 0, 0.05, M.steel); // floor track
      // REV R48: wall above +3.50 on the OUTER edge of the catwalk (x 21.15) — the catwalk is inside and doubles as a viewing gallery over the courts
      const XO = XE + 0.15 + CW, zRo = 8.8;
      b.box(XO - 0.02, XO + 0.02, HALL.y0, HALL.y1, zT + 0.05, 7.4, M.glass);
      for (let y = HALL.y0; y <= HALL.y1 + 0.01; y += 2.25) b.box(XO - 0.04, XO + 0.04, y - 0.03, y + 0.03, zT, zRo, M.charcoal);
      for (let z = 7.45; z < zRo; z += 0.16) b.box(XO - 0.08, XO + 0.08, HALL.y0, HALL.y1, z, z + 0.03, M.charcoal);
      b.box(XE + 0.15, XO, HALL.y0 - 0.25, HALL.y0, zT, zRo, M.plaster); // front end closed
    }
    // hall columns R47 (portal frames, full height to the roof) — A3 removed (user R33), W-line at x −3.13
    for (const [x, y, id] of COLS_HALL) b.box(x - 0.15, x + 0.15, y - 0.15, y + 0.15, 0, x === XE ? 9.0 : x > 0 ? 8.6 : zRoofW(x), M.concreteDark); // R50: A1 removed (court B1); W3 / W4 kept ≥ 2.0 m from the palm trunks
    // louvre bands 7.4 – 8.6
    for (const x of [XWALL - 0.1]) {
      for (let z = 7.45; z < 8.6; z += 0.16) b.box(x - 0.08, x + 0.08, HALL.y0, HALL.y1, z, z + 0.03, M.charcoal);
    }
    // front wall y=-10.15 : plaster + gable, entrance + flanking glazing
    const fy0 = HALL.y0 - 0.25, fy1 = HALL.y0;
    const cut = [[9.55, 11.95, 0, 3.0], [1.4, 6.6, 0.4, 3.3], [14.9, 20.1, 0.4, 3.3]];
    // build the front wall as strips so openings stay open
    const xs = [HALL.x0, 1.4, 6.6, 9.55, 11.95, 14.9, 20.1, HALL.x1];
    // piers between openings full height to 8.6
    b.box(HALL.x0, 1.4, fy0, fy1, 0, 8.6, M.plaster);
    b.box(6.6, 9.55, fy0, fy1, 0, 8.6, M.plaster);
    b.box(11.95, 14.9, fy0, fy1, 0, 8.6, M.plaster);
    b.box(20.1, HALL.x1, fy0, fy1, 0, 8.6, M.plaster);
    // above / below openings
    for (const [x0, x1, z0, z1] of cut) {
      if (z0 > 0) b.box(x0, x1, fy0, fy1, 0, z0, M.plasterWarm);
      b.box(x0, x1, fy0, fy1, z1, 8.6, M.plaster);
      b.box(x0, x1, fy0 + 0.1, fy0 + 0.14, z0, z1, M.glass);
      // frames
      b.box(x0, x1, fy0 + 0.04, fy0 + 0.2, z1 - 0.06, z1, M.charcoal);
      b.box(x0, x0 + 0.06, fy0 + 0.04, fy0 + 0.2, z0, z1, M.charcoal);
      b.box(x1 - 0.06, x1, fy0 + 0.04, fy0 + 0.2, z0, z1, M.charcoal);
    }
    // sliding door centre mullion (2.40 m clear)
    b.box(10.72, 10.78, fy0 + 0.04, fy0 + 0.2, 0, 3.0, M.charcoal);
    // gable triangle
    {
      const shp = new THREE.Shape();
      shp.moveTo(HALL.x0 - t, 8.6); shp.lineTo(HALL.x1 + 0.05, 8.6); shp.lineTo(HALL.ridgeX, HALL.ridge + 0.12); shp.lineTo(HALL.x0 - t, 8.6);
      const g = new THREE.ExtrudeGeometry(shp, { depth: 0.25, bevelEnabled: false });
      g.translate(0, 0, -HALL.y0); // spec y → Three -z: slab spans y = -10.40 … -10.15
      b.add(M.plaster, g);
    }
    // rear gable end above rear complex (y=24.1), L3 studio glazing in it
    b.box(HALL.x0, HALL.x1, HALL.y1 - 0.1, HALL.y1 + 0.1, 7.0, 8.6, M.plaster);
    b.box(4.2, 17.2, HALL.y1 - 0.06, HALL.y1 + 0.06, 7.3, 10.3, M.glass);
    for (let x = 4.2; x <= 17.21; x += 1.3) b.box(x - 0.04, x + 0.04, HALL.y1 - 0.08, HALL.y1 + 0.08, 7.0, 10.5, M.charcoal);
    // gable rear (triangle above 8.6)
    {
      const shp = new THREE.Shape();
      shp.moveTo(HALL.x0 - t, 8.6); shp.lineTo(HALL.x1 + 0.05, 8.6); shp.lineTo(HALL.ridgeX, HALL.ridge + 0.12); shp.lineTo(HALL.x0 - t, 8.6);
      const g = new THREE.ExtrudeGeometry(shp, { depth: 0.2, bevelEnabled: false });
      g.translate(0, 0, -HALL.y1 - 0.2);
      b.add(M.plaster, g);
    }
    // ground-floor south wall of the hall behind courts is the clinic façade (built with rear complex)

    // REV R47: portal columns are drawn from COLS_HALL in the wall block above
    // sign "MY PLACE"
    const signTex = canvasTex(1024, 192, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.fillStyle = '#f8fafc';
      g.font = '600 120px "Helvetica Neue", Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('M Y   P L A C E', w / 2, h / 2 + 4);
    });
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.7, 0.7),
      new THREE.MeshStandardMaterial({ map: signTex, transparent: true, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.15, roughness: 0.6 })
    );
    sign.position.set(HALL.ridgeX, 3.9, -(HALL.y0 - 0.31));
    sign.name = 'sign';
    G.hall_shell.group.add(sign);
    // sign backing band
    b.box(8.85, 12.65, HALL.y0 - 0.28, HALL.y0 - 0.25, 3.5, 4.3, M.charcoal);
  }

  // ── Hall roof: gable sheet + space-frame trusses + solar + skylight ──
  {
    const b = layer('hall_roof');
    const ov = 0.5; // eave overhang
    const slope = (HALL.ridge - HALL.eave) / (HALL.ridgeX - HALL.x0);
    const zRoof = (x) => HALL.ridge - Math.abs(x - HALL.ridgeX) * slope;
    const yA = HALL.y0 - 0.5, yB = HALL.y1 + 0.0;
    // roof sheet (two planes)
    const xw = XWALL - 0.2 - ov, xe = HALL.x1 + ov, xn = -2.6; // REV R45: west eave beyond the boundary wall; roof strip x < −2.6 is cut open over the palm notches
    b.quad(M.roofSheet, [xn, yA, zRoof(xn)], [HALL.ridgeX, yA, HALL.ridge], [HALL.ridgeX, yB, HALL.ridge], [xn, yB, zRoof(xn)]);
    { let y = yA; for (const [n0, n1] of [...PALM_NOTCH, [yB, yB]]) { if (n0 > y) b.quad(M.roofSheet, [xw, y, zRoof(xw)], [xn, y, zRoof(xn)], [xn, n0, zRoof(xn)], [xw, n0, zRoof(xw)]); y = n1; } }
    b.quad(M.roofSheet, [HALL.ridgeX, yA, HALL.ridge], [xe, yA, zRoof(xe)], [xe, yB, zRoof(xe)], [HALL.ridgeX, yB, HALL.ridge]);
    // underside lining slightly below
    const u = 0.14;
    b.quad(M.roofUnder, [HALL.x0, HALL.y0, zRoof(HALL.x0) - u], [HALL.ridgeX, HALL.y0, HALL.ridge - u], [HALL.ridgeX, yB, HALL.ridge - u], [HALL.x0, yB, zRoof(HALL.x0) - u]);
    b.quad(M.roofUnder, [HALL.ridgeX, HALL.y0, HALL.ridge - u], [HALL.x1, HALL.y0, zRoof(HALL.x1) - u], [HALL.x1, yB, zRoof(HALL.x1) - u], [HALL.ridgeX, yB, HALL.ridge - u]);
    // ridge skylight strip
    b.quad(M.skylight, [HALL.ridgeX - 1.2, HALL.y0 + 1, zRoof(HALL.ridgeX - 1.2) + 0.03], [HALL.ridgeX, HALL.y0 + 1, HALL.ridge + 0.03], [HALL.ridgeX, yB - 1, HALL.ridge + 0.03], [HALL.ridgeX - 1.2, yB - 1, zRoof(HALL.ridgeX - 1.2) + 0.03]);
    // rooftop PV arrays, both slopes (35–48 kWp zone)
    const panelAt = (xa, xb, y0, y1) => {
      const lift = 0.07;
      b.quad(M.solar, [xa, y0, zRoof(xa) + lift], [xb, y0, zRoof(xb) + lift], [xb, y1, zRoof(xb) + lift], [xa, y1, zRoof(xa) + lift], [Math.round(Math.abs(xb - xa) / 1.3), Math.round((y1 - y0) / 2.3)]);
    };
    panelAt(0.4, 9.4, 1.0, 22.0);
    panelAt(12.1, 21.1, 1.0, 22.0);
    // Space-frame trusses every 2.6 m (span ≈ 23 m, no column inside the courts)
    const rBig = 0.07, rSm = 0.035;
    const nT = 14, step = (HALL.y1 - 0.4 - (HALL.y0 + 0.4)) / (nT - 1);
    const zb = HALL.eave; // bottom chord level
    for (let k = 0; k < nT; k++) {
      const y = HALL.y0 + 0.4 + k * step;
      const xs = [];
      const nx = 12;
      for (let i = 0; i <= nx; i++) xs.push(HALL.x0 + ((HALL.x1 - HALL.x0) * i) / nx);
      b.member([HALL.x0, y, zb], [HALL.x1, y, zb], rBig, M.truss, 8);
      for (let i = 0; i < nx; i++) {
        const xa = xs[i], xb = xs[i + 1];
        const ta = [xa, y, zRoof(xa) - 0.2], tb = [xb, y, zRoof(xb) - 0.2];
        b.member(ta, tb, rBig, M.truss, 8);
        b.member([xa, y, zb], tb, rSm, M.truss);
        b.member([xb, y, zb], tb, rSm, M.truss);
        b.member([xa, y, zb], ta, rSm, M.truss);
      }
      b.member([HALL.x1, y, zb], [HALL.x1, y, zRoof(HALL.x1) - 0.2], rSm, M.truss);
    }
    // purlins/longitudinal tubes (space-frame cross-bracing)
    for (let i = 0; i <= 12; i++) {
      const x = HALL.x0 + ((HALL.x1 - HALL.x0) * i) / 12;
      b.member([x, HALL.y0 + 0.4, zRoof(x) - 0.2], [x, HALL.y1 - 0.4, zRoof(x) - 0.2], 0.04, M.truss);
    }
    // indirect LED troughs, two per bay, glowing onto roof reflectors
    for (const x of [3.2, 7.4, 14.1, 18.3]) {
      b.box(x - 0.15, x + 0.15, HALL.y0 + 1, HALL.y1 - 1, zRoof(x) - 0.45, zRoof(x) - 0.38, M.led);
    }
    // HVLS fans Ø6.0 m x4
    for (const [fx, fy] of [[5.2, -1.7], [15.2, -1.7], [5.2, 16.4], [15.2, 16.4]]) {
      b.cyl(fx, fy, 7.1, 7.6, 0.25, 0.25, M.charcoal, 16);
      b.cyl(fx, fy, 7.6, 8.6, 0.05, 0.05, M.charcoal, 8);
      for (let k = 0; k < 6; k++) {
        const a = (k * TAU) / 6;
        const g = new THREE.BoxGeometry(2.75, 0.04, 0.32);
        g.translate(1.55, 0, 0);
        g.rotateY(a);
        g.translate(fx, 7.2, -fy);
        b.add(M.white, g);
      }
    }
  }

  // ── Front facade: raised Solar Ribbon + Cyclone C1 / C2 down to the water court (REV D.7) ──
  // Ribbon keeps the hall's gable slope (0.2275) but its ridge sits 0.50 m below the hall ridge (11.25 → 10.75),
  // so it now canopies over the full height of both towers. The steel cores of C1/C2 carry it.
  const RIB_RIDGE = HALL.ridge - 0.5;
  const ribZ = (x) => RIB_RIDGE - Math.abs(x - HALL.ridgeX) * 0.2275;
  {
    const b = layer('front_facade');
    const xa = 4.25, xb = 17.25, y0 = -12.5, y1 = -10.15;
    const t = 0.14; // build-up of the ribbon (frame + soffit)
    // warm timber soffit (visible from the entrance) + charcoal frame + PV
    b.quad(M.soffit, [xa, y0, ribZ(xa) - t], [HALL.ridgeX, y0, RIB_RIDGE - t], [HALL.ridgeX, y1, RIB_RIDGE - t], [xa, y1, ribZ(xa) - t], [4, 1]);
    b.quad(M.soffit, [HALL.ridgeX, y0, RIB_RIDGE - t], [xb, y0, ribZ(xb) - t], [xb, y1, ribZ(xb) - t], [HALL.ridgeX, y1, RIB_RIDGE - t], [4, 1]);
    for (const [pa, pb] of [[xa, HALL.ridgeX], [HALL.ridgeX, xb]]) {
      b.quad(M.solar, [pa, y0, ribZ(pa)], [pb, y0, ribZ(pb)], [pb, y1, ribZ(pb)], [pa, y1, ribZ(pa)], [5, 1]);
    }
    for (const x of [xa, HALL.ridgeX, xb]) b.box(x - 0.04, x + 0.04, y0, y1, ribZ(x) - t, ribZ(x) + 0.03, M.charcoal);
    // front fascia beam (follows the gable)
    for (const [pa, pb] of [[xa, HALL.ridgeX], [HALL.ridgeX, xb]]) b.member([pa, y0, ribZ(pa) - 0.08], [pb, y0, ribZ(pb) - 0.08], 0.07, M.charcoal, 8);
    // rafters (outriggers) from the hall façade + diagonal knee braces, one every ~1.6 m
    for (const x of [4.6, 6.0, 7.35, 8.9, 10.75, 12.6, 14.15, 15.6, 16.9]) {
      b.member([x, y1, ribZ(x) - 0.2], [x, y0 + 0.05, ribZ(x) - 0.16], 0.045, M.charcoal, 8);
      if ([4.6, 8.9, 12.6, 16.9].includes(x)) b.member([x, y1, ribZ(x) - 0.9], [x, y0 + 0.5, ribZ(x) - 0.2], 0.03, M.charcoal, 6);
    }
    // downlights under the ribbon
    for (const x of [5.2, 9.0, 10.75, 12.5, 16.3]) for (const y of [-11.0, -12.0]) b.cyl(x, y, ribZ(x) - t - 0.03, ribZ(x) - t, 0.07, 0.07, M.led, 10);

    // twin Cyclone towers: counter-rotating 128° funnels, tiles now run from the water court up to +8.60
    const TZ0 = 0.85, TZ1 = 8.6, TR0 = 0.45, TR1 = 0.72;
    const towers = [
      { cx: 7.35, cy: -11.3, twist: rad(128) },
      { cx: 14.15, cy: -11.3, twist: -rad(128) },
    ];
    for (const T of towers) {
      cyclone(b, { cx: T.cx, cy: T.cy, z0: TZ0, z1: TZ1, r0: TR0, r1: TR1, twist: T.twist, nRods: 22, nTiles: 24, phase: T.twist > 0 ? 0 : 0.3 });
      const rAt = (h) => TR0 + (TR1 - TR0) * ((h - TZ0) / (TZ1 - TZ0)) + 0.08;
      // H250 core now rises to the underside of the ribbon and carries it
      b.cbox(T.cx, T.cy, (ribZ(T.cx) - t) / 2, 0.25, 0.25, ribZ(T.cx) - t, M.charcoal);
      for (const h of [2.0, 3.5, 4.9, 6.4, 7.9]) b.torus(T.cx, T.cy, h, rAt(h), 0.022, M.steel, 36);
      b.torus(T.cx, T.cy, ribZ(T.cx) - t - 0.05, 0.4, 0.05, M.charcoal, 32); // collar at the roof connection
      // stone boss the tiles sit on (above the water line)
      b.cyl(T.cx, T.cy, 0.15, 0.82, 0.6, 0.52, M.concreteDark, 28);
      b.cyl(T.cx, T.cy, 0.80, 0.85, 0.55, 0.55, M.ss316, 28);
    }
  }

  // ── Entrance water court: one continuous plinth, two koi ponds with seating, connected bench band ──
  {
    const b = layer('entrance_court');
    const PL = 0.15, SEAT = 0.45, WATER = 0.36;
    const shp = (build) => { const s = new THREE.Shape(); build(s); return s; };
    const extrude = (shape, depth, z0, mat) => {
      const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 40 });
      g.rotateX(-Math.PI / 2);
      g.translate(0, z0, 0);
      b.add(mat, g);
    };
    // 1) the plinth: a single sculpted piece, rounded at the street side
    {
      const x0 = 3.8, x1 = 17.7, yF = -15.4, yB = -10.4, r = 1.8;
      const s = shp((p) => {
        p.moveTo(x0, yB); p.lineTo(x0, yF + r); p.quadraticCurveTo(x0, yF, x0 + r, yF); p.lineTo(x1 - r, yF);
        p.quadraticCurveTo(x1, yF, x1, yF + r); p.lineTo(x1, yB); p.lineTo(x0, yB);
      });
      extrude(s, PL, 0.0, M.travertine);
      // darker arrival path (2.8 m) leading to the 2.40 m sliding door + glowing edge strips
      b.box(9.3, 12.2, -15.4, -10.4, PL, PL + 0.02, M.pathStone);
      b.box(9.26, 9.3, -15.0, -10.45, PL, PL + 0.03, M.led);
      b.box(12.2, 12.24, -15.0, -10.45, PL, PL + 0.03, M.led);
    }
    // 2) ponds A (C1) and B (C2): ellipse basins with 0.45 m seat copings all round
    const ponds = [{ cx: 7.35, cy: -12.0, a: 1.6, bb: 1.55 }, { cx: 14.15, cy: -12.0, a: 1.6, bb: 1.55 }];
    for (const P of ponds) {
      const ring = (ao, bo, ai, bi) => shp((p) => {
        p.absellipse(P.cx, P.cy, ao, bo, 0, TAU, false, 0);
        const h = new THREE.Path(); h.absellipse(P.cx, P.cy, ai, bi, 0, TAU, true, 0); p.holes.push(h);
      });
      extrude(ring(P.a + 0.5, P.bb + 0.5, P.a, P.bb), SEAT, PL, M.travertine); // wall + seat
      extrude(ring(P.a + 0.5, P.bb + 0.5, P.a - 0.12, P.bb - 0.12), 0.06, PL + SEAT, M.teakLight); // teak seat cap
      // pebble floor + water
      const floor = new THREE.CylinderGeometry(1, 1, 0.02, 56); floor.scale(P.a, 1, P.bb); floor.translate(P.cx, PL + 0.01, -P.cy); b.add(M.pebble, floor);
      const water = new THREE.CylinderGeometry(1, 1, 0.02, 56); water.scale(P.a - 0.01, 1, P.bb - 0.01); water.translate(P.cx, PL + WATER, -P.cy); b.add(M.pondWater, water);
      // lily pads
      for (let k = 0; k < 6; k++) {
        const ang = k * 1.1 + P.cx, rr = 0.55 + (k % 3) * 0.28;
        const lp = new THREE.CylinderGeometry(0.16, 0.16, 0.01, 12); lp.translate(P.cx + Math.cos(ang) * rr * P.a * 0.6, PL + WATER + 0.012, -(P.cy + Math.sin(ang) * rr * P.bb * 0.6)); b.add(M.hedge, lp);
      }
      // koi: orange / white / dark ellipsoids with a tail fin
      const koiMats = [M.koiOrange, M.koiWhite, M.koiOrange, M.koiDark, M.koiGold];
      for (let k = 0; k < 9; k++) {
        const ang = k * 0.9 + P.cx * 2.3, rr = 0.35 + ((k * 37) % 55) / 100;
        const fx = P.cx + Math.cos(ang) * rr * P.a * 0.85, fy = P.cy + Math.sin(ang) * rr * P.bb * 0.85;
        if (Math.hypot(fx - P.cx, fy + 11.3) < 0.8) continue; // keep clear of the tower boss
        const len = 0.32 + (k % 3) * 0.08;
        const body = new THREE.SphereGeometry(0.5, 10, 6); body.scale(len, 0.07, 0.1);
        const tail = new THREE.ConeGeometry(0.06, 0.12, 6); tail.rotateZ(Math.PI / 2); tail.translate(-len * 0.55, 0, 0);
        const fish = mergeGeometries([body, tail], false);
        fish.rotateY(ang + Math.PI / 2 + (k % 2 ? 0.3 : -0.3));
        fish.translate(fx, PL + 0.14 + (k % 3) * 0.05, -fy);
        b.add(koiMats[k % koiMats.length], fish);
      }
    }
    // 3) front bench band tying the two ponds together (central 2.40 m gap = entrance axis)
    const band = (xa, xb) => { b.box(xa, xb, -14.95, -14.45, PL, PL + SEAT, M.travertine); b.box(xa, xb, -14.97, -14.43, PL + SEAT, PL + SEAT + 0.05, M.teakLight); };
    band(5.3, 9.3); band(12.2, 16.2);
    // planters behind the band (ornamental grass) and uplights
    for (const [xa, xb] of [[5.3, 9.3], [12.2, 16.2]]) {
      b.box(xa + 0.2, xb - 0.2, -14.45, -14.15, PL, PL + 0.3, M.travertine);
      for (let x = xa + 0.3; x < xb - 0.25; x += 0.28) { const g = new THREE.ConeGeometry(0.07, 0.55, 5); g.translate(x, PL + 0.55, 14.3); b.add(M.hedge, g); }
    }
    for (const x of [4.6, 17.0]) b.cyl(x, -14.8, PL, PL + 0.25, 0.1, 0.1, M.led, 10);
    // 4) underground services (shown as a dashed trench line for the plan view): recirculation pipes + sump under the plinth
    b.box(7.35 - 0.05, 14.15 + 0.05, -16.0, -15.9, -0.01, 0.0, M.pathStone); // service trench cover (flush, in the street-side apron)
  }

  // ── Cyclone family inside the hall: C0 (wet), E0 (dry), W0 (half) ──
  {
    const b = layer('cyclones');
    const hoopsFor = (z0, z1, rf) => [0.3, 0.6, 0.85].map((t) => z0 + (z1 - z0) * t);
    // C0 wet tower (10.13, 7.35)
    {
      const o = { cx: 10.13, cy: 7.35, z0: 2.55, z1: 8.6, r0: 0.55, r1: 0.66, rw: -0.1, twist: rad(128), nRods: 22, nTiles: 21 };
      cyclone(b, o);
      const rAt = (h) => 0.55 + 0.11 * ((h - 2.55) / 6.05) - 0.1 * Math.sin(Math.PI * ((h - 2.55) / 6.05)) + 0.08;
      towerHardware(b, { cx: o.cx, cy: o.cy, zTop: 8.9, coreRound: true, hoops: hoopsFor(2.55, 8.6), rAt });
      b.torus(o.cx, o.cy, 8.75, 0.55, 0.03, new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.6 }), 36); // misting ring
      // net catch fan under the tray
      const fan = new THREE.CylinderGeometry(1.5, 0.86, 0.35, 40, 1, true);
      fan.translate(o.cx, 2.38, -o.cy);
      b.add(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 1, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }), fan);
      b.torus(o.cx, o.cy, 2.2, 1.5, 0.02, M.ss316, 48);
    }
    // E0 dry twin tower on the east portal column (20.2, 7.35)
    {
      const o = { cx: 20.2, cy: 7.35, z0: 2.3, z1: 8.6, r0: 0.5, r1: 0.6, rw: -0.08, twist: rad(128), nRods: 16, nTiles: 22, phase: 0.15 };
      cyclone(b, o);
      const rAt = (h) => 0.5 + 0.1 * ((h - 2.3) / 6.3) - 0.08 * Math.sin(Math.PI * ((h - 2.3) / 6.3)) + 0.08;
      towerHardware(b, { cx: o.cx, cy: o.cy, trayZ: 2.2, zTop: 8.6, coreW: 0.3, hoops: hoopsFor(2.3, 8.6), rAt });
    }
    // W0 dry tower on the west portal column (0.2, 7.35) — now a FULL 360° tower so the wind lane (y 6.35…8.35) strikes tile faces directly
    {
      const o = { cx: 0.2, cy: 7.35, z0: 2.3, z1: 8.6, r0: 0.5, r1: 0.6, rw: -0.08, twist: rad(128), nRods: 16, nTiles: 22, phase: 0.4 };
      cyclone(b, o);
      const rAt = (h) => 0.5 + 0.1 * ((h - 2.3) / 6.3) - 0.08 * Math.sin(Math.PI * ((h - 2.3) / 6.3)) + 0.08;
      towerHardware(b, { cx: o.cx, cy: o.cy, trayZ: 2.2, zTop: 8.6, coreW: 0.3, hoops: hoopsFor(2.3, 8.6), rAt });
    }
    // base footprints at floor (blue padded collars for E0/W0)
    for (const x of [0.2, 20.2]) b.cyl(x, 7.35, 0.1, 2.1, 0.33, 0.33, M.collarBlue, 24);
  }

  // ── Badminton courts, nets, run-off, hall interior bits ──────────
  {
    const b = layer('hall_interior');
    const courts = [];
    const xs = [-1.8, 5.55, 12.85]; // REV R45: court columns as the user's R33 (1.25 m gaps; B4 starts at x −1.80)
    // REV R52: every court sits 1.20 m off grid 2 (y 7.35) on both sides, like court B1 → front row y −7.25…6.15, rear row y 8.55…21.95
    // (more space at the entrance and at the back; cross-aisle now 2.40 m on the grid-2 line with the W0 / C0 / E0 towers)
    for (const [y0] of [[-7.25], [8.55]]) for (const x0 of xs) courts.push([x0, y0]);
    for (let [x0, y0] of courts) {
      if (x0 === -1.8 && y0 < 0 && !C6) continue; // court B1 (y −7.25…6.15) · scheme 'boxing' puts the rings there instead
      const g = new THREE.PlaneGeometry(6.1, 13.4);
      g.rotateX(-Math.PI / 2);
      g.translate(x0 + 3.05, 0.01, -(y0 + 6.7));
      b.add(M.court, g);
      // surrounding run-off apron (slightly lighter slab outline)
      // posts + net
      const ny = y0 + 6.7;
      for (const px of [x0 - 0.3, x0 + 6.4]) b.cyl(px, ny, 0, 1.55, 0.03, 0.03, M.charcoal, 8);
      b.cbox(x0 + 3.05, ny, 0.79, 6.7, 0.02, 0.76, M.net);
      b.box(x0 - 0.3, x0 + 6.4, ny - 0.015, ny + 0.015, 1.5, 1.55, M.white);
    }
    // ── REV R44 boxing zone on the old court B1 (user's R33): main ring 6×6 inside the ropes, 7.80 × 7.80 platform; existing practice ring 3×3 / 4×4 ──
    const ring = (cx, cy, hOut, hIn, H, canvas, nRope) => {
      b.box(cx - hOut, cx + hOut, cy - hOut, cy + hOut, 0, H - 0.05, M.charcoal); // platform
      b.box(cx - hOut, cx + hOut, cy - hOut, cy + hOut, H - 0.05, H, canvas); // canvas
      for (const [sx, sy, m] of [[-1, -1, M.holdR], [1, 1, M.holdB], [1, -1, M.white], [-1, 1, M.white]]) {
        const px = cx + sx * hIn, py = cy + sy * hIn; b.cyl(px, py, H, H + 1.45, 0.06, 0.06, M.steel, 10); b.box(px - 0.12, px + 0.12, py - 0.12, py + 0.12, H + 0.25, H + 1.35, m);
      }
      for (let k = 1; k <= nRope; k++) { const z = H + 0.15 + k * (1.2 / nRope); for (const sy of [-1, 1]) b.box(cx - hIn, cx + hIn, cy + sy * hIn - 0.02, cy + sy * hIn + 0.02, z - 0.02, z + 0.02, M.holdR); for (const sx of [-1, 1]) b.box(cx + sx * hIn - 0.02, cx + sx * hIn + 0.02, cy - hIn, cy + hIn, z - 0.02, z + 0.02, M.holdR); }
    };
    if (!C6) {
    ring(0.18, 2.68, 3.9, 3.0, 0.9, M.holdB, 4); // main ring (R33): platform x −3.72…4.08, y −1.22…6.58, +0.90, ropes 6 × 6
    for (let i = 1; i <= 4; i++) b.box(3.2, 4.0, -1.22 - 0.3 * (5 - i), -1.22 - 0.3 * (4 - i), 0, 0.225 * i - 0.02, M.steel); // steps up at the SE corner
    ring(0.67, -5.7, 2.0, 1.5, 0.3, M.holdR, 3); // practice ring (existing, R33): x −1.33…2.67, y −7.70…−3.70, +0.30
    for (let i = 1; i <= 2; i++) b.box(2.67 + 0.3 * (2 - i), 2.67 + 0.3 * (3 - i), -6.3, -5.2, 0, 0.15 * i, M.steel); // steps (R33)
    b.box(-1.8, 4.25, -8.7, -1.22, 0.0, 0.008, M.mat); // rubber training floor (R33 hatched zone)
    }
    // thin darker apron around the court group for tournament look
    b.box(-2.2, 19.25, -8.05, 22.75, 0.0, 0.006, M.floorWet);
  }

  // ── REV R47 East catwalk: 0.80 m wide at +3.50 on the OUTER face of the grid-E columns (x 20.35 … 21.15), y −10.15 … 24.10,
  // level with the rear L2 floor (it runs straight into the L2 east link); outriggers at E0–E3 + hangers from the roof edge beam every ~3 m.
  {
    const b = layer('east_catwalk');
    const x0 = XE + 0.15, x1 = x0 + CW, y0 = HALL.y0, y1 = HALL.y1;
    b.box(x0, x1, y0, y1, ZCW - 0.05, ZCW + 0.03, M.grating);
    b.box(x1 - 0.06, x1, y0, y1, ZCW - 0.25, ZCW, M.charcoal); b.box(x0, x0 + 0.06, y0, y1, ZCW - 0.25, ZCW, M.charcoal);
    for (const y of [-10.15, -1.65, 7.35, 16.35]) { b.box(XE + 0.15, x1, y - 0.08, y + 0.08, ZCW - 0.3, ZCW - 0.05, M.charcoal); b.member([x1 - 0.05, y, ZCW - 0.3], [XE + 0.16, y, ZCW - 1.2], 0.04, M.charcoal, 8); }
    for (let y = y0 + 1.5; y < y1; y += 3.0) b.member([x1 - 0.05, y, ZCW], [x1 - 0.05, y, zRoofW(x1) - 0.3], 0.016, M.steel, 6); // hangers to the roof edge beam
    // R48: hall-side glass balustrade 1.10 m (watch the badminton from here) + lean rail; outer side is the new wall
    b.box(x0 + 0.02, x0 + 0.05, y0, y1, ZCW + 0.03, ZCW + 1.05, M.glass); b.box(x0, x0 + 0.08, y0, y1, ZCW + 1.03, ZCW + 1.1, M.teak);
    for (let y = y0; y <= y1 + 0.01; y += 2.25) b.box(x0, x0 + 0.06, y - 0.025, y + 0.025, ZCW, ZCW + 1.1, M.charcoal);
    b.box(x0, x1, y0, y0 + 0.04, ZCW, ZCW + 1.1, M.charcoal); // south end guard
    // wind-block louvre screens outside the upper glass, operated from the catwalk (z 4.75 … 7.25)
    for (let y = y0; y < y1 - 2; y += 2.7) for (let yy = y + 0.15; yy < y + 2.55; yy += 0.19) { const g = new THREE.BoxGeometry(0.1, 2.38, 0.035); g.rotateY(0.9); g.translate(x1 + 0.12, 6.0, -yy); b.add(M.louvre, g); }
    b.box(x1 + 0.08, x1 + 0.16, y0, y1, 7.25, 7.33, M.charcoal); b.box(x1 + 0.08, x1 + 0.16, y0, y1, 4.67, 4.75, M.charcoal);
  }

  // ── REV R45: WEST WING REMOVED (user) — west of the hall only the coconut palms P1–P3 and the solid boundary wall remain ──
  {
    const W = layer('west_wing');
    // the hall now runs to the boundary wall (see hall_shell); only planting beds in the two palm notches + the strip outside the wall
    for (const [y0, y1] of PALM_NOTCH) W.box(-3.9, -2.9, y0, y1, 0.0, 0.12, M.turf);
    W.box(-4.4, -3.9, 22.6, 25.0, 0.0, 0.12, M.turf); // bed round palm P1 (outside the wall)
  }
  // ── West wing REV P6 + palms garden — detailed interior (REV D.9) — DISABLED in R45, kept for reference ─────────────
  if (false) {
    const W = layer('west_wing'), GI = layer('ww_G'), UI = layer('ww_L2'), RF = layer('ww_roof');
    layer('x_wind');
    const SW = new B('ww_stair_w'), SG = new B('ww_stair_g'), SU = new B('ww_stair_u'), SR = new B('ww_stair_r');
    const SHIFT = 3.65; // stair block built at its REV D.9 position (y 5.2…9.8) and slid to y 1.55…6.15 when flushed
    const wx0 = -3.9, wx1 = -0.8, ix0 = -3.7, ix1 = -1.05; // outer faces / inner clear faces (hall wall = x −1.05…−0.8)
    const ZC = Z2 - 0.15; // ground-floor ceiling / L1 slab soffit (3.35)
    const M2 = {
      acoustic: std({ color: 0x39404a, roughness: 1 }),
      cyclo: std({ color: 0xf6f6f4, roughness: 0.95, side: THREE.DoubleSide }),
      fern: std({ color: 0x5f9a4a, roughness: 1 }),
      fernDark: std({ color: 0x2f5d33, roughness: 1 }),
      sofa: std({ color: 0x3e6b57, roughness: 0.9 }),
      sofaTan: std({ color: 0xb48a5a, roughness: 0.85 }),
      glassPod: std({ color: 0xbfd8e3, roughness: 0.05, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }),
      board: std({ color: 0xf7f7f5, roughness: 0.4 }),
      screen: std({ color: 0x0b1020, roughness: 0.2, emissive: 0x24408a, emissiveIntensity: 0.5 }),
      rug: std({ color: 0x9a5b3a, roughness: 1 }),
      rugGrey: std({ color: 0x7c8087, roughness: 1 }),
      white: std({ color: 0xf1f1ee, roughness: 0.5 }),
      moss: std({ color: 0x4a6b3a, roughness: 1 }),
      cabinet: std({ color: 0x66707b, roughness: 0.5, metalness: 0.4 }),
      lift: std({ color: 0xb9c0c7, roughness: 0.3, metalness: 0.8 }),
    };
    // wall pieces with rectangular holes. wallY: runs along x at thickness y0..y1; wallX: runs along y at thickness x0..x1.
    const wallY = (L, y0, y1, xa, xb, za, zb, mat, holes = []) => {
      let x = xa;
      for (const h of [...holes].sort((p, q) => p.x0 - q.x0)) {
        if (h.x0 > x) L.box(x, h.x0, y0, y1, za, zb, mat);
        if (h.z0 > za) L.box(h.x0, h.x1, y0, y1, za, h.z0, mat);
        if (h.z1 < zb) L.box(h.x0, h.x1, y0, y1, h.z1, zb, mat);
        x = h.x1;
      }
      if (x < xb) L.box(x, xb, y0, y1, za, zb, mat);
    };
    const wallX = (L, x0, x1, ya, yb, za, zb, mat, holes = []) => {
      let y = ya;
      for (const h of [...holes].sort((p, q) => p.y0 - q.y0)) {
        if (h.y0 > y) L.box(x0, x1, y, h.y0, za, zb, mat);
        if (h.z0 > za) L.box(x0, x1, h.y0, h.y1, za, h.z0, mat);
        if (h.z1 < zb) L.box(x0, x1, h.y0, h.y1, h.z1, zb, mat);
        y = h.y1;
      }
      if (y < yb) L.box(x0, x1, y, yb, za, zb, mat);
    };
    const tripod = (L, x, y, h, legR = 0.45) => { for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.5; L.member([x, y, h], [x + Math.cos(a) * legR, y + Math.sin(a) * legR, 0.02], 0.012, M.charcoal, 4); } };
    const chair = (L, x, y, m = M.charcoal) => { L.box(x - 0.2, x + 0.2, y - 0.2, y + 0.2, 0.42, 0.47, m); L.box(x - 0.2, x + 0.2, y + 0.17, y + 0.2, 0.47, 0.9, m); for (const [dx, dy] of [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]]) L.box(x + dx - 0.015, x + dx + 0.015, y + dy - 0.015, y + dy + 0.015, 0, 0.42, M.steel); };
    const plant = (L, x, y, s = 1, mat = M2.fern) => { for (let k = 0; k < 7; k++) { const a = k * 0.9; const g = new THREE.ConeGeometry(0.06 * s, 0.7 * s, 5); g.rotateZ(0.4); g.rotateY(a); g.translate(x + Math.cos(a) * 0.08 * s, 0.4 * s, -(y + Math.sin(a) * 0.08 * s)); L.add(mat, g); } };

    // ═══ shell ═══
    W.box(wx0, wx1, -9.0, 30.1, -0.05, 0.0, M.concrete); // ground slab
    // west wall: solid (2.00 m setback rule, no openings) with a fire-rated glass-block band and timber battens
    wallX(W, wx0, wx0 + 0.2, -9.0, 22.0, 0, Z3, M.plaster, [{ y0: 6.35, y1: 8.35, z0: 0, z1: Z2 - 0.15 }]); // solid boundary wall, louvre door at the wind lane
    W.box(wx0 - 0.02, wx0 + 0.02, -8.0, 4.0, 4.6, 6.2, M.glassFrost);
    for (let y = -8.8; y < 1.0; y += 0.55) W.box(wx0 - 0.06, wx0, y, y + 0.1, 0.3, 6.8, M.teakLight);
    for (let y = 5.2; y < 9.8; y += 0.55) SW.box(wx0 - 0.06, wx0, y, y + 0.1, 0.3, 6.8, M.teak);
    for (let y = 8.8; y < 9.7; y += 0.55) W.box(wx0 - 0.06, wx0, y, y + 0.1, 0.3, 6.8, M.teak);
    // street front y = −9.0 (zone 1): storefront with door D1 and VIP window, teak fins
    wallY(W, -9.0, -8.8, wx0, wx1, 0, Z3, M.plaster, [{ x0: -3.6, x1: -1.25, z0: 0.1, z1: 3.1 }, { x0: -3.6, x1: -1.25, z0: 3.9, z1: 6.6 }]);
    W.box(-3.6, -1.25, -8.98, -8.9, 0.1, 3.1, M.glass); W.box(-3.6, -1.25, -8.98, -8.9, 3.9, 6.6, M.glass);
    for (const x of [-3.6, -2.4, -1.25]) W.box(x - 0.03, x + 0.03, -9.02, -8.86, 0.1, 6.6, M.charcoal);
    W.box(-3.6, -1.25, -9.02, -8.86, 3.1, 3.9, M.charcoal); W.box(-3.6, -1.25, -9.02, -8.86, 6.55, 6.65, M.charcoal);
    for (let x = wx0 + 0.25; x <= wx1; x += 0.3) W.box(x - 0.03, x + 0.03, -9.4, -9.15, 0.1, Z3, M.teak);
    W.box(-3.0, -2.15, -9.06, -8.9, 0.1, 2.2, M.charcoal); // door D1 frame (private front door)
    // zone 1 / zone 2 party wall (y 4.8…5.2): ground door into the stair lobby, upper door to the Creative Suite
    wallY(SW, 4.8, 5.2, ix0 - 0.2, ix1, Z2 - 0.15, Z3, M.plaster, [{ x0: -2.9, x1: -1.9, z0: 3.6, z1: 5.8 }]); // only above the slab: at ground the cafe and the stair lobby are one open space
    // zone 2 north wall (y 9.8…10.0): shell only (stair hall is closed at ground; garden is entered through D4 from the hall)
    wallY(SW, 9.8, 10.0, ix0 - 0.2, ix1, Z2 - 0.15, Z3, M.plaster); // north wall (above the slab only: stair lobby and wind lane share the ground floor) of the stair block (6.15…6.35 after the slide) = south wall of the lane
    SW.box(ix1, wx1, 9.8, 10.0, Z2 - 0.15, Z3, M.plaster);
    wallY(W, 9.8, 10.0, ix0 - 0.2, ix1, 0, Z3, M.plaster); // north wall of the store block (y 9.8…10.0)
    wallY(W, 8.35, 8.55, wx0, wx1, 0, Z2 - 0.15, M.plaster); // north wall of the wind lane
    // roof + parapet (zones 1–2) and L1 slab
    RF.box(wx0 - 0.1, wx1 + 0.1, -9.1, 6.45, Z3, Z3 + 0.3, M.concrete); // roof: suite + stair block
    RF.box(wx0 - 0.1, wx1 + 0.1, 8.25, 10.1, Z3, Z3 + 0.3, M.concrete); // roof: store block
    SR.box(-3.7, -1.05, 6.0, 9.0, Z3, Z3 + 0.4, M.skylight); // stair-hall skylight
    UI.box(-4.4, wx1, -9.0, 1.15, Z2 - 0.15, Z2 + 0.1, M.concrete); // L1 slab, now a canopy slab out to the plot line

    // ═══ ZONE 1 (ground) — COFFEE SHOP open to the badminton hall: counter, banquette tables, viewing ledge + stools, waiting lounge ═══
    {
      GI.box(ix0, ix1, -8.8, 1.15, 0, 0.02, M.floorInt);
      GI.box(-2.0, -0.9, -8.8, 1.15, 0.02, 0.025, M.pathStone); // lighter stone strip along the hall edge (spill-out zone)
      // back-of-house + service counter near the street door
      GI.box(ix0, -3.35, -8.5, -4.6, 0, 2.3, M.wallInt); // back wall unit (fridges, shelves)
      for (let z = 0.9; z < 2.2; z += 0.4) GI.box(ix0 + 0.02, ix0 + 0.35, -8.3, -4.8, z, z + 0.03, M.teakLight);
      GI.box(ix0 + 0.05, ix0 + 0.4, -8.2, -6.4, 1.0, 1.45, M.ss316); // espresso machine + grinders
      GI.box(-3.35, -2.45, -8.2, -4.9, 0.0, 1.05, M.teak); GI.box(-3.4, -2.4, -8.25, -4.85, 1.05, 1.1, M.ss316); // service counter 0.90 × 3.30
      GI.box(-3.0, -2.5, -7.6, -5.4, 1.1, 1.5, M.glass); // pastry display
      for (const y of [-7.7, -6.6, -5.5]) { GI.cyl(-2.1, y, 0.0, 0.7, 0.025, 0.025, M.steel, 6); GI.cyl(-2.1, y, 0.7, 0.76, 0.17, 0.17, M2.sofa, 12); } // counter stools
      GI.box(-3.55, -2.75, -9.0 + 0.2, -8.6, 1.8, 2.5, M.charcoal); // menu board over the entrance side
      for (const y of [-7.4, -6.0, -4.6]) { GI.cyl(-2.85, y, 2.7, ZC - 0.02, 0.006, 0.006, M.steel, 4); GI.cyl(-2.85, y, 2.45, 2.7, 0.14, 0.14, M.led, 10); }
      // banquette along the plot-line wall with two-top tables
      GI.box(ix0, -3.25, -4.2, 0.9, 0.0, 0.45, M2.sofa); GI.box(ix0, -3.55, -4.2, 0.9, 0.45, 1.0, M2.sofa);
      for (const y of [-3.5, -2.2, -0.9, 0.4]) {
        GI.box(-3.1, -2.4, y - 0.35, y + 0.35, 0.72, 0.76, M.teakLight); GI.cyl(-2.75, y, 0.0, 0.72, 0.03, 0.03, M.charcoal, 8); GI.box(-2.9, -2.6, y - 0.12, y + 0.12, 0.0, 0.02, M.charcoal);
        chair(GI, -2.15, y, M2.sofaTan);
        GI.cyl(-2.75, y, 2.5, 3.0, 0.006, 0.006, M.steel, 4); GI.cyl(-2.75, y, 2.3, 2.5, 0.12, 0.12, M.led, 10);
      }
      // viewing / waiting zone on the hall edge: bar ledge facing the courts + stools + two low benches
      GI.box(-1.28, -0.95, -7.0, -0.5, 1.02, 1.07, M.teakLight); GI.box(-1.2, -1.15, -7.0, -0.5, 0, 1.02, M.charcoal);
      for (let y = -6.6; y < -0.6; y += 0.85) { GI.cyl(-1.62, y, 0.0, 0.68, 0.025, 0.025, M.steel, 6); GI.cyl(-1.62, y, 0.68, 0.74, 0.18, 0.18, M2.sofaTan, 12); }
      GI.box(-1.5, -1.05, 0.15, 1.1, 0, 0.45, M.teakLight); GI.box(-1.5, -1.05, -8.7, -7.6, 0, 0.45, M.teakLight); // waiting benches facing the courts
      GI.box(-1.52, -1.48, 0.15, 1.1, 0.45, 0.95, M2.sofa);
      plant(GI, -3.6, 1.0, 1.4); plant(GI, -1.25, 1.0, 1.1, M2.fernDark); plant(GI, -3.6, -8.6, 1.3, M2.fernDark);
      // entrance door D1 (street) mat + step light
      GI.box(-3.0, -2.15, -8.86, -8.5, 0.0, 0.015, M.charcoal);
    }

    // ═══ ZONE 2 — G2 Grand U-stair (y 5.2 … 9.8), 20 risers × 175 mm, 260 mm treads, 1.25 m flights ═══
    SG.box(ix0, ix1, 5.2, 9.8, 0, 0.02, M.floorInt);
    {
      const R = 0.175, TR = 0.26, y0s = 5.95, yM = 8.55;
      // flight 1 (west, rises north): x −3.70 … −2.45
      for (let i = 1; i <= 10; i++) {
        const ya = y0s + (i - 1) * TR, top = R * i;
        SG.box(ix0, -2.45, ya, ya + TR, top - 0.3, top, M.concreteDark); SG.box(ix0, -2.45, ya - 0.02, ya + TR, top, top + 0.03, M.teak);
      }
      // mid-landing (z 1.75) and flight 2 (east, rises south): x −2.30 … −1.05
      SG.box(ix0, ix1, yM, 9.8, 1.45, 1.75, M.concreteDark); SG.box(ix0, ix1, yM, 9.8, 1.75, 1.78, M.teak);
      for (let j = 1; j <= 10; j++) {
        const yb = yM - j * TR, top = 1.75 + R * j;
        SG.box(-2.3, ix1, yb, yb + TR, top - 0.3, top, M.concreteDark); SG.box(-2.3, ix1, yb, yb + TR + 0.02, top, top + 0.03, M.teak);
      }
      // top landing (z 3.50) over the lobby, balustrades, handrails
      SU.box(ix0, ix1, 5.2, 5.95, 3.2, 3.5, M.concrete); SU.box(ix0, ix1, 5.2, 5.95, 3.5, 3.56, M.teak);
      SG.box(-2.45, -2.3, y0s, yM, 0, 0.9, M.charcoal); // central well rail base (void 0.15 m)
      for (const [x, ya, yb, za, zb] of [[-2.38, y0s, yM, 0.9, 2.65], [-2.38, yM, y0s, 2.65, 4.4]]) SG.member([x, ya, za + 0.05], [x, yb, zb + 0.05], 0.025, M.steel, 6);
      SU.box(-2.7, -1.05, 5.93, 5.97, 3.56, 4.6, M.glass); // balustrade at the stair head
      // WC G2 under flight 2 (1.20 × 0.95, ceiling ≥ 2.0 m), door from the lobby
      const hx0 = -2.3, hx1 = -1.1;
      wallY(SG, 6.95, 7.0, hx0, hx1, 0, 2.05, M.wallInt, [{ x0: -2.15, x1: -1.45, z0: 0, z1: 2.0 }]);
      SG.box(hx0, hx0 + 0.05, 6.95, 7.9, 0, 2.05, M.wallInt); SG.box(hx0, hx1, 7.9, 7.95, 0, 2.05, M.wallInt);
      SG.box(hx0, hx1, 6.95, 7.95, 2.0, 2.05, M.wallInt);
      SG.box(-1.75, -1.45, 7.55, 7.85, 0, 0.4, M2.white); SG.cyl(-1.6, 7.6, 0.4, 0.8, 0.14, 0.14, M2.white, 12); // WC pan + cistern
      SG.box(-2.2, -1.9, 7.7, 7.9, 0.8, 0.88, M2.white); SG.box(-2.19, -1.91, 7.9, 7.93, 1.05, 1.9, M.glass); // basin + mirror
      SG.box(-2.0, -1.5, 6.9, 7.1, 2.0, 2.05, M.charcoal);
      // under-landing storage + fire extinguisher cabinet
      SG.box(ix0, -2.5, 8.6, 9.8, 0, 1.4, M.teakLight); SG.box(ix0 + 0.02, -2.52, 8.62, 9.78, 0.02, 0.05, M.charcoal);
      SG.box(-1.12, -1.05, 5.4, 5.7, 0.9, 1.5, M.holdR);
      // lobby: bench, planter, wayfinding light
      SG.box(-3.55, -2.7, 5.35, 5.75, 0, 0.45, M.teakLight); plant(SG, -3.45, 5.7, 1.2, M2.fernDark);
    }
    // (D3 is gone: the stair lobby is open to the hall and to the wind lane)
    // store block north of the wind lane (y 8.55 … 9.80): bicycle / cleaning store, door from the lane
    GI.box(ix0, ix1, 8.55, 9.8, 0, 0.02, M.floorWet);
    for (let k = 0; k < 4; k++) GI.box(ix0 + 0.05, ix0 + 0.4, 8.7 + k * 0.28, 8.92 + k * 0.28, 0, 1.9, M.teakLight);
    GI.cyl(-2.2, 9.2, 0.0, 0.5, 0.2, 0.2, M2.cabinet, 12); GI.box(-1.7, -1.25, 8.7, 9.7, 0, 1.1, M.charcoal);

    // ═══ ZONE 3 — co-working palm garden (G3), jali wall V1–V4, slatted roof, L2 gallery walkway ═══
    const palmYs = [15.46, 12.08];
    // terracotta brick relief on the interior face of the solid boundary wall (V1…V4) — a relief, not perforations, because no opening is allowed this close to the plot line
    for (let k = 0; k < 4; k++) {
      const ya = 10.0 + k * 3.0, yb = ya + 2.85;
      for (let y = ya; y < yb; y += 0.19) for (let z = 0.0; z < 6.9; z += 0.19) {
        const ix = Math.round((y - ya) / 0.19), iz = Math.round(z / 0.19);
        if (Math.abs(y - 15.46) < 0.45) continue; // relief steps round palm P2
        const deep = (ix + iz) % 2 === 0 && z > 0.4 && z < 6.4 && ix % 5 !== 0;
        W.box(wx0 + 0.2, wx0 + (deep ? 0.2 : 0.2) + (deep ? 0.04 : 0.15), y, y + 0.17, z, z + 0.17, k % 2 ? M.brick : M.terracotta);
      }
    }
    W.box(wx0, wx0 + 0.2, 10.0, 22.0, 6.9, 7.0, M.concrete);
    // ── RC canopy slab (พื้นกันสาด) at +3.50: continuous from the hall edge out to the plot line (x −4.40), full length of the wing.
    // Garden part has round openings round the palm trunks; rails round the openings; glass balustrade on the hall-side edge.
    {
      const sh = new THREE.Shape();
      sh.moveTo(-4.4, 10.0); sh.lineTo(-0.8, 10.0); sh.lineTo(-0.8, 22.0); sh.lineTo(-4.4, 22.0); sh.lineTo(-4.4, 10.0);
      for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) { const h = new THREE.Path(); h.absarc(px, py, 0.85, 0, TAU, true); sh.holes.push(h); }
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.25, bevelEnabled: false, curveSegments: 28 });
      g.rotateX(-Math.PI / 2); g.translate(0, Z2 - 0.15, 0);
      UI.add(M.concrete, g);
      UI.box(-4.4, -0.8, 6.15, 6.35 + 0.0, Z2 - 0.15, Z2 + 0.1, M.concrete);
      UI.box(-4.4, wx1, 6.35, 8.55, Z2 - 0.15, Z2 + 0.1, M.concrete); // slab above the wind lane
      UI.box(-4.4, wx1, 8.55, 10.0, Z2 - 0.15, Z2 + 0.1, M.concrete);
      UI.box(-4.4, -3.7, 1.15, 6.15, Z2 - 0.15, Z2 + 0.1, M.concrete); UI.box(-1.05, wx1, 1.15, 6.15, Z2 - 0.15, Z2 + 0.1, M.concrete);
      UI.box(-4.4, -3.9, 22.0, 23.1, Z2 - 0.15, Z2 + 0.1, M.concrete); UI.box(-4.4, -3.9, 24.5, 30.1, Z2 - 0.15, Z2 + 0.1, M.concrete); // canopy strip round palm P1
      // upstand kerb on the free edge (x −4.40) so rain sheds to the inside gutter
      UI.box(-4.4, -4.33, -9.0, 22.0, Z2 + 0.1, Z2 + 0.32, M.concrete); UI.box(-4.4, -4.33, 24.5, 30.1, Z2 + 0.1, Z2 + 0.32, M.concrete);
      // guard rails round the palm openings (steel posts + glass infill)
      for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) {
        UI.torus(px, py, Z2 + 1.1, 0.95, 0.02, M.steel, 40); UI.torus(px, py, Z2 + 0.25, 0.95, 0.015, M.steel, 40);
        for (let k = 0; k < 12; k++) { const a = (k / 12) * TAU; UI.cyl(px + Math.cos(a) * 0.95, py + Math.sin(a) * 0.95, Z2 + 0.1, Z2 + 1.1, 0.025, 0.025, M.steel, 6); }
        const rg = new THREE.CylinderGeometry(0.95, 0.95, 0.85, 40, 1, true); rg.translate(px, Z2 + 0.65, -py); UI.add(M.glass, rg);
      }
      // hall-side edge guard (1.10 m glass) along the garden and the wind-lane deck
      for (const [ya, yb] of [[6.35, 8.35], [10.0, 22.0]]) { UI.box(-0.86, -0.82, ya, yb, Z2 + 0.1, Z2 + 1.2, M.glass); UI.box(-0.88, -0.8, ya, yb, Z2 + 1.15, Z2 + 1.2, M.charcoal); }
    }
    for (const y of [10.4, 14.4, 18.4, 21.6]) UI.box(-1.7, -1.2, y - 0.25, y + 0.25, Z2 + 0.1, Z2 + 0.5, M.teakLight); // bench pockets
    // pergola frame + slats (slats and edge beam open around the palm trunks)
    for (const x of [-2.6, wx1 - 0.1]) W.box(x - 0.06, x + 0.06, 10.0, 22.0, 6.85, 6.95, M.charcoal);
    for (const [ya, yb] of [[10.0, 11.65], [12.5, 15.0], [15.9, 22.0]]) W.box(wx0 + 0.04, wx0 + 0.16, ya, yb, 6.85, 6.95, M.charcoal);
    for (let y = 10.0; y <= 22.0; y += 3.0) for (const x of [-2.55, -0.85]) W.box(x - 0.07, x + 0.07, y - 0.07, y + 0.07, 0, 6.9, M.charcoal);
    for (let y = 10.0; y <= 22.0; y += 0.45) { if (palmYs.some((p) => Math.abs(y - p) < 0.42)) continue; RF.box(wx0, wx1, y - 0.06, y + 0.06, 6.95, 7.05, M.teak); }
    // earth beds, circular teak benches, root-zone guards, drip rings, planting
    for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) {
      // earth bed r 1.50, clipped by the solid wall line (x ≥ −3.70) so nothing sits outside the wall
      const amax = Math.acos(Math.max(-1, Math.min(1, (-3.7 - px) / 1.5)));
      const eb = new THREE.Shape(); eb.moveTo(px, py);
      for (let i = 0; i <= 28; i++) { const a = -amax + (2 * amax * i) / 28; eb.lineTo(px + 1.5 * Math.cos(a), py + 1.5 * Math.sin(a)); }
      eb.lineTo(px, py);
      const eg = new THREE.ExtrudeGeometry(eb, { depth: 0.06, bevelEnabled: false }); eg.rotateX(-Math.PI / 2); GI.add(M.earth, eg);
      for (let k = 0; k < 28; k++) { const a = (k / 28) * TAU, qx = px + 1.05 * Math.cos(a); if (qx > -3.62) GI.cyl(qx, py + 1.05 * Math.sin(a), 0.06, 0.1, 0.025, 0.025, M.charcoal, 6); }
      const n = 14;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU, bx = px + Math.cos(a) * 1.35;
        if (bx < -3.5) continue; // no bench outside / against the solid wall
        const g = new THREE.BoxGeometry(0.9, 0.06, 0.38); g.rotateY(a + Math.PI / 2); g.translate(bx, 0.45, -(py + Math.sin(a) * 1.35)); GI.add(M.teakLight, g);
        const l = new THREE.BoxGeometry(0.08, 0.45, 0.08); l.translate(bx, 0.22, -(py + Math.sin(a) * 1.35)); GI.add(M.charcoal, l);
      }
      for (let k = 0; k < 9; k++) { const qx = px + Math.cos(k * 0.7 + 1) * (0.55 + (k % 3) * 0.18); if (qx > -3.55) plant(GI, qx, py + Math.sin(k * 0.7 + 1) * (0.55 + (k % 3) * 0.18), 0.9 + (k % 2) * 0.4, k % 2 ? M2.fern : M2.fernDark); }
    }
    GI.box(wx0, wx1, 10.0, 22.0, -0.04, 0.0, M.paving);
    // stepping-stone path along the hall wall, bar-height co-working ledge with stools, lounge corner, pendants, bollards
    for (let y = 10.5; y < 21.8; y += 0.85) GI.box(-2.0, -1.2, y, y + 0.7, 0.0, 0.06, M.pathStone);
    GI.box(-1.45, -1.05, 12.6, 16.8, 1.02, 1.07, M.teakLight); GI.box(-1.25, -1.2, 12.6, 16.8, 0, 1.02, M.charcoal);
    for (let y = 13.0; y < 16.7; y += 0.9) { GI.cyl(-1.85, y, 0.0, 0.7, 0.025, 0.025, M.steel, 6); GI.cyl(-1.85, y, 0.7, 0.76, 0.18, 0.18, M2.sofaTan, 12); }
    GI.box(-3.0, -2.2, 17.0, 17.9, 0.7, 0.75, M.teakLight); for (const [x, y] of [[-3.3, 17.45], [-2.0, 17.45]]) chair(GI, x, y, M2.sofaTan);
    for (let y = 11.0; y < 22; y += 2.5) for (const x of [-3.0, -1.3]) { GI.cyl(x, y, 2.9, 3.35, 0.006, 0.006, M.steel, 4); GI.cyl(x, y, 2.6, 2.9, 0.1, 0.1, M.led, 10); }
    for (let y = 11.0; y < 22; y += 3.0) GI.cyl(-2.05, y, 0.0, 0.4, 0.05, 0.05, M.led, 8);
    plant(GI, -1.2, 21.5, 1.4); plant(GI, -3.6, 21.6, 1.3, M2.fernDark); plant(GI, -3.6, 10.4, 1.2); plant(GI, -1.2, 10.3, 1.0, M2.fernDark);
    GI.cyl(-2.9, 20.9, 0.0, 0.45, 0.4, 0.4, M.concreteDark, 20); GI.cyl(-2.9, 20.9, 0.4, 0.42, 0.36, 0.36, M.pondWater, 20); // water bowl
    // focus pods G4 / L3 (y 18 … 22): glass boxes with meeting tables, screens, whiteboards
    for (const L of [{ lyr: GI, z0: 0.0, key: 'G4' }, { lyr: UI, z0: Z2 + 0.1, key: 'L3' }]) {
      const { lyr, z0 } = L, zt = z0 + 2.6, x0p = ix0, x1p = L.key === 'G4' ? ix1 : -2.65;
      lyr.box(x0p, x1p, 18.0, 22.0, z0, z0 + 0.03, M2.rugGrey);
      for (const y of [18.0, 22.0]) lyr.box(x0p, x1p, y - 0.03, y + 0.03, z0, zt, M2.glassPod);
      lyr.box(x1p - 0.03, x1p + 0.03, 18.0, 22.0, z0, zt, M2.glassPod);
      for (const y of [18.0, 22.0]) lyr.box(x0p, x1p, y - 0.04, y + 0.04, zt - 0.05, zt, M.charcoal);
      lyr.box(x0p, x1p, 18.0, 22.0, zt, zt + 0.05, M.charcoal);
      lyr.box(x0p + 0.1, x1p - 0.3, 19.0, 21.0, z0 + 0.72, z0 + 0.76, M.teakLight); lyr.box(x0p + 0.5, x0p + 0.56, 19.4, 20.6, z0, z0 + 0.72, M.charcoal);
      for (const y of [19.3, 19.9, 20.5]) { chair(lyr, x0p + 0.3, y, M.charcoal); }
      lyr.box(x0p + 0.04, x0p + 0.08, 18.4, 19.6, z0 + 1.0, z0 + 2.0, M2.board); lyr.box(x1p - 0.4, x1p - 0.36, 20.0, 21.0, z0 + 1.1, z0 + 1.7, M2.screen);
      lyr.cyl(x0p + 0.9, 21.5, z0, z0 + 1.6, 0.025, 0.025, M.steel, 6); lyr.cyl(x0p + 0.9, 21.5, z0 + 1.6, z0 + 1.7, 0.2, 0.15, M.led, 10);
    }

    // ═══ WIND LANE (แนวลู่รับลม): 2.00 m clear, y 6.35 … 8.35, on the W0–C0–E0 axis (y 7.35) ═══
    // A through-passage at ground level from the plot-line wall to the hall. Two operable louvre screens (west wall + hall edge) open to let the
    // breeze run straight onto the terracotta tower W0 (and on along the cross-aisle to C0 / E0) and close for tournaments (zero-draught policy).
    {
      const LY0 = 6.35, LY1 = 8.35, LX0 = wx0, LX1 = wx1;
      GI.box(LX0, LX1, 1.55, LY1, 0.0, 0.03, M.pathStone); // one continuous stone floor: stair lobby + wind lane
      for (let x = LX0 + 0.1; x < LX1; x += 0.4) GI.box(x, x + 0.04, LY0 + 0.05, LY1 - 0.05, 0.03, 0.045, M.grating);
      const fins = (xc, depth, open, mat = M.louvre) => { // vertical pivoting fins, 10 per 2.00 m
        GI.box(xc - 0.07, xc + 0.07, LY0, LY1, 0, 0.06, M.charcoal); GI.box(xc - 0.07, xc + 0.07, LY0, LY1, Z2 - 0.21, Z2 - 0.15, M.charcoal);
        for (let i = 0; i < 10; i++) {
          const g = new THREE.BoxGeometry(depth, Z2 - 0.4, 0.02); g.rotateY(open); g.translate(xc, (Z2 - 0.4) / 2 + 0.07, -(LY0 + 0.1 + i * 0.2)); GI.add(mat, g);
          GI.cyl(xc, LY0 + 0.1 + i * 0.2, 0.0, Z2 - 0.15, 0.01, 0.01, M.steel, 4);
        }
      };
      fins(wx0 + 0.1, 0.19, 1.15); // west boundary wall: louvre door, fins turned open
      fins(-0.88, 0.19, 1.15); // hall-side louvre screen, shown open
      // sliding rain/draught shutter parked in the north lane wall pocket (closed position drawn dashed in the plan)
      GI.box(LX0 + 0.15, LX1 - 0.15, LY1 + 0.0, LY1 + 0.04, 0.2, 2.6, M.glassFrost);
      // lane ceiling lights + a bench niche in the south wall
      for (const x of [-3.3, -2.3, -1.3]) GI.cyl(x, 7.35, Z2 - 0.32, Z2 - 0.15, 0.09, 0.09, M.led, 10);
      GI.box(-3.0, -1.6, LY1 - 0.4, LY1, 0.0, 0.45, M.teakLight); // bench
      // arrows of the breeze (hidden unless a wind view is shown)
      const WM = new THREE.MeshStandardMaterial({ color: 0x3aa6ff, emissive: 0x2a8cff, emissiveIntensity: 1.2, transparent: true, opacity: 0.55, roughness: 0.3 });
      const WB = G.x_wind;
      for (const [y, z, len] of [[6.75, 1.0, 1], [7.35, 1.6, 1.2], [7.95, 1.0, 1], [7.35, 0.7, 0.9], [7.35, 2.4, 0.9]]) {
        const x0w = -7.4, x1w = 0.0 - (len < 1 ? 0.2 : 0.0);
        WB.box(x0w, x1w - 0.4, y - 0.035, y + 0.035, z - 0.035, z + 0.035, WM);
        const cone = new THREE.ConeGeometry(0.14, 0.4, 12); cone.rotateZ(-Math.PI / 2); cone.translate(x1w - 0.2, z, -y); WB.add(WM, cone);
      }
    }

    // ═══ ZONE 4 — north core: G5 MDB + pump room, L4 staff / linen, MRL lift, corner fire stair ═══
    {
      const cx0 = -3.9, cx1 = -1.8;
      // shell (palm P1 sits in a 0.5 m notch at y 23.2 … 24.4)
      wallX(W, cx0, cx0 + 0.2, 25.3, 30.1, 0, ZR, M.plaster);
      W.box(-3.4, -3.2, 23.2, 24.4, 0, ZR, M.plaster); W.box(wx0, -3.2, 22.0, 23.2, 0, ZR, M.plaster); W.box(wx0, -3.2, 24.4, 25.3, 0, ZR, M.plaster);
      W.box(-3.4, -1.8, 23.2, 23.4, 0, ZR, M.plaster); W.box(-3.4, -1.8, 24.2, 24.4, 0, ZR, M.plaster);
      W.box(cx0, -1.8, 22.0, 22.2, 0, ZR, M.plaster);
      wallX(W, -1.9, -1.8, 22.0, 24.9, 0, ZR, M.plaster, [{ y0: 22.4, y1: 23.2, z0: 0, z1: 2.2 }]);
      W.box(cx0 - 0.1, -1.7, 22.0, 30.2, ZR, ZR + 0.3, M.concrete);
      W.box(-3.55, -3.2, 25.4, 25.5, 0.2, 2.4, M.glassFrost);
      for (let z = 0.8; z < ZR - 1; z += 3.5) W.box(wx0 - 0.02, wx0 + 0.02, 25.8, 27.2, z, z + 1.3, M.glassFrost);
      // G5 MDB & pump room (x −3.7…−1.9, y 22.2…24.9): switchboards, pump set, expansion tank
      GI.box(-3.7, -1.9, 22.2, 24.9, 0, 0.02, M.floorWet);
      for (let k = 0; k < 4; k++) { GI.box(-3.35 + k * 0.42, -2.97 + k * 0.42, 22.25, 22.7, 0, 2.1, M2.cabinet); GI.box(-3.3 + k * 0.42, -3.0 + k * 0.42, 22.69, 22.72, 1.5, 1.8, M2.screen); }
      GI.box(-3.65, -3.0, 24.3, 24.85, 0, 0.5, M.concreteDark); GI.cyl(-3.3, 24.55, 0.5, 0.95, 0.2, 0.2, M.collarBlue, 14); GI.cyl(-2.4, 24.5, 0, 1.4, 0.3, 0.3, M2.cabinet, 16);
      GI.member([-3.3, 24.55, 0.9], [-2.4, 24.5, 0.9], 0.04, M.steel, 6);
      GI.box(-1.92, -1.9, 22.4, 23.2, 0, 2.2, M.charcoal); // door to the hall passage (service)
      // REV R43: old corner fire stair + MRL lift removed (S1 behind the rear building is the stair; no lift).
      // The vacated bay (x −3.7…−1.8, y 24.9…30.1) = GF garden store + L2 link floor from the west wing to the rear L2 west door.
      GI.box(-3.7, -1.8, 24.9, 30.1, 0, 0.02, M.floorWet);
      UI.box(-3.7, -1.8, 24.9, 30.1, Z2 - 0.2, Z2 + 0.06, M.concrete); UI.box(-3.7, -1.8, 24.9, 30.1, Z2 + 0.06, Z2 + 0.08, M.teakLight);
      // L4 staff room & linen (upper floor of the core) + L1 corridor to the lift
      UI.box(-3.7, -1.9, 22.2, 24.9, Z2 - 0.15, Z2 + 0.1, M.concrete);
      for (let k = 0; k < 5; k++) { UI.box(-3.65 + k * 0.33, -3.37 + k * 0.33, 22.25, 22.7, Z2 + 0.1, Z2 + 1.95, M.holdB); }
      UI.box(-3.0, -2.2, 23.3, 24.0, Z2 + 0.74, Z2 + 0.78, M.teakLight); for (const y of [23.1, 24.2]) UI.box(-2.9, -2.3, y - 0.2, y + 0.2, Z2 + 0.45, Z2 + 0.5, M.charcoal);
      for (let z = Z2 + 0.4; z < Z2 + 2.0; z += 0.4) UI.box(-3.65, -3.4, 24.45, 24.85, z, z + 0.03, M.charcoal);
      for (let k = 0; k < 3; k++) UI.box(-3.65, -3.35, 24.45, 24.85, Z2 + 0.43 + k * 0.4, Z2 + 0.78 + k * 0.4, M2.white); // folded linen
    }

    // ═══ ZONE 1 (upper, +3.50) — CREATIVE STUDIO with cyclorama + VIP lounge corner (moved up from the ground floor) ═══
    {
      const z = Z2 + 0.1; // finished floor 3.60
      UI.box(ix0, ix1, -8.8, 1.15, z, z + 0.05, M.teakLight); // floating acoustic floor over the cafe (soft layer + isolation joint underneath)
      // sound-lock vestibule from the stair head: partition at y 0.55…0.65 with a door (the party wall with the stair block is at y 1.15…1.55)
      // VIP lounge corner at the street end (y −8.8 … −5.6): sofa, armchairs, bar counter, TV
      UI.box(-3.55, -1.4, -8.4, -6.0, z + 0.05, z + 0.07, M2.rug);
      UI.box(-3.55, -2.6, -8.3, -6.4, z + 0.07, z + 0.45, M2.sofaTan); UI.box(-3.55, -3.3, -8.3, -6.4, z + 0.45, z + 0.95, M2.sofaTan);
      chair(UI, -1.7, -7.7, M2.sofa); chair(UI, -1.7, -6.8, M2.sofa); UI.box(-2.5, -2.0, -7.6, -7.0, z + 0.07, z + 0.45, M.teakLight);
      UI.box(ix0 + 0.02, ix0 + 0.08, -8.0, -6.2, z + 1.0, z + 2.0, M2.screen);
      // glass partition between the lounge and the shooting area (y −5.5)
      UI.box(ix0, ix1, -5.55, -5.5, z, ZC + Z2 - 0.1, M2.glassPod); UI.box(ix0, ix1, -5.58, -5.47, z + 2.55, z + 2.65, M.charcoal);
      UI.box(-2.9, -2.0, -5.6, -5.45, z, z + 2.2, M2.glassPod);
      // shooting area y −5.4 … 1.15: acoustic panels, ceiling track, softboxes, camera, monitor, prop shelves
      for (let y = -5.0; y < -1.5; y += 1.3) UI.box(ix0, ix0 + 0.08, y, y + 1.1, z + 0.9, z + 2.7, M2.acoustic);
      for (let y = -5.0; y < -1.4; y += 0.4) UI.box(ix1 - 0.08, ix1, y, y + 0.25, z + 0.9, z + 2.7, M.teakLight);
      UI.box(-2.43, -2.37, -5.2, 0.9, Z3 - 0.4, Z3 - 0.34, M.steel);
      for (let y = -5.0; y < 0.9; y += 0.9) { UI.cyl(-2.4, y, Z3 - 0.6, Z3 - 0.4, 0.07, 0.07, M.charcoal, 8); UI.cyl(-2.4, y, Z3 - 0.62, Z3 - 0.6, 0.05, 0.05, M.led, 8); }
      for (const [x, y] of [[-3.15, -2.5], [-1.55, -1.9]]) { for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.5; UI.member([x, y, z + 1.9], [x + Math.cos(a) * 0.45, y + Math.sin(a) * 0.45, z + 0.02], 0.012, M.charcoal, 4); } UI.box(x - 0.35, x + 0.35, y - 0.35, y + 0.35, z + 1.9, z + 2.5, M2.white); UI.box(x - 0.3, x + 0.3, y - 0.3, y + 0.3, z + 2.5, z + 2.52, M.led); }
      UI.box(-1.6, -1.2, -3.0, -2.7, z, z + 0.9, M2.cabinet); UI.box(-1.6, -1.2, -3.0, -2.7, z + 0.9, z + 1.4, M2.screen);
      for (let k = 0; k < 4; k++) UI.box(ix0 + 0.08, ix0 + 0.4, -5.2 + k * 0.55 + 3.4, -5.2 + k * 0.55 + 3.85, z, z + 2.0, M.teakLight);
      // cyclorama: white floor, 0.90 m radius cove and wall (y −1.25 … 1.15)
      UI.box(ix0, ix1, -1.25, 0.25, z + 0.05, z + 0.06, M2.cyclo);
      for (let i = 0; i < 8; i++) {
        const a0 = (i / 8) * (Math.PI / 2), a1 = ((i + 1) / 8) * (Math.PI / 2);
        const pp = (a) => [0.25 + 0.9 * Math.sin(a), z + 0.06 + 0.9 - 0.9 * Math.cos(a)];
        const [y0c, z0c] = pp(a0), [y1c, z1c] = pp(a1);
        UI.quad(M2.cyclo, [ix0, y0c, z0c], [ix1, y0c, z0c], [ix1, y1c, z1c], [ix0, y1c, z1c]);
      }
      UI.quad(M2.cyclo, [ix0, 1.15, z + 0.96], [ix1, 1.15, z + 0.96], [ix1, 1.15, Z3 - 0.3], [ix0, 1.15, Z3 - 0.3]);
      UI.box(ix0, ix0 + 0.06, -1.25, 1.15, z + 0.05, Z3 - 0.3, M2.cyclo); UI.box(ix1 - 0.06, ix1, -1.25, 1.15, z + 0.05, Z3 - 0.3, M2.cyclo);
      plant(UI, -3.6, -8.55, 1.3); plant(UI, -1.2, -8.55, 1.1, M2.fernDark);
    }

    for (const [sb, host] of [[SW, W], [SG, GI], [SU, UI], [SR, RF]]) { const g = sb.flush(); g.position.z = SHIFT; host.group.add(g); }
  }

  // (stair block sub-builders are flushed at the end of the wing block)
  // ── Rear complex REV D.5 ──────────────────────────────────────────
  const GFr = layer('rear_GF'), L2r = layer('rear_L2'), L3r = layer('rear_L3'), RFr = layer('rear_roof'), STr = layer('rear_structure');
  if (!R2) {
    const xs = [0.2, 5.2, 10.2, 15.2, 20.2];
    // columns, rows A (25.1) and B (28.1)
    const colsAt = (lyr, z0, z1) => { for (const y of [25.1, 28.1]) for (const x of xs) lyr.box(x - 0.15, x + 0.15, y - 0.15, y + 0.15, z0, z1, M.concreteDark); };
    colsAt(GFr, 0, Z2); colsAt(L2r, Z2, Z3); colsAt(L3r, Z3, ZR);
    // existing RC slab at +3.5 (144 m²) — shown darker so it reads as "do not touch"
    L2r.box(SLAB.x0, SLAB.x1, SLAB.y0, SLAB.y1, Z2 - 0.28, Z2, M.concreteDark);
    // existing beams along rows
    for (const y of [25.1, 28.1]) L2r.box(SLAB.x0, SLAB.x1, y - 0.15, y + 0.15, Z2 - 0.65, Z2 - 0.28, M.concreteDark);

    // ═══ REV R43 — rear complex rebuilt from the approved plans: GF R40, L2 R42, L3 R41, S1 stacked U-stair (1.20 m clear) ═══
    // ground floor (R40) ------------------------------------------------
    const b = GFr, H = Z2 - 0.3;
    b.box(SLAB.x0, SLAB.x1, 25.1, 30.1, -0.05, 0.0, M.floorInt);
    b.box(-1.8, 7.4, 25.1, 30.0, -0.04, 0.005, M.floorWet); // wet block floor (WCs + lockers)
    b.box(20.2, 22.2, 25.1, 30.1, -0.04, 0.005, M.floorWet); // existing staff WC
    // south façade y = 25.1 with doors / shopfronts (staff bay x 21.18 … 22.2 stays open)
    const doorsS = [[-1.2, -0.3, 't'], [0.5, 1.5, 't'], [1.9, 2.8, 't'], [3.9, 4.8, 't'], [6.3, 7.2, 't'], [8.2, 9.4, 'g'], [11.6, 12.8, 'g'], [16.0, 16.9, 'g'], [18.5, 19.4, 'g']];
    const glassS = [[7.6, 8.2], [9.4, 10.0], [15.4, 16.0], [16.9, 17.6], [17.8, 18.5], [19.4, 20.0], [12.8, 14.6]];
    { const cuts = doorsS.map(([a, c]) => [a, c]).concat(glassS).sort((p, q) => p[0] - q[0]); let x = SLAB.x0;
      for (const [a, c] of cuts) { if (a > x) b.box(x, a, 25.0, 25.2, 0, H, M.plaster); b.box(a, c, 25.0, 25.2, 2.2, H, M.plaster); x = Math.max(x, c); }
      b.box(x, 21.18, 25.0, 25.2, 0, H, M.plaster); }
    for (const [a, c] of glassS) b.box(a, c, 25.06, 25.14, 0.0, 2.2, M.glass);
    for (const [a, c, k] of doorsS) b.box(a + 0.03, c - 0.03, 25.07, 25.13, 0.0, 2.15, k === 'g' ? M.glass : M.teak);
    b.box(21.18, 22.3, 25.0, 25.2, 2.2, H, M.plaster); // lintel over the open staff-WC entry
    // north façade y = 30.0…30.1: frosted over the wet block, clear elsewhere; passage door to S1 at x 0.5…1.5
    b.box(SLAB.x0, 0.5, 30.02, 30.1, 0, H, M.glassFrost); b.box(1.5, 7.4, 30.02, 30.1, 0, H, M.glassFrost); b.box(7.4, 20.2, 30.02, 30.1, 0, H, M.glass);
    b.box(0.5, 1.5, 30.02, 30.1, 2.2, H, M.plaster); b.box(0.53, 1.47, 30.03, 30.09, 0, 2.15, M.teak);
    for (let x = SLAB.x0; x <= 20.21; x += 1.2) b.box(x - 0.03, x + 0.03, 30.0, 30.15, 0, H, M.charcoal);
    b.box(SLAB.x0, SLAB.x0 + 0.15, 25.1, 30.1, 0, H, M.plaster); // west wall
    // partitions
    const part = (x0, x1, y0, y1, z1 = H) => b.box(x0, x1, y0, y1, 0, z1, M.wallInt);
    for (const x of [0.4, 1.6, 3.6, 5.5, 7.4, 10.2, 15.2, 20.2]) part(x - 0.05, x + 0.05, 25.2, 30.0);
    part(-1.8, 0.4, 27.1, 27.2); part(1.6, 3.6, 27.1, 27.2); // accessible WC / kiosk back walls
    part(10.2, 15.2, 27.25, 27.35); part(12.65, 12.75, 27.35, 30.0); // clinic
    // accessible WC (−1.8…0.4 × 25.1…27.15): pan, basin, grab bars
    const pan = (x, y, rot, z = 0) => { b.box(x - 0.19, x + 0.19, y - 0.3, y + 0.3, z, z + 0.42, M.bedWhite); if (rot) b.box(x - 0.2, x + 0.2, y + (rot > 0 ? 0.25 : -0.4), y + (rot > 0 ? 0.4 : -0.25), z, z + 0.8, M.bedWhite); };
    const pan2 = (x, y, dir) => { b.box(x - 0.3, x + 0.3, y - 0.19, y + 0.19, 0, 0.42, M.bedWhite); b.box(x + dir * 0.25 - 0.08, x + dir * 0.25 + 0.08, y - 0.2, y + 0.2, 0, 0.8, M.bedWhite); };
    const basin = (x, y, z = 0.82) => { b.box(x - 0.24, x + 0.24, y - 0.18, y + 0.18, z - 0.15, z, M.bedWhite); b.cyl(x, y, 0.2, z - 0.15, 0.04, 0.04, M.ss316, 8); };
    pan2(-0.25, 26.8, 1); basin(-1.5, 26.75); b.box(-0.9, 0.3, 27.05, 27.1, 0.7, 0.74, M.ss316); b.box(0.32, 0.36, 26.2, 26.95, 0.7, 0.74, M.ss316);
    // female WC (−1.8…0.4 × 27.2…30.0): 2 cubicles behind grid 5 + basin; male WC (1.6…3.6): 1 WC + 2 urinals + basin
    part(-1.75, 0.35, 28.47, 28.53, 2.1); part(-0.7, -0.65, 28.5, 30.0, 2.1);
    for (const x of [-1.25, -0.15]) pan(x, 29.6, 1); basin(-1.4, 28.3);
    part(1.65, 2.65, 28.47, 28.53, 2.1); part(2.6, 2.65, 28.5, 30.0, 2.1); pan(2.1, 29.6, 1); basin(3.35, 28.3);
    for (const x of [2.95, 3.35]) b.box(x - 0.18, x + 0.18, 29.65, 29.98, 0.45, 1.05, M.bedWhite); b.box(3.13, 3.17, 29.4, 29.98, 0.5, 1.6, M.wallInt);
    // kiosk (1.6…3.6 × 25.1…27.15): counter
    b.box(1.8, 3.4, 25.3, 25.75, 0, 1.05, M.teakLight);
    // lockers F (3.6…5.5) / M (5.5…7.4): lockers + bench front, 2 showers behind grid 5
    for (const x0 of [3.6, 5.5]) {
      const x1 = x0 + 1.9;
      b.box(x1 - 0.5, x1 - 0.05, 25.7, 28.0, 0, 1.9, M.holdB); b.box(x0 + 0.15, x0 + 0.5, 26.0, 27.9, 0.0, 0.45, M.teakLight);
      for (let i = 0; i < 2; i++) { const sx = x0 + 0.05 + i * 0.9; b.box(sx, sx + 0.88, 29.05, 30.0, 0, 0.03, M.floorWet); b.box(sx, sx + 0.88, 29.03, 29.06, 0.0, 2.0, M.glassFrost); b.cyl(sx + 0.44, 29.85, 1.9, 2.0, 0.1, 0.1, M.ss316, 10); }
      b.box(x0 + 0.92, x0 + 0.96, 29.06, 30.0, 0, 2.0, M.wallInt);
    }
    // gift shop: wall shelving + display tables + counter
    b.box(7.45, 7.9, 26.0, 29.9, 0, 2.2, M.teakLight); b.box(7.45, 10.15, 29.55, 29.95, 0, 2.2, M.teakLight); b.box(9.7, 10.15, 26.0, 29.5, 0, 2.2, M.teakLight);
    for (const y of [27.2, 28.4]) b.box(8.3, 9.3, y, y + 0.7, 0, 0.85, M.teak); b.box(9.5, 10.1, 25.3, 25.8, 0, 1.05, M.teak);
    // clinic: reception counter + bench, 2 exam rooms with plinth beds and basins
    b.box(10.6, 11.4, 25.35, 25.85, 0, 1.05, M.teakLight); b.box(13.2, 15.0, 25.35, 25.85, 0, 0.45, M.teakLight);
    for (const x of [10.45, 12.9]) { b.box(x, x + 0.5, 28.2, 29.6, 0.45, 0.75, M.bedWhite); b.box(x, x + 0.5, 28.2, 29.6, 0.0, 0.45, M.charcoal); }
    basin(12.3, 29.75); basin(14.85, 29.75);
    // lease L1 / L2: empty shells, demountable split line
    b.box(17.68, 17.72, 25.2, 30.0, 0, 0.02, M.charcoal);
    // staff WC (existing) at 4–5/E: 2 WC back-to-back, doors inward, basin on the door wall, 2 urinals on the grid-5 wall + screen
    part(20.25, 21.15, 26.6, 26.66, 2.2); part(20.25, 21.18, 28.07, 28.13, 2.2); part(21.12, 21.18, 25.9, 27.35, 2.2); part(21.12, 21.18, 28.13, 29.1, 1.8);
    pan(20.7, 26.15, 1); pan(20.7, 27.1, -1); basin(21.4, 26.63);
    for (const x of [20.57, 20.95]) b.box(x - 0.17, x + 0.17, 28.13, 28.45, 0.45, 1.05, M.bedWhite); b.box(20.75, 20.79, 28.13, 28.6, 0.5, 1.6, M.wallInt);
    b.box(21.15, 21.18, 25.15, 25.9, 0, 2.0, M.teak); b.box(21.15, 21.18, 27.35, 28.07, 0, 2.0, M.teak);

    // S1 stacked U-stair (x −1.8…3.2, y 30.1…32.9): 4 flights × 10 risers 0.175, treads 0.26, 1.20 m clear (1.30 gross) -------
    {
      const s = STr, rS = [30.15, 31.45], rN = [31.55, 32.85], xa = -0.6, xb = 1.74, th = 0.22;
      const flight = (row, z0, dir) => { for (let i = 1; i <= 9; i++) { const xr = dir < 0 ? xb - 0.26 * i : xa + 0.26 * (i - 1); const top = z0 + 0.175 * i; s.box(xr, xr + 0.26, row[0], row[1], top - th, top, M.concrete); } };
      flight(rN, 0, -1); flight(rS, 1.75, 1); flight(rN, Z2, -1); flight(rS, Z2 + 1.75, 1);
      for (const z of [1.75, Z2 + 1.75]) s.box(-1.8, xa, 30.15, 32.85, z - 0.2, z, M.concrete); // mid landings
      s.box(xb, 3.2, 30.15, 32.85, Z2 - 0.2, Z2, M.concrete); s.box(xb, 3.2, 30.15, 31.45, Z3 - 0.2, Z3, M.concrete); // floor landings +3.50 / +7.00
      s.box(xa, xb, 31.45, 31.55, 0, Z3 + 1.1, M.plaster); // spine wall between the flights
      for (const [x, y] of [[-1.75, 30.2], [-1.75, 32.8], [3.15, 32.8], [3.15, 30.2]]) s.box(x - 0.1, x + 0.1, y - 0.1, y + 0.1, 0, ZR + 0.3, M.concreteDark);
      // teak-batten screen on the open faces (W, N, E), solid base; roof slab at ZR
      for (let x = -1.8; x <= 3.2; x += 0.3) s.box(x - 0.025, x + 0.025, 32.9, 32.95, 0.15, ZR, M.teak);
      for (let y = 30.2; y <= 32.9; y += 0.3) { s.box(-1.85, -1.8, y - 0.025, y + 0.025, 0.15, ZR, M.teak); s.box(3.2, 3.25, y - 0.025, y + 0.025, 2.3, ZR, M.teak); }
      RFr.box(-1.9, 3.3, 30.1, 33.0, ZR, ZR + 0.25, M.concrete); // S1 roof (in the roof layer so cut-aways can lift it)
      s.box(xb, 3.2, 31.42, 31.48, Z3, Z3 + 1.1, M.steel); // guard at the +7.00 landing over the open well
      // pool / garden store under the mid-landing (h 1.55)
      s.box(-1.8, xa, 30.15, 30.2, 0, 1.55, M.plaster); s.box(xa - 0.05, xa, 30.15, 32.85, 0, 1.55, M.plaster); s.box(-1.4, -0.95, 30.14, 30.16, 0, 1.4, M.teak);
    }

    // level 2 wellness (R42): rooms full depth on the court side, 1.20 m corridor at the back --------------
    const c = L2r, Hz = Z3 - 0.3, yC = 28.8;
    c.box(SLAB.x0, SLAB.x1, SLAB.y0, SLAB.y1, Z2, Z2 + 0.06, M.floorInt);
    c.box(0.4, 22.2, yC, 30.0, Z2 + 0.06, Z2 + 0.15, M.floorWet); // raised corridor floor (pipe void)
    c.box(SLAB.x0, SLAB.x1, 24.0, 24.12, Z2 - 0.5, Z2, M.plaster); // slab edge fascia
    // court-side façade y = 24.1: clear glass at reception/lounge and quiet lounge, frosted at treatment rooms
    for (const [a, e, m] of [[-1.8, 3.6, M.glass], [3.6, 17.6, M.glassFrost], [17.6, 20.2, M.glass], [21.15, 22.2, M.glassFrost]]) c.box(a, e, 24.06, 24.14, Z2 + 0.06, Hz, m);
    for (let x = SLAB.x0; x <= SLAB.x1 + 0.01; x += 1.2) c.box(x - 0.03, x + 0.03, 24.02, 24.18, Z2, Hz, M.charcoal);
    // north façade y = 30.1 (corridor glass), door to S1 landing x 1.85…3.1
    c.box(SLAB.x0, 1.85, 30.05, 30.15, Z2 + 0.06, Hz, M.glassFrost); c.box(3.1, SLAB.x1, 30.05, 30.15, Z2 + 0.06, Hz, M.glass);
    c.box(1.85, 3.1, 30.05, 30.15, Z2 + 2.25, Hz, M.plaster); c.box(1.88, 3.07, 30.07, 30.13, Z2 + 0.15, Z2 + 2.2, M.glass);
    for (let x = SLAB.x0; x <= SLAB.x1 + 0.01; x += 1.2) c.box(x - 0.03, x + 0.03, 30.0, 30.18, Z2, Hz, M.charcoal);
    // west wall with the door from the west-wing bridge (y 24.6…25.8); east wall with the corridor-end door (y 28.9…29.9)
    c.box(-1.8, -1.7, 24.1, 30.1, Z2, Hz, M.plaster); // REV R45: no west-wing bridge any more → solid west wall
    c.box(22.1, 22.3, 24.1, 30.1, Z2, Hz, M.plaster); // REV R47: east wall solid (exit is now the catwalk link)
    // partitions + corridor wall (door leaves teak)
    for (const x of [3.6, 5.8, 8.0, 10.6, 13.2, 17.6, 20.2]) c.box(x - 0.05, x + 0.05, 24.15, yC, Z2 + 0.06, Hz, M.wallInt);
    const dC = [[4.3, 5.1], [6.5, 7.3], [8.9, 9.8], [11.5, 12.4], [15.7, 16.5], [18.4, 19.3], [20.3, 21.1], [21.4, 22.0]];
    { let x = 0.4; for (const [a, e] of dC) { c.box(x, a, yC - 0.05, yC + 0.05, Z2 + 0.06, Hz, M.wallInt); c.box(a, e, yC - 0.05, yC + 0.05, Z2 + 2.2, Hz, M.wallInt); c.box(a + 0.03, e - 0.03, yC - 0.03, yC + 0.03, Z2 + 0.15, Z2 + 2.15, M.teak); x = e; } c.box(x, 22.1, yC - 0.05, yC + 0.05, Z2 + 0.06, Hz, M.wallInt); }
    c.box(-1.8, 0.4, 27.85, 27.95, Z2 + 0.06, Hz, M.wallInt); c.box(0.35, 0.45, 27.95, 30.0, Z2 + 0.06, Hz, M.wallInt); // WC
    // reception + lounge: counter, sofas facing the courts
    c.box(1.0, 2.6, 27.6, 28.1, Z2 + 0.06, Z2 + 1.1, M.teakLight);
    for (const [a, e] of [[-1.5, 0.0], [1.2, 3.3]]) { c.box(a, e, 24.4, 25.0, Z2 + 0.06, Z2 + 0.45, M.bedBlue); c.box(a, e, 24.85, 25.0, Z2 + 0.45, Z2 + 0.85, M.bedBlue); }
    c.box(-1.3, -0.9, 29.4, 29.9, Z2 + 0.06, Z2 + 0.48, M.bedWhite); c.box(-0.8, -0.4, 29.75, 29.95, Z2 + 0.7, Z2 + 0.85, M.bedWhite); // WC
    // red light ×2: bed + full-height red panel
    for (const x0 of [3.6, 5.8]) { c.box(x0 + 0.6, x0 + 1.4, 25.9, 27.9, Z2 + 0.06, Z2 + 0.6, M.bedWhite); c.box(x0 + 0.2, x0 + 2.0, 28.6, 28.7, Z2 + 0.3, Z2 + 2.2, M.holdR); }
    // HBOT ×2
    for (const xm of [9.3, 11.9]) { const g = new THREE.CylinderGeometry(0.5, 0.5, 2.0, 24); g.rotateX(Math.PI / 2); g.translate(xm, Z2 + 0.65, -26.75); c.add(M.hbot, g); c.box(xm - 0.5, xm + 0.5, 25.8, 27.7, Z2 + 0.06, Z2 + 0.2, M.charcoal); }
    // contrast room: sauna 2.2 × 2.2 at the corridor wall, cold plunge, rinse shower, bench
    c.box(13.3, 15.5, 26.5, 28.7, Z2 + 0.06, Z2 + 2.3, M.teak); c.box(13.9, 14.6, 26.47, 26.5, Z2 + 0.1, Z2 + 2.0, M.glass);
    c.box(15.7, 17.5, 27.3, 28.7, Z2 + 0.06, Z2 + 0.8, M.plunge); c.box(16.7, 17.5, 26.3, 27.15, Z2 + 0.06, Z2 + 0.09, M.floorWet); c.cyl(17.1, 26.7, Z2 + 2.1, Z2 + 2.2, 0.1, 0.1, M.ss316, 10);
    c.box(13.6, 15.2, 24.5, 24.9, Z2 + 0.06, Z2 + 0.45, M.teakLight);
    // quiet lounge: 2 recliners; massage: bed
    for (const y of [26.3, 27.4]) c.box(17.9, 19.9, y, y + 0.6, Z2 + 0.06, Z2 + 0.55, M.bedBlue);
    // REV R47: east bay = 0.90 m link passage from the +3.50 catwalk to the back corridor (x 20.25…21.15) + linen store (x 21.2…22.1)
    c.box(21.15, 21.25, 24.15, 28.8, Z2 + 0.06, Hz, M.wallInt); c.box(21.3, 22.0, 24.4, 28.6, Z2 + 0.06, Z2 + 2.2, M.teakLight);
    c.box(20.25, 21.15, 24.02, 24.2, Z2 + 2.25, Hz, M.plaster); c.box(20.28, 21.12, 24.08, 24.12, Z2 + 0.06, Z2 + 2.2, M.glass);

    // level 3 --------------------------------------------------------
    const d = L3r;
    d.box(-1.8, 22.2, 24.1, 30.1, Z3 - 0.25, Z3, M.concrete); // L3 slab
    d.box(4.2, 22.2, 24.1, 30.1, Z3, Z3 + 0.04, M.teakLight);
    d.box(-1.8, 4.2, 24.1, 30.1, Z3, Z3 + 0.04, M.floorInt);
    // studio glazing (south toward courts, north toward pool)
    d.box(4.2, 17.2, 24.06, 24.14, Z3, ZR - 0.2, M.glass);
    d.box(4.2, 17.2, 30.06, 30.14, Z3, ZR - 0.2, M.glass);
    for (let x = 4.2; x <= 17.21; x += 1.3) { d.box(x - 0.04, x + 0.04, 24.0, 24.2, Z3, ZR, M.charcoal); d.box(x - 0.04, x + 0.04, 30.0, 30.2, Z3, ZR, M.charcoal); }
    d.box(4.1, 4.3, 24.1, 26.5, Z3, ZR - 0.2, M.plaster); d.box(4.1, 4.3, 28.1, 30.1, Z3, ZR - 0.2, M.plaster); d.box(4.1, 4.3, 26.5, 28.1, Z3 + 2.3, ZR - 0.2, M.plaster);
    d.box(4.17, 4.23, 26.55, 28.05, Z3 + 0.04, Z3 + 2.25, M.glass); // glass double door lobby → studio
    // L3 west (R41): lobby x 0.4…4.2 (S1 door in the north wall), WC + shower and tenant store x −1.8…0.4
    d.box(-1.8, -1.7, 24.1, 30.1, Z3, ZR - 0.2, M.plaster); d.box(-1.8, 0.4, 24.06, 24.14, Z3, ZR - 0.2, M.plaster); d.box(0.4, 4.1, 24.06, 24.14, Z3, ZR - 0.2, M.glass);
    d.box(-1.8, 1.85, 30.06, 30.14, Z3, ZR - 0.2, M.glassFrost); d.box(3.1, 4.1, 30.06, 30.14, Z3, ZR - 0.2, M.glass); d.box(1.85, 3.1, 30.06, 30.14, Z3 + 2.25, ZR - 0.2, M.plaster); d.box(1.88, 3.07, 30.07, 30.13, Z3 + 0.04, Z3 + 2.2, M.glass);
    d.box(0.35, 0.45, 24.1, 30.0, Z3, ZR - 0.2, M.wallInt); d.box(-1.8, 0.4, 27.55, 27.65, Z3, ZR - 0.2, M.wallInt);
    d.box(-1.5, -1.1, 29.35, 29.95, Z3 + 0.04, Z3 + 0.45, M.bedWhite); d.box(-0.55, 0.35, 29.05, 29.95, Z3 + 0.04, Z3 + 0.07, M.floorWet); d.box(-0.55, 0.35, 29.03, 29.06, Z3 + 0.04, Z3 + 2.0, M.glassFrost); d.box(-1.6, -1.1, 27.8, 28.1, Z3 + 0.65, Z3 + 0.82, M.bedWhite);
    for (let k = 0; k < 3; k++) d.box(-1.7, -0.2, 24.3 + k * 1.0, 24.7 + k * 1.0, Z3 + 0.04, Z3 + 2.0, M.holdB); // tenant store shelving
    d.box(0.7, 2.0, 25.6, 26.1, Z3 + 0.04, Z3 + 1.05, M.teakLight); d.box(3.6, 4.05, 26.0, 28.4, Z3 + 0.04, Z3 + 1.2, M.teak); d.box(0.6, 1.4, 28.9, 29.3, Z3 + 0.04, Z3 + 1.1, M.bedWhite);
    d.box(17.1, 17.3, 24.1, 30.1, Z3, ZR - 0.2, M.glass);
    // studio equipment: cardio row along grid A, machines, reformers
    for (let x = 5.0; x < 10; x += 1.2) d.box(x, x + 0.8, 24.8, 26.4, Z3 + 0.04, Z3 + 1.3, M.charcoal);
    for (let k = 0; k < 4; k++) d.box(10.8 + k * 1.5, 11.3 + k * 1.5, 26.5, 29.0, Z3 + 0.04, Z3 + 0.45, M.bedWhite); // reformers
    d.box(5.0, 9.0, 27.5, 29.8, Z3 + 0.04, Z3 + 0.06, M.holdB); // mats
    // yoga terrace: balustrade, pergola, planters, retractable canopy
    d.box(17.2, 22.2, 24.0, 24.1, Z3, Z3 + 1.1, M.glass);
    d.box(17.2, 22.2, 30.1, 30.2, Z3, Z3 + 1.1, M.glass);
    d.box(22.1, 22.2, 24.1, 30.1, Z3, Z3 + 1.1, M.glass); // east edge closed (Sky Trail removed in R44)
    for (const x of [17.7, 22.0]) for (const y of [24.3, 29.9]) d.box(x - 0.08, x + 0.08, y - 0.08, y + 0.08, Z3, ZR - 0.4, M.teak);
    for (let x = 17.7; x <= 22.0; x += 0.45) d.box(x - 0.05, x + 0.05, 24.3, 29.9, ZR - 0.4, ZR - 0.3, M.teak);
    d.box(17.7, 22.0, 26.0, 28.4, ZR - 0.28, ZR - 0.25, M.glassFrost); // canopy sheet (retractable)
    for (const [x, y] of [[18.0, 24.5], [18.0, 29.6], [21.6, 29.6]]) d.box(x - 0.3, x + 0.3, y - 0.3, y + 0.3, Z3, Z3 + 0.6, M.hedge);
    // OUTDOOR FITNESS DECK (5.0 × 6.0, +7.00): sled/sprint turf, functional rig with pull-up bars + rings + TRX, plyo boxes, kettlebell rack, battle-rope post, door-wide link to the indoor studio
    d.box(17.6, 22.0, 25.0, 26.1, Z3 + 0.04, Z3 + 0.07, M.turf); d.box(17.6, 22.0, 25.0, 25.06, Z3 + 0.07, Z3 + 0.09, M.white); d.box(17.6, 22.0, 26.04, 26.1, Z3 + 0.07, Z3 + 0.09, M.white);
    d.box(18.4, 19.4, 25.3, 25.8, Z3 + 0.07, Z3 + 0.25, M.charcoal); d.box(18.5, 18.6, 25.3, 25.8, Z3 + 0.25, Z3 + 0.9, M.charcoal); // weighted sled
    for (const x of [18.2, 21.2]) d.box(x - 0.06, x + 0.06, 28.4 - 0.06, 28.4 + 0.06, Z3, Z3 + 2.7, M.charcoal); // rig posts
    d.box(18.1, 21.3, 28.34, 28.46, Z3 + 2.6, Z3 + 2.7, M.charcoal); d.box(18.1, 21.3, 28.34, 28.46, Z3 + 1.1, Z3 + 1.16, M.steel); d.box(18.1, 21.3, 28.34, 28.46, Z3 + 2.05, Z3 + 2.11, M.steel);
    for (const x of [19.0, 19.7]) { d.member([x, 28.4, Z3 + 2.6], [x, 28.4, Z3 + 2.0], 0.012, M.steel, 4); d.torus(x, 28.4, Z3 + 1.95, 0.12, 0.012, M.steel, 14); }
    for (const x of [20.4, 20.7]) { d.member([x, 28.4, Z3 + 2.6], [x - 0.1, 28.2, Z3 + 1.0], 0.012, M.holdY, 4); d.cyl(x - 0.1, 28.2, Z3 + 0.95, Z3 + 1.05, 0.03, 0.03, M.holdY, 8); } // TRX straps
    for (const [x0, h] of [[18.0, 0.5], [18.8, 0.6], [19.7, 0.75]]) d.box(x0, x0 + 0.7, 26.6, 27.2, Z3 + 0.04, Z3 + 0.04 + h, M.teakLight); // plyo boxes
    d.box(21.2, 21.9, 26.5, 27.9, Z3, Z3 + 0.9, M.charcoal); for (let k = 0; k < 6; k++) { const ge = new THREE.SphereGeometry(0.11, 10, 8); ge.translate(21.3 + (k % 3) * 0.22, Z3 + 0.62, -(26.7 + Math.floor(k / 3) * 0.5 + 0.0)); d.add(M.holdB, ge); }
    d.box(21.7, 21.85, 25.4, 25.55, Z3, Z3 + 1.3, M.teak); d.member([21.78, 25.45, Z3 + 1.0], [20.6, 25.9, Z3 + 0.2], 0.03, M.holdR, 6); // battle-rope post + rope
    d.box(17.1, 17.3, 26.5, 27.9, Z3, ZR - 0.2, M.glassFrost); // sliding door leaf to the indoor studio (parked open: frosted)

    // roof of rear complex
    RFr.box(4.0, 17.4, 23.95, 30.3, ZR - 0.25, ZR + 0.05, M.concrete);
    RFr.box(-1.9, 4.0, 22.0, 30.3, ZR, ZR + 0.3, M.concrete);
    // roof PV (rear complex part of the 60-75 kWp microgrid)
    for (let k = 0; k < 6; k++) RFr.quad(M.solar, [4.6 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 27.6, ZR + 0.25], [4.6 + k * 2.1, 27.6, ZR + 0.25], [1, 2]);
  }


  // ── SKY TRAIL (REV E): the L3 outdoor fitness deck links to the ground floor by a 48 m switch-back hiking trail (boardwalk 1.30 m wide, 17.5 % hill grade, 4 runs), trailhead at the pool court.
  // No new building: it is a landscape structure (steel posts + teak deck) in the rear garden. A step-free alternative remains the MRL lift.
  if (false) { // REV R44: Sky Trail (long switch-back stairs at E/5) removed on request — block kept for reference only
    const T = layer('hiking_trail');
    const deck = std({ color: 0xb07a3c, roughness: 0.65, side: THREE.DoubleSide });
    const W = 1.3, TH = 0.14, ZB = 7.0;
    const X0 = 26.0, X1 = 36.0, YC = [30.7, 32.5, 34.3, 36.1];
    const zRun = [ZB, ZB - 1.75, ZB - 3.5, ZB - 5.25, 0];
    const slab = (xa, za, xb, zb, yc, w = W) => {
      const y0 = yc - w / 2, y1 = yc + w / 2;
      T.quad(deck, [xa, y0, za], [xb, y0, zb], [xb, y1, zb], [xa, y1, za]);
      T.quad(deck, [xa, y0, za - TH], [xb, y0, zb - TH], [xb, y1, zb - TH], [xa, y1, za - TH]);
      T.quad(deck, [xa, y0, za], [xb, y0, zb], [xb, y0, zb - TH], [xa, y0, za - TH]);
      T.quad(deck, [xa, y1, za], [xb, y1, zb], [xb, y1, zb - TH], [xa, y1, za - TH]);
    };
    const cleat = (x, z, yc, ang, w = W - 0.1) => { const g = new THREE.BoxGeometry(0.05, 0.035, w); g.rotateZ(ang); g.translate(x, z + 0.02, -yc); T.add(M.charcoal, g); };
    const post = (x, y, z1) => T.cyl(x, y, 0, z1, 0.07, 0.07, M.charcoal, 8);
    const rails = (xa, za, xb, zb, yc, nPost = 5) => {
      for (const sy of [-1, 1]) {
        const y = yc + sy * (W / 2 - 0.03);
        T.member([xa, y, za + 1.0], [xb, y, zb + 1.0], 0.025, M.steel, 6); T.member([xa, y, za + 0.5], [xb, y, zb + 0.5], 0.018, M.steel, 5);
        for (let k = 0; k < nPost; k++) { const t = k / (nPost - 1), x = xa + (xb - xa) * t, z = za + (zb - za) * t; T.member([x, y, z], [x, y, z + 1.0], 0.022, M.steel, 5); }
      }
    };
    const run = (i, dir) => { // dir +1 = eastwards
      const xa = dir > 0 ? X0 : X1, xb = dir > 0 ? X1 : X0, za = zRun[i], zb = zRun[i + 1], yc = YC[i];
      slab(xa, za, xb, zb, yc);
      const L = Math.abs(xb - xa), ang = Math.atan2(zb - za, xb - xa);
      for (let t = 0.4; t < L; t += 0.55) { const x = xa + Math.sign(xb - xa) * t, z = za + (zb - za) * (t / L); cleat(x, z, yc, ang); }
      rails(xa, za, xb, zb, yc);
      for (let k = 0; k <= 3; k++) { const t = (k / 3) * L, x = xa + Math.sign(xb - xa) * t, z = za + (zb - za) * (t / L) - TH; for (const sy of [-1, 1]) post(x, yc + sy * 0.55, z); T.box(x - 0.05, x + 0.05, yc - W / 2, yc + W / 2, z - 0.12, z, M.charcoal); }
      // trail km-post every run
      T.cbox(xa + Math.sign(xb - xa) * 1.0, yc + W / 2 + 0.12, za + (zb - za) * (1.0 / L) + 0.45, 0.35, 0.03, 0.2, M.holdY);
    };
    const landing = (x0, x1, y0, y1, z) => {
      T.box(x0, x1, y0, y1, z - TH, z, M.teak);
      for (const [px, py] of [[x0 + 0.1, y0 + 0.1], [x1 - 0.1, y0 + 0.1], [x0 + 0.1, y1 - 0.1], [x1 - 0.1, y1 - 0.1]]) post(px, py, z - TH);
      T.box(x0 + 0.05, x1 - 0.05, y0 + 0.05, y1 - 0.05, z - TH - 0.1, z - TH, M.charcoal);
      for (const [xa, xb, ya, yb] of [[x0, x1, y0, y0], [x0, x1, y1, y1], [x0, x0, y0, y1], [x1, x1, y0, y1]]) T.member([xa, ya, z + 1.0], [xb, yb, z + 1.0], 0.025, M.steel, 6);
    };
    // deck on the L3 level → bridge → first landing
    T.box(22.2, 24.3, 29.35, 30.65, ZB - TH, ZB, M.teak); T.box(22.2, 24.3, 29.35, 30.65, ZB - TH - 0.25, ZB - TH, M.charcoal);
    for (const y of [29.35, 30.65]) T.member([22.2, y, ZB + 1.0], [24.3, y, ZB + 1.0], 0.025, M.steel, 6);
    landing(24.3, 26.0, 29.35, 31.5, ZB);
    for (const x of [22.8, 23.7]) for (const y of [29.45, 30.55]) post(x, y, ZB - TH - 0.25);
    run(0, +1); landing(36.0, 37.6, 30.05, 33.15, zRun[1]);
    run(1, -1); landing(24.4, 26.0, 31.85, 34.95, zRun[2]);
    run(2, +1); landing(36.0, 37.6, 33.65, 36.75, zRun[3]);
    run(3, -1);
    // trailhead pad at the ground floor + amenities
    T.box(23.4, 26.0, 35.45, 36.75, 0, 0.04, M.pathStone);
    T.box(23.5, 25.0, 36.0, 36.6, 0.04, 0.45, M.teakLight); T.box(23.5, 24.9, 36.5, 36.6, 0.45, 0.95, M.teakLight); // bench with back
    T.cyl(23.9, 35.65, 0.04, 1.0, 0.1, 0.1, M.ss316, 10); T.cyl(23.9, 35.65, 1.0, 1.04, 0.15, 0.15, M.ss316, 10); // drinking fountain
    T.box(24.4, 25.6, 34.95, 35.3, 0, 0.3, M.pebble); T.box(24.45, 25.55, 35.0, 35.25, 0.18, 0.3, M.poolWater); // boot-wash trough
    const sgn = canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#2b2118'; g.fillRect(0, 0, w, h); g.fillStyle = '#f4e9d4'; g.font = '700 54px "Helvetica Neue", Arial, sans-serif'; g.textAlign = 'center'; g.fillText('SKY TRAIL', w / 2, 84); g.font = '34px Arial'; g.fillText('48 m  ·  +7.0 m  ·  17 %', w / 2, 142); g.font = '26px Arial'; g.fillText('L3 FITNESS DECK  ⟷  GROUND', w / 2, 196); });
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshStandardMaterial({ map: sgn, roughness: 0.8 }));
    sg.position.set(23.45, 1.75, -35.7); sg.rotation.y = Math.PI / 2; sg.name = 'trail_sign'; T.group.add(sg);
    T.cyl(23.45, 35.1, 0, 1.4, 0.04, 0.04, M.charcoal, 6); T.cyl(23.45, 36.3, 0, 1.4, 0.04, 0.04, M.charcoal, 6);
    // hill terrain flanking the trail: rock garden + planted slope
    let hs2 = 5; const hr2 = () => ((hs2 = (hs2 * 48271) % 2147483647) / 2147483647);
    const rock = std({ color: 0x8b8f93, roughness: 1 });
    for (let k = 0; k < 16; k++) { const rx = 24.2 + hr2() * 13.6, ry = 29.9 + hr2() * 6.9, r = 0.18 + hr2() * 0.28; if (Math.abs(ry - YC[0]) < 0.9 && rx > 24 && rx < 36) continue; const rg = new THREE.DodecahedronGeometry(r, 0); rg.scale(1.2, 0.7, 1); rg.translate(rx, r * 0.45, -ry); T.add(rock, rg); }
    for (const [mx, my, mr] of [[38.0, 34.0, 1.1], [24.0, 37.3, 0.9], [37.9, 31.0, 0.8]]) { const mg = new THREE.SphereGeometry(mr, 12, 8, 0, TAU, 0, Math.PI / 2); mg.translate(mx, 0, -my); T.add(M.treeCrown, mg); }
    for (let k = 0; k < 10; k++) { const gx = 24.4 + k * 1.4; const g = new THREE.ConeGeometry(0.08, 0.7, 5); g.translate(gx, 0.35, -(37.2 - (k % 2) * 0.2)); T.add(M.hedge, g); }
    // under-deck LED strips on the runs (night walking)
    for (let i = 0; i < 4; i++) { const xa = i % 2 === 0 ? X0 : X1, xb = i % 2 === 0 ? X1 : X0; T.member([xa, YC[i], zRun[i] - TH - 0.02], [xb, YC[i], zRun[i + 1] - TH - 0.02], 0.02, M.led, 4); }
  }

  // ── Rear (north) façade, pool court and side detailing (REV D.8) ──────────
  {
    const R = layer('rear_services');
    const fN = 30.1;
    // L3 studio: vertical teak sun-fins on the north glass (0.65 m rhythm) + continuous fin rail
    for (let x = 4.2; x <= 17.21; x += 0.65) L3r.box(x - 0.025, x + 0.025, fN + 0.1, fN + 0.55, Z3 + 0.05, ZR - 0.25, M.teak);
    L3r.box(4.2, 17.2, fN + 0.08, fN + 0.12, ZR - 0.3, ZR - 0.24, M.charcoal);
    L3r.box(4.2, 17.2, fN + 0.08, fN + 0.12, Z3 + 0.02, Z3 + 0.08, M.charcoal);
    // L2 wellness: continuous 0.70 m eyebrow shade over the glazing + warm wall-washer lights under it
    L2r.box(SLAB.x0, SLAB.x1, fN, fN + 0.7, Z3 - 0.3, Z3 - 0.24, M.charcoal);
    L2r.box(SLAB.x0, SLAB.x1, fN + 0.68, fN + 0.72, Z3 - 0.45, Z3 - 0.24, M.plaster);
    for (let x = -0.6; x < 22.2; x += 2.4) L2r.box(x - 0.1, x + 0.1, fN + 0.55, fN + 0.65, Z3 - 0.33, Z3 - 0.3, M.led);
    // GF: timber-slat canopy over the 2.00 m clinic sliding door to the pool deck (x 14.6 … 18.2)
    // services on the façade: stainless sauna exhaust risers + rain caps, charcoal downpipes
    for (const x of R2 ? [] : [12.9, 14.3]) {
      R.cyl(x, fN + 0.3, Z2 + 0.4, ZR + 1.6, 0.1, 0.1, M.ss316, 14);
      R.cyl(x, fN + 0.3, ZR + 1.6, ZR + 1.78, 0.18, 0.02, M.ss316, 14);
      for (let z = Z2 + 1.5; z < ZR + 1.5; z += 2.2) R.cyl(x, fN + 0.3, z, z + 0.05, 0.13, 0.13, M.steel, 14);
    }
    for (const x of [-1.6, 4.1, 10.1, 17.3, 22.05]) R.cyl(x, fN + 0.12, 0.0, ZR, 0.045, 0.045, M.charcoal, 8);
    // rooftop plant screen on the L3 roof: louvred enclosure + condensers / chillers (north side, behind the PV)
    {
      const x0 = 5.0, x1 = 16.8, y0 = 28.0, y1 = 29.95, z0 = ZR + 0.05, zt = ZR + 2.0;
      for (const x of [x0, 8.9, 12.9, x1]) RFr.box(x - 0.05, x + 0.05, y1 - 0.05, y1 + 0.05, z0, zt, M.charcoal);
      for (const y of [y0, y1]) RFr.box(x0, x1, y - 0.04, y + 0.04, zt - 0.08, zt, M.charcoal);
      for (const x of [x0, x1]) RFr.box(x - 0.04, x + 0.04, y0, y1, zt - 0.08, zt, M.charcoal);
      for (let z = z0 + 0.15; z < zt - 0.1; z += 0.14) {
        RFr.box(x0, x1, y1 - 0.02, y1 + 0.02, z, z + 0.05, M.louvre);
        RFr.box(x0 - 0.02, x0 + 0.02, y0, y1, z, z + 0.05, M.louvre);
        RFr.box(x1 - 0.02, x1 + 0.02, y0, y1, z, z + 0.05, M.louvre);
      }
      for (const [cx, cy] of [[6.2, 29.0], [8.0, 29.0], [10.2, 29.0], [12.0, 29.0], [14.2, 29.0], [15.8, 29.0]]) {
        RFr.cbox(cx, cy, z0 + 0.55, 1.2, 1.0, 1.1, M.concreteDark);
        RFr.cyl(cx, cy, z0 + 1.1, z0 + 1.14, 0.42, 0.42, M.rubber, 18);
        RFr.cbox(cx, cy, z0 + 1.15, 0.9, 0.04, 0.02, M.steel);
      }
      RFr.box(x0, x1, y0, y1, z0 - 0.02, z0 + 0.02, M.concreteDark); // equipment plinth slab
    }
    // PV array moved to the south part of the roof so the plant screen has room
    // (kept at 6 panels; the quad above is shortened in the roof block)
    // west wing: sconces on the batten wall + PV on the flat roof (REV P6 wing, south-facing 10° arrays)
    {
      const b = G.west_wing, bR = G.ww_roof;
      if (!bR) { /* REV R45: no wing */ } else {
      for (let y = -8.0; y < 10; y += 2.2) b.box(-3.98, -3.9, y - 0.05, y + 0.05, 3.0, 3.25, M.led);
      for (let y = 26.2; y < 30; y += 2.2) b.box(-3.98, -3.9, y - 0.05, y + 0.05, 3.0, 3.25, M.led);
      for (let y = -8.4; y < 9.2; y += 2.2) bR.quad(M.solar, [-3.6, y, 7.3 + 0.12], [-1.1, y, 7.3 + 0.12], [-1.1, y + 1.9, 7.3 + 0.45], [-3.6, y + 1.9, 7.3 + 0.45], [2, 1]);
      for (let y = -8.4; y < 9.2; y += 2.2) for (const x of [-3.5, -1.2]) bR.member([x, y + 0.1, 7.3], [x, y + 1.0, 7.3 + 0.28], 0.025, M.charcoal, 4);
      }
    }
  }

  // ── Outdoor: pool + deck, climbing wall + sunk crash pit, pickleball, senior garden ──
  {
    const b = G.outdoor || layer('outdoor');
    // ── REV R43: NO POOL — the rear yard behind the building is kept as lawn for a future landscape (x 3.4 … 22.2 up to the sloped fence) ──
    {
      const fenceY = (x) => 33.85 + (x - 0.2) * 0.15;
      for (let x = 3.4; x < 22.2; x += 1.0) b.box(x, Math.min(x + 1.0, 22.2), 30.2, fenceY(x) - 0.3, 0.0, 0.03, M.turf);
      for (let x = 4.0; x < 21.5; x += 0.9) b.box(x, x + 0.5, 30.25, 30.65, 0.0, 0.05, M.pebble); // gravel drip strip along the façade (buried drains run here)
      for (const [x, y] of [[6.0, 32.6], [10.0, 33.0], [14.0, 33.4], [18.0, 34.0]]) b.box(x - 0.6, x + 0.6, y - 0.35, y + 0.35, 0.0, 0.05, M.teakLight); // stepping pads (temporary)
    }
    // REV R43: outdoor climbing tower + crash pit removed (the L2 east exit landing now runs along the east wall to y 30.1)
    // pickleball courts PB1, PB2 along the hall's glass wall
    const PX = XE + 0.15 + 1.5; // REV R47: court edge 1.50 m from the grid-E column face (x 21.85)
    // REV R49: courts on the badminton rows; ONE chain-link fence on grid 2 (y 7.35) between them → 2.35 m run-off behind each inner baseline;
    // east side 1.50 m beyond the courts = plot line (x 29.45) with the 3.0 m chain-link on it; 1.2 m fence toward the hall with two gates by grid 2
    const FX0 = PX - 0.5, FX1 = XEAST, FY0 = -9.0, FY1 = 23.7, GY = 7.35;
    const MESH = std({ color: 0x1f2937, roughness: 0.8, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false });
    b.box(FX0, FX1, FY0, FY1, 0.0, 0.015, M.pickleOut);
    for (const y0 of [-8.4, 9.7]) {
      const g = new THREE.PlaneGeometry(6.1, 13.4);
      g.rotateX(-Math.PI / 2);
      g.translate(PX + 3.05, 0.02, -(y0 + 6.7));
      b.add(M.pickleTex, g);
      const ny = y0 + 6.7;
      for (const px of [PX - 0.3, PX + 6.4]) b.cyl(px, ny, 0, 0.95, 0.03, 0.03, M.charcoal, 8);
      b.cbox(PX + 3.05, ny, 0.5, 6.1, 0.02, 0.8, M.net);
    }
    for (const [lx, ly] of [[FX1 - 0.15, FY0 + 0.2], [FX1 - 0.15, GY - 0.25], [FX1 - 0.15, FY1 - 0.2]]) { b.cyl(lx, ly, 0, 6.0, 0.06, 0.05, M.charcoal, 8); b.box(lx - 0.25, lx + 0.25, ly - 0.1, ly + 0.1, 5.9, 6.0, M.led); }
    const fence = (xa, ya, xb, yb, h) => { b.box(Math.min(xa, xb) - 0.01, Math.max(xa, xb) + 0.01, Math.min(ya, yb) - 0.01, Math.max(ya, yb) + 0.01, 0.05, h, MESH); for (let t = 0; t <= 1.0001; t += 1 / Math.max(1, Math.round(Math.hypot(xb - xa, yb - ya) / 2.5))) b.cyl(xa + (xb - xa) * t, ya + (yb - ya) * t, 0, h + 0.05, 0.03, 0.03, M.charcoal, 8); b.box(Math.min(xa, xb), Math.max(xa, xb), Math.min(ya, yb) - 0.025, Math.max(ya, yb) + 0.025, h - 0.04, h + 0.04, M.charcoal); };
    fence(FX1, FY0, FX1, FY1, 3.0); fence(FX0, FY0, FX1, FY0, 3.0); fence(FX0, FY1, FX1, FY1, 3.0); fence(FX0, GY, FX1, GY, 3.0); // east (plot line), ends, grid 2
    fence(FX0, FY0, FX0, 5.9, 1.2); fence(FX0, 6.9, FX0, 7.8, 1.2); fence(FX0, 8.8, FX0, FY1, 1.2); // toward the hall, gates y 5.9…6.9 and 7.8…8.8
    // senior parkour & active-aging garden along the rear fence (grass beds + handrail path)
    if (!R2) b.box(22.4, XEAST, 24.2, 37.5, 0.0, 0.02, M.turf);
    if (!R2) b.box(-3.9, -1.95, 30.2, 33.0, 0.0, 0.02, M.turf);
  }

  // ════════════════════════════════════════════════════════════════════════════════════════
  // REV R2 — "RECOVERY COURTYARD" (free re-think of the rear zone)
  //  • all wet / heavy recovery (sauna, steam, cold plunge, showers, HBOT) on GRADE; the existing
  //    +3.50 slab only carries light, dry uses (gallery, lounge, lab, massage, staff)
  //  • a single-loaded "recovery street" corridor on the noisy hall side, every room faces the garden
  //  • NEW east core = 2nd fire stair (GF → roof) + catwalk access + 12 m climbing wall on its east face
  //  • NEW single-storey Thermal Pavilion closes the courtyard on the east (changing, sauna, steam, cold plunge)
  //  • yoga moves to the quiet WEST end of L3 under the palm crowns; L3 services next to the new core
  // ════════════════════════════════════════════════════════════════════════════════════════
  if (R2) {
    const M2r = { sofa: std({ color: 0x3e6b57, roughness: 0.9 }), sofaTan: std({ color: 0xb48a5a, roughness: 0.85 }), cabinet: std({ color: 0x66707b, roughness: 0.5, metalness: 0.4 }), screen: std({ color: 0x0b1020, roughness: 0.2, emissive: 0x24408a, emissiveIntensity: 0.5 }) };
    const xs = [0.2, 5.2, 10.2, 15.2, 20.2];
    const colsAt = (lyr, z0, z1) => { for (const y of [25.1, 28.1]) for (const x of xs) lyr.box(x - 0.15, x + 0.15, y - 0.15, y + 0.15, z0, z1, M.concreteDark); };
    colsAt(GFr, 0, Z2); colsAt(L2r, Z2, Z3); colsAt(L3r, Z3, ZR);
    L2r.box(SLAB.x0, SLAB.x1, SLAB.y0, SLAB.y1, Z2 - 0.28, Z2, M.concreteDark);
    for (const y of [25.1, 28.1]) L2r.box(SLAB.x0, SLAB.x1, y - 0.15, y + 0.15, Z2 - 0.65, Z2 - 0.28, M.concreteDark);
    const glassN = (L, z0, z1, x0 = SLAB.x0, x1 = SLAB.x1) => { L.box(x0, x1, 30.05, 30.15, z0, z1, M.glass); for (let x = x0; x <= x1 + 0.01; x += 1.2) L.box(x - 0.03, x + 0.03, 30.0, 30.18, z0, z1, M.charcoal); };
    const bed = (L, x0, x1, y0, y1, z, mat = M.bedWhite) => { L.box(x0, x1, y0, y1, z + 0.45, z + 0.8, mat); L.box(x0 + 0.05, x1 - 0.05, y0 + 0.05, y1 - 0.05, z, z + 0.45, M.charcoal); };
    const chairR2 = (L, x, y, z, m = M.charcoal) => { L.box(x - 0.22, x + 0.22, y - 0.22, y + 0.22, z + 0.42, z + 0.47, m); L.box(x - 0.22, x + 0.22, y + 0.19, y + 0.22, z + 0.47, z + 0.9, m); L.cyl(x, y, z, z + 0.42, 0.03, 0.03, M.steel, 6); };
    const shrub = (L, x, y, z, s = 1) => { for (let k = 0; k < 6; k++) { const a = k * 1.05; const g = new THREE.ConeGeometry(0.08 * s, 0.8 * s, 5); g.rotateZ(0.35); g.rotateY(a); g.translate(x, z + 0.4 * s, -y); L.add(M.hedge, g); } };

    // ── GF (on grade): reception + recovery clinic, single-loaded corridor on the hall side ──
    {
      const b = GFr, CY = 26.6; // corridor y 25.2 … 26.6, rooms y 26.65 … 30.0
      b.box(SLAB.x0, SLAB.x1, 25.1, 30.1, -0.05, 0.0, M.floorInt);
      b.box(SLAB.x0, 22.1, 25.2, CY, 0.0, 0.01, M.paving); // corridor stone
      // south façade to the hall aisle: solid acoustic wall 0 … 2.2 + clerestory glazing 2.2 … 3.2 (hall light, no doors onto the run-off)
      b.box(SLAB.x0, SLAB.x1, 25.0, 25.2, 0, 2.2, M.plaster);
      b.box(SLAB.x0, SLAB.x1, 25.05, 25.15, 2.2, Z2 - 0.3, M.glassFrost);
      b.box(6.0, 7.0, 24.98, 25.22, 0, 2.15, M.charcoal); // single emergency door only
      glassN(b, 0, Z2 - 0.3);
      b.box(22.1, 22.3, 25.1, 25.25, 0, Z2 - 0.3, M.plaster); b.box(22.1, 22.3, 26.55, 30.1, 0, Z2 - 0.3, M.plaster); b.box(22.1, 22.3, 25.25, 26.55, 2.2, Z2 - 0.3, M.plaster); // east wall with the door to the core
      // … with the door to the new east core at the end of the corridor (rebuilt as two pieces)
      // corridor wall (y 26.6) = frosted glass with charcoal door frames; west lobby + reception are open to it
      b.box(5.2, 22.1, CY - 0.04, CY + 0.04, 0, 2.6, M.glassFrost);
      for (const [x0] of [[8.5], [11.0], [13.5], [16.0], [20.7]]) { b.box(x0 - 0.05, x0, CY - 0.07, CY + 0.07, 0, 2.2, M.charcoal); b.box(x0 + 1.0, x0 + 1.05, CY - 0.07, CY + 0.07, 0, 2.2, M.charcoal); b.box(x0 - 0.05, x0 + 1.05, CY - 0.07, CY + 0.07, 2.15, 2.2, M.charcoal); }
      for (const x of [5.2, 10.2, 12.7, 15.2, 20.2]) b.box(x - 0.05, x + 0.05, CY, 30.0, 0, Z2 - 0.3, M.wallInt);
      // west lobby (lift link) + reception / waiting
      b.box(2.4, 4.8, 27.6, 28.2, 0, 1.05, M.teak); b.box(2.35, 4.85, 27.55, 28.25, 1.05, 1.1, M.ss316); // front desk
      for (const x of [-1.2, -0.4, 0.4]) chairR2(b, x, 29.3, 0, M2r.sofa);
      b.box(-1.5, 1.2, 28.6, 28.75, 0, 0.45, M.teakLight); shrub(b, 1.5, 29.6, 0, 1.3); shrub(b, -1.5, 27.0, 0, 1.1);
      // HBOT suite (5.0 × 3.35): two monoplace chambers on grade + compressor cabinet
      for (const cx of [6.5, 8.9]) { const g = new THREE.CylinderGeometry(0.45, 0.45, 2.2, 24); g.rotateZ(Math.PI / 2); g.translate(cx, 0.95, -28.6); b.add(M.hbot, g); b.box(cx - 1.0, cx + 1.0, 28.1, 29.1, 0, 0.5, M.charcoal); }
      b.box(9.4, 10.1, 29.4, 29.95, 0, 1.6, M2r.cabinet);
      // treatment rooms 1 + 2 (2.5 × 3.35)
      bed(b, 10.6, 11.4, 27.7, 29.6, 0); bed(b, 13.1, 13.9, 27.7, 29.6, 0, M.bedBlue);
      b.box(11.9, 12.4, 29.4, 29.9, 0, 1.25, M.charcoal); b.box(14.4, 14.9, 29.4, 29.9, 0, 1.25, M.charcoal);
      // rehab gym (5.0 × 3.35): turf, stall bars, parallel bars, door to the pool deck (x 15.4 … 17.4 stays on the pool axis)
      b.box(15.25, 20.15, CY + 0.05, 30.0, 0.0, 0.02, M.turf);
      for (let y = 27.0; y < 29.9; y += 0.3) b.box(19.95, 20.05, y, y + 0.05, 0, 2.2, M.teakLight);
      for (const y of [27.6, 28.3]) { b.box(17.6, 19.6, y - 0.02, y + 0.02, 0.95, 1.0, M.steel); for (const x of [17.6, 19.6]) b.cyl(x, y, 0, 0.95, 0.025, 0.025, M.steel, 6); }
      b.cyl(16.2, 27.4, 0, 0.6, 0.3, 0.3, M.bedBlue, 16);
      // red-light / PBM pod (2.0 × 3.35)
      b.box(20.4, 22.0, 29.85, 29.95, 0.4, 2.2, M.holdR); b.box(20.6, 21.8, 27.4, 29.3, 0.0, 0.5, M.bedWhite);
    }

    // ── L2 (+3.50, existing slab — light & dry only): spectator gallery, members' lounge, sports-science lab, massage ──
    {
      const c = L2r;
      c.box(SLAB.x0, SLAB.x1, SLAB.y0, SLAB.y1, Z2, Z2 + 0.06, M.floorInt);
      c.box(SLAB.x0, SLAB.x1, 24.08, 24.12, Z2 + 0.06, Z2 + 1.16, M.glass); c.box(SLAB.x0, SLAB.x1, 24.06, 24.14, Z2 + 1.12, Z2 + 1.18, M.steel);
      for (let x = SLAB.x0; x <= SLAB.x1 + 0.01; x += 2.0) c.box(x - 0.03, x + 0.03, 24.05, 24.15, Z2, Z2 + 1.18, M.steel);
      c.box(SLAB.x0, SLAB.x1, 24.0, 24.12, Z2 - 0.5, Z2, M.plaster);
      // solid acoustic wall between the public gallery and the rooms (privacy), high strip windows, one door per room
      const doors = [1.6, 8.0, 15.9, 18.4, 20.7];
      let x = SLAB.x0;
      for (const d of doors) { c.box(x, d, 25.85, 25.95, Z2 + 0.06, Z3 - 0.3, M.plaster); c.box(d, d + 1.0, 25.85, 25.95, Z2 + 2.2, Z3 - 0.3, M.plaster); c.box(d - 0.04, d + 1.04, 25.84, 25.96, Z2, Z2 + 2.25, M.charcoal); x = d + 1.0; }
      c.box(x, SLAB.x1, 25.85, 25.95, Z2 + 0.06, Z3 - 0.3, M.plaster);
      c.box(SLAB.x0, SLAB.x1, 25.84, 25.96, Z2 + 2.5, Z2 + 3.0, M.glassFrost);
      glassN(c, Z2 + 0.06, Z3 - 0.3);
      c.box(22.1, 22.3, 25.2, 30.1, Z2, Z3 - 0.3, M.plaster); c.box(22.1, 22.3, 24.1, 25.2, Z2 + 2.2, Z3 - 0.3, M.plaster); // gallery end door → east core
      for (const xp of [5.2, 15.2, 17.7, 20.2]) c.box(xp - 0.06, xp + 0.06, 25.9, 30.1, Z2 + 0.06, Z3 - 0.3, M.wallInt);
      const z = Z2 + 0.06;
      // members' lounge + juice bar (7.0 × 4.2) facing the garden and the palms
      c.box(-1.6, 1.2, 26.2, 26.75, z, z + 1.05, M.teak); c.box(-1.65, 1.25, 26.15, 26.8, z + 1.05, z + 1.1, M.ss316);
      c.box(-1.4, 2.0, 29.2, 29.9, z, z + 0.45, M2r.sofa); c.box(-1.4, 2.0, 29.75, 29.95, z + 0.45, z + 0.95, M2r.sofa);
      for (const [tx, ty] of [[2.8, 27.6], [4.0, 29.0], [0.2, 28.3]]) { c.cyl(tx, ty, z, z + 0.72, 0.04, 0.04, M.charcoal, 8); c.cyl(tx, ty, z + 0.72, z + 0.75, 0.4, 0.4, M.teakLight, 18); chairR2(c, tx + 0.55, ty, z, M2r.sofaTan); chairR2(c, tx - 0.55, ty, z, M2r.sofaTan); }
      // sports-science lab (10.0 × 4.2): instrumented treadmill, force plates, bike ergometer, VO2 cart, desk with screens
      c.box(6.0, 8.4, 27.8, 28.8, z, z + 0.35, M.charcoal); c.box(6.0, 6.2, 27.8, 28.8, z + 0.35, z + 1.3, M.charcoal);
      c.box(9.2, 11.4, 27.4, 28.6, z, z + 0.04, M.ss316); c.box(9.2, 11.4, 28.7, 29.9, z, z + 0.04, M.ss316);
      c.box(12.0, 13.2, 28.2, 28.8, z, z + 1.0, M.charcoal); c.box(13.6, 14.2, 28.0, 28.6, z, z + 1.4, M2r.cabinet);
      c.box(9.0, 14.8, 26.2, 26.8, z + 0.72, z + 0.76, M.teakLight); for (const sx of [10.0, 11.6, 13.2]) c.box(sx - 0.4, sx + 0.4, 26.25, 26.3, z + 0.8, z + 1.3, M2r.screen);
      // massage suites (2.5 × 4.2 each)
      bed(c, 16.0, 16.8, 27.3, 29.3, z); bed(c, 18.5, 19.3, 27.3, 29.3, z);
      // staff / linen (2.0 × 4.2)
      c.box(20.5, 21.9, 26.2, 29.9, z, z + 2.2, M.teakLight);
      for (const px of [3, 9, 15, 19.5]) c.box(px - 0.3, px + 0.3, 24.3, 24.9, z, z + 0.6, M.hedge);
    }

    // ── L3 (+7.00): YOGA TERRACE at the quiet west end (palm crowns overhead) · rentable studio · services by the new core ──
    {
      const d = L3r;
      d.box(-1.8, 22.2, 24.1, 30.1, Z3 - 0.25, Z3, M.concrete);
      d.box(-1.8, 4.1, 24.1, 30.1, Z3, Z3 + 0.05, M.teak); d.box(4.2, 17.2, 24.1, 30.1, Z3, Z3 + 0.04, M.teakLight); d.box(17.2, 22.2, 24.1, 30.1, Z3, Z3 + 0.04, M.floorInt);
      // studio 13.0 × 6.0 (unchanged area) — now glazed on the west too, opening onto the yoga terrace
      d.box(4.2, 17.2, 24.06, 24.14, Z3, ZR - 0.2, M.glass); d.box(4.2, 17.2, 30.06, 30.14, Z3, ZR - 0.2, M.glass);
      for (let x = 4.2; x <= 17.21; x += 1.3) { d.box(x - 0.04, x + 0.04, 24.0, 24.2, Z3, ZR, M.charcoal); d.box(x - 0.04, x + 0.04, 30.0, 30.2, Z3, ZR, M.charcoal); }
      d.box(4.15, 4.25, 24.1, 30.1, Z3, ZR - 0.2, M.glass); for (let y = 24.1; y <= 30.11; y += 1.5) d.box(4.12, 4.28, y - 0.04, y + 0.04, Z3, ZR, M.charcoal);
      d.box(17.1, 17.3, 24.1, 30.1, Z3, ZR - 0.2, M.plaster);
      for (let x = 5.0; x < 10; x += 1.2) d.box(x, x + 0.8, 24.8, 26.4, Z3 + 0.04, Z3 + 1.3, M.charcoal);
      for (let k = 0; k < 4; k++) d.box(10.8 + k * 1.5, 11.3 + k * 1.5, 26.5, 29.0, Z3 + 0.04, Z3 + 0.45, M.bedWhite);
      d.box(5.0, 9.0, 27.5, 29.8, Z3 + 0.04, Z3 + 0.06, M.holdB);
      // yoga terrace (5.9 × 6.0): glass balustrades, pergola, retractable canopy, mats, planters
      d.box(-1.8, 4.1, 24.0, 24.1, Z3, Z3 + 1.1, M.glass); d.box(-1.8, 4.1, 30.1, 30.2, Z3, Z3 + 1.1, M.glass);
      for (const px of [-1.4, 3.8]) for (const py of [24.3, 29.9]) d.box(px - 0.08, px + 0.08, py - 0.08, py + 0.08, Z3, ZR - 0.4, M.teak);
      for (let px = -1.4; px <= 3.8; px += 0.45) d.box(px - 0.05, px + 0.05, 24.3, 29.9, ZR - 0.4, ZR - 0.3, M.teak);
      d.box(-1.4, 3.8, 26.0, 28.4, ZR - 0.28, ZR - 0.25, M.glassFrost);
      for (let k = 0; k < 5; k++) d.box(-1.0 + k * 0.95, -1.0 + k * 0.95 + 0.65, 25.4, 27.2, Z3 + 0.05, Z3 + 0.07, M.holdY);
      for (const [px, py] of [[-1.3, 29.6], [3.6, 29.6], [3.6, 24.5]]) { d.box(px - 0.3, px + 0.3, py - 0.3, py + 0.3, Z3, Z3 + 0.6, M.teak); shrub(d, px, py, Z3 + 0.6, 1.2); }
      // services by the east core: accessible WC 2.30 × 2.30, tenant store, small lobby
      d.box(17.3, 19.6, 26.5, 26.6, Z3, ZR - 0.3, M.wallInt); d.box(19.6, 19.7, 24.2, 26.6, Z3, ZR - 0.3, M.wallInt);
      d.box(17.3, 22.1, 26.6, 26.7, Z3, ZR - 0.3, M.wallInt);
      d.box(17.6, 18.0, 25.9, 26.4, Z3, Z3 + 0.4, M.bedWhite); d.box(18.6, 19.3, 24.3, 24.7, Z3 + 0.8, Z3 + 0.88, M.bedWhite);
      for (let k = 0; k < 4; k++) d.box(17.5, 18.0, 27.0 + k * 0.75, 27.6 + k * 0.75, Z3, Z3 + 2.0, M.teakLight);
      d.box(21.5, 22.05, 27.0, 29.8, Z3, Z3 + 2.0, M.teakLight);
      d.box(22.1, 22.3, 25.2, 30.1, Z3, ZR - 0.2, M.plaster); d.box(22.1, 22.3, 24.1, 25.2, Z3 + 2.2, ZR - 0.2, M.plaster);
    }
    // roof (terrace stays open to the sky; pergola only)
    RFr.box(4.0, 22.3, 23.95, 30.3, ZR - 0.25, ZR + 0.05, M.concrete);
    for (let k = 0; k < 6; k++) RFr.quad(M.solar, [4.6 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 27.6, ZR + 0.25], [4.6 + k * 2.1, 27.6, ZR + 0.25], [1, 2]);

    // ── NEW EAST CORE (x 22.30 … 25.10, y 22.00 … 28.00, RC, top +12.00) = 2nd fire stair + catwalk access + CLIMB TOWER ──
    {
      const k = layer('r2_core'), X0 = 22.3, X1 = 25.1, Y0 = 22.0, Y1 = 28.0, ZT = 12.0, t = 0.2;
      const wallYc = (y0, y1, za, zb, holes) => { let x = X0; for (const h of holes) { if (h[0] > x) k.box(x, h[0], y0, y1, za, zb, M.concrete); if (h[2] > za) k.box(h[0], h[1], y0, y1, za, h[2], M.concrete); if (h[3] < zb) k.box(h[0], h[1], y0, y1, h[3], zb, M.concrete); x = h[1]; } if (x < X1) k.box(x, X1, y0, y1, za, zb, M.concrete); };
      const wallXc = (x0, x1, za, zb, holes) => { let y = Y0; for (const h of holes) { if (h[0] > y) k.box(x0, x1, y, h[0], za, zb, M.concrete); if (h[2] > za) k.box(x0, x1, h[0], h[1], za, h[2], M.concrete); if (h[3] < zb) k.box(x0, x1, h[0], h[1], h[3], zb, M.concrete); y = h[1]; } if (y < Y1) k.box(x0, x1, y, Y1, za, zb, M.concrete); };
      // west face: doors into the corridor (GF), gallery (L2), L3 lobby
      k.box(X0, X0 + t, Y0, 24.2, 0, ZT, M.concrete); k.box(X0, X0 + t, 26.55, Y1, 0, ZT, M.concrete);
      k.box(X0, X0 + t, 25.2, 25.25, 0, ZT, M.concrete); k.box(X0, X0 + t, 25.25, 26.55, 2.2, ZT, M.concrete); // GF door → corridor
      for (const [za, zb] of [[0, Z2], [Z2 + 2.2, Z3], [Z3 + 2.2, ZT]]) k.box(X0, X0 + t, 24.2, 25.2, za, zb, M.concrete); // L2 + L3 doors
      // south face: street door from the pickleball path (GF) + door onto the +4.50 catwalk
      wallYc(Y0, Y0 + t, 0, ZT, [[22.5, 23.7, 4.5, 6.7]]); k.box(23.9, 24.9, Y0 - 0.01, Y0 + t + 0.01, 0, 2.2, M.charcoal);
      wallYc(Y1 - t, Y1, 0, ZT, [[22.6, 24.8, 0, 2.4]]); // north face: glazed link to the thermal pavilion
      wallXc(X1 - t, X1, 0, ZT, []); // east face: climbing wall
      k.box(X0 - 0.05, X1 + 0.05, Y0 - 0.05, Y1 + 0.05, ZT, ZT + 0.2, M.concrete);
      k.box(X0, X1, Y0, Y1, ZT + 0.2, ZT + 1.2, M.glass); k.box(X0 - 0.03, X1 + 0.03, Y0 - 0.03, Y1 + 0.03, ZT + 1.15, ZT + 1.2, M.steel); // roof top-out deck balustrade
      for (let z = 1.2; z < ZT - 1; z += 3.5) k.box(X0 + 0.6, X1 - 0.6, Y0 - 0.02, Y0 + 0.02, z, z + 1.6, M.glassFrost); // slot windows on the stair
      // climbing wall on the east face (5.20 m wide × 11.80 m), route tapes, holds, auto-belays, overhang at the top
      const CX = X1 + 0.05, cy0 = 22.4, cy1 = 27.6;
      k.box(X1, CX, cy0, cy1, 0.1, ZT - 0.2, M.climbPanel);
      k.quad(M.climbPanel, [CX, cy0, 8.5], [CX, cy1, 8.5], [CX + 0.8, cy1, ZT - 0.2], [CX + 0.8, cy0, ZT - 0.2]); // overhang panel
      let hs = 23; const hr = () => ((hs = (hs * 48271) % 2147483647) / 2147483647);
      const holds = [M.holdY, M.holdR, M.holdB, M.holdK];
      for (let i = 0; i < 130; i++) { const zh = 0.4 + hr() * 8.0, yh = cy0 + 0.15 + hr() * (cy1 - cy0 - 0.3); k.cbox(CX + 0.05, yh, zh, 0.1, 0.18, 0.14, holds[i % 4]); }
      [M.holdY, M.holdR, M.holdB, M.holdK, M.white, M.holdY].forEach((m, i) => k.box(CX, CX + 0.012, cy0 + 0.4 + i * 0.85, cy0 + 0.5 + i * 0.85, 0.2, 8.4, m));
      for (let i = 0; i < 4; i++) { k.box(CX, CX + 0.9, cy0 + 0.7 + i * 1.3 - 0.05, cy0 + 0.7 + i * 1.3 + 0.05, ZT - 0.35, ZT - 0.25, M.steel); k.cyl(CX + 0.85, cy0 + 0.7 + i * 1.3, ZT - 0.7, ZT - 0.35, 0.16, 0.16, M.holdY, 12); }
      // crash pit x 25.15 … 27.50, y 22.20 … 27.80 (−0.60, foam to −0.30), bench rim N/S/E, 1.20 m stair gap at the south-east
      const o = G.outdoor || layer('outdoor');
      o.box(25.15, 27.5, 22.2, 27.8, -0.6, -0.55, M.concrete); o.box(25.15, 27.5, 22.2, 27.8, -0.55, -0.3, M.matFoam); o.box(25.3, 27.35, 22.35, 27.65, -0.3, -0.28, M.mat);
      for (const [x0, x1, y0, y1] of [[25.15, 27.5, 22.05, 22.2], [25.15, 27.5, 27.8, 27.95], [27.5, 27.65, 22.2, 27.8]]) o.box(x0, x1, y0, y1, -0.6, 0.0, M.concrete);
      o.box(25.15, 28.1, 21.6, 22.05, 0, 0.45, M.concrete); o.box(25.15, 28.1, 27.95, 28.4, 0, 0.45, M.concrete); o.box(27.65, 28.1, 23.4, 27.95, 0, 0.45, M.concrete);
      o.box(27.65, 28.1, 22.2, 23.4, -0.3, 0.0, M.concreteDark);
      // glazed link core → pavilion
      k.box(23.3, 24.9, 28.0, 28.6, 0, 0.02, M.paving); k.box(23.3, 24.9, 28.0, 28.6, 2.5, 2.65, M.charcoal); for (const xg of [23.3, 24.9]) k.box(xg - 0.03, xg + 0.03, 28.0, 28.6, 0, 2.5, M.glass);
    }

    // ── NEW THERMAL PAVILION (x 23.20 … 33.20, y 28.60 … 34.00, h 3.60, green roof) — contrast-therapy circuit on grade ──
    {
      const P = layer('r2_pavilion'), X0 = 23.2, X1 = 33.2, Y0 = 28.6, Y1 = 34.0, H = 3.6, CYp = 29.8;
      P.box(X0, X1, Y0, Y1, -0.05, 0.02, M.floorWet);
      P.box(X0, X1, Y0, Y0 + 0.2, 0, H, M.plaster); // south wall (towards the pit / core)
      P.box(X1 - 0.2, X1, Y0, Y1, 0, H, M.plaster);
      P.box(X0, X0 + 0.2, Y0, Y1, 0, H, M.plaster);
      // north face: glass sliders to the rest garden, teak slat screens in front of the changing rooms
      P.box(X0, X1, Y1 - 0.1, Y1, 0, H, M.glass); for (let xg = X0; xg <= X1 + 0.01; xg += 1.25) P.box(xg - 0.03, xg + 0.03, Y1 - 0.12, Y1 + 0.02, 0, H, M.charcoal);
      for (let xg = X0 + 0.1; xg < 29.2; xg += 0.16) P.box(xg, xg + 0.08, Y1 + 0.1, Y1 + 0.16, 0.05, H - 0.2, M.teak);
      // internal corridor along the south (1.2 m) and room partitions
      P.box(X0 + 0.2, X1 - 0.2, CYp, CYp + 0.1, 0, H - 0.4, M.wallInt);
      for (const xp of [26.2, 29.2, 31.2]) P.box(xp - 0.05, xp + 0.05, CYp, Y1 - 0.1, 0, H - 0.4, M.wallInt);
      // changing W / M: lockers, bench, two showers each
      for (const [x0, x1] of [[23.4, 26.1], [26.3, 29.1]]) {
        P.box(x0, x1, 29.95, 30.3, 0, 1.9, M2r.cabinet); P.box(x0 + 0.3, x1 - 0.3, 31.0, 31.4, 0, 0.45, M.teakLight);
        for (const sx of [x0 + 0.1, x0 + 1.4]) { P.box(sx, sx + 1.2, 32.6, 32.65, 0, 2.1, M.glassFrost); P.cyl(sx + 0.6, 33.6, 2.0, 2.1, 0.12, 0.12, M.ss316, 10); }
      }
      // Finnish sauna (2.0 × 2.2) + steam room (2.0 × 1.8)
      P.box(29.3, 31.1, 31.7, 33.8, 0, 2.3, M.teak); P.box(30.4, 31.0, 33.0, 33.6, 0.0, 0.9, M.charcoal);
      P.box(29.3, 31.1, 29.95, 31.6, 0, 2.3, M.glassFrost);
      // cold-plunge room (2.0 × 4.2): two tubs 3–5 °C + chiller
      for (const ty of [30.4, 32.4]) { P.box(31.4, 32.9, ty, ty + 1.2, 0, 0.75, M.ss316); P.box(31.5, 32.8, ty + 0.1, ty + 1.1, 0.6, 0.7, M.plunge); }
      // roof: thin RC slab, deep overhang to the north (shade over the rest deck), green roof + roof lights
      const PR = layer('r2_pav_roof');
      PR.box(X0 - 0.3, X1 + 0.3, Y0 - 0.1, Y1 + 1.4, H, H + 0.25, M.concrete); PR.box(X0 - 0.2, X1 + 0.2, Y0, Y1 + 1.3, H + 0.25, H + 0.4, M.turf);
      for (const xl of [24.7, 27.7]) PR.box(xl - 0.5, xl + 0.5, 31.5, 32.5, H + 0.2, H + 0.5, M.skylight);
      for (const xl of [24.0, 27.0, 30.0, 33.0]) P.box(xl - 0.06, xl + 0.06, Y1 + 1.2, Y1 + 1.32, 0, H, M.charcoal);
      // outdoor showers + cold buckets on the north wall
      for (const xs2 of [29.6, 30.6]) { P.cyl(xs2, Y1 + 0.5, 0, 2.3, 0.04, 0.04, M.ss316, 8); P.cyl(xs2, Y1 + 0.5, 2.2, 2.3, 0.03, 0.14, M.ss316, 10); }
      P.box(29.2, 31.2, Y1 + 0.1, Y1 + 0.9, 0, 0.03, M.pebble);
    }

    // ── RECOVERY COURTYARD (garden) ──
    {
      const g = layer('r2_garden');
      // rest deck north of the pavilion under its overhang + loungers
      g.box(23.0, 33.4, 34.0, 36.4, 0, 0.07, M.teak);
      for (const lx of [24.0, 25.4, 26.8, 28.2]) { g.box(lx - 0.35, lx + 0.35, 34.9, 36.2, 0.07, 0.35, M.bedWhite); g.box(lx - 0.35, lx + 0.35, 35.9, 36.2, 0.35, 0.75, M.bedWhite); }
      // stepping path loop: pavilion → pool deck → west garden
      for (let x = 7.0; x < 23.0; x += 0.9) g.box(x, x + 0.7, 35.75, 36.35, 0, 0.05, M.pathStone);
      for (let y = 31.0; y < 35.6; y += 0.9) g.box(21.6, 22.6, y, y + 0.7, 0, 0.05, M.pathStone);
      // west active-aging garden: handrail path + exercise stations + shade trees
      g.box(-3.9, 11.3, 30.2, 34.0, 0, 0.02, M.turf);
      for (let x = -3.0; x < 10.5; x += 1.5) { g.cyl(x, 31.4, 0, 0.95, 0.03, 0.03, M.steel, 6); }
      g.box(-3.0, 10.5, 31.38, 31.42, 0.92, 0.97, M.steel);
      for (const [sx, sy] of [[0.5, 32.6], [4.5, 32.8], [8.5, 33.0]]) { g.box(sx - 0.5, sx + 0.5, sy - 0.25, sy + 0.25, 0, 0.45, M.teakLight); g.cyl(sx, sy + 0.6, 0, 1.6, 0.04, 0.04, M.charcoal, 8); g.box(sx - 0.6, sx + 0.6, sy + 0.58, sy + 0.62, 1.55, 1.6, M.charcoal); }
      for (const [tx, ty] of [[2.5, 34.3], [8.8, 35.0]]) { g.cyl(tx, ty, 0, 1.8, 0.12, 0.09, M.trunk, 8); for (const [dx, dy, dz, r] of [[0, 0, 2.6, 1.3], [0.6, 0.3, 2.1, 0.9], [-0.5, -0.3, 2.2, 0.95]]) { const ge = new THREE.IcosahedronGeometry(r, 1); ge.translate(tx + dx, dz, -(ty + dy)); g.add(M.treeCrown, ge); } }
      // open-air lounge deck between the west lobby and the pool
      g.box(5.0, 11.4, 30.1, 31.4, 0, 0.07, M.teak);
      for (const tx of [6.2, 8.6]) { g.cyl(tx, 30.75, 0.07, 0.75, 0.04, 0.04, M.charcoal, 8); g.cyl(tx, 30.75, 0.72, 0.75, 0.35, 0.35, M.teakLight, 16); }
    }
  }

  // ── vegetation: preserved coconut palms P1–P3 + trees ─────────────
  {
    const b = layer('vegetation');
    const coconutG = std({ color: 0x7ba043, roughness: 0.7 }), coconutB = std({ color: 0x6b4a2a, roughness: 0.9 });
    const palm = (px, py, h, lean, tilt) => {
      const pts = [];
      const n = 16;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push([px + Math.cos(lean) * tilt * t * t, py + Math.sin(lean) * tilt * t * t, h * t]);
      }
      const rAt = (i) => 0.2 - 0.075 * (i / n);
      for (let i = 0; i < n; i++) b.member(pts[i], pts[i + 1], rAt(i), M.trunk, 12);
      // ring scars every ~0.32 m, swollen bole with root flare, green crown shaft
      for (let z = 0.5; z < h - 1.3; z += 0.32) { const i = Math.min(n, Math.round((z / h) * n)); b.torus(pts[i][0], pts[i][1], z, rAt(i) + 0.004, 0.011, M.trunk, 14); }
      b.cyl(px, py, 0, 0.8, 0.42, 0.22, M.trunk, 14);
      for (let k = 0; k < 6; k++) { const a = k * 1.05; b.member([px + Math.cos(a) * 0.4, py + Math.sin(a) * 0.4, 0.02], [px + Math.cos(a) * 0.2, py + Math.sin(a) * 0.2, 0.55], 0.04, M.trunk, 5); }
      const top = pts[n];
      b.cyl(top[0], top[1], top[2] - 1.3, top[2], 0.14, 0.11, M.hedge, 12);
      const frondGeo = (len, droop) => {
        const seg = 10, pos = [], uv = [], idx = [];
        for (let i = 0; i <= seg; i++) {
          const t = i / seg, w = 1.15 * Math.sin(Math.PI * Math.min(1, t * 1.02 + 0.06));
          const x = len * t, y = -droop * t * t;
          pos.push(x, y, -w / 2, x, y, w / 2);
          uv.push(0, 1 - t, 1, 1 - t);
          if (i < seg) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
      };
      for (let k = 0; k < 20; k++) {
        const el = 1.05 - (k % 5) * 0.24; // fronds fan out from steep new growth to drooping old fronds
        const g = frondGeo(4.2 + (k % 3) * 0.35, 1.0 + (k % 5) * 0.55);
        g.rotateX(((k % 3) - 1) * 0.25); // roll
        g.rotateZ(el);
        g.rotateY(-(k / 20) * TAU * 1.0 - k * 0.15);
        g.translate(top[0], top[2] - 0.1, -top[1]);
        b.add(M.leaf, g);
      }
      // coconut bunches below the crown
      for (let k = 0; k < 3; k++) {
        const a = k * 2.1 + px;
        for (let m = 0; m < 5; m++) {
          const g = new THREE.SphereGeometry(0.11, 8, 6);
          g.translate(top[0] + Math.cos(a) * (0.22 + 0.06 * (m % 2)), top[2] - 0.7 - 0.12 * (m % 3), -(top[1] + Math.sin(a) * (0.22 + 0.06 * (m % 2)) + (m - 2) * 0.03));
          b.add(m % 2 ? coconutG : coconutB, g);
        }
      }
    };
    // P1 north-west corner, P2 / P3 in the garden — leaning gently towards the open pergola gap (east)
    palm(-4.0, 23.8, 12.5, rad(20), 0.7);
    // REV R51: P2 (−3.67, 15.46) and P3 (−3.24, 12.08) removed / transplanted — only P1 (rear) is kept

    const T = layer('trees');
    const tree = (x, y, s = 1) => {
      T.cyl(x, y, 0, 2.2 * s, 0.18 * s, 0.12 * s, M.trunk, 8);
      for (const [dx, dy, dz, r] of [[0, 0, 3.4, 1.7], [0.9, 0.5, 2.7, 1.2], [-0.8, -0.4, 2.9, 1.3]]) {
        const g = new THREE.IcosahedronGeometry(r * s, 1);
        g.translate(x + dx * s, dz * s, -(y + dy * s));
        T.add(M.treeCrown, g);
      }
    };
    for (const [x, y, s] of [[-8, -21, 0.8], [3, -23.2, 0.7], [27, -23.3, 0.7], [36, -23.3, 0.7], [-8, -6, 0.7], [-34, 4, 1.4], [-34, 26, 1.3], [-30, -14, 1.2], [40, 6, 1.0], [41, 24, 0.9], [34, 36, 0.8], [27, 34, 0.7]]) tree(x, y, s);
    for (const x of [-3, 0.5, 19.5, 22.5, 26]) b.box(x, x + 1.4, -13.9, -12.8, 0, 0.5, M.hedge);
  }

  // ── flush layers into the scene ────────────────────────────────────
  const order = ['site', 'fences', 'trees', 'rear_services', 'hall_shell', 'hall_roof', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'east_catwalk', 'west_wing', 'ww_G', 'ww_L2', 'ww_roof', 'x_wind', 'rear_structure', 'rear_GF', 'rear_L2', 'rear_L3', 'rear_roof', 'r2_core', 'r2_pavilion', 'r2_pav_roof', 'r2_garden', 'hiking_trail', 'outdoor', 'vegetation'];
  for (const n of order) if (G[n]) root.add(G[n].flush());
  // every glass material must not cast shadows
  root.traverse((o) => {
    if (o.isMesh && o.material && o.material.transparent && !o.material.alphaTest) o.castShadow = false;
  });
  return { root, layers: order.filter((n) => G[n]) };
}

// ───────────────────────────── camera shots (spec §5.4 + extras) ─────────────────────────────
export const SHOTS = {
  s1: { title: 'S1 · Street Approach', pos: [10.75, -30.0, 1.7], target: [10.75, -12.0, 5.4], focal: 24, time: 'golden' },
  s1_dusk: { title: 'S1 · Street Approach (Dusk hero)', pos: [10.75, -30.0, 1.7], target: [10.75, -12.0, 5.4], focal: 24, time: 'dusk' },
  s2: { title: 'S2 · Entrance Threshold', pos: [10.75, -18.0, 1.6], target: [10.75, -10.5, 4.6], focal: 24, time: 'golden' },
  s3: { title: 'S3 · Badminton Hall Grandeur', pos: [10.4, -1.0, 1.7], target: [10.4, 12.0, 4.0], focal: 14, time: 'day' },
  s4: { title: 'S4 · C0 Cyclone Close-up', pos: [10.13, 3.5, 1.6], target: [10.13, 7.35, 3.4], focal: 35, time: 'day' },
  s5: { title: 'S5 · West Palms Co-Working', pos: [-1.3, 10.2, 6.6], target: [-3.5, 14.0, 0.8], focal: 20, time: 'morning' },
  s6: { title: 'S6 · Rear building & future landscape', pos: [14.0, 39.0, 1.7], target: [14.0, 28.0, 4.2], focal: 14, time: 'golden' },
  s7: { title: 'S7 · Aerial Master', pos: [-22.0, -40.0, 20.0], target: [11.0, 10.0, 3.0], focal: 30, time: 'golden' },
  oblique: { title: 'Master Oblique (front-right)', pos: [42.0, -34.0, 17.0], target: [10.0, 8.0, 3.0], focal: 30, time: 'golden' },
  // REV D.7 additions
  entrance_plan: { title: 'Entrance water court · plan view', pos: [10.75, -22.0, 17.0], target: [10.75, -12.0, 0.0], focal: 26, time: 'golden' },
  entrance_pond: { title: 'Entrance · koi pond + seating', pos: [4.2, -19.5, 1.7], target: [8.0, -12.5, 1.3], focal: 24, time: 'golden' },
  entrance_front: { title: 'Entrance · front elevation (ortho)', pos: [10.75, -40.0, 5.5], target: [10.75, 0.0, 5.5], focal: 24, time: 'golden', ortho: 12.5, hide: ['trees'] },
  catwalk_ext: { title: 'East wall · catwalk +4.50 from pickleball', pos: [29.0, 4.0, 3.2], target: [22.4, 6.0, 5.0], focal: 20, time: 'golden' },
  catwalk_aerial: { title: 'East wall · catwalk, stair and braces (aerial)', pos: [34.0, -13.0, 13.0], target: [22.5, 9.0, 4.0], focal: 24, time: 'golden' },
  catwalk_int: { title: 'East wall · louvre screens from inside', pos: [12.0, 1.0, 1.7], target: [22.3, 4.0, 5.0], focal: 18, time: 'day' },
  left_elev: { title: 'Left (west) elevation (ortho)', pos: [-40.0, 13.0, 5.0], target: [0.0, 13.0, 5.0], focal: 24, time: 'golden', ortho: 12.5, hide: ['fences', 'trees'] },
  left_oblique: { title: 'Left side · south-west oblique', pos: [-22.0, -16.0, 5.0], target: [-1.0, 8.0, 3.5], focal: 24, time: 'golden' },
  left_garden: { title: 'Left side · jali wall & palms from outside', pos: [-14.0, 16.0, 2.6], target: [-4.0, 15.0, 4.2], focal: 20, time: 'morning' },
  rear_elev: { title: 'Rear (north) elevation (ortho)', pos: [11.0, 70.0, 5.0], target: [11.0, 0.0, 5.0], focal: 24, time: 'golden', ortho: 10.5, hide: ['fences', 'trees'] },
  rear_wide: { title: 'Rear · façade, S1 stair, future landscape lawn', pos: [11.0, 52.0, 4.0], target: [11.0, 28.0, 5.0], focal: 22, time: 'golden' },
  rear_ne: { title: 'Rear · north-east oblique', pos: [38.0, 50.0, 11.0], target: [10.0, 26.0, 4.0], focal: 24, time: 'golden' },
  rear_nw: { title: 'Rear · north-west oblique', pos: [-16.0, 46.0, 8.0], target: [8.0, 27.0, 4.0], focal: 24, time: 'golden' },
  // REV D.8 additions: access from L2, rear and side details
  catwalk_stair: { title: 'East · L2 door, landing and 6-riser stair up to the +4.50 catwalk', pos: [29.5, 19.0, 6.5], target: [22.9, 24.0, 3.8], focal: 26, time: 'golden' },
  catwalk_door_int: { title: 'East · inside the L2 gallery looking at the catwalk door', pos: [15.0, 24.55, 4.9], target: [22.3, 24.7, 4.9], focal: 24, time: 'day' },
  east_elev: { title: 'Right (east) elevation (ortho)', pos: [80.0, 12.0, 5.0], target: [0.0, 12.0, 5.0], focal: 24, time: 'golden', ortho: 12.5, hide: ['fences', 'trees'] },
  east_climb: { title: 'East · climbing wall, crash pit, top-out gate', pos: [33.0, 28.5, 3.2], target: [23.3, 27.2, 5.2], focal: 20, time: 'golden' },
  rear_gf: { title: 'Rear · GF north façade and lawn', pos: [16.5, 40.0, 1.7], target: [16.5, 30.0, 2.2], focal: 22, time: 'golden' },
  rear_roof: { title: 'Rear · fins, eyebrow shade, exhaust risers, roof plant screen', pos: [26.0, 44.0, 14.5], target: [10.0, 28.0, 8.5], focal: 28, time: 'golden' },
  left_nw: { title: 'Left · north-west corner: S1 stair, palm P1', pos: [-13.0, 38.0, 4.5], target: [-3.5, 27.0, 4.5], focal: 22, time: 'golden' },
  left_top: { title: 'Left · aerial over the west wing (PV, pergola, jali)', pos: [-16.0, -2.0, 19.0], target: [-2.0, 12.0, 3.0], focal: 28, time: 'golden' },
  // REV D.9: west wing + coconut garden in detail
  ww_G: { title: 'West wing · ground floor cut-away, south half (studio, stair hall)', pos: [7.0, -14.0, 14.0], target: [-2.4, 3.0, 0.0], focal: 28, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_L2: { title: 'West wing · upper floor cut-away, south half (Creative Suite)', pos: [7.0, -14.0, 15.0], target: [-2.4, 3.0, 3.5], focal: 28, time: 'day', hide: ['vegetation', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_G_south: { title: 'West wing · studio + stair hall plan (ground, top view)', pos: [-2.4, -3.0, 21.0], target: [-2.4, 2.0, 0.0], focal: 30, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_G_north: { title: 'West wing · garden, pods and core (ground, top view)', pos: [-2.4, 12.0, 24.0], target: [-2.4, 21.0, 0.0], focal: 30, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_L2_north: { title: 'West wing · upper floor north (gallery walkway, L3 pod, L4 staff)', pos: [7.0, 5.0, 15.0], target: [-2.4, 20.0, 3.5], focal: 28, time: 'day', hide: ['vegetation', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'fences', 'trees'] },
  ww_G_north_ob: { title: 'West wing · ground floor cut-away, north half (garden, pods, core)', pos: [7.0, 5.0, 14.0], target: [-2.4, 20.0, 0.0], focal: 28, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'fences', 'trees'] },
  studio_in: { title: 'G1 Creative Studio · from the street door towards the cyclorama', pos: [-2.6, -8.4, 1.5], target: [-2.4, 3.5, 1.3], focal: 18, time: 'day', hide: ['ww_L2'] },
  studio_cyc: { title: 'G1 Creative Studio · cyclorama end, lights and cameras', pos: [-2.4, -3.5, 1.6], target: [-2.4, 1.0, 1.2], focal: 20, time: 'day', hide: ['ww_L2'] },
  stair_hall: { title: 'G2 Grand U-stair · from D3 (hall door)', pos: [-1.6, 1.8, 1.6], target: [-3.0, 4.85, 2.2], focal: 16, time: 'day', hide: ['ww_roof'] },
  stair_up: { title: 'G2 Grand U-stair · looking up the flights', pos: [-3.0, 2.45, 0.9], target: [-2.4, 5.15, 3.6], focal: 16, time: 'day', hide: ['ww_roof'] },
  suite_in: { title: 'L1 Creative Suite · VIP lounge', pos: [-2.4, 4.5, 5.3], target: [-2.4, -6.0, 4.6], focal: 16, time: 'day', hide: ['ww_roof'] },
  garden_eye: { title: 'G3 Coconut co-working garden · ground level', pos: [-1.5, 10.5, 1.6], target: [-3.2, 17.5, 2.6], focal: 16, time: 'morning' },
  garden_palm: { title: 'G3 · palm P2 / P3, teak benches, jali, bar ledge', pos: [-1.5, 17.2, 1.5], target: [-3.5, 12.5, 2.6], focal: 18, time: 'morning' },
  garden_top: { title: 'G3 · garden from above (pergola slats removed)', pos: [-2.2, 9.5, 11.0], target: [-2.4, 17.0, 0.0], focal: 24, time: 'morning', hide: ['ww_roof', 'hall_roof', 'hall_shell', 'hall_interior'] },
  walkway_l2: { title: 'L2 gallery walkway · guard net and canopy, palms beyond', pos: [-1.2, 10.4, 5.1], target: [-3.0, 19.0, 4.8], focal: 16, time: 'morning' },
  pods: { title: 'Focus pods G4 / L3 and the north end of the garden', pos: [-2.0, 14.0, 1.6], target: [-2.6, 21.5, 2.4], focal: 18, time: 'day' },
  core_in: { title: 'G5 MDB + pump room, link bay (old core)', pos: [-3.0, 22.5, 1.6], target: [-2.6, 26.5, 1.5], focal: 16, time: 'day' },
  palm_crown: { title: 'Palms P2 / P3 crowns above the pergola', pos: [-12.0, 22.0, 10.0], target: [-3.5, 14.0, 10.5], focal: 24, time: 'morning', hide: ['fences', 'trees'] },
  // REV D.10: plot-line wall, canopy slab, wind lane
  lane_in: { title: 'Wind lane · inside, looking west to the louvre door (breeze arrows on)', pos: [-1.2, 7.35, 1.6], target: [-4.0, 7.35, 1.5], focal: 18, time: 'day', show: ['x_wind'] },
  lane_hall: { title: 'Wind lane · from the cross-aisle: louvre screen, lane and tower W0', pos: [3.6, 7.35, 1.6], target: [-2.6, 7.35, 1.7], focal: 18, time: 'day', show: ['x_wind'] },
  lane_w0: { title: 'Tower W0 (now full) · wind lane axis W0 – C0 – E0', pos: [4.6, 6.0, 1.7], target: [0.2, 7.35, 3.5], focal: 20, time: 'day', show: ['x_wind'] },
  lane_plan: { title: 'Wind lane · plan view with breeze arrows', pos: [-2.0, 7.35, 17.0], target: [-1.0, 7.35, 0.0], focal: 24, time: 'day', hide: ['ww_L2', 'ww_roof', 'hall_roof', 'fences', 'trees', 'vegetation'], show: ['x_wind'] },
  canopy_out: { title: 'Plot line · solid wall 0.50 m in, RC canopy slab to the boundary (from outside, looking east)', pos: [-9.5, 5.0, 2.0], target: [-3.9, 14.0, 3.2], focal: 20, time: 'golden', hide: ['fences', 'trees', 'vegetation'] },
  canopy_under: { title: 'Under the canopy slab · garden with round openings round the palms', pos: [-1.0, 11.0, 1.6], target: [-3.5, 18.5, 3.0], focal: 16, time: 'morning' },
  canopy_deck: { title: 'On top of the canopy slab · palm openings and hall-side edge', pos: [-1.2, 10.6, 5.2], target: [-3.4, 16.5, 4.5], focal: 16, time: 'morning' },
  garden_open: { title: 'Garden open to the badminton hall (no wall at x = −0.80)', pos: [2.5, 15.0, 1.7], target: [-3.4, 16.0, 2.2], focal: 18, time: 'day' },
  // REV D.11: coffee shop on the ground floor, studio upstairs, stair + wind lane as one open lobby
  cafe_in: { title: 'Coffee shop · from the street door along the counter', pos: [-2.3, -8.4, 1.6], target: [-2.4, -0.5, 1.3], focal: 18, time: 'day', hide: ['ww_L2'] },
  cafe_courts: { title: 'Coffee shop · seen from the badminton courts (open edge)', pos: [3.5, -3.0, 1.6], target: [-2.5, -3.0, 1.3], focal: 20, time: 'day' },
  cafe_ledge: { title: 'Coffee shop · viewing ledge and stools facing the courts', pos: [-2.9, -6.8, 1.5], target: [1.5, -2.5, 1.2], focal: 22, time: 'day' },
  lobby_open: { title: 'Open lobby · stair + wind lane as one space (from the courts)', pos: [4.6, 5.0, 1.7], target: [-2.5, 4.2, 2.4], focal: 18, time: 'day', show: ['x_wind'] },
  lobby_in: { title: 'Open lobby · inside, stair to the south, lane to the north', pos: [-1.5, 7.3, 1.6], target: [-3.0, 3.6, 2.2], focal: 16, time: 'day', hide: ['ww_roof'] },
  studio_up: { title: 'L2 Creative studio · cyclorama end', pos: [-2.4, -4.2, 5.2], target: [-2.4, 1.0, 4.8], focal: 18, time: 'day', hide: ['ww_roof'] },
  studio_lounge: { title: 'L2 Creative studio · VIP lounge corner', pos: [-2.3, -1.0, 5.2], target: [-2.5, -8.0, 4.6], focal: 18, time: 'day', hide: ['ww_roof'] },
  cafe_cut: { title: 'Coffee shop · ground-floor cut-away (top view)', pos: [-2.4, -3.5, 22.0], target: [-2.4, -3.5, 0.0], focal: 30, time: 'day', hide: ['ww_L2', 'ww_roof', 'hall_roof', 'fences', 'trees', 'vegetation'] },
  // REV D.12: prefab raised pool 3 × 6
  pool_plan: { title: 'Prefab pool · plan view', pos: [16.4, 33.0, 12.0], target: [16.4, 33.0, 0.0], focal: 28, time: 'day', hide: ['fences', 'trees', 'vegetation'] },
  pool_aerial: { title: 'Rear · pool court from above', pos: [26.0, 42.0, 9.0], target: [16.0, 32.5, 0.5], focal: 26, time: 'golden' },
  // REV R2 'Recovery Courtyard' (render with SCHEME=r2)
  r2_aerial: { title: 'R2 · Recovery Courtyard from the north-east', pos: [38.0, 50.0, 16.0], target: [13.0, 28.0, 2.0], focal: 24, time: 'golden', hide: ['fences'] },
  r2_aerial_w: { title: 'R2 · from the north-west over the yoga terrace', pos: [-14.0, 46.0, 15.0], target: [12.0, 28.0, 3.0], focal: 24, time: 'golden', hide: ['fences'] },
  r2_garden: { title: 'R2 · courtyard at eye level: pool, pavilion, climb tower', pos: [11.5, 36.9, 1.7], target: [25.0, 30.5, 3.5], focal: 20, time: 'golden', hide: ['fences'] },
  r2_pavilion: { title: 'R2 · thermal pavilion + rest deck (contrast-therapy circuit)', pos: [21.0, 37.6, 1.7], target: [29.0, 32.0, 1.8], focal: 20, time: 'golden', hide: ['fences'] },
  // REV R43: rear building rebuilt from plans GF R40 / L2 R42 / L3 R41 + S1 stair, no pool
  r43_aerial: { title: 'R43 · rear building, S1 stair and future-landscape lawn (aerial NE)', pos: [32.0, 48.0, 20.0], target: [9.0, 28.0, 4.0], focal: 24, time: 'golden' },
  r43_yard: { title: 'R43 · from the rear lawn: S1 stair, frosted wet block, palms', pos: [13.0, 35.6, 1.7], target: [4.0, 29.5, 4.0], focal: 16, time: 'golden' },
  r43_s1: { title: 'R43 · S1 stacked U-stair (1.20 m clear) + store under the landing', pos: [10.0, 39.0, 12.0], target: [0.7, 31.5, 2.8], focal: 20, time: 'golden', hide: ['fences', 'trees', 'rear_roof', 'rear_services'] },
  r43_gf_cut: { title: 'R43 · GF cut-away (R40): WCs, lockers, gift, clinic, lease, staff WC', pos: [10.0, 15.5, 24.0], target: [10.0, 27.6, 0.0], focal: 24, time: 'day', hide: ['rear_L2', 'rear_L3', 'rear_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'east_catwalk', 'cyclones', 'trees', 'ww_L2', 'ww_roof'] },
  r43_l2_cut: { title: 'R43 · L2 cut-away (R42): wellness rooms + back corridor', pos: [10.0, 15.5, 27.5], target: [10.0, 27.2, 3.5], focal: 24, time: 'day', hide: ['rear_L3', 'rear_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'east_catwalk', 'cyclones', 'trees', 'ww_roof'] },
  r43_l3_cut: { title: 'R43 · L3 cut-away (R41): lobby, studio, outdoor terrace', pos: [10.0, 15.5, 31.0], target: [10.0, 27.2, 7.0], focal: 24, time: 'day', hide: ['rear_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'east_catwalk', 'cyclones', 'trees'] },
  r43_l2_corr: { title: 'R43 · L2 back corridor looking west', pos: [21.6, 29.4, 5.15], target: [2.0, 29.4, 5.0], focal: 16, time: 'day' },
  r43_l2_lounge: { title: 'R43 · L2 reception lounge, view down to the courts', pos: [3.0, 27.3, 5.25], target: [-0.5, 18.0, 2.6], focal: 14, time: 'day' },
  r44_boxing: { title: 'R44 · boxing zone on old court B1: main ring 6×6 (+0.90) + practice ring', pos: [11.0, -7.5, 4.2], target: [2.8, 0.5, 0.8], focal: 18, time: 'day' },
  r44_boxing_top: { title: 'R44 · boxing zone from above (roof hidden)', pos: [8.0, -12.0, 20.0], target: [3.0, 0.0, 0.0], focal: 22, time: 'day', hide: ['hall_roof', 'cyclones', 'front_facade'] },
  r44_rear: { title: 'R44 · rear without the Sky Trail, catwalk kept', pos: [36.0, 44.0, 16.0], target: [14.0, 22.0, 4.0], focal: 24, time: 'golden' },
  r45_west: { title: 'R45 · west side: wing removed, hall to the boundary wall, palms P1–P3', pos: [-15.0, -2.0, 7.0], target: [-3.5, 11.0, 4.0], focal: 20, time: 'golden', hide: ['fences'] },
  r45_hall: { title: 'R45 · inside the hall looking west: boxing rings + courts as R33', pos: [17.0, -6.5, 5.5], target: [0.0, 4.0, 1.0], focal: 16, time: 'day' },
  r47_east: { title: 'R48 · east side: wall on the catwalk outer edge, pickleball on the badminton rows, fenced', pos: [33.0, -14.0, 6.5], target: [20.5, 4.0, 2.8], focal: 20, time: 'golden', hide: ['fences'] },
  r47_east_in: { title: 'R47 · inside: bi-fold doors on the E column line (two bays open)', pos: [12.0, 2.0, 1.7], target: [20.2, 10.0, 2.2], focal: 18, time: 'day' },
  r47_catwalk: { title: 'R47 · on the +3.50 catwalk looking north to the L2 link', pos: [20.75, -6.0, 5.1], target: [20.75, 24.0, 4.6], focal: 18, time: 'day' },
  r47_cols: { title: 'R47 · column layout (roof hidden)', pos: [9.0, -24.0, 26.0], target: [9.0, 9.0, 0.0], focal: 22, time: 'day', hide: ['hall_roof', 'rear_L2', 'rear_L3', 'rear_roof', 'cyclones', 'front_facade', 'entrance_court', 'trees'] },
  r48_gallery: { title: 'R48 · catwalk = viewing gallery inside the hall (+3.50)', pos: [20.75, -7.5, 5.15], target: [12.0, 8.0, 1.0], focal: 16, time: 'day' },
  r48_pb_aisle: { title: 'R48 · pickleball cross-aisle garden in line with the hall aisle', pos: [32.5, 7.35, 2.2], target: [20.0, 7.35, 1.5], focal: 18, time: 'golden', hide: ['fences'] },
  r49_pb: { title: 'R49 · pickleball: chain-link on grid 2, plot line 1.50 m east of the courts', pos: [36.0, -13.0, 9.0], target: [24.0, 7.0, 0.5], focal: 20, time: 'golden', hide: ['fences'] },
  r49_top: { title: 'R49 · hall + pickleball from above (roof hidden)', pos: [12.0, -22.0, 30.0], target: [12.0, 6.5, 0.0], focal: 20, time: 'day', hide: ['hall_roof', 'cyclones', 'front_facade', 'entrance_court', 'trees', 'rear_L2', 'rear_L3', 'rear_roof'] },
  r2_climb: { title: 'R2 · east core = fire stair + catwalk access + 12 m climbing wall', pos: [33.5, 15.5, 2.0], target: [25.0, 25.0, 6.5], focal: 20, time: 'golden' },
  r2_cut_GF: { title: 'R2 · GF cut-away: reception, HBOT, treatment, rehab, pavilion', pos: [14.0, 21.0, 30.0], target: [14.0, 29.5, 0.0], focal: 26, time: 'day', hide: ['rear_L2', 'rear_L3', 'rear_roof', 'hall_roof', 'r2_core', 'r2_pav_roof', 'fences', 'trees'] },
  r2_cut_L2: { title: 'R2 · L2 cut-away: gallery, lounge, sports-science lab, massage', pos: [10.2, 18.0, 25.0], target: [10.2, 27.5, 3.5], focal: 24, time: 'day', hide: ['rear_L3', 'rear_roof', 'hall_roof', 'fences', 'trees'] },
  r2_cut_L3: { title: 'R2 · L3 cut-away: yoga terrace west, studio, services', pos: [10.2, 18.0, 27.0], target: [10.2, 27.5, 7.0], focal: 24, time: 'day', hide: ['rear_roof', 'hall_roof', 'fences', 'trees'] },
  r2_corridor: { title: 'R2 · GF recovery street (corridor on the hall side, rooms on the garden)', pos: [-0.8, 25.9, 1.6], target: [22.0, 25.9, 1.5], focal: 18, time: 'day' },
  r2_yoga: { title: 'R2 · yoga terrace +7.00 under the palm crowns', pos: [3.4, 29.4, 8.7], target: [-3.5, 24.5, 10.0], focal: 18, time: 'morning' },
  r2_lab: { title: 'R2 · L2 sports-science lab facing the garden', pos: [14.6, 27.2, 5.2], target: [5.8, 28.6, 4.6], focal: 18, time: 'day' },
  r2_rear: { title: 'R2 · rear elevation from the garden', pos: [16.0, 40.5, 1.7], target: [14.0, 28.0, 4.5], focal: 16, time: 'golden', hide: ['fences'] },
  // REV E: wellness L2, fitness L3 (indoor + outdoor) and the sky trail down to the ground floor
  trail_aerial: { title: 'Sky Trail · aerial from the north-east', pos: [46.0, 46.0, 17.0], target: [29.0, 31.0, 3.0], focal: 24, time: 'golden', hide: ['fences'] },
  trail_run: { title: 'Sky Trail · walking down run 1 from the L3 fitness deck', pos: [24.4, 30.7, 8.6], target: [36.0, 30.9, 5.0], focal: 20, time: 'golden' },
  trail_head: { title: 'Sky Trail · trailhead at the pool court', pos: [28.5, 38.0, 1.7], target: [24.5, 34.0, 2.0], focal: 20, time: 'golden', hide: ['fences'] },
  trail_side: { title: 'Sky Trail · side elevation from the north', pos: [30.0, 52.0, 4.5], target: [30.0, 31.0, 3.5], focal: 24, time: 'golden', hide: ['fences', 'trees'] },
  fit_deck: { title: 'L3 outdoor fitness deck · rig, sled lane, plyo boxes', pos: [17.5, 24.5, 9.3], target: [20.3, 28.0, 8.1], focal: 20, time: 'day' },
  fit_indoor: { title: 'L3 indoor fitness studio opening onto the deck', pos: [5.0, 29.4, 8.7], target: [16.5, 26.5, 8.2], focal: 18, time: 'day' },
  wellness_l2: { title: 'L2 wellness centre cut-away', pos: [10.2, 17.0, 24.0], target: [10.2, 27.0, 3.5], focal: 22, time: 'day', hide: ['rear_L3', 'rear_roof', 'hall_roof', 'hiking_trail', 'fences', 'trees'] },
  // interior studies
  hall_aisle: { title: 'Interior · Cyclone aisle W0–C0–E0', pos: [2.4, 6.0, 1.6], target: [14.0, 7.6, 4.0], focal: 20, time: 'day' },
  hall_roof: { title: 'Interior · Space-frame roof & courts', pos: [21.0, -9.0, 2.0], target: [6.0, 12.0, 6.0], focal: 16, time: 'day' },
  gallery_l2: { title: 'Interior · L2 viewing gallery', pos: [-1.2, 24.6, 4.9], target: [21.0, 24.9, 5.0], focal: 18, time: 'day', hide: [] },
  clinic: { title: 'Interior · Physio clinic → pool', pos: [17.9, 27.2, 1.5], target: [15.0, 30.1, 1.4], focal: 16, time: 'day', hide: ['rear_L2', 'rear_L3', 'rear_roof'] },
  // cut-away plans (upper levels removed) for interior reading
  plan_gf: { title: 'Cut-away · Ground floor (clinic, changing, climbing)', pos: [10.2, 18.5, 26.0], target: [10.2, 28.0, 0.0], focal: 22, time: 'day', hide: ['rear_L2', 'rear_L3', 'rear_roof', 'hall_roof'], upVec: 'north' },
  plan_l2: { title: 'Cut-away · Level 2 wellness (7 zones + gallery)', pos: [10.2, 17.0, 24.0], target: [10.2, 27.0, 3.5], focal: 22, time: 'day', hide: ['rear_L3', 'rear_roof', 'hall_roof'], upVec: 'north' },
  plan_l3: { title: 'Cut-away · Level 3 studio & yoga terrace', pos: [10.2, 17.0, 26.0], target: [10.2, 27.0, 7.0], focal: 22, time: 'day', hide: ['rear_roof', 'hall_roof'], upVec: 'north' },
};

// time-of-day presets
export const TIMES = {
  day: { sky: [0x6fa8dc, 0xdfeaf5, 0xf4f1e8], sun: 0xfff3dc, sunI: 3.0, sunPos: [30, 50, -20], env: 0.55, hemi: 0.35, fog: 0xdbe6ef, glow: 0 },
  golden: { sky: [0x4f86c6, 0xf3d9b6, 0xf7c88c], sun: 0xffd9a0, sunI: 3.4, sunPos: [60, 28, -35], env: 0.5, hemi: 0.3, fog: 0xf1ddc4, glow: 0 },
  morning: { sky: [0x7db4e6, 0xf6ecd3, 0xfbe9bd], sun: 0xffe2b0, sunI: 3.2, sunPos: [-40, 38, -20], env: 0.55, hemi: 0.35, fog: 0xf1e6cf, glow: 0 },
  dusk: { sky: [0x0f1b3d, 0x4a3f7a, 0xf09a50], sun: 0xff8f4a, sunI: 0.35, sunPos: [-70, 4, -80], env: 0.18, hemi: 0.18, fog: 0x5a4a78, glow: 1 },
};
