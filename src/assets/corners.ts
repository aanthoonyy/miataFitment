import * as THREE from "three";

import { makeWheels } from "./wheels";
import { makeTires } from "./tire";
import { axleSettings } from "./common/axleSettings";
import { calculateWheelPosition } from "./common/wheelPositionCalculator";
import { CORNERS, type CarModel } from "@/constants/wheelPositions";
import type { WheelDesign } from "@/constants/wheelDesigns";
import type { Settings } from "@/types/settings";

// A corner is a wheel and the tire around it, built, placed and torn down
// together. Everything here works on all four at once, because nothing in the
// scene ever wants just one.

export interface Corners {
    wheels: THREE.Object3D[];
    tires: THREE.Object3D[];
    pendingWheels: {
        wheel: THREE.Object3D;
        fitted: Promise<THREE.Object3D>;
        hideFallback: () => void;
    }[];
}

export function buildCorners(
    settings: Settings,
    model: CarModel,
    design: WheelDesign,
): Corners {
    const wheelBuilds = CORNERS.map((corner) => {
            const { wheelWidthIn, wheelDiameterIn } = axleSettings(corner, settings);
            return makeWheels(
                wheelWidthIn,
                wheelDiameterIn,
                corner,
                settings,
                model,
                design,
            );
        });
    return {
        wheels: wheelBuilds.map(({ wheel }) => wheel),
        tires: CORNERS.map((corner) =>
            makeTires(corner, settings, model),
        ),
        pendingWheels: wheelBuilds.flatMap(({ wheel, fitted, hideFallback }) =>
            fitted && hideFallback ? [{ wheel, fitted, hideFallback }] : [],
        ),
    };
}

// Puts every corner back where the settings say it belongs, undoing whatever
// the bounce left behind.
export function placeCorners(
    corners: Corners,
    settings: Settings,
    model: CarModel,
): void {
    CORNERS.forEach((corner, index) => {
        const { rotation, position } = calculateWheelPosition(
            corner,
            settings,
            model,
        );
        for (const object of [corners.wheels[index], corners.tires[index]]) {
            if (!object) continue;
            object.rotation.set(rotation.x, 0, rotation.z);
            object.position.set(position.x, position.y, position.z);
        }
    });
}
