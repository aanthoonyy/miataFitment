import type { BodyLoadStatus } from "@/types/bodyLoad";
import * as THREE from "three";

import { createCarBody } from "./body";
import type { CarAppearance } from "@/utils/carAppearance";
import { buildCorners, placeCorners, type Corners } from "./corners";
import { disposeObject } from "./common/disposeObject";
import { CORNERS, type CarModel } from "@/constants/wheelPositions";
import type { WheelDesign } from "@/constants/wheelDesigns";
import type { Settings } from "@/types/settings";
import { bounceCornerRotation } from "@/utils/bounceFrame";

export interface FitmentSnapshot {
  model: CarModel;
  wheelDesign: WheelDesign;
  settings: Settings;
  appearance: CarAppearance;
}

export interface SceneAssetError {
  kind: "car" | "wheel";
  cause: unknown;
}

export interface SceneFitment {
  replaceFitment(next: FitmentSnapshot): void;
  showBounce(bodyDropIn: number | null): void;
  dispose(): void;
}

export function createSceneFitment(
  scene: THREE.Scene,
  onAssetError?: (error: SceneAssetError) => void,
  onBodyStatus?: (status: BodyLoadStatus) => void,
): SceneFitment {
  let snapshot: FitmentSnapshot | null = null;
  const body = createCarBody(scene, (cause) => onAssetError?.({ kind: "car", cause }), onBodyStatus);
  let corners: Corners | null = null;
  let cornerGeneration = 0;
  let bodyDropIn: number | null = null;
  let disposed = false;

  const assertOpen = () => {
    if (disposed) throw new Error("Scene fitment has been disposed");
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
    body.showBounce(dropIn);
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

      body.replaceAppearance(next.model, next.appearance);
      if (cornersChanged) {
        retireCorners();
        corners = buildCorners(next.settings, next.model, next.wheelDesign);
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
      body.dispose();
      retireCorners();
      snapshot = null;
    },
  };
}
