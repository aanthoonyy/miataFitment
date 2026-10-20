"""Rebuild mounting returns from the unwarped OBJ skins, against retained panels."""
import bpy, bmesh, math, json, sys
import numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

ROOT=Path(__file__).resolve().parents[1]
if '--' not in sys.argv:raise RuntimeError('Pass an output directory after --')
OUT=Path(sys.argv[sys.argv.index('--')+1]).resolve()
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'models/na/na-body-customization.blend'))
manifest=json.loads((ROOT/'models/na-parts-manifest.json').read_text())
MATERIAL_NAMES={'Ext1':'Miata_Paint_ClassicRed','Ext1.003':'Miata_Paint_ClassicRed','Ext2':'Miata_Trim_Satin','Ext6':'Miata_Seal_Rubber','WindowGlass':'Miata_Glass_Tinted','LightReflectors':'Miata_Reflector_Chrome','IndicatorGlass':'Miata_Lens_Amber','HeadlightOn':'Miata_Headlight_Reflective','HeadlightGlass':'Miata_Lens_Clear'}

for old in list(bpy.data.objects):
    if old.name.startswith(('Miata_Roof_Mount_','Miata_BN_StockRocker')):bpy.data.objects.remove(old,do_unlink=True)
for original in bpy.data.collections['Stock • skirts'].objects:
    rocker=original.copy();rocker.data=original.data.copy();rocker.name='Miata_BN_StockRocker'
    bpy.data.collections['SideskirtsBN'].objects.link(rocker)
roof_mount=bpy.data.objects['Miata_Stock_roof'].copy()
roof_mount.data=roof_mount.data.copy()
bm=bmesh.new();bm.from_mesh(roof_mount.data)
bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.00001,plane_co=Vector((0,0,7.5)),plane_no=Vector((0,0,1)),clear_outer=True)
bm.to_mesh(roof_mount.data);bm.free()
for part in manifest:
    if part['slot']=='roof':
        mount=roof_mount.copy();mount.data=roof_mount.data.copy();mount.name='Miata_Roof_Mount_'+Path(part['source']).stem
        bpy.data.collections[Path(part['source']).stem].objects.link(mount)

def source_mesh(obj,path,slot):
    vertices=[];faces=[];uv=[];uvfaces=[];groups=[];group='Ext1'
    for line in path.read_text().splitlines():
        fields=line.split()
        if not fields:continue
        if fields[0]=='v':
            x,height,long=map(float,fields[1:4])
            p=Vector((-x*4.6,long*4.35+50.65,height*4.75-27.70))
            if slot in ['bumper-front','headlights']:p.y=long*4.5+52.5
            elif slot=='bumper-rear':p.y=long*5.12+57.28;p.z=height*4.905-27.7
            elif slot=='skirts':p.x=-x*4.632;p.y=long*4.376+52.897;p.z=height*5.201-28.89
            elif slot=='roof':p.y=long*4.45+51.42;p.z=height*4.85-27.95
            elif slot=='fenders-front':
                p.y=long*4.25+57
                weight=max(0,min((p.y-92.6)/28.9,(140.3-p.y)/18.8))
                p.y-=2.5*weight;p.z-=.4
                p.y-=3.0*max(0,min(1,(102-p.y)/9.4))
            elif slot=='flares-front':p.y+=2.5
            elif slot=='flares-rear' and path.stem!='RearFlareBL':p.y+=1.5
            vertices.append(p)
        elif fields[0]=='vt':uv.append(tuple(map(float,fields[1:3])))
        elif fields[0]=='usemtl':group=fields[1]
        elif fields[0]=='f':
            parts=[f.split('/') for f in fields[1:]]
            faces.append([int(p[0])-1 for p in parts]);uvfaces.append([int(p[1])-1 if len(p)>1 and p[1] else None for p in parts]);groups.append(group)
    mesh=bpy.data.meshes.new(path.stem+'_Rebuilt');mesh.from_pydata(vertices,[],faces);mesh.update()
    material_groups=list(dict.fromkeys(groups))
    for name in material_groups:mesh.materials.append(bpy.data.materials[MATERIAL_NAMES[name]])
    for face,name in zip(mesh.polygons,groups):face.material_index=material_groups.index(name);face.use_smooth=True
    if uv:
        layer=mesh.uv_layers.new(name='UVMap')
        for face,coords in zip(mesh.polygons,uvfaces):
            for li,coordinate in zip(face.loop_indices,coords):
                if coordinate is not None:layer.data[li].uv=uv[coordinate]
    obj.data=mesh
    bm=bmesh.new();bm.from_mesh(mesh)
    bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001)
    bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
    bm.to_mesh(mesh);bm.free();mesh.update()

def reference_for(slot):
    objects=list(bpy.data.collections['NA • Fixed shell'].objects)
    for name in ['fenders-front','roof','skirts','bumper-front','bumper-rear']:
        if name!=slot or slot=='skirts':objects.extend(bpy.data.collections['Stock • '+name].objects)
    if slot=='roof':objects.append(roof_mount)
    points=[];faces=[]
    for obj in objects:
        if obj.type!='MESH':continue
        start=len(points);points.extend(obj.matrix_world@v.co for v in obj.data.vertices)
        for face in obj.data.polygons:
            mat=obj.data.materials[face.material_index]
            if mat and mat.name.startswith('Miata_Paint_'):faces.append([start+v for v in face.vertices])
    return BVHTree.FromPolygons(points,faces)

def boundary_groups(bm):
    edges={e for e in bm.edges if e.is_boundary}
    groups=[]
    while edges:
        group=[];stack=[edges.pop()]
        while stack:
            edge=stack.pop();group.append(edge)
            for v in edge.verts:
                for other in v.link_edges:
                    if other in edges:edges.remove(other);stack.append(other)
        groups.append(group)
    return sorted(groups,key=len,reverse=True)

def contact_target(p,slot,reference,inset=-.08):
    # Side-mounted skins retain their cross-section; only new return surfaces
    # run inward to the original metal. No clamping of the exterior vertices.
    if slot.startswith('flares') or slot=='skirts':
        sign=1 if p.x>0 else -1
        hit,normal,_,distance=reference.ray_cast(Vector((sign*45,p.y,p.z)),Vector((-sign,0,0)),20)
        if hit is not None and abs(hit.x)>26:
            return hit+Vector((sign*inset,0,0))
        if slot.startswith('flares'):return None
    hit,normal,index,distance=reference.find_nearest(p)
    allowed=3.5 if slot in ['skirts','fenders-front','bumper-front','bumper-rear'] else 2.4
    if hit is not None and distance<allowed:
        return hit+normal*inset
    return None

def rebuild_returns(obj,slot,reference):
    bm=bmesh.new();bm.from_mesh(obj.data);bm.verts.ensure_lookup_table()
    return_layer=bm.verts.layers.float.new('mount_return')
    groups=boundary_groups(bm)
    added=0;contacts=0;maximum=0
    if not groups:bm.free();return {}
    # Largest loops are external panel outlines; small loops are lamps, vents,
    # glazing and fastener holes, which must remain open.
    minimum=max(32,len(groups[0])*.45)
    eligible=[e for group in groups if len(group)>=minimum for e in group]
    mounting=[]
    for edge in eligible:
        face=edge.link_faces[0]
        material=obj.data.materials[face.material_index]
        if not material.name.startswith('Miata_Paint_'):continue
        midpoint=(edge.verts[0].co+edge.verts[1].co)/2
        if slot=='bumper-front' and midpoint.z<-7 and midpoint.y>136:continue
        if slot=='bumper-rear' and midpoint.z<-8 and midpoint.y<10:continue
        if slot=='roof' and midpoint.z>10 and midpoint.y<70:continue
        if slot=='fenders-front' and midpoint.z<-4 and 103<midpoint.y<132:continue
        if slot=='skirts' and midpoint.z<-19:continue
        if slot.startswith('flares'):
            wheel_y=118.2 if slot=='flares-front' else 25.8
            if math.hypot(midpoint.y-wheel_y,midpoint.z+12.1)<12.6:continue
        if slot in ['headlights','rack']:continue
        targets=[contact_target(v.co,slot,reference) for v in edge.verts]
        if any(p is None for p in targets):continue
        if any((p-v.co).length>5 for p,v in zip(targets,edge.verts)):continue
        mounting.append(edge)
    # Spread the mounting displacement through the skin while preserving the
    # original differential shape, rather than pulling isolated vertices.
    if mounting:
        bm.verts.index_update()
        count=len(bm.verts)
        deltas=np.zeros((count,3));weights=np.zeros(count)
        boundary_neighbors={}
        for edge in mounting:
            a,b=edge.verts
            boundary_neighbors.setdefault(a.index,set()).add(b.index)
            boundary_neighbors.setdefault(b.index,set()).add(a.index)
            for vertex in edge.verts:
                target=contact_target(vertex.co,slot,reference,inset=.25 if slot=='skirts' else .10)
                deltas[vertex.index]=np.array(target-vertex.co)*.94
                weights[vertex.index]=1
        for iteration in range(8):
            smoothed=deltas.copy()
            for index,neighbors in boundary_neighbors.items():
                smoothed[index]=.6*deltas[index]+.4*np.mean(deltas[list(neighbors)],axis=0)
            deltas=smoothed
        source=np.array([e.verts[0].index for e in bm.edges]);destination=np.array([e.verts[1].index for e in bm.edges])
        stiffness=np.array([1/max(e.calc_length(),.1) for e in bm.edges])
        degree=np.bincount(source,weights=stiffness,minlength=count)+np.bincount(destination,weights=stiffness,minlength=count)
        anchors=weights*degree*50
        displacement=deltas.copy()
        for iteration in range(160):
            total=np.zeros((count,3))
            for axis in range(3):
                total[:,axis]=np.bincount(source,weights=stiffness*displacement[destination,axis],minlength=count)+np.bincount(destination,weights=stiffness*displacement[source,axis],minlength=count)
            displacement=(total+anchors[:,None]*deltas)/np.maximum((degree*1.055+anchors)[:,None],.00001)
        for vertex in bm.verts:vertex.co+=Vector(displacement[vertex.index])
    cache={}
    for edge in mounting:
        face=edge.link_faces[0]
        loop=next(loop for loop in face.loops if loop.edge==edge)
        a,b=loop.vert,loop.link_loop_next.vert
        for v in [a,b]:
            if v not in cache:
                p=contact_target(v.co,slot,reference)
                if p is None or (p-v.co).length>5:p=v.co.copy()
                cache[v]=bm.verts.new(p)
                cache[v][return_layer]=1
                maximum=max(maximum,(p-v.co).length);contacts+=1
        if (cache[a].co-a.co).length<.025 and (cache[b].co-b.co).length<.025:continue
        new=bm.faces.new((b,a,cache[a],cache[b]));new.material_index=face.material_index;new.smooth=True;added+=1
    # Close the short ends of each partial return strip.
    for v,inner in list(cache.items()):
        connector=next((e for e in v.link_edges if inner in e.verts),None)
        if connector and connector.is_boundary:
            # A small folded return keeps the material from ending in a razor edge.
            connector.smooth=False
    bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
    for edge in bm.edges:
        if len(edge.link_faces)==2:edge.smooth=edge.calc_face_angle(0)<math.radians(40)
    bm.to_mesh(obj.data);bm.free();obj.data.update()
    return {'return_faces':added,'contact_vertices':contacts,'maximum_return_depth_in':round(maximum,4)}

def smooth_clearance(obj,slot,reference):
    if not slot.startswith('flares') and slot!='skirts':return 0
    skin=BVHTree.FromPolygons([v.co for v in obj.data.vertices],[list(p.vertices) for p in obj.data.polygons])
    required=[]
    for vertex in obj.data.vertices:
        p=vertex.co;sign=1 if p.x>0 else -1
        origin=Vector((sign*45,p.y,p.z));direction=Vector((-sign,0,0))
        outer,*_=skin.ray_cast(origin,direction,20)
        target,*_=reference.ray_cast(origin,direction,20)
        if outer is not None and target is not None and abs(p.x-outer.x)<.05 and abs(target.x)>27:
            required.append(max(0,abs(target.x)+.12-abs(p.x)))
    if not required:return 0
    required.sort();shift=required[int(.97*(len(required)-1))]
    for v in obj.data.vertices:v.co.x+=shift*(1 if v.co.x>0 else -1)
    return round(shift,4)

def finish_normals(obj,slot,reference):
    bpy.ops.object.select_all(action='DESELECT');obj.hide_set(False);obj.select_set(True);bpy.context.view_layer.objects.active=obj
    bm=bmesh.new();bm.from_mesh(obj.data)
    crease=bm.edges.layers.float.get('crease_edge') or bm.edges.layers.float.new('crease_edge')
    for edge in bm.edges:
        if len(edge.link_faces)==2 and edge.calc_face_angle(0)>math.radians(35):edge[crease]=.85
    bm.to_mesh(obj.data);bm.free()
    modifier=obj.modifiers.new('Continuous panel surface','SUBSURF');modifier.levels=1
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    if slot=='skirts':
        return_attribute=obj.data.attributes.get('mount_return')
        for v in obj.data.vertices:
            if return_attribute and return_attribute.data[v.index].value>.05:continue
            p=v.co;sign=1 if p.x>0 else -1
            hit,*_=reference.ray_cast(Vector((sign*45,p.y,p.z)),Vector((-sign,0,0)),20)
            if hit is not None and abs(hit.x)>26 and -1.2<abs(p.x)-abs(hit.x)<.14:
                p.x=hit.x+sign*.14
    modifier=obj.modifiers.new('Surface thickness','SOLIDIFY');modifier.thickness=.045;modifier.offset=-1;modifier.use_even_offset=False;modifier.thickness_clamp=.5
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    modifier=obj.modifiers.new('Panel normals','WEIGHTED_NORMAL');modifier.keep_sharp=True;modifier.weight=40
    bpy.ops.object.modifier_apply(modifier=modifier.name)

reports=[]
for entry in manifest:
    if entry.get("authored"):continue
    name=Path(entry['source']).stem;obj=bpy.data.objects['Miata_Aero_'+name];slot=entry['slot']
    source_mesh(obj,ROOT/'models/na'/entry['source'],slot)
    ref=reference_for(slot)
    clearance=smooth_clearance(obj,slot,ref)
    report=rebuild_returns(obj,slot,ref)
    if slot not in ['headlights','rack']:finish_normals(obj,slot,ref)
    obj['fitted']=True;obj['mesh_reworked']=True
    reports.append({'source':entry['source'],'side_clearance_shift_in':clearance,**report})
    print(name,json.dumps(reports[-1]),flush=True)

for obj in bpy.data.collections['FrontBarBN'].objects:
    if obj.name.startswith('Miata_BN_RunningLens'):obj.location.y=-1.13 if obj.location.x>0 else -.96

for collection in bpy.context.scene.collection.children:
    visible=collection.name.startswith('NA •') or (collection.name.startswith('Stock •') and collection.name not in ['Stock • bumper-front','Stock • bumper-rear','Stock • skirts']) or collection.name in ['FrontBarBN','RearBarBN','SideskirtsBN']
    for obj in collection.objects:obj.hide_render=not visible;obj.hide_set(not visible)
bpy.ops.object.select_all(action='DESELECT')
(OUT/'models/na').mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'models/na/na-body-customization.blend'))
(OUT/'mesh-rework-report.json').write_text(json.dumps(reports,indent=2))

scene=bpy.context.scene;camera=scene.camera
scene.render.resolution_x=1200;scene.render.resolution_y=850;camera.data.ortho_scale=40
views=[('skirt',(65,110,2),(31,75,-15)),('rear',(70,-60,10),(19,-3,-6)),('front',(70,210,20),(20,140,-7))]
for name,position,target in views:
    camera.location=position;camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(OUT/f'close-{name}.png');bpy.ops.render.render(write_still=True)

