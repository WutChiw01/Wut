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
    // ground with holes for the sunk crash pit and the pool
    const shape = new THREE.Shape();
    const gx0 = -70, gx1 = 90, gy0 = -80, gy1 = 80;
    shape.moveTo(gx0, gy0); shape.lineTo(gx1, gy0); shape.lineTo(gx1, gy1); shape.lineTo(gx0, gy1); shape.lineTo(gx0, gy0);
    const hole = (x0, x1, y0, y1) => {
      const h = new THREE.Path();
      h.moveTo(x0, y0); h.lineTo(x0, y1); h.lineTo(x1, y1); h.lineTo(x1, y0); h.lineTo(x0, y0);
      shape.holes.push(h);
    };
    hole(22.85, 25.05, 23.6, 27.9);
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
      b.add(M.charcoal, g);
    };
    fence(-4.4, -12.5, -4.4, 33.45);
    fence(-4.4, 33.45, 38.5, 39.9, 0.5); // slope 3/20 through (0.2,34.1) and (20.2,37.1)
    fence(38.5, 39.9, 38.5, -12.5);
    b.box(-4.4, 38.5, -12.6, -12.4, 0, 0.6, M.hedge);
    // boundary markers (setbacks)
    b.box(-4.45, -4.35, -12.5, 34, 0.0, 0.03, M.holdY);
  }

  // ── Badminton hall shell ───────────────────────────────────────
  {
    const b = layer('hall_shell');
    const t = 0.25;
    // west wall (x=-0.8) – solid to 7.4, louvre band above
    b.box(HALL.x0 - t, HALL.x0, HALL.y0, HALL.y1, 0, 7.4, M.plaster);
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
      new THREE.PlaneGeometry(5.0, 0.94),
      new THREE.MeshStandardMaterial({ map: signTex, transparent: true, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.15, roughness: 0.6 })
    );
    sign.position.set(HALL.ridgeX, 9.35, -(HALL.y0 - 0.31));
    sign.name = 'sign';
    G.hall_shell.group.add(sign);
    // sign backing band
    b.box(8.1, 13.4, HALL.y0 - 0.28, HALL.y0 - 0.25, 8.85, 9.85, M.charcoal);
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

  // ── Front facade: Solar Ribbon + Cyclone C1 / C2 (REV D.6) ──────────
  {
    const b = layer('front_facade');
    const ribZ = (x) => 6.6 - Math.abs(x - HALL.ridgeX) * 0.2275;
    const xa = 4.25, xb = 17.25, y0 = -12.5, y1 = -10.15;
    const lift = 0.0;
    // ribbon sheet (two slopes) + panels
    b.quad(M.charcoal, [xa, y0, ribZ(xa) - 0.12], [HALL.ridgeX, y0, 6.6 - 0.12], [HALL.ridgeX, y1, 6.6 - 0.12], [xa, y1, ribZ(xa) - 0.12]);
    b.quad(M.charcoal, [HALL.ridgeX, y0, 6.6 - 0.12], [xb, y0, ribZ(xb) - 0.12], [xb, y1, ribZ(xb) - 0.12], [HALL.ridgeX, y1, 6.6 - 0.12]);
    for (const [pa, pb] of [[xa, HALL.ridgeX], [HALL.ridgeX, xb]]) {
      b.quad(M.solar, [pa, y0, ribZ(pa) + lift], [pb, y0, ribZ(pb) + lift], [pb, y1, ribZ(pb) + lift], [pa, y1, ribZ(pa) + lift], [5, 1]);
    }
    // frame rails on the ribbon edges
    for (const x of [xa, HALL.ridgeX, xb]) b.box(x - 0.04, x + 0.04, y0, y1, ribZ(x) - 0.14, ribZ(x) + 0.03, M.charcoal);
    b.box(xa, xb, y0 - 0.05, y0 + 0.02, 5.1, 5.25, M.charcoal);
    // ribbon steel hangers to the hall facade
    for (const x of [xa + 0.3, 9.0, 12.5, xb - 0.3]) b.member([x, -10.15, ribZ(x) - 0.14], [x, -10.15, 8.4], 0.035, M.charcoal);

    // twin Cyclone towers (counter-rotating funnels r0 .45 → r1 .72, tiles +3.20 … +8.60, twist 128°)
    const towers = [
      { cx: 7.35, cy: -11.3, twist: rad(128) },
      { cx: 14.15, cy: -11.3, twist: -rad(128) },
    ];
    for (const T of towers) {
      const pt = cyclone(G.front_facade, { cx: T.cx, cy: T.cy, z0: 3.2, z1: 8.6, r0: 0.45, r1: 0.72, twist: T.twist, nRods: 22, nTiles: 18, phase: T.twist > 0 ? 0 : 0.3 });
      const rAt = (h) => 0.45 + (0.72 - 0.45) * ((h - 3.2) / 5.4) + 0.08;
      towerHardware(G.front_facade, { cx: T.cx, cy: T.cy, zTop: 8.95, coreW: 0.25, hoops: [4.9, 6.4, 7.9], rAt });
      // collar ring where the ribbon passes (R = 0.65)
      b.torus(T.cx, T.cy, ribZ(T.cx) - 0.06, 0.65, 0.05, M.charcoal, 48);
      // tie-back bracket to hall gable truss
      b.member([T.cx, T.cy, 8.95], [T.cx, HALL.y0 - 0.25, 8.2], 0.045, M.charcoal);
    }
    // ground-level base plinths (footings)
    for (const T of towers) b.cyl(T.cx, T.cy, -0.02, 0.1, 0.55, 0.55, M.concreteDark, 24);
    // entrance canopy-free threshold: dark stone mat
    b.box(9.3, 12.2, -12.5, -10.4, 0.0, 0.03, M.concreteDark);
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

  // ── West wing REV P6 + palms garden ───────────────────────────────
  {
    const b = layer('west_wing');
    const wx0 = -3.9, wx1 = -0.8;
    // zone 1 – creative studio + VIP lounge (y -9 … 5)
    const block = (y0, y1, label) => {
      b.box(wx0, wx1, y0, y1, -0.05, 0.0, M.concrete);
      b.box(wx0, wx0 + 0.2, y0, y1, 0, Z3, M.plaster);
      b.box(wx0, wx1, y0, y0 + 0.2, 0, Z3, M.plaster);
      b.box(wx0, wx1, y1 - 0.2, y1, 0, Z3, M.plaster);
      b.box(wx0 - 0.1, wx1 + 0.1, y0 - 0.1, y1 + 0.1, Z3, Z3 + 0.3, M.concrete); // roof slab + parapet
      b.box(wx0, wx1, y0, y1, Z2 - 0.15, Z2 + 0.1, M.concrete); // floor L1
    };
    block(-9.0, 5.0, 'zone1');
    // front glass + teak fins on the zone-1 street front (y=-9)
    b.box(wx0 + 0.2, wx1, -9.12, -9.0, 0.2, 3.2, M.glass);
    b.box(wx0 + 0.2, wx1, -9.12, -9.0, Z2 + 0.3, Z3 - 0.4, M.glass);
    for (let x = wx0 + 0.25; x <= wx1; x += 0.3) b.box(x - 0.03, x + 0.03, -9.4, -9.15, 0.1, Z3, M.teak);
    // east-side glazing facing the hall wall is blank; add long clerestory ribbon on the west wall
    b.box(wx0 - 0.02, wx0 + 0.02, -8.0, 4.0, 4.6, 6.2, M.glassFrost);
    // zone 2 – Grand U-stair (y 5 … 10)
    block(5.0, 10.0, 'zone2');
    b.box(wx0 + 0.2, wx1, 6.0, 9.0, Z3, Z3 + 0.4, M.skylight);
    // U-stair flights (visible through the stair-hall skylight; simplified)
    for (let i = 0; i < 10; i++) {
      b.box(wx0 + 0.3, wx0 + 1.55, 5.3 + i * 0.26, 5.3 + (i + 1) * 0.26, 0, 0.175 * (i + 1), M.concreteDark);
      b.box(wx0 + 1.65, wx1 - 0.1, 7.9 - i * 0.26, 7.9 - (i + 1) * 0.26, 0, 3.5 - 0.175 * (i), M.concreteDark);
    }
    // zone 3 – co-working palm garden (y 10 … 22): open, pergola above, jali wall west, L2 gallery walkway east
    // earth bed around palms (r 1.5) + circular teak benches
    // jali (terracotta perforated brick) screens V1–V4, west face x=-3.9
    for (let k = 0; k < 4; k++) {
      const ya = 10.0 + k * 3.0, yb = ya + 2.85;
      for (let y = ya; y < yb; y += 0.19) for (let z = 0.0; z < 6.9; z += 0.19) {
        const ix = Math.round((y - ya) / 0.19), iz = Math.round(z / 0.19);
        if ((ix + iz) % 2 === 0 && z > 0.4 && z < 6.4 && ix % 5 !== 0) continue; // checker perforation
        b.box(wx0, wx0 + 0.18, y, y + 0.17, z, z + 0.17, k % 2 ? M.brick : M.terracotta);
      }
    }
    b.box(wx0, wx0 + 0.2, 10.0, 22.0, 6.9, 7.0, M.concrete);
    // L2 gallery walkway (x -2.6 … -0.8) with safety balustrade + overhead canopy slats
    b.box(-2.6, wx1, 10.0, 22.0, Z2 - 0.18, Z2 + 0.02, M.concrete);
    b.box(-2.62, -2.58, 10.0, 22.0, Z2, Z2 + 1.1, M.glass);
    b.box(-2.65, -2.55, 10.0, 22.0, Z2 + 1.05, Z2 + 1.1, M.charcoal);
    // slatted pergola roof (z=7.0) and net frame
    for (let y = 10.0; y <= 22.0; y += 0.45) b.box(wx0, wx1, y - 0.06, y + 0.06, 6.95, 7.05, M.teak);
    for (const x of [wx0 + 0.1, -2.6, wx1 - 0.1]) b.box(x - 0.06, x + 0.06, 10.0, 22.0, 6.85, 6.95, M.charcoal);
    for (let y = 10.0; y <= 22.0; y += 3.0) for (const x of [-2.55, -0.85]) b.box(x - 0.07, x + 0.07, y - 0.07, y + 0.07, 0, 6.9, M.charcoal);
    // circular teak benches + earth around P2 / P3
    for (const [px, py] of [[-3.67, 15.46], [-3.24, 12.08]]) {
      b.cyl(px, py, 0, 0.05, 1.5, 1.5, M.earth, 36);
      const n = 14;
      for (let k = 0; k < n; k++) {
        if (k === 4 || k === 5) continue;
        const a = (k / n) * TAU;
        const g = new THREE.BoxGeometry(0.9, 0.06, 0.38);
        g.rotateY(a + Math.PI / 2);
        g.translate(px + Math.cos(a) * 1.35, 0.45, -(py + Math.sin(a) * 1.35));
        b.add(M.teakLight, g);
        const l = new THREE.BoxGeometry(0.08, 0.45, 0.08);
        l.translate(px + Math.cos(a) * 1.35, 0.22, -(py + Math.sin(a) * 1.35));
        b.add(M.charcoal, l);
      }
    }
    // co-working tables on the garden floor
    b.box(-3.5, -2.9, 17.0, 17.9, 0.7, 0.75, M.teakLight);
    b.box(-3.5, -2.9, 18.5, 19.4, 0.7, 0.75, M.teakLight);
    b.box(-3.5, -2.9, 20.0, 20.9, 0.7, 0.75, M.teakLight);
    // garden floor
    b.box(wx0, wx1, 10.0, 22.0, -0.04, 0.0, M.paving);
    // focus pods G4/L3 (y 18 … 22 north end)
    // zone 4 – north core, lift & fire stair (y 22 … 30.1)
    b.box(-2.9, -1.8, 22.0, 25.4, 0, ZR, M.plaster);
    b.box(wx0, -1.8, 25.4, 30.1, 0, ZR, M.plaster);
    b.box(wx0 - 0.1, -1.7, 22.0, 30.2, ZR, ZR + 0.3, M.concrete);
    b.box(-3.6, -1.8, 28.05, 30.1, 0, ZR + 1.2, M.concreteDark); // MRL lift shaft overrun
    b.box(-3.55, -3.2, 25.4, 25.5, 0.2, 2.4, M.glassFrost);
    // corner fire stair slits
    for (let z = 0.8; z < ZR - 1; z += 3.5) b.box(wx0 - 0.02, wx0 + 0.02, 25.8, 27.2, z, z + 1.3, M.glassFrost);
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
    c.box(22.1, 22.3, 24.1, 30.1, Z2, Z3 - 0.3, M.plaster);
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
    for (let k = 0; k < 6; k++) RFr.quad(M.solar, [4.6 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 25.0, ZR + 0.25], [6.5 + k * 2.1, 29.5, ZR + 0.25], [4.6 + k * 2.1, 29.5, ZR + 0.25], [1, 2]);
  }

  // ── Outdoor: pool + deck, climbing wall + sunk crash pit, pickleball, senior garden ──
  {
    const b = layer('outdoor');
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

    // Outdoor climbing wall: free-standing steel tower 3.30 m wide × 10.50 m tall, x 22.55…22.85, y 24.3…27.6
    const cy0 = 24.3, cy1 = 27.6;
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
    // crash pit: floor −0.60, mat top −0.30, RC walls 150 mm, concrete bench rim +0.45 on N, S, E
    b.box(22.85, 25.05, 23.6, 27.9, -0.6, -0.55, M.concrete);
    b.box(22.85, 25.05, 23.6, 27.9, -0.55, -0.3, M.matFoam);
    b.box(23.0, 24.9, 23.75, 27.75, -0.3, -0.28, M.mat);
    for (const [x0, x1, y0, y1] of [[22.85, 25.05, 23.45, 23.6], [22.85, 25.05, 27.9, 28.05], [25.05, 25.2, 23.6, 27.9], [22.7, 22.85, 23.6, 27.9]]) b.box(x0, x1, y0, y1, -0.6, 0.0, M.concrete);
    // benches (0.45 high, 0.45 wide) with a 1.20 m stair gap at the SE corner
    b.box(22.85, 25.5, 28.05, 28.5, 0, 0.45, M.concrete); // south side
    b.box(22.85, 25.5, 23.15, 23.6, 0, 0.45, M.concrete); // north side
    b.box(25.2, 25.65, 23.15, 26.7, 0, 0.45, M.concrete); // east side (stops short = 1.20 m stair gap)
    b.box(25.2, 25.65, 26.7, 27.9, -0.3, 0.0, M.concreteDark);
    // sump (0.6 × 0.6) + cover
    b.box(23.7, 24.3, 25.4, 26.0, -0.6, -0.55, M.charcoal);

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
    const palm = (px, py, h, lean, tilt) => {
      const pts = [];
      const n = 12;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push([px + Math.cos(lean) * tilt * t * t, py + Math.sin(lean) * tilt * t * t, h * t]);
      }
      for (let i = 0; i < n; i++) b.member(pts[i], pts[i + 1], 0.22 - 0.09 * (i / n), M.trunk, 10);
      const top = pts[n];
      // crown: fronds
      const frondGeo = (len, droop) => {
        const seg = 8, pos = [], uv = [], idx = [];
        for (let i = 0; i <= seg; i++) {
          const t = i / seg, w = 1.3 * Math.sin(Math.PI * Math.min(1, t * 1.05 + 0.08));
          const x = len * t, y = -droop * t * t;
          pos.push(-w / 2 * 0 + x, y, -w / 2, x, y, w / 2);
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
      for (let k = 0; k < 14; k++) {
        const g = frondGeo(4.2 + (k % 3) * 0.4, 1.2 + (k % 4) * 0.5);
        g.rotateX(Math.PI / 2 * 0);
        g.rotateY(-(k / 14) * TAU + k * 0.4);
        g.rotateZ(((k % 2) * 0.35 + 0.15));
        g.translate(top[0], top[2], -top[1]);
        b.add(M.leaf, g);
      }
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU;
        b.cyl(top[0] + Math.cos(a) * 0.25, top[1] + Math.sin(a) * 0.25, top[2] - 0.45, top[2] - 0.05, 0.14, 0.12, M.brick, 8);
      }
    };
    palm(-4.0, 23.8, 12.5, rad(160), 1.2);
    palm(-3.67, 15.46, 11.8, rad(200), 1.6);
    palm(-3.24, 12.08, 10.8, rad(100), 1.0);

    const tree = (x, y, s = 1) => {
      b.cyl(x, y, 0, 2.2 * s, 0.18 * s, 0.12 * s, M.trunk, 8);
      for (const [dx, dy, dz, r] of [[0, 0, 3.4, 1.7], [0.9, 0.5, 2.7, 1.2], [-0.8, -0.4, 2.9, 1.3]]) {
        const g = new THREE.IcosahedronGeometry(r * s, 1);
        g.translate(x + dx * s, dz * s, -(y + dy * s));
        b.add(M.treeCrown, g);
      }
    };
    for (const [x, y, s] of [[-8, -21, 0.8], [3, -23.2, 0.7], [27, -23.3, 0.7], [36, -23.3, 0.7], [-9, 8, 0.9], [-9, 26, 0.8], [-8, -5, 0.8], [-18, 12, 1.0], [-18, 30, 0.9], [40, 6, 1.0], [41, 24, 0.9], [34, 36, 0.8], [27, 34, 0.7]]) tree(x, y, s);
    for (const x of [-3, 0.5, 4, 17, 20.5, 24]) b.box(x, x + 1.4, -13.9, -12.8, 0, 0.5, M.hedge);
  }

  // ── flush layers into the scene ────────────────────────────────────
  const order = ['site', 'hall_shell', 'hall_roof', 'hall_interior', 'cyclones', 'front_facade', 'west_wing', 'rear_structure', 'rear_GF', 'rear_L2', 'rear_L3', 'rear_roof', 'outdoor', 'vegetation'];
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
