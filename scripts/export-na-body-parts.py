"""Export the reviewed collections from models/na/na-body-customization.blend.

blender -b models/na/na-body-customization.blend --python scripts/export-na-body-parts.py -- public
The fitted flag, rather than non-unit scale, identifies authored parts: transforms
are baked into the vertices so every GLB uses the same chassis coordinate frame.
"""
import json
import sys
from pathlib import Path
import bpy


def export_collection(collection, destination):
    objects=[obj for obj in collection.objects if obj.type=='MESH']
    if not objects:
        raise RuntimeError(f'Empty export collection: {collection.name}')
    destination.parent.mkdir(parents=True,exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    hidden={obj:obj.hide_get() for obj in objects}
    try:
        for obj in objects:
            obj.hide_set(False)
            obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.export_scene.gltf(filepath=str(destination),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
    finally:
        for obj,state in hidden.items():obj.hide_set(state)


def main():
    root=Path(__file__).resolve().parents[1]
    output=Path(sys.argv[sys.argv.index('--')+1]) if '--' in sys.argv else root/'public'
    manifest=json.loads((root/'models/na-parts-manifest.json').read_text())
    for part in manifest:
        name=Path(part['source']).stem
        collection=bpy.data.collections.get(name)
        if collection is None or not any(obj.get('fitted') for obj in collection.objects):
            raise RuntimeError(f'Missing fitted collection: {name}')
        export_collection(collection,output/part['path'].lstrip('/'))
    for collection in bpy.data.collections:
        if collection.name.startswith('Stock • ') and collection.objects:
            slot=collection.name.removeprefix('Stock • ')
            export_collection(collection,output/f'body/na/{slot}/stock.glb')
    export_collection(bpy.data.collections['NA • Fixed shell'],output/'na_render.glb')


main()
