# NA body customization assets

`na/na-body-customization.blend` is the fitted authoring scene. It contains all
28 source OBJ variants, the fixed NA shell, and separate stock panel collections.
The BN front bumper, rear bumper, and skirts are visible on opening the file.
Toggle the named collections to inspect the other options. The original OBJ
files and `na/bn style kit.blend` remain source references.

The models use the application's existing inch-based chassis coordinates:
Blender X spans the car, +Y points forward, and Z points upward. Object transforms
are baked into mesh coordinates. Do not center individual parts before export.

## Export

From the repository root, with Blender on PATH:

```powershell
blender -b models/na/na-body-customization.blend --python scripts/export-na-body-parts.py -- public
```

The exporter reads `na-parts-manifest.json` and exports every fitted collection,
the fixed shell, and the stock panels. It accepts fitted objects with unit scale.
The app catalog is in `src/constants/bodyParts.ts`; labels live in the strings
module. `public/body/na/` contains the browser-ready GLBs.

## Materials

The OBJ material groups and UV maps are retained. Their referenced MTL files and
image textures were not supplied, so the exports use reconstructed PBR finishes:
body paint, satin black trim, rubber, tinted glazing, amber/clear lenses, and
metallic reflectors. All painted surfaces use `Miata_Paint_ClassicRed`, preserving
the application's paint color and metallic controls. Glass, trim, and lighting
materials keep their authored finish when the body color changes.

## Panel relationships

- Front/rear bumpers, front fenders, and roofs replace their stock panels.
- Skirt GLBs include the stock rocker backing underneath their extensions.
  The raised BN fender mounting tabs are retained over that backing.
- Flares, spoilers, and the luggage rack mount over the retained bodywork.
- Pitcrew headlights and the Pitcrew front bumper are selected together.
- Fastback roofs occupy the trunk surface, so selecting one clears the spoiler
  and luggage rack. Selecting either accessory returns to the stock roof.

These are visual models fitted to this NA shell. The existing fitment physics
and suspension measurements are unchanged.

## Mesh fitting

The aftermarket skins were rebuilt from the source OBJs, with local deformation
at mounting edges and new return faces connecting them to the retained body.
The BN bumper lamps are seated separately. Front fenders extend back to the door
seam; replacement roofs include the stock lower mounting surround. Open wheel
arches, vents and lamp openings remain intentional openings. Panel skins have
thin inward thickness and corrected surface normals. The stock shell is unchanged
by this refitting pass.

The authoring scene is the editable result. To regenerate the mesh fitting into
a separate output folder (this regenerates the aftermarket skins from the OBJs):

```powershell
blender -b --python scripts/refit-na-body-parts.py -- build/na-refit
```

After export, `node scripts/check-na-body-parts.mjs` checks all 28 catalog entries,
34 GLBs, material assignments, finite geometry, chassis coordinates and the
Pitcrew/fastback selection rules. Embedded texture payloads are checked in Node;
image appearance requires browser review. The manifest records final mesh counts
and the return geometry added during fitting; those depths are construction
measurements, not a claim of a maximum visible seam gap.

## Wings West W-Type inspired kit

The front lip, rear lip and paired side skirts are newly authored interpretations
of the NA W-Type kit, using the manufacturer's product photos as visual references.
They are not official meshes or dimensionally verified replicas. Each component
is a separate `Wings West W-Type Inspired` choice in the existing selectors.
The bumper exports contain their stock upper sections and lighting; skirts retain
the original rocker backing. Original glazing, handle and lamp materials remain.

The editable collections are `WingsWestFront`, `WingsWestRear`, and
`WingsWestSkirts` in the main authoring scene. The procedural source is
`scripts/build-wings-west.py`; it generates only these new collections and exports.
Regenerate into a separate review directory with:

```powershell
blender -b --python scripts/build-wings-west.py -- build/wings-west
```

The manifest distinguishes these authored models from imported OBJs. The OBJ
refitting script leaves authored collections alone. Exporting the main scene
includes all 31 variants (28 imported and 3 authored) and 37 GLBs in total.

References:
- [Complete kit](https://wingswest.com/products/101184-1990-1998-mazda-miata-w-typ-complete-4pc-kit-fiberglass)
- [Side skirts](https://wingswest.com/products/101181-1990-1998-mazda-miata-w-typ-right-side-skirt-fiberglass)
- [Rear lip](https://wingswest.com/products/101183-1990-1998-mazda-miata-w-typ-rear-lip-fiberglass)
