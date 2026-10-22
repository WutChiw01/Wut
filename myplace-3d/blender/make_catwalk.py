"""MY PLACE — elevated service walkway (+4.50) between the badminton hall and the pickleball courts, as a Blender scene.
Run:  python make_catwalk.py [out_dir]     (needs the `bpy` module:  pip install bpy)
Spec axes = Blender axes (x east, y north, z up, metres). Writes MyPlace_Catwalk.blend + preview renders."""
import math, sys, os
import bpy, bmesh
from mathutils import Matrix, Vector

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(OUT, 'renders'), exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

# ── materials ──────────────────────────────────────────────────────────────
def mat(name, color, rough=0.5, metal=0.0, alpha=1.0, trans=0.0, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if trans: b.inputs['Transmission Weight'].default_value = trans; b.inputs['IOR'].default_value = 1.45
    if emit: b.inputs['Emission Color'].default_value = (*color, 1); b.inputs['Emission Strength'].default_value = emit
    return m
def srgb(h): return tuple(((h >> s) & 255) / 255 for s in (16, 8, 0))
def lin(c): return tuple(v ** 2.2 for v in c)
MT = {k: mat(k, lin(srgb(c)), r, m, trans=t, emit=e) for k, (c, r, m, t, e) in {
    'concrete': (0xb9bcbf, .9, 0, 0, 0), 'concrete_dark': (0x8e9296, .9, 0, 0, 0), 'plaster': (0xece8df, .9, 0, 0, 0),
    'charcoal': (0x1e293b, .45, .4, 0, 0), 'galv': (0xa9b0b8, .35, .85, 0, 0), 'alu': (0xd5dade, .3, .9, 0, 0),
    'glass': (0xcfe6ee, .03, 0, .95, 0), 'grass': (0x6f8f55, 1, 0, 0, 0), 'paving': (0xc9c2b4, .9, 0, 0, 0),
    'court_green': (0x15803d, .65, 0, 0, 0), 'court_blue': (0x2e6aa8, .75, 0, 0, 0), 'court_out': (0x2f7d4f, .8, 0, 0, 0),
    'line': (0xf8fafc, .5, 0, 0, 0), 'led': (0xfff4de, .4, 0, 0, 6), 'hall_floor': (0xa7aaad, .8, 0, 0, 0),
    'mat': (0x1e3a8a, .95, 0, 0, 0), 'net': (0x111111, 1, 0, 0, 0), 'teak': (0xb07a3c, .6, 0, 0, 0),
    'roof': (0xcfd3d6, .5, .35, 0, 0), 'safety': (0xfacc15, .6, 0, 0, 0)}.items()}

# ── batch builder: one mesh object per (collection, material, smooth) ─────────
COLL = {}
def coll(name):
    if name not in COLL:
        COLL[name] = bpy.data.collections.new(name); sc.collection.children.link(COLL[name])
    return COLL[name]
class Batch:
    def __init__(s, cname): s.c = cname; s.bm = {}
    def _b(s, m, smooth):
        k = (m, smooth)
        if k not in s.bm: s.bm[k] = bmesh.new()
        return s.bm[k]
    def box(s, x0, x1, y0, y1, z0, z1, m, rotz=0.0):
        mt = Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)) @ Matrix.Rotation(rotz, 4, 'Z') @ Matrix.Diagonal((abs(x1 - x0), abs(y1 - y0), abs(z1 - z0), 1))
        bmesh.ops.create_cube(s._b(m, False), size=1.0, matrix=mt)
    def tube(s, p0, p1, r, m, seg=12):
        a, b = Vector(p0), Vector(p1); d = b - a
        mt = Matrix.Translation((a + b) / 2) @ d.to_track_quat('Z', 'Y').to_matrix().to_4x4()
        bmesh.ops.create_cone(s._b(m, True), cap_ends=True, segments=seg, radius1=r, radius2=r, depth=d.length, matrix=mt)
    def poly(s, pts, m):  # closed polygon in 3D → single face
        bm = s._b(m, False); bm.faces.new([bm.verts.new(p) for p in pts])
    def flush(s):
        for (m, smooth), bm in s.bm.items():
            me = bpy.data.meshes.new(f'{s.c}_{m.name}'); bm.to_mesh(me); bm.free()
            for p in me.polygons: p.use_smooth = smooth
            me.materials.append(m); o = bpy.data.objects.new(f'{s.c}_{m.name}', me); coll(s.c).objects.link(o)
        s.bm.clear()

# ── context: hall east side ─────────────────────────────────────────────────────
HY0, HY1, XE, EAVE = -10.15, 24.1, 22.3, 8.6
site = Batch('Site'); hall = Batch('Hall_east_side'); court = Batch('Pickleball_courts')
site.box(-60, 130, -90, 110, -0.3, -0.02, MT['grass'])
site.box(XE, 24.2, HY0, HY1, -0.02, 0.0, MT['paving']); site.box(8, XE, -13, 25.1, -0.1, 0.0, MT['hall_floor'])
# existing portal columns on the east wall line (the catwalk outriggers bolt to them)
COLS = [-8.0, -3.0, 2.0, 12.5, 17.5, 22.0]
for y in COLS: hall.box(XE - 0.3, XE, y - 0.15, y + 0.15, 0, EAVE, MT['concrete_dark'])
# sliding glass wall + mullions every 2.5 m
y = HY0
while y <= HY1 + 0.01: hall.box(XE - 0.05, XE + 0.05, y - 0.04, y + 0.04, 0, 7.4, MT['charcoal']); y += 2.5
hall.box(XE - 0.05, XE + 0.05, HY0, HY1, 0, 0.1, MT['charcoal']); hall.box(XE - 0.05, XE + 0.05, HY0, HY1, 7.3, 7.4, MT['charcoal'])
hall.box(XE - 0.02, XE + 0.02, HY0, HY1, 0.1, 7.3, MT['glass'])
z = 7.45
while z < 8.6: hall.box(XE - 0.08, XE + 0.08, HY0, HY1, z, z + 0.03, MT['charcoal']); z += 0.16  # louvre band above the glass
# front gable wall (south) and rear complex east wall (north) frame the stretch
hall.box(14, XE + 0.25, HY0 - 0.25, HY0, 0, EAVE, MT['plaster']); hall.box(22.0, 22.3, 24.1, 30.1, 0, 10.5, MT['plaster'])
# roof edge: slab following the 0.2275 slope with 0.5 m overhang + gutter
slope = 0.2275; zr = lambda x: 11.25 - abs(x - 10.75) * slope
for y0, y1 in [(HY0 - 0.5, HY1)]:
    pts = [(14, y0, zr(14) - .15), (XE + .5, y0, zr(XE + .5) - .15), (XE + .5, y0, zr(XE + .5)), (14, y0, zr(14))]
    hall.poly(pts, MT['roof'])
hall.box(XE, XE + 0.5, HY0 - 0.5, HY1, zr(XE + .25) - .15, zr(XE + .25), MT['roof'])
hall.box(XE + .45, XE + .6, HY0 - 0.5, HY1, zr(XE + .5) - .3, zr(XE + .5) + .08, MT['alu'])
# a court of the hall for scale (B3 / B6 east courts, 40 mm lines)
def badminton(x0, y0):
    court.box(x0, x0 + 6.1, y0, y0 + 13.4, 0.0, 0.012, MT['court_green'])
    for (a, b_, c, d) in [(0, 6.1, 0, .04), (0, 6.1, 13.36, 13.4), (0, .04, 0, 13.4), (6.06, 6.1, 0, 13.4), (.46, .5, 0, 13.4), (5.6, 5.64, 0, 13.4), (0, 6.1, .76, .8), (0, 6.1, 12.6, 12.64), (0, 6.1, 4.72, 4.76), (0, 6.1, 8.64, 8.68), (3.03, 3.07, 0, 4.76), (3.03, 3.07, 8.64, 13.4)]:
        court.box(x0 + a, x0 + b_, y0 + c, y0 + d, .012, .016, MT['line'])
badminton(13.9, -8.4); badminton(13.9, 9.7)

# ── pickleball courts PB1 / PB2 (outside, east of the catwalk) ──────────────────
for y0 in (-8.0, 6.4):
    court.box(24.5, 31.1, y0 - 1.0, y0 + 14.4, 0, 0.015, MT['court_out'])
    cx = 25.0; court.box(cx, cx + 6.1, y0, y0 + 13.4, .015, .03, MT['court_blue'])
    nl = y0 + 6.7
    for (a, b_, c, d) in [(0, 6.1, 0, .05), (0, 6.1, 13.35, 13.4), (0, .05, 0, 13.4), (6.05, 6.1, 0, 13.4), (0, 6.1, 6.7 - 2.13, 6.7 - 2.08), (0, 6.1, 6.7 + 2.08, 6.7 + 2.13), (3.0, 3.05, 0, 6.7 - 2.13), (3.0, 3.05, 6.7 + 2.13, 13.4)]:
        court.box(cx + a, cx + b_, y0 + c, y0 + d, .03, .034, MT['line'])
    for px in (cx - 0.3, cx + 6.4): court.tube((px, nl, 0), (px, nl, 0.95), 0.03, MT['charcoal'], 8)
    court.box(cx - 0.3, cx + 6.4, nl - .01, nl + .01, .5, .91, MT['net']); court.box(cx - 0.3, cx + 6.4, nl - .015, nl + .015, .9, .94, MT['line'])
    for lx, ly in [(24.7, y0 - .8), (30.9, y0 - .8), (24.7, y0 + 14.2), (30.9, y0 + 14.2)]:  # 6 m LED mast
        court.tube((lx, ly, 0), (lx, ly, 6.0), 0.06, MT['charcoal'], 10); court.box(lx - .25, lx + .25, ly - .1, ly + .1, 5.9, 6.0, MT['led'])

# ── THE ELEVATED WALKWAY ────────────────────────────────────────────────────────
cw = Batch('Catwalk'); rail = Batch('Catwalk_handrails'); lv = Batch('Louvre_frames')
DZ = 4.5; DX0 = XE + 0.2; DX1 = DX0 + 1.2; YS, YN = -9.2, 21.85
# deck: steel plate + welded-bar grating + two stringers + edge channels
cw.box(DX0, DX1, YS, YN, DZ - .07, DZ - .05, MT['galv'])
y = YS + 0.05
while y < YN: cw.box(DX0, DX1, y, y + .025, DZ - .05, DZ, MT['galv']); y += 0.1
for x in (DX0 + .05, DX1 - .05): cw.box(x - .06, x + .06, YS, YN, DZ - .3, DZ - .07, MT['charcoal'])
for x in (DX0, DX1 - .03): cw.box(x, x + .03, YS, YN, DZ - .05, DZ + .12, MT['charcoal'])  # kick plates
# outriggers (through the glass line) + knee braces + base plates on the existing columns; tie rods on the long 10.5 m bay
for y in [c for c in COLS if YS < c < YN + .3]:
    cw.box(XE - .3, DX1 + .05, y - .075, y + .075, DZ - .34, DZ - .07, MT['charcoal'])
    for dy in (-.1, .1):
        cw.tube((DX1 - .1, y + dy, DZ - .3), (XE - .15, y + dy, DZ - 2.5), .045, MT['charcoal'], 10)
    cw.box(XE - .35, XE - .05, y - .2, y + .2, DZ - 2.65, DZ - 2.45, MT['galv'])
    for bx in (XE - .3, XE - .1):
        for by in (y - .12, y + .12): cw.tube((bx, by, DZ - 2.45), (bx, by, DZ - 2.38), .018, MT['galv'], 6)
for y in (5.5, 9.0): cw.tube((DX1 - .05, y, DZ - .05), (XE + .5, y, EAVE + .05), .022, MT['galv'], 8)
# handrail: Ø42 top rail at 1.10 m, Ø25 mid rail, Ø32 posts every 2 m (outer edge only; the wall side is the louvre line)
rail.tube((DX1 - .02, YS, DZ + 1.1), (DX1 - .02, YN, DZ + 1.1), .021, MT['galv']); rail.tube((DX1 - .02, YS, DZ + .55), (DX1 - .02, YN, DZ + .55), .0125, MT['galv'])
y = YS
while y <= YN + .01: rail.tube((DX1 - .02, y, DZ), (DX1 - .02, y, DZ + 1.1), .016, MT['galv'], 10); y += 2.0
for y in (YS, YN): rail.tube((DX0 + .02, y, DZ + 1.1), (DX1 - .02, y, DZ + 1.1), .021, MT['galv'])
# L2 landing (+3.50) with 6-riser steel stair up to the deck, glazed door in the rear-complex wall
LZ, ly0, ly1 = 3.5, 23.4, 25.25
cw.box(XE, DX1, ly0, ly1, LZ, LZ + .06, MT['galv'])
for x in (XE + .15, DX1 - .08): cw.box(x - .06, x + .06, ly0, ly1, LZ - .28, LZ, MT['charcoal'])
for px, py, pz in [(DX1 - .1, 23.45, 0), (DX1 - .1, 24.68, .45), (XE + .2, 23.45, 0)]: cw.tube((px, py, pz), (px, py, LZ - .28), .08, MT['charcoal'], 10)
site.box(22.85, 25.5, 24.45, 24.9, 0, .45, MT['concrete'])  # pit bench carrying the landing post
rise = (DZ - (LZ + .06)) / 6
for i in range(1, 7):
    ya = ly0 - .26 * (i - 1); z = LZ + .06 + rise * i; cw.box(DX0, DX1, ya - .26, ya, z - .05, z, MT['galv']); cw.box(DX0, DX1, ya - .26, ya - .24, z - rise, z, MT['charcoal'])
for x in (DX0 + .05, DX1 - .05): cw.tube((x, ly0, LZ - .2), (x, ly0 - 1.56, DZ - .2), .05, MT['charcoal'], 10)
for x in (DX0 + .01, DX1 - .01): rail.tube((x, ly0, LZ + 1.15), (x, ly0 - 1.56, DZ + 1.1), .021, MT['galv'])
rail.tube((DX1 - .03, ly0, LZ + 1.1), (DX1 - .03, ly1, LZ + 1.1), .021, MT['galv']); rail.tube((XE, ly1, LZ + 1.1), (DX1 - .03, ly1, LZ + 1.1), .021, MT['galv'])
for y in (23.45, 24.3, 25.2): rail.tube((DX1 - .03, y, LZ + .06), (DX1 - .03, y, LZ + 1.1), .016, MT['galv'], 10)
hall.box(XE, XE + .1, 24.1, 25.2, LZ + .06, LZ + 2.15, MT['glass']); hall.box(XE - .02, XE + .12, 24.1, 25.2, LZ + 2.15, LZ + 2.3, MT['charcoal'])
cw.box(XE - .02, XE + .06, 24.3, 25.0, LZ + 2.45, LZ + 2.75, MT['led'])
# south end: removable chain gate + toe-guard sign plate
cw.box(DX0, DX1, YS - .05, YS, DZ, DZ + .02, MT['safety'])
# catwalk LED strip under the top rail, every 2 m a bollard-height lamp
y = YS + 1.0
while y < YN: cw.box(DX1 - .05, DX1 - .02, y - .1, y + .1, DZ + .2, DZ + .24, MT['led']); y += 2.0

# ── wind-block sliding louvre screens (z 4.75–7.25) in front of the glass, 13 panels on two tracks ─────────────
ZB, ZT = 4.75, 7.25; NP = 13; PW = (HY1 - HY0) / NP
lv.box(XE + .02, XE + .1, HY0, HY1, ZT, ZT + .1, MT['charcoal']); lv.box(XE + .02, XE + .1, HY0, HY1, ZB - .1, ZB, MT['charcoal'])  # rails
panels = []
for i in range(NP):
    pb = Batch(f'Louvre_panel_{i + 1:02d}'); xo = XE + .12 + (i % 2) * .09; ya = HY0 + i * PW + .05; yb = ya + PW - .1
    pb.box(xo, xo + .05, ya, yb, ZB, ZB + .06, MT['charcoal']); pb.box(xo, xo + .05, ya, yb, ZT - .06, ZT, MT['charcoal'])
    pb.box(xo, xo + .05, ya, ya + .06, ZB, ZT, MT['charcoal']); pb.box(xo, xo + .05, yb - .06, yb, ZB, ZT, MT['charcoal'])
    y = ya + .18
    while y < yb - .1: pb.box(xo - .025, xo + .075, y - .0175, y + .0175, ZB + .06, ZT - .06, MT['alu'], rotz=.9); y += .19
    pb.flush(); panels.append((i, bpy.data.objects[f'Louvre_panel_{i + 1:02d}_alu'] if False else None, pb.c))
# join each panel's meshes into one object so it can slide as a unit; animate odd panels sliding open (frames 1 → 60 → 120)
for i, _, cn in panels:
    objs = list(COLL[cn].objects); bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join(); o = bpy.context.view_layer.objects.active; o.name = f'Louvre_panel_{i + 1:02d}'
    if i % 2:
        for f, dy in ((1, 0.0), (60, PW), (120, 0.0)): o.location.y = dy; o.keyframe_insert('location', index=1, frame=f)
sc.frame_start, sc.frame_end = 1, 120
for b_ in (site, hall, court, cw, rail, lv): b_.flush()

# ── cameras, sun/sky, render ──────────────────────────────────────────────────────
def cam(name, loc, tgt, lens):
    c = bpy.data.cameras.new(name); c.lens = lens; c.clip_end = 400
    o = bpy.data.objects.new(name, c); sc.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
CAMS = {'aerial_NE': ((40, -16, 14), (23.5, 6, 4.5), 26), 'on_deck': ((23.1, -8.6, 5.7), (23.1, 20, 5.0), 22),
        'from_pickleball': ((30.5, 4, 1.7), (22.6, 4, 5.2), 24), 'stair_landing': ((27.5, 19, 3.9), (23.0, 24.2, 4.2), 24),
        'louvre_closeup': ((23.4, 2.0, 5.3), (22.4, 6.5, 5.9), 30)}
for k, (l, t, ln) in CAMS.items(): cam(k, l, t, ln)
w = bpy.data.worlds.new('Sky'); sc.world = w; w.use_nodes = True
sky = w.node_tree.nodes.new('ShaderNodeTexSky')
try: sky.sky_type = 'MULTIPLE_SCATTERING'
except Exception: pass
sky.sun_intensity = 0.7; sky.sun_elevation = math.radians(28); sky.sun_rotation = math.radians(250)
w.node_tree.links.new(sky.outputs['Color'], w.node_tree.nodes['Background'].inputs['Color'])
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = int(os.environ.get('SAMPLES', 40)); sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 1600, 900; sc.view_settings.view_transform = 'AgX'; sc.view_settings.exposure = -1.3
try: sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass
sc.render.filepath = os.path.join(OUT, 'x.png')
sc.camera = bpy.data.objects['aerial_NE']
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'MyPlace_Catwalk.blend'))
if os.environ.get('RENDER', '1') == '1':
    for k in CAMS:
        sc.camera = bpy.data.objects[k]; sc.frame_set(1)
        sc.render.filepath = os.path.join(OUT, 'renders', f'{k}.png'); bpy.ops.render.render(write_still=True); print('rendered', k, flush=True)
    sc.camera = bpy.data.objects['from_pickleball']; sc.frame_set(60)   # louvre screens slid half open
    sc.render.filepath = os.path.join(OUT, 'renders', 'from_pickleball_louvre_open.png'); bpy.ops.render.render(write_still=True); print('rendered open', flush=True)
    sc.frame_set(1); sc.camera = bpy.data.objects['aerial_NE']
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'MyPlace_Catwalk.blend'))
