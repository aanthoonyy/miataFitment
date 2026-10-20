import assert from 'node:assert/strict';
import console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Texture } from 'three';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadConstants(relativePath, imports = {}) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: (name) => {
    assert.ok(name in imports, `Unexpected runtime import: ${name}`);
    return imports[name];
  } });
  return exports;
}

const strings = loadConstants('src/i18n/strings.ts');
const catalog = loadConstants('src/constants/bodyParts.ts', { '@/i18n/strings': strings });
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'models/na-parts-manifest.json'), 'utf8'));
const sources = fs.readdirSync(path.join(root, 'models/na')).filter((name) => name.endsWith('.obj')).sort();
assert.deepEqual(manifest.filter((part) => !part.authored).map((part) => part.source).sort(), sources, 'Every source OBJ needs an export');
const paths = new Set(['/na_render.glb']);
for (const slot of catalog.BODY_SLOTS) {
  const choices = catalog.bodyPartsFor('na', slot);
  assert.equal(new Set(choices.map((part) => part.value)).size, choices.length, `Duplicate ${slot} choices`);
  for (const part of choices) if (part.model) paths.add(part.model);
  for (const model of ['nb', 'nd']) assert.equal(catalog.bodyPartsFor(model, slot).length, 1);
}
for (const part of manifest) assert.ok(paths.has(part.path), `Unlisted export ${part.path}`);

for (const part of manifest.filter((entry) => entry.authored)) {
  assert.ok(fs.existsSync(path.join(root, part.generator)), `Missing generator: ${part.source}`);
}
let selected = catalog.selectBodyPart(catalog.DEFAULT_BODY_PARTS, 'headlights', 'pitcrew');
assert.equal(selected.bumperFront, 'pitcrew');
selected = catalog.selectBodyPart(selected, 'bumperFront', 'bn');
assert.equal(selected.headlights, 'stock');
selected = catalog.selectBodyPart(selected, 'roof', 'fastback');
selected = catalog.selectBodyPart(selected, 'rack', 'luggage');
assert.equal(selected.roof, 'stock');
const persisted = catalog.resolveBodyParts('na', { ...selected, roof: 'fastback', wing: 'ducktail' });
assert.equal(persisted.rack, 'stock');
assert.equal(persisted.wing, 'stock');
assert.equal(catalog.resolveBodyParts('nb', selected).rack, 'stock');

let meshes = 0;
for (const assetPath of paths) {
  const bytes = fs.readFileSync(path.join(root, 'public', assetPath));
  assert.equal(bytes.readUInt32LE(0), 0x46546c67, assetPath);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  // Node has no image decoder. Verify embedded image payloads here; the local
  // browser review checks their rendered appearance with the real decoder.
  const loader = new GLTFLoader().register((parser) => ({
    name: 'HeadlessEmbeddedImageCheck',
    loadTexture(index) {
      const image = parser.json.images[parser.json.textures[index].source];
      assert.ok(image && image.bufferView !== undefined, `${assetPath}: missing embedded image`);
      assert.ok(parser.json.bufferViews[image.bufferView].byteLength > 0);
      return Promise.resolve(new Texture());
    },
  }));
  const gltf = await loader.parseAsync(buffer, '');
  const box = new Box3().setFromObject(gltf.scene);
  assert.ok(!box.isEmpty(), `Empty model: ${assetPath}`);
  assert.ok([...box.min.toArray(), ...box.max.toArray()].every(Number.isFinite), assetPath);
  assert.ok(box.min.x > -45 && box.max.x < 45 && box.min.z > -160 && box.max.z < 20, `Wrong chassis frame: ${assetPath}`);
  let painted = 0;
  gltf.scene.traverse((object) => {
    if (!object.isMesh) return;
    meshes++;
    assert.ok(object.geometry.attributes.position.count > 0);
    for (const attribute of ['position', 'normal', 'uv']) {
      const values = object.geometry.attributes[attribute]?.array;
      if (values) assert.ok(values.every(Number.isFinite), `${assetPath}: invalid ${attribute}`);
    }
    for (const material of [object.material].flat()) {
      assert.ok(material.name.startsWith('Miata_'), `${assetPath}: unassigned source material`);
      if (material.name.startsWith('Miata_Paint_')) painted++;
    }
  });
  if (!assetPath.includes('/headlights/') && !assetPath.includes('/rack/')) assert.ok(painted > 0, assetPath);
}
console.log(`PASS: ${sources.length} OBJ variants + ${manifest.filter((part) => part.authored).length} authored variants, ${paths.size} GLBs, ${meshes} mesh primitives; catalog, materials, coordinates, and selection compatibility.`);
