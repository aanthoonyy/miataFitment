# Source models

Body-part art in the form it arrived in. Nothing here is served: it sits outside
`public/` on purpose, so Vite neither bundles it nor publishes it. What the app
loads is the `.glb` files under `public/body/`.

The Blender scene the parts are fitted in is `na/bn style kit.blend`. It holds
`Miata_Body` in the same frame the app's shell uses, which is what makes a
fitted part land correctly with no placement code.

## Getting one into the app

An `.obj` here carries no usable placement — the geometry is in its own local
space, and the parts that have been fitted do not share a transform that could
be applied to the rest. Each one has to be positioned by hand before it can be
exported:

1. Import the `.obj` into `na/bn style kit.blend` alongside `Miata_Body`.
2. Scale, rotate and position it until it sits on the car.
3. Assign it `Miata_Paint_ClassicRed`, so the colour picker drives it. A part on
   any material not named `Miata_Paint_*` will not take the body colour.
4. Name it `Miata_Aero_<something>` and add it to `PARTS` in
   `scripts/export-na-body-parts.py`.
5. Run that script, then add a line to the slot's list in
   `src/constants/bodyParts.ts`.

The script skips anything still at its import scale rather than exporting it
into the wrong place, so it is safe to run at any point.

There are no `.mtl` files, so the parts carrying glass, lights or trim
(`HeadlightsPitcrew`, the roofs, `Rack`) need those materials assigned in
Blender before they will look right.

## What is in the app already

`FrontBarBN`, `RearBarBN` and `SideskirtsBN` — the three that were already
fitted in the `.blend`. Everything else below is waiting on step 2.

| Slot | Files |
|---|---|
| `bumperFront` | `FrontBarAK`, `FrontBarBN`\*, `FrontBarHY`, `FrontBarLip1`, `FrontBarLip2`, `FrontBarLip3`, `FrontBarPitcrew` |
| `bumperRear` | `RearBarBN`\*, `RearBarCut`, `RearBarPitcrew`, `RearBarPitcrew2` |
| `fendersFront` | `GuardAK`, `GuardLipped` |
| `flaresFront` | `FrontFlare`, `FrontFlareAK` |
| `flaresRear` | `RearFlare`, `RearFlareAK`, `RearFlareBL` |
| `skirts` | `SideskirtsAK`, `SideskirtsBN`\*, `SideskirtsFW` |
| `roof` | `RoofFastback`, `RoofOEM`, `RoofPC` |
| `wing` | `SpoilerDuck`, `SpoilerLip1` |
| `headlights` | `HeadlightsPitcrew` |
| `rack` | `Rack` |

\* already exported and selectable in the app.

The slot column is inferred from the filenames and each part's position, not
from anything the files themselves record.
