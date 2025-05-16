import { Settings } from "./settingsStore";
import { WHEEL_POSITIONS } from "../../mainComponent";
import rollingDiameter from "./rollingDiameter";

const mmToFeet = (mm: number) => mm / 25.4 / 12;

export type WheelPosition = "FL" | "FR" | "BL" | "BR";

export interface WheelPositionData {
    rotation: {
        x: number;
        z: number;
    };
    position: {
        x: number;
        y: number;
        z: number;
    };
}

export function calculateWheelPosition(position: WheelPosition, settings: Settings): WheelPositionData {
    const isFront = position.startsWith("F");
    const isLeft = position.endsWith("L");
    
    const camber = isFront ? settings.frontCamber : settings.rearCamber;
    const toe = isFront ? settings.frontToe : settings.rearToe;
    const wheelDiameter = isFront ? settings.frontWheelDiameter : settings.rearWheelDiameter;
    const tireWidth = isFront ? settings.frontTireWidth : settings.rearTireWidth;
    const tireSidewall = isFront ? settings.frontTireSidewall : settings.rearTireSidewall;
    const wheelOffset = isFront ? settings.frontWheelOffset : settings.rearWheelOffset;
    const wheelSpacer = isFront ? settings.frontWheelSpacer : settings.rearWheelSpacer;
    const rideHeight = isFront ? settings.rideHeightFront : settings.rideHeightRear;

    const wheelPos = isFront 
        ? (isLeft ? WHEEL_POSITIONS.FRONT.LEFT : WHEEL_POSITIONS.FRONT.RIGHT)
        : (isLeft ? WHEEL_POSITIONS.REAR.LEFT : WHEEL_POSITIONS.REAR.RIGHT);

    const camberRad = (Math.min(Math.max(camber, -20), 1) * Math.PI) / 180;
    const toeRadiusComp = (rollingDiameter(wheelDiameter, tireWidth, tireSidewall) * 
        Math.sin(isLeft ? toe : -toe)) / 12;

    const baseX = isFront 
        ? wheelPos.x + (isFront ? settings.frontCaster / wheelPos.casterOffset : 0)
        : wheelPos.x;
    const baseZ = wheelPos.z;
    const offset = mmToFeet(isLeft ? -wheelOffset : wheelOffset);
    const spacer = mmToFeet(isLeft ? wheelSpacer : -wheelSpacer);
    const zPos = baseZ + offset + spacer;

    return {
        rotation: {
            x: isLeft ? Math.PI / 2 + camberRad : Math.PI / 2 - camberRad,
            z: toeRadiusComp
        },
        position: {
            x: baseX,
            y: rideHeight,
            z: zPos
        }
    };
} 