// COLLADA (.dae) exporter tuned for SketchUp import.
//  • Z-up, metres (unit meter="1"), one <node> group per model layer, one child node per material
//  • vertex-welded geometry, coplanar triangle pairs re-joined into quads (clean SketchUp faces, no diagonal edges)
//  • vertex-colour meshes (terracotta tiles) split into flat-colour materials; canvas textures written as PNG
import * as THREE from 'three';
import { M } from './model.js';

const MAT_NAMES = new Map(Object.entries(M).filter(([, v]) => v && v.isMaterial).map(([k, v]) => [v, k]));
const f4 = (v) => { const s = v.toFixed(4); return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''); };
const esc = (s) => String(s).replace(/[^A-Za-z0-9_\-.]/g, '_');
const hex = (c) => c.getHex(THREE.SRGBColorSpace);
const rgb = (c) => [((hex(c) >> 16) & 255) / 255, ((hex(c) >> 8) & 255) / 255, (hex(c) & 255) / 255];

export function exportDAE(root, opts = {}) {
  root.updateMatrixWorld(true);
  const matDefs = new Map(); // key -> def
  const images = new Map(); // uuid -> {id,file,url}
  const geoXml = [], nodeXml = [];
  let nGeo = 0, tris = 0, quads = 0, verts = 0;
  const v3 = new THREE.Vector3(), n3 = new THREE.Vector3();

  const matDef = (mat, colorOverride) => {
    const baseName = MAT_NAMES.get(mat) || `mat_${hex(mat.color || new THREE.Color(0x888888)).toString(16)}`;
    const c = colorOverride || mat.color || new THREE.Color(0x888888);
    const key = `${baseName}|${mat.map ? mat.map.uuid : ''}|${colorOverride ? hex(colorOverride) : ''}|${mat.opacity}|${mat.transparent}|${mat.side}`;
    if (matDefs.has(key)) return matDefs.get(key);
    const id = `m${matDefs.size}_${esc(baseName)}${colorOverride ? '_' + hex(colorOverride).toString(16) : ''}`;
    let img = null;
    if (mat.map && mat.map.image && mat.map.image.toDataURL) {
      if (!images.has(mat.map.uuid)) images.set(mat.map.uuid, { id: `img${images.size}`, file: `textures/${esc(baseName)}_${images.size}.png`, url: mat.map.image.toDataURL('image/png') });
      img = images.get(mat.map.uuid);
    }
    const def = { id, name: baseName, color: rgb(c), opacity: mat.transparent ? mat.opacity : 1, cutout: !!mat.alphaTest, img, roughness: mat.roughness ?? 0.8, metal: mat.metalness ?? 0, emissive: mat.emissive && mat.emissiveIntensity > 0.05 ? rgb(mat.emissive).map((v) => v * Math.min(1, mat.emissiveIntensity * 0.5)) : null, uvScale: 1 };
    matDefs.set(key, def);
    return def;
  };

  const layerNodes = [];
  for (const layer of root.children) {
    if (layer.name.startsWith('x_')) continue; // helper layers (wind arrows)
    const kids = [];
    layer.traverse((o) => {
      if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
      const g = o.geometry, pos = g.attributes.position, uv = g.attributes.uv, col = g.attributes.color;
      const idx = g.index ? g.index.array : null, count = idx ? idx.length : pos.count;
      const useCol = o.material.vertexColors && col;
      const buckets = new Map();
      const m = o.matrixWorld;
      const get = (i, out) => { // world → spec axes (Z up): (x, y, z)_three → (x, -z, y)
        v3.fromBufferAttribute(pos, i).applyMatrix4(m);
        out.x = v3.x; out.y = -v3.z; out.z = v3.y;
        return out;
      };
      for (let t = 0; t < count; t += 3) {
        const ids = idx ? [idx[t], idx[t + 1], idx[t + 2]] : [t, t + 1, t + 2];
        let colorOverride = null, bk = '';
        if (useCol) {
          const c = new THREE.Color(col.getX(ids[0]), col.getY(ids[0]), col.getZ(ids[0]));
          const q = (v) => Math.round(v * 12) / 12;
          colorOverride = new THREE.Color(q(c.r), q(c.g), q(c.b)); bk = String(hex(colorOverride));
        }
        if (!buckets.has(bk)) buckets.set(bk, { colorOverride, tri: [] });
        buckets.get(bk).tri.push(ids);
      }
      for (const [bk, b] of buckets) {
        const def = matDef(o.material, b.colorOverride);
        const textured = !!(def.img && uv);
        const map = new Map(), P = [], UV = [], T = [];
        const P3 = (i) => { const o3 = { x: 0, y: 0, z: 0 }; get(i, o3); return o3; };
        for (const ids of b.tri) {
          const tri = ids.map((i) => {
            const p = P3(i);
            const u = textured ? [uv.getX(i), uv.getY(i)] : null;
            const key = `${Math.round(p.x * 1e4)},${Math.round(p.y * 1e4)},${Math.round(p.z * 1e4)}${u ? ',' + Math.round(u[0] * 1e4) + ',' + Math.round(u[1] * 1e4) : ''}`;
            let id = map.get(key);
            if (id === undefined) { id = P.length; map.set(key, id); P.push(p); if (u) UV.push(u); }
            return id;
          });
          if (tri[0] === tri[1] || tri[1] === tri[2] || tri[0] === tri[2]) continue;
          T.push(tri);
        }
        if (!T.length) continue;
        // re-join consecutive coplanar triangle pairs into quads
        const faces = [];
        const nrm = (t) => { const a = P[t[0]], bb = P[t[1]], c = P[t[2]]; n3.set((bb.y - a.y) * (c.z - a.z) - (bb.z - a.z) * (c.y - a.y), (bb.z - a.z) * (c.x - a.x) - (bb.x - a.x) * (c.z - a.z), (bb.x - a.x) * (c.y - a.y) - (bb.y - a.y) * (c.x - a.x)); const l = n3.length() || 1; return [n3.x / l, n3.y / l, n3.z / l]; };
        for (let i = 0; i < T.length; i++) {
          const t1 = T[i], t2 = T[i + 1];
          if (t2) {
            const sh = t1.filter((v) => t2.includes(v));
            if (sh.length === 2) {
              const n1 = nrm(t1), n2 = nrm(t2);
              if (n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2] > 0.99999) {
                const ui = t1.findIndex((v) => !sh.includes(v)), u = t1[ui], s1 = t1[(ui + 1) % 3], s2 = t1[(ui + 2) % 3];
                const v = t2.find((x) => !sh.includes(x));
                // convex check: u and v on opposite sides of s1-s2 (given) and s1, s2 on opposite sides of u-v
                const cr = (a, bb, c) => { const A = P[a], B = P[bb], C = P[c]; const dx = B.x - A.x, dy = B.y - A.y, dz = B.z - A.z, ex = C.x - A.x, ey = C.y - A.y, ez = C.z - A.z; return (dy * ez - dz * ey) * n1[0] + (dz * ex - dx * ez) * n1[1] + (dx * ey - dy * ex) * n1[2]; };
                if (cr(u, v, s1) * cr(u, v, s2) < 0) { faces.push([u, s1, v, s2]); i++; quads++; continue; }
              }
            }
          }
          faces.push(t1); tris++;
        }
        const gid = `geo${nGeo++}`;
        const posArr = P.map((p) => `${f4(p.x)} ${f4(p.y)} ${f4(p.z)}`).join(' ');
        verts += P.length;
        let x = `<geometry id="${gid}" name="${esc(o.name || def.name)}"><mesh><source id="${gid}-pos"><float_array id="${gid}-pos-a" count="${P.length * 3}">${posArr}</float_array><technique_common><accessor source="#${gid}-pos-a" count="${P.length}" stride="3"><param name="X" type="float"/><param name="Y" type="float"/><param name="Z" type="float"/></accessor></technique_common></source>`;
        if (textured) x += `<source id="${gid}-uv"><float_array id="${gid}-uv-a" count="${UV.length * 2}">${UV.map((u) => `${f4(u[0])} ${f4(u[1])}`).join(' ')}</float_array><technique_common><accessor source="#${gid}-uv-a" count="${UV.length}" stride="2"><param name="S" type="float"/><param name="T" type="float"/></accessor></technique_common></source>`;
        x += `<vertices id="${gid}-v"><input semantic="POSITION" source="#${gid}-pos"/></vertices>`;
        x += `<polylist material="${def.id}" count="${faces.length}"><input semantic="VERTEX" source="#${gid}-v" offset="0"/>${textured ? `<input semantic="TEXCOORD" source="#${gid}-uv" offset="0" set="0"/>` : ''}<vcount>${faces.map((fc) => fc.length).join(' ')}</vcount><p>${faces.map((fc) => fc.join(' ')).join(' ')}</p></polylist></mesh></geometry>`;
        geoXml.push(x);
        kids.push(`<node id="n_${gid}" name="${esc(layer.name)}__${esc(def.name)}${bk ? '_' + bk : ''}" type="NODE"><instance_geometry url="#${gid}"><bind_material><technique_common><instance_material symbol="${def.id}" target="#${def.id}">${textured ? '<bind_vertex_input semantic="UVMap" input_semantic="TEXCOORD" input_set="0"/>' : ''}</instance_material></technique_common></bind_material></instance_geometry></node>`);
      }
    });
    if (kids.length) layerNodes.push(`<node id="layer_${esc(layer.name)}" name="${esc(layer.name)}" type="NODE">${kids.join('')}</node>`);
  }

  const fx = [], mt = [];
  for (const d of matDefs.values()) {
    const col = d.img ? `<texture texture="${d.img.id}-samp" texcoord="UVMap"/>` : `<color sid="diffuse">${d.color.map(f4).join(' ')} 1</color>`;
    const spec = Math.max(0.05, d.metal * 0.6 + (1 - d.roughness) * 0.25);
    fx.push(`<effect id="${d.id}-fx"><profile_COMMON>${d.img ? `<newparam sid="${d.img.id}-surf"><surface type="2D"><init_from>${d.img.id}</init_from></surface></newparam><newparam sid="${d.img.id}-samp"><sampler2D><source>${d.img.id}-surf</source></sampler2D></newparam>` : ''}<technique sid="common"><phong>${d.emissive ? `<emission><color>${d.emissive.map(f4).join(' ')} 1</color></emission>` : ''}<ambient><color>${d.color.map(f4).join(' ')} 1</color></ambient><diffuse>${col}</diffuse><specular><color>${[spec, spec, spec].map(f4).join(' ')} 1</color></specular><shininess><float>${f4(8 + (1 - d.roughness) * 60)}</float></shininess>${d.cutout && d.img ? `<transparent opaque="A_ONE"><texture texture="${d.img.id}-samp" texcoord="UVMap"/></transparent><transparency><float>1</float></transparency>` : d.opacity < 1 ? `<transparent opaque="A_ONE"><color>1 1 1 1</color></transparent><transparency><float>${f4(d.opacity)}</float></transparency>` : ''}</phong></technique></profile_COMMON></effect>`);
    mt.push(`<material id="${d.id}" name="${esc(d.name)}"><instance_effect url="#${d.id}-fx"/></material>`);
  }
  const imgs = [...images.values()];
  const dae = `<?xml version="1.0" encoding="utf-8"?>
<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
<asset><contributor><authoring_tool>MY PLACE model exporter (three.js)</authoring_tool></contributor><created>${new Date().toISOString()}</created><modified>${new Date().toISOString()}</modified><unit meter="1" name="meter"/><up_axis>Z_UP</up_axis></asset>
<library_images>${imgs.map((i) => `<image id="${i.id}" name="${i.id}"><init_from>${i.file}</init_from></image>`).join('')}</library_images>
<library_effects>${fx.join('')}</library_effects>
<library_materials>${mt.join('')}</library_materials>
<library_geometries>${geoXml.join('')}</library_geometries>
<library_visual_scenes><visual_scene id="Scene" name="${esc(opts.name || 'MyPlace')}">${layerNodes.join('')}</visual_scene></library_visual_scenes>
<scene><instance_visual_scene url="#Scene"/></scene>
</COLLADA>`;
  return { dae, textures: imgs.map((i) => ({ file: i.file, url: i.url })), stats: { geometries: nGeo, materials: matDefs.size, vertices: verts, quads, tris, layers: layerNodes.length } };
}
