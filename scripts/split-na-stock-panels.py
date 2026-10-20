"""Cuts the NA's stock bumpers and side skirts out of the shell.

The shell shipped as one joined body mesh, so an aftermarket bumper was drawn
over the stock one rather than in place of it. This carves the stock panels into
their own models: shell plus the three stock parts is the original body exactly,
face for face, so picking stock restores the car it came from.

A face is cut only where the aftermarket part for that slot actually covers it,
tested by ray-casting the face along its normal. A box cut cannot follow a
panel seam and leaves holes where the fender curves up out of the bumper.

Run against the ORIGINAL unsplit shell -- run against an already-split one it
would carve a second time and take real bodywork with it. Recover the input
with `git show <ref>:public/na_render.glb` if that happens.

  blender -b --python scripts/split-na-stock-panels.py --       public/na_render.glb public/body/na <out dir>
"""

import os, sys
import bpy, bmesh

SRC, PARTS_DIR, OUT = sys.argv[sys.argv.index("--") + 1:][:3]

# The outer limit of each panel: roughly where the stock part lives. Blender
# world axes here: X width, Y length (front is +Y), Z up.
ZONES = {
    "bumper-front": lambda c: c.y > 130 and c.z < 2 and abs(c.x) < 34,
    "bumper-rear": lambda c: c.y < 17 and c.z < -2 and abs(c.x) < 33,
    "skirts": lambda c: abs(c.x) > 26 and 38 < c.y < 107 and c.z < -5,
}

# A face is only cut if the replacement covers it, so the seam left behind is
# always underneath the new part. Generous enough to catch a face sitting just
# inside the part's skin, short enough not to reach across the car.
COVER_DISTANCE = 14.0
SURFACE_EPSILON = 0.05

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
body = [o for o in bpy.data.objects if o.type == "MESH" and "Body" in o.name][0]
body_name, mw = body.name, body.matrix_world.copy()
print(f"body: {len(body.data.polygons)} faces")


def load_cover(slot):
    """The aftermarket part for a slot, used only to test what it hides."""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(PARTS_DIR, slot, "bn.glb"))
    added = [o for o in set(bpy.data.objects) - before if o.type == "MESH"]
    return added[0]


def covered_by(part):
    inv = part.matrix_world.inverted()
    rot = inv.to_3x3()

    def hidden(centre, normal):
        for direction in (normal, -normal):
            origin = centre + direction * SURFACE_EPSILON
            hit, *_ = part.ray_cast(inv @ origin, rot @ direction, distance=COVER_DISTANCE)
            if hit:
                return True
        return False

    return hidden


cuts = {}
normal_rot = mw.to_3x3()
for slot, in_zone in ZONES.items():
    part = load_cover(slot)
    hidden = covered_by(part)
    keep = set()
    for poly in body.data.polygons:
        centre = mw @ poly.center
        if not in_zone(centre):
            continue
        if hidden(centre, (normal_rot @ poly.normal).normalized()):
            keep.add(poly.index)
    cuts[slot] = keep
    bpy.data.objects.remove(part, do_unlink=True)
    print(f"  {slot}: {len(keep)} faces covered by its replacement")

taken = set().union(*cuts.values())


def carve(name, wanted):
    src = bpy.data.objects[body_name]
    obj = src.copy()
    obj.data = src.data.copy()
    obj.name = name
    bpy.context.scene.collection.objects.link(obj)

    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.faces.ensure_lookup_table()
    doomed = [f for f in bm.faces if f.index not in wanted]
    bmesh.ops.delete(bm, geom=doomed, context="FACES")
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()
    print(f"  {name}: {len(obj.data.polygons)} faces")
    return obj


stock = {slot: carve(f"Miata_Stock_{slot}", keep) for slot, keep in cuts.items()}
all_faces = set(range(len(body.data.polygons)))
shell_body = carve("Miata_Body_Shell", all_faces - taken)


def export(objs, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB",
                              use_selection=True, export_apply=True, export_yup=True)


shell_body.name = body_name + "_split"
others = [o for o in bpy.data.objects if o.type == "MESH" and o.name != body_name
          and o not in stock.values() and o is not shell_body]
export([shell_body] + others, os.path.join(OUT, "na_render.glb"))
for slot, obj in stock.items():
    export([obj], os.path.join(OUT, "body", "na", slot, "stock.glb"))
print("=====DONE=====")
