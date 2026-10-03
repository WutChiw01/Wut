# MY PLACE · REV D.6 — 3D model & snapshots

Parametric Three.js model built directly from `MyPlace_Master_Design_and_Engineering_Spec_vD6`
(spec axes: x east, y north/rear, z up, metres; mapped to Three.js as `(x, z, -y)`).

- `model.js` – the model (hall, courts, space frame, Cyclone C0/E0/W0/C1/C2, Solar Ribbon, west wing + palms P1–P3, rear complex GF/L2/L3, pool, climbing wall + sunk crash pit, pickleball) and the camera presets (`SHOTS`).
- `viewer.html` – interactive viewer (orbit, shot buttons, layer toggles). Serve this folder over HTTP, e.g. `npx serve .`
- `render.mjs` – renders every preset to `snapshots/*.png` (headless Chromium); `GLB=1 node render.mjs` also writes `MyPlace_Master_vD6.glb`.
- `snapshots/` – exterior: `s1`, `s1_dusk`, `s2`, `s6`, `s7`, `oblique`; interior: `s3`, `s4`, `s5`, `hall_aisle`, `hall_roof`, `gallery_l2`, `clinic`; cut-aways: `plan_gf`, `plan_l2`, `plan_l3`.

Known deviations from the spec / simplifications
- Pool placed at x 10.2–22.2 (spec y 31–35 collides with the skewed rear fence); the rear fence is drawn 0.5 m high so shot S6 can be taken from the spec position outside it.
- S5 camera raised (spec z = 3.5 is floor level of L2). The west wing is only 3.1 m wide, so this view is cramped.
- Massing-level model: furniture, MEP and structure details are schematic; materials follow the spec's palette but are not photoreal.
