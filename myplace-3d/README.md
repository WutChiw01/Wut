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

## REV D.7 changes
- Solar Ribbon raised: same 0.2275 gable slope, ridge 0.50 m below the hall ridge (+10.75), canopying both towers; H250 cores of C1/C2 rise to the soffit and carry it; timber soffit + downlights.
- C1/C2 tiles now run from the water court to +8.60; each tower stands in a koi pond with a 0.45 m seat coping; ponds, a front bench band and a 2.8 m arrival path sit on one continuous travertine plinth. Recirculation pipes/sump are to run in a new underground trench below the plinth (not drawn).
- East wall (hall / pickleball): +4.50 m service catwalk 1.20 m wide on outriggers + knee braces to the existing portal columns, steel stair at the north end, sliding wind-block louvre screens (z 4.75–7.25) operated from the deck. The 10.5 m bay y = 2…12.5 has no column: tie rods to the roof eave are shown, to be verified by the structural engineer.
- New views: `entrance_*`, `catwalk_*`, `left_*`, `rear_*` (incl. orthographic elevations `left_elev`, `rear_elev`, `entrance_front`).

## REV D.8 changes
- East catwalk (+4.50) is now reached from the rear complex L2 floor (+3.50): glazed door in the L2 east wall → free-standing landing (own posts, existing RC slab untouched) → 6 risers (157 mm) → deck. The ground-level stair was removed; the catwalk also lands on the existing columns at y = 17.5 and 22.0.
- To make room, the climbing wall + crash pit moved 1.30 m north (pit y 24.90…29.20, tower y 25.60…28.90); the 1.20 m pit stair gap is now at the SE corner as in the spec.
- Rear: teak sun-fins on L3, eyebrow shade + wall-washers on L2, slat canopy over the clinic door, sauna exhaust risers, downpipes, louvred roof plant screen with condensers, pool steps/ladder/underwater lights, shower, pool plant room, planters.
- Sides: batten wall sconces and PV on the west wing roof; climbing wall route tapes, auto-belay units, top-out gate; new east elevation.
