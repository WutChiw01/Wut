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

## REV D.9 — West wing + coconut garden in detail
New layers (`ww_G`, `ww_L2`, `ww_roof`) so the wing can be cut away; shots `ww_*`, `studio_*`, `stair_*`, `suite_in`, `garden_*`, `walkway_l2`, `pods`, `core_in`, `palm_crown`.
- G1 Creative Studio (2.65 × 13.6 m): street door D1, sound-lock vestibule, acoustic + teak-slat panels, ceiling track, softboxes on tripods, camera, make-up station, lounge corner, prop shelves, 0.90 m radius cyclorama cove.
- G2 Grand U-stair: 20 risers × 175 mm, 260 mm treads, two 1.25 m flights + mid-landing, stair-head glass balustrade, WC G2 under flight 2 (1.20 × 0.95 m only — the headroom limit of 2.0 m), under-landing store; hall doors D3 (1.70 m, y 5.25–6.95) and D4 (1.70 m, y 10.6–12.3) cut in the hall west wall.
- L1 Creative Suite: rug, sofa, armchairs, bar counter with stools, TV wall, shared desk, pendants.
- G3 garden: P2/P3 with earth beds, drip rings, curved teak benches, jali wall wrapped around P2, stepping-stone path, bar-height co-working ledge + stools, water bowl, pendants; L2 gallery walkway with guard net + polycarbonate canopy against falling coconuts, slatted pergola opened around the trunks.
- Focus pods G4 (ground) and L3 (upper), G5 MDB + pump room, L4 staff / linen, 2.05 × 2.05 m MRL lift, switchback fire stair.
- Palms rebuilt: ring scars, bole, crown shaft, 20 arching fronds, coconut bunches; trunks lean gently east into the pergola gap instead of towards the wall.

Open design conflicts found while detailing (need a decision)
1. The 2.65 m wide stair hall cannot hold a 20-riser U-stair, D3 (1.70 m) and WC G2 *and* a bridge from the stair head (z 3.50, south) to the L2 gallery walkway (z 3.50, north) — the bridge would sit 0.3 m above flight 2. Currently the L2 stair head feeds the Creative Suite only; the walkway starts at y = 10 with no direct stair link.
2. Fire stair flights are 0.95 m wide (1.90 m available outside the existing slab) instead of the 1.20 m in the spec.
3. G4/L3 pods are 4 m long, full width / half width — spec area 10.36 m² each is not reachable with the 2.65 m wing width.
