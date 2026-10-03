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

## REV D.10 — plot-line wall, canopy slab, wind lane
- **Plot-line wall:** solid RC wall 0.50 m inside the boundary (x = −3.90) over the whole west side, no openings except the louvre door of the wind lane. In the garden the former perforated jali is now a *relief* of terracotta bricks on the inside face of the solid wall (perforations would be openings).
- **Hall ↔ west strip:** the badminton-hall west wall (x = −0.80) is removed at the wind lane (y 6.35…8.35) and along the whole garden (y 10…22). Rooms keep their own walls (studio, stair block, store, core). A 1.10 m glass guard runs along the L2 slab edge on the hall side.
- **Canopy slab:** one continuous RC slab at +3.50, 250 mm, from the hall edge out to the plot line (x = −4.40) along the full length (the 0.50 m beyond the wall is a cantilevered canopy with an upstand kerb). Round 0.85 m-radius openings with glass rails round the trunks of P2/P3; a gap round P1. The ground-floor garden is therefore shaded by the slab.
- **Wind lane (แนวลู่รับลม):** 2.00 m clear through-passage at y 6.35…8.35, on the W0–C0–E0 axis. Pivoting louvre fins in the plot-line wall and at the hall edge (shown open); close for tournaments (zero-draught policy). **W0 is now a full 360° tower** (spec said a half tower facing the hall) so the breeze strikes tile faces directly. Breeze arrows can be toggled in the viewer (`x_wind` layer; shown in the `lane_*` shots).
- **Re-planned wing:** the U-stair block slid 3.65 m south (now y 1.55…6.15) to free the lane; the studio/suite shrank to 2.65 × 9.95 m; a new 2.65 × 1.25 m store sits north of the lane. 2D plans in `plans/` regenerated.

Open points / things to verify
1. The slab beyond the wall (x −4.40…−3.90) is a 0.50 m eave that touches the plot line — check against MR 55 ข้อ 50 and the local authority; and neighbours' rights (eave drip). The wind-lane louvre door opens onto the neighbour's side in the closed condition only; ensure the louvre door is kept closed when the neighbour's use requires it.
2. Studio area drops from 38.36 m² (spec) to about 26 m²; the U-stair now sits where the studio was.
3. Still no link from the stair head (z 3.50, south end) to the L2 deck over the lane and garden: flight 1 climbs under that route and headroom would be < 2.0 m.
4. The 0.50 m eave and the open garden edge change the fire-separation assumptions between the garden / hall and the stair block (door D3 only); re-check with the fire engineer.

## REV D.11 — coffee shop on the ground floor, studio upstairs, stair + wind lane as one open lobby
- **Ground floor (zone 1):** no studio any more. The strip becomes an open coffee shop: espresso counter + pastry display near the street door, four two-top tables on a long banquette against the plot-line wall, a bar ledge with stools facing the courts, waiting benches, planters. The hall wall is removed at ground level from the street front to the wind lane, so the café opens straight onto the courts; all furniture stays inside x ≤ −0.90 so the 1.20 m athlete run-off (x −0.80 … +0.40) is untouched.
- **Open lobby:** the party wall between café and stair, the stair's north wall and the hall-side wall are removed at ground level (they remain above the slab for acoustics / fire). The U-stair, its WC, the stone floor and the 2.00 m wind lane read as one open breezeway lobby with the louvre screens at both ends.
- **Upper floor (+3.50):** the creative studio (cyclorama, ceiling track, softboxes, acoustic panels) and a VIP lounge corner at the street end, separated by a glass sound partition; floating acoustic floor over the café. Studio footprint 2.65 × 9.95 m.
- New views: `cafe_*`, `lobby_*`, `studio_up`, `studio_lounge`; plans in `plans/` regenerated (REV D.11).

Open points
1. The café sits under the studio: needs a proper floating floor / ceiling build-up (shown only as a soft layer) and the studio's own sound lock at the stair-head door.
2. Café kitchen / grease: only a counter + display is modelled. A full kitchen would need exhaust and a grease trap (spec has a 1,000 L trap for the café zone) — location not decided.
3. Café tables are 2.90 m deep only; peak seating overflows to the lobby benches. Capacity ≈ 8 table seats + 8 stools + 4 bench seats.
4. Fire / egress: the open ground floor connects café, stair and hall without separation; check travel distances and smoke control with the fire engineer.

## REV D.12 — prefab pool 3 × 6 m, rim +0.80 m
- The 4 × 12 m site-built pool is replaced by a prefab shell **3.00 × 6.00 m** (x 13.40…19.40, y 31.60…34.60) on the axis of the clinic's 2.00 m sliding door (x = 16.40), 1.50 m from the façade.
- Set 0.55 m into the ground (floor −0.55, depth 1.30 m); the rim stands **0.80 m above the teak deck** (+0.87), 0.32 m wide so it doubles as a seat. Water level 0.15 m below the rim. Charcoal skin + vertical teak slats on the sides.
- Easy entry: 3 teak steps (0.27 m risers, 1.20 m wide) opposite the clinic door with stainless rails on both sides, 4 under-water treads, plus a built-in seat bench on the north wall.
- Pool plant room (filter, salt chlorinator, UV-C, heater) 1.80 × 1.90 m on the east side; outdoor shower; loungers + umbrella on the west deck; planters on the north deck; pipes under the deck. Teak deck 1.50 m on the clinic side, ≥ 1.0 m elsewhere. 2D plan + section: `plans/pool_court.*` (`plan_pool.mjs`).
- Needs checking: prefab pools are normally set in a structural collar — confirm the shell can carry 0.80 m of free-standing wall (supplier data) and the 0.80 m rim height against child-safety rules (needs a gate / cover if kids use the court); the spec's water volume / treatment sizing (4×12 m) is now much smaller (≈ 23 m³).

## REV D.12 — rear complex 2D plans (GF, L2, L3)
`plans_rear.mjs` → `plans/rear_GF`, `rear_L2`, `rear_L3` (.svg/.png), drawn from the same numbers as the 3D model (north up, grid 1–5 / A–B, existing 144 m² slab outlined on L2).
- GF: lift lobby + C1 corridor, accessible WC, changing rooms M/F, physio clinic (reception, TR1, TR2, rehab bay, 2.00 m door to the pool), indoor bouldering room, corner fire stair + MRL lift, pool court with the 3×6 m prefab pool, outdoor climbing wall + crash pit.
- L2: viewing gallery (1.80 m, glass balustrade), 10 bays along the north (West Cross, 2× Red Light, 2× HBOT, Cold Plunge, Sauna, Lounge, plant/chiller room, linen), east door + landing + 6-riser stair to the +4.50 catwalk.
- L3: rentable fitness studio 13 × 6 m, open-air yoga terrace 5 × 6 m, top-out gate to the climbing tower. WC and tenant store on L3 are drawn per spec but are NOT in the 3D model.
Known gaps: the GF area x 1.9…4.2 / y 27.5…30.1 is unused in the model; the L2 bay x 17.05…20.20 is a plant/chiller room (not in the spec list of 7 zones); stair flights are 0.95 m (spec 1.20 m).
