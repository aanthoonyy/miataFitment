import * as THREE from "three";

import { makeCar } from "./carMaker";
import { buildCorners, placeCorners, type Corners } from "./corners";
import { disposeObject } from "./common/disposeObject";
import { CORNERS, type CarModel } from "@/constants/wheelPositions";
import type { WheelDesign } from "@/constants/wheelDesigns";
import type { Settings } from "@/types/settings";
import { bounceCornerRotation } from "@/utils/bounceFrame";
import { inchesToFeet } from "@/utils/unitConversions";

const CAR_BODY_Y_FT = -1.4;

export interface FitmentSnapshot {
  model: CarModel;
  wheelDesign: WheelDesign;
  settings: Settings;
}

export interface SceneAssetError {
  kind: "car" | "wheel";
  cause: unknown;
}

export interface SceneFitmentSources {
  loadCar(model: CarModel): Promise<THREE.Object3D>;
  buildCorners(settings: Settings, model: CarModel, design: WheelDesign): Corners;
}

export interface SceneFitment {
  replaceFitment(next: FitmentSnapshot): void;
  showBounce(bodyDropIn: number | null): void;
  dispose(): void;
}

const defaultSources: SceneFitmentSources = {
  loadCar: (model) => makeCar(CAR_BODY_Y_FT, model),
  buildCorners,
};

export function createSceneFitment(
  scene: THREE.Scene,
  onAssetError?: (error: SceneAssetError) => void,
  sources: SceneFitmentSources = defaultSources,
): SceneFitment {
  let snapshot: FitmentSnapshot | null = null;
  let car: THREE.Object3D | null = null;
  let corners: Corners | null = null;
  let carGeneration = 0;
  let cornerGeneration = 0;
  let bodyDropIn: number | null = null;
  let disposed = false;

  const assertOpen = () => {
    if (disposed) throw new Error("Scene fitment has been disposed");
  };

  const retireCar = () => {
    carGeneration++;
    if (!car) return;
    scene.remove(car);
    disposeObject(car);
    car = null;
  };

  const retireCorners = () => {
    cornerGeneration++;
    if (!corners) return;
    for (const object of [...corners.wheels, ...corners.tires]) {
      scene.remove(object);
      disposeObject(object);
    }
    corners = null;
  };

  const applyPose = () => {
    const current = snapshot;
    const currentCorners = corners;
    const dropIn = bodyDropIn;
    if (!current) return;
    if (car) car.position.y = dropIn === null ? 0 : -inchesToFeet(dropIn);
    if (!currentCorners) return;

    if (dropIn === null) {
      placeCorners(currentCorners, current.settings, current.model);
      return;
    }

    CORNERS.forEach((corner, index) => {
      const { xRad, zRad } = bounceCornerRotation(corner, current.settings, dropIn);
      for (const object of [currentCorners.wheels[index], currentCorners.tires[index]]) {
        if (!object) continue;
        object.rotation.x = xRad;
        object.rotation.z = zRad;
      }
    });
  };

  const loadCar = (model: CarModel) => {
    const generation = carGeneration;
    void (async () => {
      try {
        const loaded = await sources.loadCar(model);
        if (disposed || generation !== carGeneration) {
          disposeObject(loaded);
          return;
        }
        car = loaded;
        scene.add(loaded);
        applyPose();
      } catch (cause) {
        if (!disposed && generation === carGeneration) onAssetError?.({ kind: "car", cause });
      }
    })();
  };

  const installWheels = (current: Corners) => {
    const generation = cornerGeneration;
    for (const { wheel, fitted, hideFallback } of current.pendingWheels) {
      void fitted.then((model) => {
        if (disposed || generation !== cornerGeneration) {
          disposeObject(model);
          return;
        }
        wheel.add(model);
        hideFallback();
      }).catch((cause) => {
        if (!disposed && generation === cornerGeneration) onAssetError?.({ kind: "wheel", cause });
      });
    }
  };

  return {
    replaceFitment(next) {
      assertOpen();
      const carChanged = !snapshot || next.model !== snapshot.model;
      const cornersChanged = carChanged || !snapshot ||
        next.settings !== snapshot.settings || next.wheelDesign !== snapshot.wheelDesign;
      snapshot = next;

      if (carChanged) {
        retireCar();
        loadCar(next.model);
      }
      if (cornersChanged) {
        retireCorners();
        corners = sources.buildCorners(next.settings, next.model, next.wheelDesign);
        for (const object of [...corners.wheels, ...corners.tires]) scene.add(object);
        applyPose();
        installWheels(corners);
      }
    },
    showBounce(nextBodyDropIn) {
      assertOpen();
      bodyDropIn = nextBodyDropIn;
      applyPose();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      retireCar();
      retireCorners();
      snapshot = null;
    },
  };
}
