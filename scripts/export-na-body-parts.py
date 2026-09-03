"""Exports the fitted NA body parts out of the kit .blend into public/body/na/.

A part is only exportable once it has been positioned against Miata_Body in the
.blend: the .glb carries the object's transform, and the app adds it to the car
with no placement of its own. Parts sitting at their import scale will land in
the wrong place, so they are skipped rather than exported wrong.

Run:
  blender -b "<kit>.blend" --python scripts/export-na-body-parts.py -- <public dir>
"""

import os
import sys

import bpy

# Blender object name -> slot it fills and the value it is picked by. Extend
# this as parts are fitted; the value is what gets persisted, so leave it alone
# once shipped.
PARTS = {
    "Miata_Aero_FrontBar": ("bumper-front", "bn"),
    "Miata_Aero_RearBar": ("bumper-rear", "bn"),
    "Miata_Aero_SideSkirts": ("skirts", "bn"),
}

# Anything at its raw import scale has not been fitted to the body yet.
UNFITTED_SCALE = 1.0


def export_part(obj, out_dir, slot, value):
    # The kit keeps its parts in collections that are not in the view layer, and
    # only objects the view layer can see are selectable.
    if obj.name not in bpy.context.scene.collection.objects:
        bpy.context.scene.collection.objects.link(obj)

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    slot_dir = os.path.join(out_dir, slot)
    os.makedirs(slot_dir, exist_ok=True)
    path = os.path.join(slot_dir, f"{value}.glb")

    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )
    print(f"  wrote {path}")


def main():
    out_dir = sys.argv[sys.argv.index("--") + 1]

    for name, (slot, value) in PARTS.items():
        obj = bpy.data.objects.get(name)
        if obj is None:
            print(f"  SKIP {name}: not in this .blend")
            continue
        if all(abs(s - UNFITTED_SCALE) < 1e-6 for s in obj.scale):
            print(f"  SKIP {name}: still at import scale, not fitted to the body")
            continue
        export_part(obj, out_dir, slot, value)


main()
