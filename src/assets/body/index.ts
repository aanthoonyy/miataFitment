import type { BodyLoadStatus } from "@/types/bodyLoad";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BODY_SLOTS, bodyPartModelPath, shellModelPath } from "@/constants/bodyParts";
import type { CarModel } from "@/constants/wheelPositions";
import type { CarPaint } from "@/constants/carColors";
import type { CarAppearance } from "@/utils/carAppearance";
import { inchesToFeet } from "@/utils/unitConversions";
import { disposeObject } from "../common/disposeObject";

const PAINT_MATERIAL_PREFIX = "Miata_Paint_";
const CHASSIS_X_FT = 5;
const CHASSIS_Y_FT = -1.4;
const CHASSIS_ROTATION_Y_RAD = Math.PI / 2;
// Approximate metal flake without losing the diffuse base colour.
const METALLIC_FINISH = { metalness: 0.7, roughness: 0.25 };
const authoredFinish = new WeakMap<THREE.Material, { metalness: number; roughness: number }>();

type LoadedPart = { path: string; object: THREE.Object3D };

function paintModel(object: THREE.Object3D, paint: CarPaint) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
      if (!(material instanceof THREE.MeshStandardMaterial) || !material.name.startsWith(PAINT_MATERIAL_PREFIX)) continue;
      if (!authoredFinish.has(material)) {
        authoredFinish.set(material, { metalness: material.metalness, roughness: material.roughness });
      }
      const finish = paint.metallic ? METALLIC_FINISH : authoredFinish.get(material)!;
      material.color.set(paint.hex);
      material.metalness = finish.metalness;
      material.roughness = finish.roughness;
    }
  });
}

function desiredPaths(model: CarModel, appearance: CarAppearance): Map<string, string | null> {
  return new Map([
    ["shell", shellModelPath(model)],
    ...BODY_SLOTS.map((slot): [string, string | null] => [slot, bodyPartModelPath(model, slot, appearance.parts[slot])]),
  ]);
}

export function createCarBody(
  scene: THREE.Scene,
  onError: (cause: unknown) => void,
  onStatus?: (status: BodyLoadStatus) => void,
) {
  const root = new THREE.Group();
  const chassis = new THREE.Group();
  chassis.scale.setScalar(inchesToFeet(1));
  chassis.rotation.y = CHASSIS_ROTATION_Y_RAD;
  chassis.position.set(CHASSIS_X_FT, CHASSIS_Y_FT, 0);
  root.add(chassis);
  scene.add(root);

  const loader = new GLTFLoader();
  const loaded = new Map<string, LoadedPart>();
  let paint: CarPaint;
  let generation = 0;
  let pendingKey: string | null = null;
  let disposed = false;

  const reportStatus = (phase: BodyLoadStatus["phase"]) => {
    onStatus?.({ phase, hasBody: loaded.has("shell") });
  };

  const repaint = () => {
    for (const part of loaded.values()) paintModel(part.object, paint);
  };

  const replaceParts = async (paths: Map<string, string | null>, key: string) => {
    const request = ++generation;
    pendingKey = key;
    const changed = [...paths].filter(([slot, path]) => (loaded.get(slot)?.path ?? null) !== path);
    if (changed.length === 0) {
      pendingKey = null;
      reportStatus("ready");
      return;
    }
    reportStatus("loading");
    const results = await Promise.allSettled(changed.map(async ([slot, path]) => ({
      slot, path, object: path ? (await loader.loadAsync(path)).scene : null,
    })));
    const failure = results.find((result) => result.status === "rejected");
    if (disposed || request !== generation || failure) {
      for (const result of results) {
        if (result.status === "fulfilled" && result.value.object) disposeObject(result.value.object);
      }
      if (!disposed && request === generation) {
        pendingKey = null;
        if (failure?.status === "rejected") {
          reportStatus("error");
          onError(failure.reason);
        }
      }
      return;
    }

    // Commit the whole compatible selection together, after every new part is ready.
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      const { slot, path, object } = result.value;
      const previous = loaded.get(slot);
      if (previous) {
        chassis.remove(previous.object);
        disposeObject(previous.object);
        loaded.delete(slot);
      }
      if (object && path) {
        paintModel(object, paint);
        chassis.add(object);
        loaded.set(slot, { path, object });
      }
    }
    pendingKey = null;
    reportStatus("ready");
  };

  return {
    replaceAppearance(model: CarModel, appearance: CarAppearance) {
      if (disposed) throw new Error("Car body has been disposed");
      paint = appearance.paint;
      repaint();
      const paths = desiredPaths(model, appearance);
      const key = JSON.stringify([...paths]);
      if (pendingKey !== key) void replaceParts(paths, key);
    },
    showBounce(bodyDropIn: number | null) {
      root.position.y = bodyDropIn === null ? 0 : -inchesToFeet(bodyDropIn);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      generation++;
      scene.remove(root);
      disposeObject(root);
      root.clear();
      loaded.clear();
    },
  };
}
