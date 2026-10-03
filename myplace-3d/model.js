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
export function buildModel() {
  const root = new THREE.Group();
  root.name = 'MyPlace_Master_vD6';
  const G = {}; // named layers
  const layer = (name) => (G[name] = new B(name));

  // geometry constants (spec §1.2)
  const HALL = { x0: -0.8, x1: 22.3, y0: -10.15, y1: 24.1, eave: 8.6, ridge: 11.25, ridgeX: 10.75 };
  const SLAB = { x0: -1.8, x1: 22.2, y0: 24.1, y1: 30.1 };
  const Z2 = 3.5, Z3 = 7.0, ZR = 10.5;

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
    hole(22.85, 25.05, 24.9, 29.2);
    hole(10.2, 22.2, 31.0, 35.0);
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
    b.box(22.3, 24.2, -10.15, 24.1, -0.02, 0.02, M.paving);
    b.box(-4.4, -3.9, -10.15, 30.1, -0.02, 0.02, M.paving);
    // concrete floor under hall + aisle
    b.box(HALL.x0, HALL.x1, HALL.y0, 25.1, -0.02, 0.0, M.concrete);
    // plot boundary: west fence (x = -4.4), skewed rear fence, east + front low hedge
    const fence = (x0, y0, x1, y1, h = 1.8) => {
      const len = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
      const g = new THREE.BoxGeometry(len, h, 0.08);
      g.rotateY(ang);
      g.translate((x0 + x1) / 2, h / 2, -(y0 + y1) / 2);
      G.fences.add(M.charcoal, g);
    };
    fence(-4.4, -12.5, -4.4, 33.45, 0.9);
    fence(-4.4, 33.45, 38.5, 39.9, 0.5); // slope 3/20 through (0.2,34.1) and (20.2,37.1)
    fence(38.5, 39.9, 38.5, -12.5);
    b.box(-4.4, 3.2, -12.6, -12.4, 0, 0.6, M.hedge); b.box(18.3, 38.5, -12.6, -12.4, 0, 0.6, M.hedge);
    // boundary markers (setbacks)
    b.box(-4.45, -4.35, -12.5, 34, 0.0, 0.03, M.holdY);
  }

  // ── Badminton hall shell ───────────────────────────────────────
  {
    const b = layer('hall_shell');
    const t = 0.25;
    // west wall (x=-0.8) – solid to 7.4, louvre band above
    for (const [ya, yb, za, zb] of [[HALL.y0, 5.25, 0, 7.4], [5.25, 6.95, 2.4, 7.4], [6.95, 10.6, 0, 7.4], [10.6, 12.3, 2.4, 7.4], [12.3, HALL.y1, 0, 7.4]]) b.box(HALL.x0 - t, HALL.x0, ya, yb, za, zb, M.plaster); // D3 / D4 openings to the west wing
    // east wall (x=22.3): full-height sliding glass, mullions every 2.5 m
    for (let y = HALL.y0; y <= HALL.y1 + 0.01; y += 2.5) b.box(HALL.x1 - 0.05, HALL.x1 + 0.05, y - 0.04, y + 0.04, 0, 7.4, M.charcoal);
    b.box(HALL.x1 - 0.05, HALL.x1 + 0.05, HALL.y0, HALL.y1, 0, 0.1, M.charcoal);
    b.box(HALL.x1 - 0.05, HALL.x1 + 0.05, HALL.y0, HALL.y1, 7.3, 7.4, M.charcoal);
    b.box(HALL.x1 - 0.02, HALL.x1 + 0.02, HALL.y0, HALL.y1, 0.1, 7.3, M.glass);
    // louvre bands 7.4 – 8.6
    for (const x of [HALL.x0 - 0.05, HALL.x1]) {
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

    // portal-frame columns on grids 1 & 5 (west + east wall lines) and C0/E0/W0 posts are in 'cyclones'
    for (const y of [-8.0, -3.0, 2.0, 12.5, 17.5, 22.0]) {
      b.box(HALL.x0, HALL.x0 + 0.3, y - 0.15, y + 0.15, 0, 8.6, M.concreteDark);
      b.box(HALL.x1 - 0.3, HALL.x1, y - 0.15, y + 0.15, 0, 8.6, M.concreteDark);
    }
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
    const xw = HALL.x0 - ov, xe = HALL.x1 + ov;
    b.quad(M.roofSheet, [xw, yA, zRoof(xw)], [HALL.ridgeX, yA, HALL.ridge], [HALL.ridgeX, yB, HALL.ridge], [xw, yB, zRoof(xw)]);
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
    // W0 dry half-tower (180°) on the west portal column (0.2, 7.35), facing the hall (+x)
    {
      const o = { cx: 0.2, cy: 7.35, z0: 2.3, z1: 8.6, r0: 0.5, r1: 0.6, rw: -0.08, twist: rad(128), nRods: 11, nTiles: 21, a0: -Math.PI / 2, arc: Math.PI, phase: 0.4 };
      cyclone(b, o);
      b.cbox(0.2, 7.35, 4.3, 0.3, 0.3, 8.6, M.charcoal);
      const rAt = (h) => 0.5 + 0.1 * ((h - 2.3) / 6.3) + 0.08 - 0.08 * Math.sin(Math.PI * ((h - 2.3) / 6.3));
      for (const h of hoopsFor(2.3, 8.6)) {
        const g = new THREE.TorusGeometry(rAt(h), 0.022, 8, 24, Math.PI);
        g.rotateX(Math.PI / 2);
        g.rotateY(Math.PI / 2);
        g.translate(0.2, h, -7.35);
        b.add(M.steel, g);
      }
      b.cbox(0.2, 7.35, 2.2, 0.4, 0.4, 0.02, M.ss316);
    }
    // base footprints at floor (blue padded collars for E0/W0)
    b.cyl(20.2, 7.35, 0.1, 2.1, 0.33, 0.33, M.collarBlue, 24);
    {
      const g = new THREE.CylinderGeometry(0.33, 0.33, 2.0, 20, 1, false, -Math.PI / 2 + Math.PI, Math.PI);
      g.rotateY(Math.PI / 2 * 0);
      g.translate(0.2, 1.1, -7.35);
      b.add(M.collarBlue, g);
    }
  }

  // ── Badminton courts, nets, run-off, hall interior bits ──────────
  {
    const b = layer('hall_interior');
    const courts = [];
    const xs = [0.4, 7.15, 13.9];
    for (const [y0] of [[-8.4], [9.7]]) for (const x0 of xs) courts.push([x0, y0]);
    for (const [x0, y0] of courts) {
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
    // thin darker apron around the court group for tournament look
    b.box(0.0, 20.4, -9.2, 24.0, 0.0, 0.006, M.floorWet);
  }

  // ── East wall (hall ↔ pickleball): +4.50 m service catwalk 1.20 m wide + wind-block sliding louvre screens ──
  // The catwalk is carried by cantilever outriggers bolted to the EXISTING portal columns, each with a diagonal knee brace
  // back to the column shaft; a steel stair at the north end gives access. From the deck the operator reaches the upper
  // sliding louvre panels (z 4.75 … 7.25) that close the hall against wind coming from the pickleball courts.
  {
    const b = layer('east_catwalk');
    const X0 = HALL.x1; // 22.3 glass line
    const DZ = 4.5, dX0 = X0 + 0.2, dX1 = dX0 + 1.2; // deck 22.50 … 23.70
    const cols = [-8.0, -3.0, 2.0, 12.5, 17.5, 22.0]; // existing portal columns (east line)
    const yS = -9.2, yN = 21.85; // catwalk runs from the south end to the short stair up from the L2 landing
    // deck: grating + two stringers + edge channels
    b.box(dX0, dX1, yS, yN, DZ - 0.06, DZ, M.grating);
    for (const x of [dX0 + 0.05, dX1 - 0.05]) b.box(x - 0.06, x + 0.06, yS, yN, DZ - 0.3, DZ - 0.06, M.charcoal);
    // outriggers + knee braces at the existing columns (those inside the catwalk length)
    for (const y of cols.filter((c) => c > yS && c < yN + 0.3)) {
      b.box(X0 - 0.3, dX1 + 0.05, y - 0.07, y + 0.07, DZ - 0.34, DZ - 0.06, M.charcoal); // outrigger through the mullion line
      b.member([dX1 - 0.1, y - 0.1, DZ - 0.3], [X0 - 0.15, y - 0.1, DZ - 2.5], 0.045, M.charcoal, 8); // knee brace to column
      b.member([dX1 - 0.1, y + 0.1, DZ - 0.3], [X0 - 0.15, y + 0.1, DZ - 2.5], 0.045, M.charcoal, 8);
      b.box(X0 - 0.35, X0 - 0.05, y - 0.2, y + 0.2, DZ - 2.65, DZ - 2.45, M.steel); // base plate on the column
    }
    // tie rods from the roof eave for the long 10.5 m bay between y = 2 and 12.5 (optional, to be checked by the structural engineer)
    for (const y of [5.5, 9.0]) b.member([dX1 - 0.05, y, DZ - 0.05], [X0 + 0.5, y, HALL.eave + 0.05], 0.022, M.steel, 6);
    // guard rail 1.10 m on the outer edge + kick plate; chain gate at the south end
    for (let y = yS; y <= yN + 0.01; y += 2.0) b.box(dX1 - 0.04, dX1 + 0.01, y - 0.025, y + 0.025, DZ, DZ + 1.1, M.charcoal);
    b.box(dX1 - 0.03, dX1 + 0.01, yS, yN, DZ + 1.05, DZ + 1.1, M.charcoal);
    b.box(dX1 - 0.03, dX1 + 0.01, yS, yN, DZ + 0.55, DZ + 0.58, M.charcoal);
    b.box(dX1 - 0.03, dX1 + 0.01, yS, yN, DZ, DZ + 0.12, M.charcoal);
    // wind-block sliding louvre screens on two tracks in front of the upper glass (z 4.75 … 7.25)
    const zb = 4.75, zt = 7.25;
    b.box(X0 + 0.02, X0 + 0.1, HALL.y0, HALL.y1, zt, zt + 0.1, M.charcoal); // upper rail
    b.box(X0 + 0.02, X0 + 0.1, HALL.y0, HALL.y1, zb - 0.1, zb, M.charcoal); // lower rail
    const nP = 13, pw = (HALL.y1 - HALL.y0) / nP;
    for (let i = 0; i < nP; i++) {
      const open = i === 4 || i === 5 ? 1 : 0; // two panels shown slid open (stacked in front of the neighbour)
      const x = X0 + 0.12 + (i % 2) * 0.09 + (open ? 0.09 : 0);
      const ya = HALL.y0 + i * pw + 0.05 + (open ? 0 : 0), yb = ya + pw - 0.1;
      b.box(x, x + 0.05, ya, yb, zb, zb + 0.06, M.charcoal); b.box(x, x + 0.05, ya, yb, zt - 0.06, zt, M.charcoal);
      b.box(x, x + 0.05, ya, ya + 0.06, zb, zt, M.charcoal); b.box(x, x + 0.05, yb - 0.06, yb, zb, zt, M.charcoal);
      for (let y = ya + 0.18; y < yb - 0.1; y += 0.19) { // fixed-pitch aluminium fins (louvre)
        const g = new THREE.BoxGeometry(0.1, zt - zb - 0.12, 0.035); g.rotateY(0.9);
        g.translate(x + 0.025, (zb + zt) / 2, -y); b.add(M.louvre, g);
      }
    }
    // Access from the rear complex L2 floor (+3.50 / finish +3.56): door in the L2 east wall → free-standing landing → 6 risers (157 mm) up to the +4.50 deck.
    // No climb from the ground floor; landing + stair stand on their own posts (the existing RC slab is not touched).
    const LZ = 3.5, lx0 = 22.3, ly0 = 23.4, ly1 = 25.25;
    b.box(lx0, dX1, ly0, ly1, LZ, LZ + 0.06, M.grating);
    for (const x of [lx0 + 0.15, dX1 - 0.08]) b.box(x - 0.06, x + 0.06, ly0, ly1, LZ - 0.28, LZ, M.charcoal);
    for (const [px, py, pz0] of [[dX1 - 0.1, 23.45, 0.0], [dX1 - 0.1, 24.68, 0.45], [lx0 + 0.2, 23.45, 0.0]]) b.box(px - 0.08, px + 0.08, py - 0.08, py + 0.08, pz0, LZ - 0.28, M.charcoal);
    b.box(dX1 - 0.9, dX1 + 0.05, 24.68 - 0.3, 24.68 + 0.3, 0.45, 0.5, M.steel); // base plate on the pit bench
    for (const y of [23.45, 24.3, 25.2]) b.box(dX1 - 0.03, dX1 + 0.01, y - 0.02, y + 0.02, LZ + 0.06, LZ + 1.15, M.charcoal);
    b.box(dX1 - 0.03, dX1 + 0.01, ly0, ly1, LZ + 1.1, LZ + 1.15, M.charcoal);
    b.box(lx0, dX1, ly1 - 0.03, ly1 + 0.01, LZ + 1.1, LZ + 1.15, M.charcoal);
    for (const x of [lx0 + 0.5, 23.0, dX1 - 0.03]) b.box(x - 0.015, x + 0.015, ly1 - 0.03, ly1 + 0.01, LZ + 0.06, LZ + 1.15, M.charcoal);
    const rise = (DZ - (LZ + 0.06)) / 6;
    for (let i = 1; i <= 6; i++) {
      const ya = ly0 - 0.26 * (i - 1), yb = ya - 0.26, z = LZ + 0.06 + rise * i;
      b.box(dX0, dX1, yb, ya, z - 0.05, z, M.grating);
    }
    for (const x of [dX0 + 0.05, dX1 - 0.05]) b.member([x, ly0, LZ - 0.2], [x, ly0 - 1.56, DZ - 0.2], 0.05, M.charcoal, 8);
    for (const x of [dX0 + 0.01, dX1 - 0.01]) { b.member([x, ly0, LZ + 1.15], [x, ly0 - 1.56, DZ + 1.1], 0.022, M.charcoal, 6); for (const t of [0.1, 0.8, 1.5]) b.cbox(x, ly0 - t, (LZ + 1.15 + (DZ + 1.1 - LZ - 1.15) * t / 1.56 + LZ + 0.06 + rise * (t / 0.26 + 1)) / 2, 0.035, 0.035, 1.0, M.charcoal); }
    // "to catwalk" exit-style sign above the L2 door
    b.box(22.28, 22.34, 24.3, 25.0, LZ + 2.2, LZ + 2.5, M.led);
  }

  // ── West wing REV P6 + palms garden — detailed interior (REV D.9) ─────────────
  // Layers (so the wing can be cut away): west_wing = shell/structure/jali/pergola frame, ww_G = ground-floor interiors,
  // ww_L2 = upper-floor slabs + interiors + gallery walkway, ww_roof = roof slabs, skylight, PV, pergola slats.
  {
    const W = layer('west_wing'), GI = layer('ww_G'), UI = layer('ww_L2'), RF = layer('ww_roof');
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
    wallX(W, wx0, wx0 + 0.2, -9.0, 10.0, 0, Z3, M.plaster);
    W.box(wx0 - 0.02, wx0 + 0.02, -8.0, 4.0, 4.6, 6.2, M.glassFrost);
    for (let y = -8.8; y < 4.8; y += 0.55) W.box(wx0 - 0.06, wx0, y, y + 0.1, 0.3, 6.8, M.teakLight);
    for (let y = 5.2; y < 9.8; y += 0.55) W.box(wx0 - 0.06, wx0, y, y + 0.1, 0.3, 6.8, M.teak);
    // street front y = −9.0 (zone 1): storefront with door D1 and VIP window, teak fins
    wallY(W, -9.0, -8.8, wx0, wx1, 0, Z3, M.plaster, [{ x0: -3.6, x1: -1.25, z0: 0.1, z1: 3.1 }, { x0: -3.6, x1: -1.25, z0: 3.9, z1: 6.6 }]);
    W.box(-3.6, -1.25, -8.98, -8.9, 0.1, 3.1, M.glass); W.box(-3.6, -1.25, -8.98, -8.9, 3.9, 6.6, M.glass);
    for (const x of [-3.6, -2.4, -1.25]) W.box(x - 0.03, x + 0.03, -9.02, -8.86, 0.1, 6.6, M.charcoal);
    W.box(-3.6, -1.25, -9.02, -8.86, 3.1, 3.9, M.charcoal); W.box(-3.6, -1.25, -9.02, -8.86, 6.55, 6.65, M.charcoal);
    for (let x = wx0 + 0.25; x <= wx1; x += 0.3) W.box(x - 0.03, x + 0.03, -9.4, -9.15, 0.1, Z3, M.teak);
    W.box(-3.0, -2.15, -9.06, -8.9, 0.1, 2.2, M.charcoal); // door D1 frame (private front door)
    // zone 1 / zone 2 party wall (y 4.8…5.2): ground door into the stair lobby, upper door to the Creative Suite
    wallY(W, 4.8, 5.2, ix0 - 0.2, ix1, 0, Z3, M.plaster, [{ x0: -3.5, x1: -2.7, z0: 0, z1: 2.2 }, { x0: -2.9, x1: -1.9, z0: 3.6, z1: 5.8 }]);
    // zone 2 north wall (y 9.8…10.0): shell only (stair hall is closed at ground; garden is entered through D4 from the hall)
    wallY(W, 9.8, 10.0, ix0 - 0.2, ix1, 0, Z3, M.plaster);
    // roof + parapet (zones 1–2) and L1 slab
    RF.box(wx0 - 0.1, wx1 + 0.1, -9.1, 10.1, Z3, Z3 + 0.3, M.concrete);
    RF.box(-3.7, -1.05, 6.0, 9.0, Z3, Z3 + 0.4, M.skylight); // stair-hall skylight
    UI.box(wx0, wx1, -9.0, 5.2, Z2 - 0.15, Z2 + 0.1, M.concrete); // L1 slab zone 1 (finish +3.60)

    // ═══ ZONE 1 — G1 Full-front Creative Studio (ground) ═══
    GI.box(ix0, ix1, -8.8, 4.8, 0, 0.02, M.floorInt);
    // sound-lock vestibule: partition at y = −7.2 with a door, second door at the street front
    wallY(GI, -7.25, -7.15, ix0, ix1, 0, ZC, M.wallInt, [{ x0: -2.9, x1: -2.0, z0: 0, z1: 2.1 }]);
    GI.box(-2.95, -1.95, -7.3, -7.1, 2.1, 2.15, M.charcoal);
    // acoustic panels (west) and teak-slat felt panels (east)
    for (let y = -6.6; y < 3.0; y += 1.3) GI.box(ix0, ix0 + 0.08, y, y + 1.1, 0.9, 2.7, M2.acoustic);
    for (let y = -6.6; y < 1.2; y += 0.4) GI.box(ix1 - 0.08, ix1, y, y + 0.25, 0.9, 2.7, M.teakLight);
    // ceiling track + spot heads, rack of softboxes on tripods, reflector, camera
    GI.box(-2.4 - 0.03, -2.4 + 0.03, -6.9, 2.9, ZC - 0.1, ZC - 0.04, M.steel);
    for (let y = -6.4; y < 2.9; y += 0.9) { GI.cyl(-2.4, y, ZC - 0.3, ZC - 0.1, 0.07, 0.07, M.charcoal, 8); GI.cyl(-2.4, y, ZC - 0.32, ZC - 0.3, 0.05, 0.05, M.led, 8); }
    for (const [x, y] of [[-3.15, 0.4], [-1.55, 1.3]]) { tripod(GI, x, y, 1.9); GI.box(x - 0.35, x + 0.35, y - 0.35, y + 0.35, 1.9, 2.5, M2.white); GI.box(x - 0.3, x + 0.3, y - 0.3, y + 0.3, 2.5, 2.52, M.led); }
    tripod(GI, -1.4, -1.0, 1.5); GI.cyl(-1.4, -1.0, 1.5, 2.1, 0.5, 0.5, M2.white, 18);
    tripod(GI, -2.4, -3.2, 1.4); GI.cbox(-2.4, -3.2, 1.5, 0.2, 0.3, 0.16, M.charcoal); GI.cyl(-2.4, -2.95, 1.46, 1.56, 0.06, 0.06, M.charcoal, 12);
    GI.box(-1.6, -1.2, -2.9, -2.6, 0.0, 0.9, M2.cabinet); GI.box(-1.6, -1.2, -2.9, -2.6, 0.9, 1.4, M2.screen); // monitor cart
    // make-up station on the east wall, sofa + coffee table, prop shelves, gear cases
    GI.box(-1.65, -1.05, -6.8, -5.4, 0.8, 0.86, M.teakLight); GI.box(-1.45, -1.05, -6.8, -5.4, 0, 0.8, M2.white);
    GI.box(-1.09, -1.05, -6.7, -5.5, 1.0, 2.1, M.glass); for (let y = -6.6; y <= -5.6; y += 0.25) GI.cyl(-1.12, y, 2.05, 2.1, 0.03, 0.03, M.led, 8);
    chair(GI, -2.0, -6.1, M2.sofaTan);
    GI.box(-3.6, -2.7, -5.6, -4.2, 0.1, 0.45, M2.sofa); GI.box(-3.6, -3.4, -5.6, -4.2, 0.45, 0.95, M2.sofa);
    GI.box(-2.5, -2.0, -5.1, -4.5, 0.0, 0.4, M.teakLight); GI.box(-3.35, -2.55, -5.75, -4.05, 0.0, 0.015, M2.rug);
    for (let k = 0; k < 4; k++) { GI.box(ix0 + 0.08, ix0 + 0.4, -2.4 + k * 0.55, -2.4 + k * 0.55 + 0.45, 0, 2.0, M.teakLight); for (let z = 0.3; z < 2; z += 0.4) GI.box(ix0 + 0.12, ix0 + 0.36, -2.38 + k * 0.55, -2.4 + k * 0.55 + 0.43, z, z + 0.03, M.charcoal); }
    GI.box(-1.5, -1.1, -0.2, 0.5, 0, 0.5, M.rubber); GI.box(-1.45, -1.15, 0.6, 1.0, 0, 0.35, M.charcoal);
    // cyclorama: white floor, 0.90 m radius cove and wall (y 2.4 … 4.8)
    GI.box(ix0, ix1, 2.4, 3.9, 0.02, 0.03, M2.cyclo);
    {
      const n = 8;
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * (Math.PI / 2), a1 = ((i + 1) / n) * (Math.PI / 2);
        const p = (a) => [3.9 + 0.9 * Math.sin(a), 0.9 - 0.9 * Math.cos(a)];
        const [y0c, z0c] = p(a0), [y1c, z1c] = p(a1);
        GI.quad(M2.cyclo, [ix0, y0c, z0c], [ix1, y0c, z0c], [ix1, y1c, z1c], [ix0, y1c, z1c]);
      }
      GI.quad(M2.cyclo, [ix0, 4.8, 0.9], [ix1, 4.8, 0.9], [ix1, 4.8, ZC], [ix0, 4.8, ZC]);
      GI.box(ix0, ix0 + 0.06, 2.4, 4.8, 0.02, ZC, M2.cyclo); GI.box(ix1 - 0.06, ix1, 2.4, 4.8, 0.02, ZC, M2.cyclo);
    }

    // ═══ ZONE 2 — G2 Grand U-stair (y 5.2 … 9.8), 20 risers × 175 mm, 260 mm treads, 1.25 m flights ═══
    GI.box(ix0, ix1, 5.2, 9.8, 0, 0.02, M.floorInt);
    {
      const R = 0.175, TR = 0.26, y0s = 5.95, yM = 8.55;
      // flight 1 (west, rises north): x −3.70 … −2.45
      for (let i = 1; i <= 10; i++) {
        const ya = y0s + (i - 1) * TR, top = R * i;
        GI.box(ix0, -2.45, ya, ya + TR, top - 0.3, top, M.concreteDark); GI.box(ix0, -2.45, ya - 0.02, ya + TR, top, top + 0.03, M.teak);
      }
      // mid-landing (z 1.75) and flight 2 (east, rises south): x −2.30 … −1.05
      GI.box(ix0, ix1, yM, 9.8, 1.45, 1.75, M.concreteDark); GI.box(ix0, ix1, yM, 9.8, 1.75, 1.78, M.teak);
      for (let j = 1; j <= 10; j++) {
        const yb = yM - j * TR, top = 1.75 + R * j;
        GI.box(-2.3, ix1, yb, yb + TR, top - 0.3, top, M.concreteDark); GI.box(-2.3, ix1, yb, yb + TR + 0.02, top, top + 0.03, M.teak);
      }
      // top landing (z 3.50) over the lobby, balustrades, handrails
      UI.box(ix0, ix1, 5.2, 5.95, 3.2, 3.5, M.concrete); UI.box(ix0, ix1, 5.2, 5.95, 3.5, 3.56, M.teak);
      GI.box(-2.45, -2.3, y0s, yM, 0, 0.9, M.charcoal); // central well rail base (void 0.15 m)
      for (const [x, ya, yb, za, zb] of [[-2.38, y0s, yM, 0.9, 2.65], [-2.38, yM, y0s, 2.65, 4.4]]) GI.member([x, ya, za + 0.05], [x, yb, zb + 0.05], 0.025, M.steel, 6);
      UI.box(-2.7, -1.05, 5.93, 5.97, 3.56, 4.6, M.glass); // balustrade at the stair head
      // WC G2 under flight 2 (1.20 × 0.95, ceiling ≥ 2.0 m), door from the lobby
      const hx0 = -2.3, hx1 = -1.1;
      wallY(GI, 6.95, 7.0, hx0, hx1, 0, 2.05, M.wallInt, [{ x0: -2.15, x1: -1.45, z0: 0, z1: 2.0 }]);
      GI.box(hx0, hx0 + 0.05, 6.95, 7.9, 0, 2.05, M.wallInt); GI.box(hx0, hx1, 7.9, 7.95, 0, 2.05, M.wallInt);
      GI.box(hx0, hx1, 6.95, 7.95, 2.0, 2.05, M.wallInt);
      GI.box(-1.75, -1.45, 7.55, 7.85, 0, 0.4, M2.white); GI.cyl(-1.6, 7.6, 0.4, 0.8, 0.14, 0.14, M2.white, 12); // WC pan + cistern
      GI.box(-2.2, -1.9, 7.7, 7.9, 0.8, 0.88, M2.white); GI.box(-2.19, -1.91, 7.9, 7.93, 1.05, 1.9, M.glass); // basin + mirror
      GI.box(-2.0, -1.5, 6.9, 7.1, 2.0, 2.05, M.charcoal);
      // under-landing storage + fire extinguisher cabinet
      GI.box(ix0, -2.5, 8.6, 9.8, 0, 1.4, M.teakLight); GI.box(ix0 + 0.02, -2.52, 8.62, 9.78, 0.02, 0.05, M.charcoal);
      GI.box(-1.12, -1.05, 5.4, 5.7, 0.9, 1.5, M.holdR);
      // lobby: bench, planter, wayfinding light
      GI.box(-3.55, -2.7, 5.35, 5.75, 0, 0.45, M.teakLight); plant(GI, -3.45, 5.7, 1.2, M2.fernDark);
    }
    // D3 (double 1.70 m) & D4 (1.70 m) openings are cut in the hall west wall; recessed leaf lines are drawn here
    for (const [ya, yb] of [[5.25, 6.95], [10.6, 12.3]]) {
      GI.box(-1.35, -1.3, ya, yb, 0, 2.35, M.glass); GI.box(-1.36, -1.29, (ya + yb) / 2 - 0.02, (ya + yb) / 2 + 0.02, 0, 2.35, M.charcoal);
      GI.box(-1.36, -1.29, ya, ya + 0.04, 0, 2.4, M.charcoal); GI.box(-1.36, -1.29, yb - 0.04, yb, 0, 2.4, M.charcoal); GI.box(-1.36, -1.29, ya, yb, 2.35, 2.4, M.charcoal);
    }

    // ═══ ZONE 3 — co-working palm garden (G3), jali wall V1–V4, slatted roof, L2 gallery walkway ═══
    const palmYs = [15.46, 12.08];
    for (let k = 0; k < 4; k++) {
      const ya = 10.0 + k * 3.0, yb = ya + 2.85;
      for (let y = ya; y < yb; y += 0.19) for (let z = 0.0; z < 6.9; z += 0.19) {
        const ix = Math.round((y - ya) / 0.19), iz = Math.round(z / 0.19);
        if (Math.abs(y - 15.46) < 0.45) continue; // jali wraps around palm P2
        if ((ix + iz) % 2 === 0 && z > 0.4 && z < 6.4 && ix % 5 !== 0) continue;
        W.box(wx0, wx0 + 0.14, y, y + 0.17, z, z + 0.17, k % 2 ? M.brick : M.terracotta);
      }
    }
    W.box(wx0, wx0 + 0.2, 10.0, 22.0, 6.9, 7.0, M.concrete);
    // L2 gallery walkway (x −2.6 … −0.8) with glass balustrade + coconut-fall guard net and canopy
    UI.box(-2.6, wx1, 10.0, 22.0, Z2 - 0.18, Z2 + 0.02, M.concrete);
    UI.box(-2.62, -2.58, 10.0, 22.0, Z2, Z2 + 1.1, M.glass); UI.box(-2.65, -2.55, 10.0, 22.0, Z2 + 1.05, Z2 + 1.1, M.charcoal);
    for (let y = 10.0; y <= 22.01; y += 2.0) UI.box(-2.64, -2.56, y - 0.03, y + 0.03, Z2, Z2 + 1.1, M.steel);
    UI.quad(M.net, [-2.6, 10.0, Z2 + 1.1], [-2.6, 22.0, Z2 + 1.1], [-2.6, 22.0, 6.1], [-2.6, 10.0, 6.1], [60, 8]); // vertical guard net to the canopy
    UI.quad(M.glassFrost, [-2.6, 10.0, 6.1], [-2.6, 22.0, 6.1], [-0.85, 22.0, 6.35], [-0.85, 10.0, 6.35], [1, 1]); // polycarbonate canopy over the walkway
    for (let y = 10.0; y <= 22.01; y += 1.0) UI.box(-2.62, -0.85, y - 0.015, y + 0.015, 6.08, 6.13, M.charcoal);
    for (const y of [10.4, 14.4, 18.4, 21.6]) UI.box(-1.7, -1.2, y - 0.25, y + 0.25, Z2 + 0.02, Z2 + 0.5, M.teakLight); // bench pockets
    // pergola frame + slats (slats and edge beam open around the palm trunks)
    for (const x of [-2.6, wx1 - 0.1]) W.box(x - 0.06, x + 0.06, 10.0, 22.0, 6.85, 6.95, M.charcoal);
    for (const [ya, yb] of [[10.0, 11.65], [12.5, 15.0], [15.9, 22.0]]) W.box(wx0 + 0.04, wx0 + 0.16, ya, yb, 6.85, 6.95, M.charcoal);
    for (let y = 10.0; y <= 22.0; y += 3.0) for (const x of [-2.55, -0.85]) W.box(x - 0.07, x + 0.07, y - 0.07, y + 0.07, 0, 6.9, M.charcoal);
    for (let y = 10.0; y <= 22.0; y += 0.45) { if (palmYs.some((p) => Math.abs(y - p) < 0.42)) continue; RF.box(wx0, wx1, y - 0.06, y + 0.06, 6.95, 7.05, M.teak); }
    // earth beds, circular teak benches, root-zone guards, drip rings, planting
    for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) {
      GI.cyl(px, py, 0, 0.06, 1.5, 1.5, M.earth, 36);
      GI.torus(px, py, 0.08, 1.05, 0.015, M.charcoal, 40);
      const n = 14;
      for (let k = 0; k < n; k++) {
        if (k === 4 || k === 5) continue;
        const a = (k / n) * TAU;
        const g = new THREE.BoxGeometry(0.9, 0.06, 0.38); g.rotateY(a + Math.PI / 2); g.translate(px + Math.cos(a) * 1.35, 0.45, -(py + Math.sin(a) * 1.35)); GI.add(M.teakLight, g);
        const l = new THREE.BoxGeometry(0.08, 0.45, 0.08); l.translate(px + Math.cos(a) * 1.35, 0.22, -(py + Math.sin(a) * 1.35)); GI.add(M.charcoal, l);
      }
      for (let k = 0; k < 9; k++) plant(GI, px + Math.cos(k * 0.7 + 1) * (0.55 + (k % 3) * 0.18), py + Math.sin(k * 0.7 + 1) * (0.55 + (k % 3) * 0.18), 0.9 + (k % 2) * 0.4, k % 2 ? M2.fern : M2.fernDark);
    }
    GI.box(wx0, wx1, 10.0, 22.0, -0.04, 0.0, M.paving);
    // stepping-stone path along the hall wall, bar-height co-working ledge with stools, lounge corner, pendants, bollards
    for (let y = 10.5; y < 21.8; y += 0.85) GI.box(-2.0, -1.2, y, y + 0.7, 0.0, 0.06, M.pathStone);
    GI.box(-1.45, -1.05, 12.6, 16.8, 1.02, 1.07, M.teakLight); GI.box(-1.25, -1.2, 12.6, 16.8, 0, 1.02, M.charcoal);
    for (let y = 13.0; y < 16.7; y += 0.9) { GI.cyl(-1.85, y, 0.0, 0.7, 0.025, 0.025, M.steel, 6); GI.cyl(-1.85, y, 0.7, 0.76, 0.18, 0.18, M2.sofaTan, 12); }
    GI.box(-3.0, -2.2, 17.0, 17.9, 0.7, 0.75, M.teakLight); for (const [x, y] of [[-3.3, 17.45], [-2.0, 17.45]]) chair(GI, x, y, M2.sofaTan);
    for (let y = 11.0; y < 22; y += 2.5) for (const x of [-3.0, -1.3]) { UI.cyl(x, y, 5.6, 7.0, 0.006, 0.006, M.steel, 4); GI.cyl(x, y, 5.45, 5.65, 0.1, 0.1, M.led, 10); }
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
    UI.box(ix0, -2.6, 18.0, 22.0, Z2 - 0.15, Z2 + 0.1, M.concrete); // slab under the L3 pod

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
      // fire stair + lift (x −3.7…−1.8, y 24.9…30.1). 2 × 0.95 m flights per floor (spec asks 1.20 m — see notes)
      const FL = [{ lyr: GI, z: 0 }, { lyr: UI, z: Z2 }, { lyr: UI, z: Z3 }];
      for (const { lyr, z } of FL) {
        lyr.box(-3.7, -1.8, 24.9, 26.0, z - 0.02, z, M.concreteDark);
        for (let i = 1; i <= 10; i++) { const ya = 28.0 - i * 0.2, top = z + 0.175 * i; lyr.box(-3.7, -2.78, ya, ya + 0.2, top - 0.25, top, M.concreteDark); }
        lyr.box(-3.7, -1.8, 24.9, 26.0, z + 1.5, z + 1.75, M.concreteDark); // half landing
        for (let j = 1; j <= 10; j++) { const ya = 26.0 + (j - 1) * 0.2, top = z + 1.75 + 0.175 * j; lyr.box(-2.72, -1.8, ya, ya + 0.2, top - 0.25, top, M.concreteDark); }
        lyr.box(-2.78, -2.72, 26.0, 28.0, z, z + 1.1, M.steel);
      }
      // MRL lift shaft 2.05 × 2.05 (y 28.05 … 30.1), steel door at each level facing the stair lobby
      W.box(-3.85, -1.8, 28.05, 30.1, 0, ZR + 1.2, M.concreteDark);
      for (const z of [0, Z2, Z3]) GI.box(-3.2, -2.3, 28.0, 28.08, z + 0.02, z + 2.1, M2.lift);
      // L4 staff room & linen (upper floor of the core) + L1 corridor to the lift
      UI.box(-3.7, -1.9, 22.2, 24.9, Z2 - 0.15, Z2 + 0.1, M.concrete);
      for (let k = 0; k < 5; k++) { UI.box(-3.65 + k * 0.33, -3.37 + k * 0.33, 22.25, 22.7, Z2 + 0.1, Z2 + 1.95, M.holdB); }
      UI.box(-3.0, -2.2, 23.3, 24.0, Z2 + 0.74, Z2 + 0.78, M.teakLight); for (const y of [23.1, 24.2]) UI.box(-2.9, -2.3, y - 0.2, y + 0.2, Z2 + 0.45, Z2 + 0.5, M.charcoal);
      for (let z = Z2 + 0.4; z < Z2 + 2.0; z += 0.4) UI.box(-3.65, -3.4, 24.45, 24.85, z, z + 0.03, M.charcoal);
      for (let k = 0; k < 3; k++) UI.box(-3.65, -3.35, 24.45, 24.85, Z2 + 0.43 + k * 0.4, Z2 + 0.78 + k * 0.4, M2.white); // folded linen
    }

    // ═══ ZONE 1 — L1 Creative Suite / VIP lounge (upper floor, z 3.50) ═══
    UI.box(ix0, ix1, -8.8, 4.8, Z2 + 0.1, Z2 + 0.12, M.floorInt);
    UI.box(ix0, ix1, -8.8, 4.8, Z2 + 0.1, Z2 + 0.14, M.teakLight);
    UI.box(-3.55, -1.4, -7.6, -4.4, Z2 + 0.14, Z2 + 0.16, M2.rug);
    // lounge: sofa, armchairs, coffee tables, TV wall, bar counter with stools, plants
    UI.box(-3.55, -2.45, -7.4, -5.3, Z2 + 0.16, Z2 + 0.55, M2.sofaTan); UI.box(-3.55, -3.3, -7.4, -5.3, Z2 + 0.55, Z2 + 1.0, M2.sofaTan);
    chair(UI, -1.7, -6.2, M2.sofa); chair(UI, -1.7, -5.4, M2.sofa);
    UI.box(-2.4, -1.9, -6.6, -5.8, Z2 + 0.16, Z2 + 0.55, M.teakLight);
    UI.box(-3.6, -1.1, -2.2, -1.6, Z2 + 0.14, Z2 + 1.05, M.teak); UI.box(-3.4, -1.3, -2.2, -2.15, Z2 + 1.05, Z2 + 1.12, M.ss316); // bar counter
    for (const x of [-3.2, -2.6, -2.0, -1.4]) { UI.cyl(x, -1.2, Z2 + 0.14, Z2 + 0.7, 0.03, 0.03, M.steel, 6); UI.cyl(x, -1.2, Z2 + 0.7, Z2 + 0.76, 0.17, 0.17, M2.sofa, 12); }
    UI.box(ix0 + 0.02, ix0 + 0.08, -6.8, -4.6, Z2 + 1.0, Z2 + 2.0, M2.screen); // TV on the west wall
    UI.box(-3.55, -1.3, 0.2, 4.4, Z2 + 0.14, Z2 + 0.16, M2.rugGrey); // work area: shared desk + chairs
    UI.box(-3.4, -1.4, 1.2, 2.0, Z2 + 0.72, Z2 + 0.76, M.teakLight); for (const x of [-3.1, -2.4, -1.7]) { chair(UI, x, 0.8); chair(UI, x, 2.4, M.charcoal); }
    UI.box(-3.4, -1.4, 1.2, 2.0, Z2 + 0.14, Z2 + 0.72, M.charcoal);
    plant(UI, -3.6, -8.2, 1.5); plant(UI, -1.2, -8.2, 1.3, M2.fernDark); plant(UI, -3.6, 4.4, 1.4);
    UI.box(ix1 - 0.05, ix1, -8.0, -1.0, Z2 + 0.9, Z2 + 2.4, M2.acoustic);
    for (let y = -8.2; y < 4.6; y += 2.4) { UI.cyl(-2.4, y, ZC + Z2 - 3.35 + 2.9, Z3 - 0.3, 0.006, 0.006, M.steel, 4); UI.cyl(-2.4, y, Z3 - 0.58, Z3 - 0.35, 0.14, 0.14, M.led, 10); }
  }

  // ── Rear complex REV D.5 ──────────────────────────────────────────
  const GFr = layer('rear_GF'), L2r = layer('rear_L2'), L3r = layer('rear_L3'), RFr = layer('rear_roof'), STr = layer('rear_structure');
  {
    const xs = [0.2, 5.2, 10.2, 15.2, 20.2];
    // columns, rows A (25.1) and B (28.1)
    const colsAt = (lyr, z0, z1) => { for (const y of [25.1, 28.1]) for (const x of xs) lyr.box(x - 0.15, x + 0.15, y - 0.15, y + 0.15, z0, z1, M.concreteDark); };
    colsAt(GFr, 0, Z2); colsAt(L2r, Z2, Z3); colsAt(L3r, Z3, ZR);
    // existing RC slab at +3.5 (144 m²) — shown darker so it reads as "do not touch"
    L2r.box(SLAB.x0, SLAB.x1, SLAB.y0, SLAB.y1, Z2 - 0.28, Z2, M.concreteDark);
    // existing beams along rows
    for (const y of [25.1, 28.1]) L2r.box(SLAB.x0, SLAB.x1, y - 0.15, y + 0.15, Z2 - 0.65, Z2 - 0.28, M.concreteDark);

    // ground floor ----------------------------------------------------
    const b = GFr;
    b.box(SLAB.x0, SLAB.x1, 25.1, 30.1, -0.05, 0.0, M.floorInt);
    // facade north y = 30.1 (glazed with mullions), openings handled by glass
    b.box(SLAB.x0, SLAB.x1, 30.05, 30.15, 0.0, Z2 - 0.3, M.glass);
    for (let x = SLAB.x0; x <= SLAB.x1 + 0.01; x += 1.2) b.box(x - 0.03, x + 0.03, 30.0, 30.18, 0, Z2 - 0.3, M.charcoal);
    // south façade y = 25.1 (to the hall aisle)
    const sw = (x0, x1, mat = M.plaster) => b.box(x0, x1, 25.0, 25.2, 0, Z2 - 0.3, mat);
    sw(SLAB.x0, 1.9); sw(4.2, 5.0); sw(10.2, 11.3);
    b.box(11.3, 12.7, 25.0, 25.2, 0, Z2 - 0.3, M.plaster);
    b.box(5.0, 10.2, 25.04, 25.16, 0.1, 2.4, M.glassFrost); // changing room dry entries / frosted
    b.box(1.9, 4.2, 25.04, 25.16, 0.1, 2.1, M.glassFrost);
    b.box(12.7, 18.4, 25.04, 25.16, 0.1, Z2 - 0.35, M.glass); // clinic reception entrance (double glass door 1.40 m)
    b.box(18.4, 22.2, 25.0, 25.2, 0, Z2 - 0.3, M.plaster);
    b.box(10.2, 18.4, 25.0, 25.2, Z2 - 0.7, Z2 - 0.3, M.charcoal);
    // east wall x = 22.2 (climbing room)
    b.box(22.1, 22.3, 25.1, 30.1, 0, Z2 - 0.3, M.plaster);
    // partitions
    const part = (x0, x1, y0, y1) => b.box(x0, x1, y0, y1, 0, Z2 - 0.3, M.wallInt);
    part(1.9, 2.0, 25.1, 27.4); part(1.9, 4.2, 27.4, 27.5); // accessible WC
    part(4.2, 4.3, 27.5, 30.1); part(7.2, 7.3, 25.1, 30.1); part(10.1, 10.3, 25.1, 30.1); // changing M/F
    part(4.3, 10.1, 27.4, 27.5);
    part(18.3, 18.5, 25.1, 30.1); // climbing room
    // clinic partitions: reception zone y 25.1…26.9, TR1 / TR2 / rehab 26.9…30.1
    part(10.2, 18.4, 26.85, 26.95);
    part(12.75, 12.85, 26.95, 30.1); part(15.35, 15.45, 26.95, 30.1);
    // clinic furniture: plinth beds, laser/shockwave carts, stall bars, reception desk, benches
    b.box(10.5, 11.4, 27.7, 29.6, 0.45, 0.8, M.bedWhite); b.box(10.5, 11.4, 27.7, 29.6, 0.0, 0.45, M.charcoal);
    b.box(13.1, 14.0, 27.7, 29.6, 0.45, 0.8, M.bedBlue); b.box(13.1, 14.0, 27.7, 29.6, 0.0, 0.45, M.charcoal);
    b.box(12.0, 12.5, 29.4, 29.9, 0, 1.25, M.charcoal); b.box(14.6, 15.1, 29.4, 29.9, 0, 1.25, M.charcoal);
    b.box(15.6, 18.3, 27.2, 30.0, 0.0, 0.02, M.turf); // rehab turf lane
    for (let y = 27.3; y < 29.8; y += 0.3) b.box(18.2, 18.3, y, y + 0.05, 0.0, 2.2, M.teakLight); // stall bars
    b.box(11.0, 14.2, 26.0, 26.5, 0, 1.05, M.teakLight); // reception counter
    b.box(15.0, 17.8, 25.3, 25.8, 0, 0.45, M.teakLight); // waiting bench
    // changing rooms: lockers + benches
    for (const [xa, xb] of [[4.4, 7.1], [7.4, 10.0]]) {
      b.box(xa, xb, 29.65, 30.0, 0, 1.9, M.holdB);
      b.box(xa + 0.3, xb - 0.3, 28.4, 28.8, 0, 0.45, M.teakLight);
    }
    // sliding glass door 2.00 m clinic → pool deck (x 15.4…17.4 on y=30.1) is part of the north glazing; add frame
    b.box(15.4, 17.4, 30.0, 30.2, 2.2, 2.35, M.charcoal);
    // indoor bouldering room: safety mat 300 mm on existing slab
    b.box(18.6, 22.0, 25.4, 29.9, 0.0, 0.3, M.mat);
    // plumbing / MDB (west core GF)
    b.box(-1.8, 1.9, 25.1, 30.1, -0.04, 0.0, M.floorWet);

    // level 2 wellness -------------------------------------------------
    const c = L2r;
    c.box(SLAB.x0 - 0.0, SLAB.x1, SLAB.y0, SLAB.y1, Z2 - 0.0, Z2 + 0.06, M.floorInt); // floor finish over existing slab
    // gallery glass balustrade (y=24.1), 1.10 m
    c.box(SLAB.x0, SLAB.x1, 24.08, 24.12, Z2 + 0.06, Z2 + 1.16, M.glass);
    c.box(SLAB.x0, SLAB.x1, 24.06, 24.14, Z2 + 1.12, Z2 + 1.18, M.steel);
    for (let x = SLAB.x0; x <= SLAB.x1 + 0.01; x += 2.0) c.box(x - 0.03, x + 0.03, 24.05, 24.15, Z2, Z2 + 1.18, M.steel);
    // gallery slab edge fascia
    c.box(SLAB.x0, SLAB.x1, 24.0, 24.12, Z2 - 0.5, Z2, M.plaster);
    // south wall of wellness rooms y = 25.9 (glazed doors to gallery)
    c.box(SLAB.x0, SLAB.x1, 25.86, 25.94, Z2 + 0.06, Z3 - 0.3, M.glassFrost);
    for (let x = SLAB.x0; x <= SLAB.x1 + 0.01; x += 1.2) c.box(x - 0.03, x + 0.03, 25.82, 25.98, Z2, Z3 - 0.3, M.charcoal);
    // north façade y=30.1 – glass (view of pool)
    c.box(SLAB.x0, SLAB.x1, 30.05, 30.15, Z2 + 0.06, Z3 - 0.3, M.glass);
    for (let x = SLAB.x0; x <= SLAB.x1 + 0.01; x += 1.2) c.box(x - 0.03, x + 0.03, 30.0, 30.18, Z2, Z3 - 0.3, M.charcoal);
    // east wall x=22.2 (linen store)
    c.box(22.1, 22.3, 25.2, 30.1, Z2, Z3 - 0.3, M.plaster);
    c.box(22.1, 22.3, 24.1, 25.2, Z2 + 2.15, Z3 - 0.3, M.plaster); // lintel over the door to the catwalk landing
    c.box(22.08, 22.32, 24.12, 24.17, Z2 + 0.06, Z2 + 2.15, M.charcoal); c.box(22.08, 22.32, 25.15, 25.2, Z2 + 0.06, Z2 + 2.15, M.charcoal);
    c.box(22.18, 22.22, 24.17, 25.15, Z2 + 0.06, Z2 + 2.12, M.glass); // glazed door leaf, 1.05 m clear, opens onto the landing
    // wellness partitions (7 zones; row-B columns buried in the partitions)
    const px = [0.0, 2.05, 4.25, 7.05, 9.55, 12.05, 15.05, 17.05, 20.2];
    for (const x of px) c.box(x - 0.06, x + 0.06, 25.9, 30.1, Z2 + 0.06, Z3 - 0.3, M.wallInt);
    // equipment: red-light panels, HBOT chambers, cold plunge tub, sauna cabins, loungers
    c.box(0.3, 1.8, 29.9, 30.0, Z2 + 0.4, Z2 + 2.1, M.holdR);
    c.box(2.3, 4.0, 29.9, 30.0, Z2 + 0.4, Z2 + 2.1, M.holdR);
    for (const [xa, xb] of [[4.5, 6.8], [7.3, 9.3]]) {
      c.cyl((xa + xb) / 2, 28.1, Z2 + 0.7, Z2 + 0.7 + 0.1, 0.05, 0.05, M.charcoal, 8);
      const g = new THREE.CylinderGeometry(0.5, 0.5, 2.0, 24);
      g.rotateZ(Math.PI / 2);
      g.translate((xa + xb) / 2, Z2 + 1.0, -28.1);
      c.add(M.hbot, g);
      c.box(xa + 0.1, xb - 0.1, 27.1, 29.1, Z2 + 0.06, Z2 + 0.5, M.charcoal);
    }
    c.box(9.8, 11.8, 27.3, 29.0, Z2 + 0.06, Z2 + 0.7, M.plunge); // cold plunge
    c.box(12.4, 14.6, 26.5, 29.7, Z2 + 0.06, Z2 + 2.3, M.teak); // sauna cabins
    c.box(14.65, 14.95, 26.5, 29.7, Z2 + 0.06, Z2 + 2.3, M.charcoal);
    for (const y of [27.4, 28.8]) c.box(15.4, 16.8, y - 0.35, y + 0.35, Z2 + 0.06, Z2 + 0.55, M.bedBlue); // lounge chairs
    c.box(17.5, 19.9, 27.0, 29.2, Z2 + 0.06, Z2 + 1.2, M.charcoal); // chiller/HBOT compressor store
    // linen & towel store (east)
    c.box(20.5, 21.9, 26.2, 29.9, Z2 + 0.06, Z2 + 2.2, M.teakLight);
    // yoga-planters on the gallery
    for (const x of [3, 9, 15, 19.5]) c.box(x - 0.3, x + 0.3, 24.3, 24.9, Z2 + 0.06, Z2 + 0.6, M.hedge);

    // level 3 --------------------------------------------------------
    const d = L3r;
    d.box(-1.8, 22.2, 24.1, 30.1, Z3 - 0.25, Z3, M.concrete); // L3 slab
    d.box(4.2, 22.2, 24.1, 30.1, Z3, Z3 + 0.04, M.teakLight);
    d.box(-1.8, 4.2, 24.1, 30.1, Z3, Z3 + 0.04, M.floorInt);
    // studio glazing (south toward courts, north toward pool)
    d.box(4.2, 17.2, 24.06, 24.14, Z3, ZR - 0.2, M.glass);
    d.box(4.2, 17.2, 30.06, 30.14, Z3, ZR - 0.2, M.glass);
    for (let x = 4.2; x <= 17.21; x += 1.3) { d.box(x - 0.04, x + 0.04, 24.0, 24.2, Z3, ZR, M.charcoal); d.box(x - 0.04, x + 0.04, 30.0, 30.2, Z3, ZR, M.charcoal); }
    d.box(4.1, 4.3, 24.1, 30.1, Z3, ZR - 0.2, M.plaster);
    d.box(17.1, 17.3, 24.1, 30.1, Z3, ZR - 0.2, M.glass);
    // studio equipment: cardio row along grid A, machines, reformers
    for (let x = 5.0; x < 10; x += 1.2) d.box(x, x + 0.8, 24.8, 26.4, Z3 + 0.04, Z3 + 1.3, M.charcoal);
    for (let k = 0; k < 4; k++) d.box(10.8 + k * 1.5, 11.3 + k * 1.5, 26.5, 29.0, Z3 + 0.04, Z3 + 0.45, M.bedWhite); // reformers
    d.box(5.0, 9.0, 27.5, 29.8, Z3 + 0.04, Z3 + 0.06, M.holdB); // mats
    // yoga terrace: balustrade, pergola, planters, retractable canopy
    d.box(17.2, 22.2, 24.0, 24.1, Z3, Z3 + 1.1, M.glass);
    d.box(17.2, 22.2, 30.1, 30.2, Z3, Z3 + 1.1, M.glass);
    d.box(22.1, 22.2, 24.1, 30.1, Z3, Z3 + 1.1, M.glass);
    for (const x of [17.7, 22.0]) for (const y of [24.3, 29.9]) d.box(x - 0.08, x + 0.08, y - 0.08, y + 0.08, Z3, ZR - 0.4, M.teak);
    for (let x = 17.7; x <= 22.0; x += 0.45) d.box(x - 0.05, x + 0.05, 24.3, 29.9, ZR - 0.4, ZR - 0.3, M.teak);
    d.box(17.7, 22.0, 26.0, 28.4, ZR - 0.28, ZR - 0.25, M.glassFrost); // canopy sheet (retractable)
    for (const [x, y] of [[18.0, 24.5], [18.0, 29.6], [21.6, 29.6]]) d.box(x - 0.3, x + 0.3, y - 0.3, y + 0.3, Z3, Z3 + 0.6, M.hedge);
    for (let k = 0; k < 4; k++) d.box(18.4 + k * 0.9, 18.4 + k * 0.9 + 0.65, 26.2, 27.8, Z3 + 0.04, Z3 + 0.06, M.holdY);

    // roof of rear complex
    RFr.box(4.0, 17.4, 23.95, 30.3, ZR - 0.25, ZR + 0.05, M.concrete);
    RFr.box(-1.9, 4.0, 22.0, 30.3, ZR, ZR + 0.3, M.concrete);
    // roof PV (rear complex part of the 60-75 kWp microgrid)
    for (let k = 0; k < 6; k++) RFr.quad(M.solar, [4.6 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 27.6, ZR + 0.25], [4.6 + k * 2.1, 27.6, ZR + 0.25], [1, 2]);
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
    for (let x = 14.7; x <= 18.15; x += 0.18) GFr.box(x - 0.04, x + 0.04, fN, fN + 0.95, 2.95, 3.05, M.teak);
    GFr.box(14.6, 18.3, fN + 0.9, fN + 1.0, 2.9, 3.1, M.charcoal);
    for (const x of [14.7, 18.2]) GFr.box(x - 0.05, x + 0.05, fN + 0.85, fN + 0.95, 0, 2.95, M.charcoal);
    for (const x of [15.2, 16.4, 17.6]) GFr.box(x - 0.08, x + 0.08, fN + 0.4, fN + 0.55, 2.88, 2.95, M.led);
    GFr.box(15.4, 17.4, fN + 0.02, fN + 0.2, 0, 0.05, M.steel); // door threshold / drain
    // services on the façade: stainless sauna exhaust risers + rain caps, charcoal downpipes
    for (const x of [12.9, 14.3]) {
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
    // pool: steps at the east end, steel ladder, underwater lights, outdoor shower, pool plant room, planters
    {
      const b = G.outdoor || layer('outdoor');
      b.box(21.6, 22.2, 31.0, 35.0, -1.4, -0.5, M.poolTile); b.box(21.0, 21.6, 31.0, 35.0, -1.4, -0.95, M.poolTile);
      for (const x of [10.55, 10.95]) { b.cyl(x, 31.15, -0.6, 0.9, 0.025, 0.025, M.ss316, 8); }
      b.torus(10.75, 31.15, 0.9, 0.2, 0.02, M.ss316, 12);
      for (const x of [11.5, 14.5, 17.5, 20.0]) b.box(x - 0.08, x + 0.08, 31.0, 31.05, -0.85, -0.7, M.led); // underwater lights
      for (const y of [32.3, 33.7]) b.box(10.2, 10.25, y - 0.08, y + 0.08, -0.85, -0.7, M.led);
      b.cyl(23.2, 31.3, 0.07, 2.3, 0.04, 0.04, M.ss316, 10); b.cyl(23.2, 31.3, 2.2, 2.3, 0.03, 0.14, M.ss316, 12);
      b.cyl(23.2, 31.3, 0.07, 0.1, 0.35, 0.35, M.pebble, 16);
      // pool equipment room (AFM filter, salt chlorinator, UV-C) with teak batten cladding and a louvred door
      b.box(24.6, 26.6, 31.6, 33.6, 0, 2.4, M.charcoal);
      for (let y = 31.65; y < 33.55; y += 0.22) b.box(24.55, 24.6, y, y + 0.1, 0.05, 2.3, M.teak);
      b.box(24.52, 24.6, 32.2, 33.0, 0.1, 2.1, M.louvre);
      b.box(24.45, 26.75, 31.5, 33.7, 2.4, 2.5, M.concrete);
      // raised teak planters with tropical shrubs on the west deck
      for (const y of [32.4, 34.0]) { b.box(7.3, 9.4, y - 0.4, y + 0.4, 0.07, 0.6, M.teak); for (let k = 0; k < 8; k++) { const g = new THREE.ConeGeometry(0.1, 0.9, 6); g.translate(7.5 + (k % 4) * 0.55, 1.05, -(y + (k < 4 ? -0.15 : 0.15))); b.add(M.hedge, g); } }
      // pool-side towel stand + deck lights
      for (const x of [10.0, 13.5, 17.0, 20.5]) b.cyl(x, 30.45, 0.07, 0.4, 0.06, 0.06, M.led, 8);
    }
    // west wing: sconces on the batten wall + PV on the flat roof (REV P6 wing, south-facing 10° arrays)
    {
      const b = G.west_wing, bR = G.ww_roof;
      for (let y = -8.0; y < 10; y += 2.2) b.box(-3.98, -3.9, y - 0.05, y + 0.05, 3.0, 3.25, M.led);
      for (let y = 26.2; y < 30; y += 2.2) b.box(-3.98, -3.9, y - 0.05, y + 0.05, 3.0, 3.25, M.led);
      for (let y = -8.4; y < 9.2; y += 2.2) bR.quad(M.solar, [-3.6, y, 7.3 + 0.12], [-1.1, y, 7.3 + 0.12], [-1.1, y + 1.9, 7.3 + 0.45], [-3.6, y + 1.9, 7.3 + 0.45], [2, 1]);
      for (let y = -8.4; y < 9.2; y += 2.2) for (const x of [-3.5, -1.2]) bR.member([x, y + 0.1, 7.3], [x, y + 1.0, 7.3 + 0.28], 0.025, M.charcoal, 4);
    }
  }

  // ── Outdoor: pool + deck, climbing wall + sunk crash pit, pickleball, senior garden ──
  {
    const b = G.outdoor || layer('outdoor');
    // Pool 4 × 12 m (x 10.2…22.2, y 31…35), 1.2–1.4 m deep, teak deck
    b.box(10.2, 22.2, 31.0, 35.0, -1.4, -1.38, M.poolTile);
    b.box(10.0, 10.2, 30.8, 35.2, -1.4, 0.05, M.concrete);
    b.box(22.2, 22.4, 30.8, 35.2, -1.4, 0.05, M.concrete);
    b.box(10.0, 22.4, 30.8, 31.0, -1.4, 0.05, M.concrete);
    b.box(10.0, 22.4, 35.0, 35.2, -1.4, 0.05, M.concrete);
    b.box(10.2, 22.2, 31.0, 35.0, -0.12, -0.1, M.poolWater);
    // teak deck all around (≥ 1.5 m where room allows; rear fence pinches the NE corner)
    b.box(7.0, 24.0, 30.1, 30.8, 0.0, 0.07, M.teak);
    b.box(7.0, 10.0, 30.8, 35.4, 0.0, 0.07, M.teak);
    b.box(22.4, 24.5, 30.8, 36.0, 0.0, 0.07, M.teak);
    for (let x = 7.0; x < 24.0; x += 0.1) b.box(x, x + 0.004, 30.1, 30.8, 0.07, 0.072, M.charcoal);
    // loungers + umbrellas on the deck
    for (const x of [8.0, 9.2]) b.box(x, x + 0.7, 32.2, 33.8, 0.07, 0.4, M.bedWhite);
    b.cyl(8.6, 31.2, 0.07, 2.4, 0.03, 0.03, M.charcoal, 8);
    b.cyl(8.6, 31.2, 2.2, 2.45, 0.05, 1.3, M.plasterWarm, 14);

    // Outdoor climbing wall: free-standing steel tower 3.30 m wide × 10.50 m tall, x 22.55…22.85, y 25.6…28.9
    // (shifted 1.30 m north vs REV D.5 so the L2 → catwalk door and landing fit at the north-east corner of the hall)
    const cy0 = 25.6, cy1 = 28.9;
    b.box(22.3, 23.2, cy0 - 0.3, cy1 + 0.3, -0.4, 0.0, M.concreteDark); // own foundation
    b.box(22.55, 22.85, cy0, cy1, 0, 10.5, M.charcoal); // HDG steel truss core
    b.box(22.85, 22.9, cy0, cy1, 0.1, 10.4, M.climbPanel); // 18 mm resin panels (facing the pit)
    for (let z = 1; z <= 10.2; z += 1.25) b.box(22.58, 22.85, cy0, cy1, z, z + 0.05, M.steel);
    for (let y = cy0; y <= cy1 + 0.01; y += 1.1) b.box(22.58, 22.85, y, y + 0.05, 0, 10.5, M.steel);
    let hs = 11;
    const hr = () => ((hs = (hs * 48271) % 2147483647) / 2147483647);
    const holds = [M.holdY, M.holdR, M.holdB, M.holdK];
    for (let i = 0; i < 90; i++) {
      const z = 0.5 + hr() * 9.6, y = cy0 + 0.15 + hr() * (cy1 - cy0 - 0.3);
      b.cbox(22.93, y, z, 0.1, 0.18, 0.14, holds[i % 4]);
    }
    // route tapes (5 lines) + auto-belay units at the top + route plate
    [M.holdY, M.holdR, M.holdB, M.holdK, M.white].forEach((m, i) => b.box(22.9, 22.915, cy0 + 0.35 + i * 0.65, cy0 + 0.45 + i * 0.65, 0.2, 10.3, m));
    for (let i = 0; i < 3; i++) { b.cyl(23.0, cy0 + 0.6 + i * 1.05, 10.1, 10.45, 0.17, 0.17, M.holdY, 14); b.member([22.9, cy0 + 0.6 + i * 1.05, 10.45], [23.0, cy0 + 0.6 + i * 1.05, 10.1], 0.01, M.steel, 4); }
    b.box(22.9, 22.93, cy0 + 0.2, cy1 - 0.2, 10.15, 10.45, M.charcoal);
    // top-out gate at +7.00: steel bridge plate from the L3 yoga terrace to the tower
    b.box(22.2, 22.55, 26.6, 27.9, 6.95, 7.0, M.grating);
    b.box(22.2, 22.55, 26.6, 26.65, 7.0, 8.1, M.charcoal); b.box(22.2, 22.55, 27.85, 27.9, 7.0, 8.1, M.charcoal);
    // crash pit: floor −0.60, mat top −0.30, RC walls 150 mm, concrete bench rim +0.45 on N, S, E (y 24.90 … 29.20)
    b.box(22.85, 25.05, 24.9, 29.2, -0.6, -0.55, M.concrete);
    b.box(22.85, 25.05, 24.9, 29.2, -0.55, -0.3, M.matFoam);
    b.box(23.0, 24.9, 25.05, 29.05, -0.3, -0.28, M.mat);
    for (const [x0, x1, y0, y1] of [[22.85, 25.05, 24.75, 24.9], [22.85, 25.05, 29.2, 29.35], [25.05, 25.2, 24.9, 29.2], [22.7, 22.85, 24.9, 29.2]]) b.box(x0, x1, y0, y1, -0.6, 0.0, M.concrete);
    // benches (0.45 high, 0.45 wide): south (low y), north (high y) and east; 1.20 m stair gap at the SE corner (y 24.9 … 26.1)
    b.box(22.85, 25.5, 24.45, 24.9, 0, 0.45, M.concrete); // south side
    b.box(22.85, 25.5, 29.2, 29.65, 0, 0.45, M.concrete); // north side
    b.box(25.2, 25.65, 26.1, 29.65, 0, 0.45, M.concrete); // east side (stops short = 1.20 m stair gap)
    b.box(25.2, 25.65, 24.9, 26.1, -0.3, 0.0, M.concreteDark);
    // sump (0.6 × 0.6) + cover
    b.box(23.7, 24.3, 26.7, 27.3, -0.6, -0.55, M.charcoal);

    // pickleball courts PB1, PB2 along the hall's glass wall
    for (const y0 of [-8.0, 6.4]) {
      b.box(24.5, 31.1, y0 - 1.0, y0 + 14.4, 0.0, 0.015, M.pickleOut);
      const g = new THREE.PlaneGeometry(6.1, 13.4);
      g.rotateX(-Math.PI / 2);
      g.translate(24.5 + 0.5 + 3.05, 0.02, -(y0 + 6.7));
      b.add(M.pickleTex, g);
      const ny = y0 + 6.7;
      for (const px of [25.0 - 0.0, 31.1 - 0.5 + 0.2]) b.cyl(px, ny, 0, 0.95, 0.03, 0.03, M.charcoal, 8);
      b.cbox(28.05, ny, 0.5, 6.1, 0.02, 0.8, M.net);
      for (const [lx, ly] of [[24.7, y0 - 0.8], [30.9, y0 - 0.8], [24.7, y0 + 14.2], [30.9, y0 + 14.2]]) {
        b.cyl(lx, ly, 0, 6.0, 0.06, 0.05, M.charcoal, 8);
        b.box(lx - 0.25, lx + 0.25, ly - 0.1, ly + 0.1, 5.9, 6.0, M.led);
      }
    }

    // senior parkour & active-aging garden along the rear fence (grass beds + handrail path)
    b.box(24.5, 38.0, 29.5, 38.4, 0.0, 0.02, M.turf);
    b.box(-3.9, 8.0, 30.2, 33.0, 0.0, 0.02, M.turf);
    for (let x = 0; x < 30; x += 3) b.box(2.0 + x * 0.5, 2.1 + x * 0.5, 32.0, 32.1, 0, 1.0, M.teakLight);
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
    palm(-3.67, 15.46, 11.8, rad(10), 0.55);
    palm(-3.24, 12.08, 10.8, rad(-10), 0.7);

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
  const order = ['site', 'fences', 'trees', 'rear_services', 'hall_shell', 'hall_roof', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'east_catwalk', 'west_wing', 'ww_G', 'ww_L2', 'ww_roof', 'rear_structure', 'rear_GF', 'rear_L2', 'rear_L3', 'rear_roof', 'outdoor', 'vegetation'];
  for (const n of order) root.add(G[n].flush());
  // every glass material must not cast shadows
  root.traverse((o) => {
    if (o.isMesh && o.material && o.material.transparent && !o.material.alphaTest) o.castShadow = false;
  });
  return { root, layers: order };
}

// ───────────────────────────── camera shots (spec §5.4 + extras) ─────────────────────────────
export const SHOTS = {
  s1: { title: 'S1 · Street Approach', pos: [10.75, -30.0, 1.7], target: [10.75, -12.0, 5.4], focal: 24, time: 'golden' },
  s1_dusk: { title: 'S1 · Street Approach (Dusk hero)', pos: [10.75, -30.0, 1.7], target: [10.75, -12.0, 5.4], focal: 24, time: 'dusk' },
  s2: { title: 'S2 · Entrance Threshold', pos: [10.75, -18.0, 1.6], target: [10.75, -10.5, 4.6], focal: 24, time: 'golden' },
  s3: { title: 'S3 · Badminton Hall Grandeur', pos: [10.4, -1.0, 1.7], target: [10.4, 12.0, 4.0], focal: 14, time: 'day' },
  s4: { title: 'S4 · C0 Cyclone Close-up', pos: [10.13, 3.5, 1.6], target: [10.13, 7.35, 3.4], focal: 35, time: 'day' },
  s5: { title: 'S5 · West Palms Co-Working', pos: [-1.3, 10.2, 6.6], target: [-3.5, 14.0, 0.8], focal: 20, time: 'morning' },
  s6: { title: 'S6 · Rear Wellness & Pool', pos: [14.0, 39.0, 1.7], target: [14.0, 28.0, 4.2], focal: 14, time: 'golden' },
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
  rear_wide: { title: 'Rear · pool & wellness façade', pos: [11.0, 52.0, 4.0], target: [11.0, 28.0, 5.0], focal: 22, time: 'golden' },
  rear_ne: { title: 'Rear · north-east oblique', pos: [38.0, 50.0, 11.0], target: [10.0, 26.0, 4.0], focal: 24, time: 'golden' },
  rear_nw: { title: 'Rear · north-west oblique', pos: [-16.0, 46.0, 8.0], target: [8.0, 27.0, 4.0], focal: 24, time: 'golden' },
  // REV D.8 additions: access from L2, rear and side details
  catwalk_stair: { title: 'East · L2 door, landing and 6-riser stair up to the +4.50 catwalk', pos: [29.5, 19.0, 6.5], target: [22.9, 24.0, 3.8], focal: 26, time: 'golden' },
  catwalk_door_int: { title: 'East · inside the L2 gallery looking at the catwalk door', pos: [15.0, 24.55, 4.9], target: [22.3, 24.7, 4.9], focal: 24, time: 'day' },
  east_elev: { title: 'Right (east) elevation (ortho)', pos: [80.0, 12.0, 5.0], target: [0.0, 12.0, 5.0], focal: 24, time: 'golden', ortho: 12.5, hide: ['fences', 'trees'] },
  east_climb: { title: 'East · climbing wall, crash pit, top-out gate', pos: [33.0, 28.5, 3.2], target: [23.3, 27.2, 5.2], focal: 20, time: 'golden' },
  rear_gf: { title: 'Rear · clinic door, canopy and pool', pos: [16.5, 40.0, 1.7], target: [16.5, 30.0, 2.2], focal: 22, time: 'golden' },
  rear_pool: { title: 'Rear · pool steps, plant room, shower', pos: [26.0, 38.0, 1.6], target: [15.0, 32.5, 0.4], focal: 20, time: 'golden' },
  rear_roof: { title: 'Rear · fins, eyebrow shade, exhaust risers, roof plant screen', pos: [26.0, 44.0, 14.5], target: [10.0, 28.0, 8.5], focal: 28, time: 'golden' },
  left_nw: { title: 'Left · north-west corner: fire-stair / lift core, palm P1', pos: [-13.0, 38.0, 4.5], target: [-3.5, 27.0, 4.5], focal: 22, time: 'golden' },
  left_top: { title: 'Left · aerial over the west wing (PV, pergola, jali)', pos: [-16.0, -2.0, 19.0], target: [-2.0, 12.0, 3.0], focal: 28, time: 'golden' },
  // REV D.9: west wing + coconut garden in detail
  ww_G: { title: 'West wing · ground floor cut-away, south half (studio, stair hall)', pos: [7.0, -14.0, 14.0], target: [-2.4, 3.0, 0.0], focal: 28, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_L2: { title: 'West wing · upper floor cut-away, south half (Creative Suite)', pos: [7.0, -14.0, 15.0], target: [-2.4, 3.0, 3.5], focal: 28, time: 'day', hide: ['vegetation', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_G_south: { title: 'West wing · studio + stair hall plan (ground, top view)', pos: [-2.4, -3.0, 21.0], target: [-2.4, 2.0, 0.0], focal: 30, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_G_north: { title: 'West wing · garden, pods and core (ground, top view)', pos: [-2.4, 12.0, 24.0], target: [-2.4, 21.0, 0.0], focal: 30, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'front_facade', 'entrance_court', 'fences', 'trees'] },
  ww_L2_north: { title: 'West wing · upper floor north (gallery walkway, L3 pod, L4 staff)', pos: [7.0, 5.0, 15.0], target: [-2.4, 20.0, 3.5], focal: 28, time: 'day', hide: ['vegetation', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'fences', 'trees'] },
  ww_G_north_ob: { title: 'West wing · ground floor cut-away, north half (garden, pods, core)', pos: [7.0, 5.0, 14.0], target: [-2.4, 20.0, 0.0], focal: 28, time: 'day', hide: ['vegetation', 'ww_L2', 'ww_roof', 'hall_roof', 'hall_shell', 'hall_interior', 'cyclones', 'fences', 'trees'] },
  studio_in: { title: 'G1 Creative Studio · from the street door towards the cyclorama', pos: [-2.6, -8.4, 1.5], target: [-2.4, 3.5, 1.3], focal: 18, time: 'day', hide: ['ww_L2'] },
  studio_cyc: { title: 'G1 Creative Studio · cyclorama end, lights and cameras', pos: [-2.4, -1.5, 1.6], target: [-2.4, 4.5, 1.2], focal: 20, time: 'day', hide: ['ww_L2'] },
  stair_hall: { title: 'G2 Grand U-stair · from D3 (hall door)', pos: [-1.6, 5.4, 1.6], target: [-3.0, 8.5, 2.2], focal: 16, time: 'day', hide: ['ww_roof'] },
  stair_up: { title: 'G2 Grand U-stair · looking up the flights', pos: [-3.0, 6.1, 0.9], target: [-2.4, 8.8, 3.6], focal: 16, time: 'day', hide: ['ww_roof'] },
  suite_in: { title: 'L1 Creative Suite · VIP lounge', pos: [-2.4, 4.5, 5.3], target: [-2.4, -6.0, 4.6], focal: 16, time: 'day', hide: ['ww_roof'] },
  garden_eye: { title: 'G3 Coconut co-working garden · ground level', pos: [-1.5, 10.5, 1.6], target: [-3.2, 17.5, 2.6], focal: 16, time: 'morning' },
  garden_palm: { title: 'G3 · palm P2 / P3, teak benches, jali, bar ledge', pos: [-1.5, 17.2, 1.5], target: [-3.5, 12.5, 2.6], focal: 18, time: 'morning' },
  garden_top: { title: 'G3 · garden from above (pergola slats removed)', pos: [-2.2, 9.5, 11.0], target: [-2.4, 17.0, 0.0], focal: 24, time: 'morning', hide: ['ww_roof', 'hall_roof', 'hall_shell', 'hall_interior'] },
  walkway_l2: { title: 'L2 gallery walkway · guard net and canopy, palms beyond', pos: [-1.2, 10.4, 5.1], target: [-3.0, 19.0, 4.8], focal: 16, time: 'morning' },
  pods: { title: 'Focus pods G4 / L3 and the north end of the garden', pos: [-2.0, 14.0, 1.6], target: [-2.6, 21.5, 2.4], focal: 18, time: 'day' },
  core_in: { title: 'G5 MDB + pump room, fire stair, lift lobby', pos: [-3.0, 22.5, 1.6], target: [-2.6, 26.5, 1.5], focal: 16, time: 'day' },
  palm_crown: { title: 'Palms P2 / P3 crowns above the pergola', pos: [-12.0, 22.0, 10.0], target: [-3.5, 14.0, 10.5], focal: 24, time: 'morning', hide: ['fences', 'trees'] },
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
