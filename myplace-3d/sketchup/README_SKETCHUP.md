# MY PLACE — SketchUp package (REV E)

`MyPlace_Master_vE1.dae` is a COLLADA file written for SketchUp (Z-up, metres, quads instead of triangles). I could not write a native `.skp` (it is a closed binary format), so open it in SketchUp and **File → Save As** to get the `.skp`.

## Import
1. SketchUp → *File ▸ Import* → file type **COLLADA (*.dae)** → pick `MyPlace_Master_vE1.dae` (keep the `textures/` folder next to it).
2. Options: tick **Merge coplanar faces** *off* (faces are already clean), units = metres (the file declares 1 unit = 1 m).
3. The model arrives as one group per layer inside the scene: `site`, `hall_shell`, `hall_roof`, `hall_interior`, `cyclones`, `front_facade`, `entrance_court`, `east_catwalk`, `west_wing`, `ww_G`, `ww_L2`, `ww_roof`, `rear_structure`, `rear_GF`, `rear_L2`, `rear_L3`, `rear_roof`, `hiking_trail`, `outdoor`, `rear_services`, `vegetation`, `trees`, `fences`. Inside each, one child group per material (`rear_L2__teak`, …).
4. *Window ▸ Outliner* → make each layer group a tag/layer if you want (**Right-click ▸ Make Group/Component**). The cut-away layers `ww_G`, `ww_L2`, `ww_roof`, `rear_L2`, `rear_L3`, `rear_roof` can be hidden to look into the floors.
5. Origin = spec origin (0,0,0) = left edge of court B1/B4 at grid 1. +X east, +Y north (towards the pool), +Z up.

## Notes
- ~97 k vertices / 89 k faces, 97 materials, 7 textures (courts, solar, net, leaf, pickleball, labels).
- Glass and water use material transparency; if a pane shows opaque, set the material's opacity in the *Materials* palette (≈ 28 % glass, 78 % pool water).
- Palm fronds and the "MY PLACE" / "SKY TRAIL" signs are PNG textures with alpha (SketchUp shows them as cut-outs).
- Terracotta tiles on the Cyclone towers are exported as flat-colour materials (≈ 40 shades) — not as a texture.
- Regenerate: `DAE=1 node render.mjs` (needs the repo's Playwright; see `render.mjs`).
