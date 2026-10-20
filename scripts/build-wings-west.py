"""Create a photo-inspired W-Type kit on the NA stock mounting surfaces."""
import bpy,bmesh,math,json,sys,ast
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(sys.argv[sys.argv.index('--')+1]).resolve()
(OUT/'models/na').mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'models/na/na-body-customization.blend'))
paint=bpy.data.materials['Miata_Paint_ClassicRed']
trim=bpy.data.materials['Miata_Trim_Satin']
def activate(obj):
 bpy.ops.object.select_all(action='DESELECT');obj.hide_set(False);obj.select_set(True);bpy.context.view_layer.objects.active=obj
def apply(obj,mod):
 activate(obj);bpy.ops.object.modifier_apply(modifier=mod.name)
def collection(name):
 old=bpy.data.collections.get(name)
 if old:
  for obj in list(old.objects):bpy.data.objects.remove(obj,do_unlink=True)
  bpy.data.collections.remove(old)
 col=bpy.data.collections.new(name);bpy.context.scene.collection.children.link(col);return col
def clone_stock(slot,col,cut=None):
 for original in bpy.data.collections['Stock • '+slot].objects:
  obj=original.copy();obj.data=original.data.copy();obj.name=col.name+'_'+original.name;col.objects.link(obj)
  if cut is not None and obj.type=='MESH' and any(m and m.name.startswith('Miata_Paint_') for m in obj.data.materials):
   bm=bmesh.new();bm.from_mesh(obj.data)
   bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.00001,plane_co=Vector((0,0,cut)),plane_no=Vector((0,0,1)),clear_inner=True)
   bm.to_mesh(obj.data);bm.free()
def reference(slot):
 points=[];faces=[]
 for obj in bpy.data.collections[slot if slot.startswith('NA •') else 'Stock • '+slot].objects:
  if obj.type!='MESH':continue
  start=len(points);points.extend(obj.matrix_world@v.co for v in obj.data.vertices)
  for f in obj.data.polygons:
   if obj.data.materials[f.material_index].name.startswith('Miata_Paint_'):faces.append([start+i for i in f.vertices])
 return BVHTree.FromPolygons(points,faces)
def mesh(name,points,faces,col,mat=paint):
 data=bpy.data.meshes.new(name);data.from_pydata(points,[],faces);data.materials.append(mat);data.update()
 obj=bpy.data.objects.new(name,data);col.objects.link(obj);obj['fitted']=True;obj['authored']='Wings West W-Type inspired'
 bm=bmesh.new();bm.from_mesh(data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(data);bm.free()
 for f in data.polygons:f.use_smooth=True
 return obj
def finish(obj,thickness=.18):
 mod=obj.modifiers.new('Panel thickness','SOLIDIFY');mod.thickness=thickness;mod.offset=-1;apply(obj,mod)
def cutter(obj,center,size,radius,taper=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=center);tool=bpy.context.object;tool.dimensions=size
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 for v in tool.data.vertices:
  if v.co.z<0:v.co.x*=1-taper
 bevel=tool.modifiers.new('Rounded aperture corners','BEVEL');bevel.width=radius;bevel.segments=5;apply(tool,bevel)
 mod=obj.modifiers.new('Functional aperture','BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=tool;apply(obj,mod)
 bpy.data.objects.remove(tool,do_unlink=True)
def bumper(col,slot):
 # The rear panel starts directly below the upper bumper molding, matching
 # the user's annotated mounting line; no stock lower band remains.
 front=slot=='bumper-front';cut=-8.8 if front else -6.8
 clone_stock(slot,col,cut)
 ref=reference(slot);center=Vector((0,128 if front else 12,cut));sign=1 if front else -1
 points=[];faces=[];cols=129;rows=25
 for i in range(cols):
  extent=math.radians(82.6) if front else math.pi/2
  angle=-extent+2*extent*i/(cols-1);direction=Vector((math.sin(angle),sign*math.cos(angle),0))
  hit,*_=ref.ray_cast(center+direction*55,-direction,55)
  if hit is None:hit=center+Vector((33*math.sin(angle),sign*19*math.cos(angle),0))
  for j in range(rows):
   t=j/(rows-1)
   # Rounded, modest projection with a kicked lower lip, following the stock
   # bumper contour exactly at the mounting edge.
   projection=(.15*math.sin(math.pi*t)+1.05*math.exp(-((t-.92)/.095)**2))*min(1,math.cos(angle)*3+.1)
   p=hit+direction*projection
   bottom=-20.0
   p.z=cut+(bottom-cut)*t
   if not front:
    # Follow the stock bumper's inward roll before extending the lower lip.
    inset=.55*math.sin(math.pi*t/2)-.55*math.exp(-((t-.90)/.09)**2)
    p.x=hit.x-direction.x*inset
    p.y=hit.y-direction.y*inset
    # Return the ends to the original rear wheel arch, including its lower sweep.
    edge=abs(math.sin(angle))**12
    arch_y=25.8-math.sqrt(max(0,14.9**2-(p.z+12.1)**2))
    p.y=p.y*(1-edge*t)+arch_y*edge*t
   points.append(tuple(p))
 for i in range(cols-1):
  for j in range(rows-1):
   a=i*rows+j;faces.append((a,a+rows,a+rows+1,a+1))
 obj=mesh(col.name+'_LowerValance',points,faces,col);finish(obj,.35)
 if front:
  cutter(obj,(0,146,-13.6),(34,30,4.7),1.10,.23)
  for x in [-24,24]:cutter(obj,(x,145,-14.2),(7.1,30,3.6),1.15,.12)
 else:cutter(obj,(18,-4,-20.1),(5.6,30,5.5),2.4)
 return obj
def skirts(col):
 clone_stock('skirts',col)
 refs=[reference('skirts'),reference('fenders-front'),reference('NA • Fixed shell')];points=[];faces=[];steps=121;rows=17
 def smooth(t):
  t=max(0,min(1,t));return t*t*(3-2*t)
 def surface(y,z):
  hits=[ref.ray_cast(Vector((50,y,z)),Vector((-1,0,0)),50)[0] for ref in refs]
  hits=[p.x for p in hits if p is not None and p.x>29]
  if not hits:
   hits=[ref.ray_cast(Vector((50,y,-17.2)),Vector((-1,0,0)),50)[0] for ref in refs]
   hits=[p.x for p in hits if p is not None and p.x>29]
  if not hits:raise RuntimeError(f'Missing rocker mounting surface at {y}, {z}')
  return max(hits)
 for sign in [-1,1]:
  start=len(points)
  for i in range(steps):
   t=i/(steps-1);y=42.0+60.0*t
   # W-Type's smooth sill with the taller upswept rear mounting end.
   # Tall flat end sections, a short rear drop and a longer front sweep,
   # following the solid outline in the user's side-view markup.
   rise=9.6*(1-smooth((t-.15)/.045))+10.2*smooth((t-.78)/.12)
   top=-16.6+rise;bottom=-20.0-.45*math.sin(math.pi*t)
   mount=surface(y,top)
   lower=surface(y,-17.2)
   for j in range(rows):
    v=j/(rows-1);z=top+(bottom-top)*v
    x=max(mount*(1-v)+lower*v,surface(y,z))
    # Broad recessed face above a narrow rounded sill, as in the reference.
    # Keep the rolled sill at one height. The sloping shoulder above it
    # blends the wide end panels into the recessed middle.
    shoulder=(1-smooth(t/.30))+smooth((t-.72)/.28)
    bulge=.08+.22*shoulder*math.sin(math.pi*v)+.90*smooth((-z-17.7)/1.9)-.12*smooth((-z-19.7)/.7)
    diagonal=-7.0-9.6*smooth(t/.20) if t<.5 else -16.6+10.2*smooth((t-.78)/.22)
    bulge+=.30*shoulder*smooth((diagonal-z)/1.8)
    end_sweep=(-2.0*(1-t)**12+1.2*t**12)*v
    points.append((sign*(x+bulge),y+end_sweep,z))
  # Smooth changes across source-object seams while keeping the mounting
  # row on the measured stock surface.
  for _ in range(5):
   previous=points[:]
   for i in range(1,steps-1):
    for j in range(1,rows):
     k=start+i*rows+j;x,y,z=previous[k]
     x=(previous[k-rows][0]+2*x+previous[k+rows][0])/4
     points[k]=(x,y,z)
  for i in range(steps-1):
   for j in range(rows-1):
    a=start+i*rows+j;faces.append((a,a+rows,a+rows+1,a+1))
  # Close both ends with an inward return, avoiding exposed open panel edges.
  for i in [0,steps-1]:
   outer=[start+i*rows+j for j in range(rows)]
   inner=[]
   for k in outer:
    x,y,z=points[k];inner.append(len(points));points.append((x-sign*.95,y,z))
   for j in range(rows-1):faces.append((outer[j],outer[j+1],inner[j+1],inner[j]))
 obj=mesh(col.name+'_Sills',points,faces,col);finish(obj,.16)
 return obj
parts=[('WingsWestFront','bumper-front','bumperFront'),('WingsWestRear','bumper-rear','bumperRear'),('WingsWestSkirts','skirts','skirts')]
manifest=json.loads((ROOT/'models/na-parts-manifest.json').read_text())
manifest=[p for p in manifest if p.get('value')!='wings-west']
for name,slot,key in parts:
 col=collection(name)
 obj=skirts(col) if slot=='skirts' else bumper(col,slot)
 allpoints=[o.matrix_world@v.co for o in col.objects if o.type=='MESH' for v in o.data.vertices]
 manifest.append({'source':name,'authored':True,'generator':'scripts/build-wings-west.py','slot':slot,'value':'wings-west','label':'Wings West W-Type Inspired','path':f'/body/na/{slot}/wings-west.glb','bounds_inches':[[min(p[i] for p in allpoints),max(p[i] for p in allpoints)] for i in range(3)],'vertices':sum(len(o.data.vertices) for o in col.objects if o.type=='MESH'),'faces':sum(len(o.data.polygons) for o in col.objects if o.type=='MESH'),'materials':sorted({m.name for o in col.objects if o.type=='MESH' for m in o.data.materials if m})})
for col in bpy.context.scene.collection.children:
 visible=col.name.startswith('NA •') or (col.name.startswith('Stock •') and col.name not in ['Stock • bumper-front','Stock • bumper-rear','Stock • skirts']) or col.name in [p[0] for p in parts]
 for obj in col.objects:obj.hide_render=not visible;obj.hide_set(not visible)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'models/na/na-body-customization.blend'))
(OUT/'models/na-parts-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
tree=ast.parse((ROOT/'scripts/export-na-body-parts.py').read_text(encoding='utf-8'));ns={}
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom,ast.FunctionDef))],type_ignores=[]),'export','exec'),ns)
for name,slot,key in parts:ns['export_collection'](bpy.data.collections[name],OUT/f'public/body/na/{slot}/wings-west.glb')
scene=bpy.context.scene;camera=scene.camera
scene.display.shading.color_type='SINGLE';scene.display.shading.single_color=(.5,.5,.5)
scene.render.resolution_x=1200;scene.render.resolution_y=850
for name,pos,target,scale in [('front',(130,225,65),(0,120,-6),100),('rear',(125,-100,45),(0,10,-6),100),('side',(180,70,20),(0,72,-5),170)]:
 camera.location=pos;camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.ortho_scale=scale
 scene.render.filepath=str(OUT/f'{name}.png');bpy.ops.render.render(write_still=True)
