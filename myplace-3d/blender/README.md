# Elevated walkway (+4.50) between the badminton hall and the pickleball courts — Blender

- `MyPlace_Catwalk.blend` (Blender 5.0, Cycles) — hall east wall (glass, louvre band, portal columns, roof edge), the 1.20 m steel walkway with grating deck, outriggers + knee braces bolted to the existing columns, tie rods, handrails, 13 sliding louvre wind-screens, L2 landing + 6-riser stair, climbing-pit bench, pickleball courts PB1/PB2 with nets and masts. Coordinates = spec axes (x east, y north, z up, metres).
- Collections: `Site`, `Hall_east_side`, `Catwalk`, `Catwalk_handrails`, `Louvre_frames`, `Louvre_panel_01…13`, `Pickleball_courts`.
- Animation (frames 1 → 60 → 120): the odd louvre panels slide north in their own track = screens half open / closed again. Cameras: `aerial_NE`, `on_deck`, `from_pickleball`, `stair_landing`, `louvre_closeup`.
- `make_catwalk.py` rebuilds everything: `pip install bpy` then `python make_catwalk.py out_dir` (`RENDER=0` skips renders, `SAMPLES=64` for cleaner images).
- Simplified: no hall trusses, plain flat materials, louvre fins fixed at 0.9 rad.
