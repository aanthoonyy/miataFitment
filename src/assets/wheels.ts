import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Settings } from "@/types/settings";
import {
    isLeft as isLeftCorner,
    type CarModel,
    type WheelPosition,
} from "@/constants/wheelPositions";
import type { WheelDesign } from "@/constants/wheelDesigns";
import { wheelModelPath } from "@/constants/wheelDesigns";
import { calculateWheelPosition } from "./common/wheelPositionCalculator";
import { axleSettings } from "./common/axleSettings";
import { inchesToFeet, mmToFeet } from "@/utils/unitConversions";
import type { WheelPart, WheelModel } from "@/types/wheels";
import { borrowMaterial, disposeObject } from "./common/disposeObject";

// --- knobs for fitting a .glb design onto the default wheel ---------------

// 1 means the model's bounding box exactly fills the nominal wheel size, so it
// occupies the same space the default barrel cylinders do. Real wheels measure
// ~1" over nominal across the flanges, so nudge these up if it reads small
// inside the tire. Shared by every .glb design.
const DIAMETER_FIT = 1.02;
const WIDTH_FIT = 1.02;

// The default wheel's plate sits on the centreline, so that's where the face
// goes. Turning this on moves it to where offset actually puts the mounting
// face, which makes the wheel dish as offset changes.
const PLATE_FOLLOWS_OFFSET = false;
const MAX_PLATE_FRACTION_OF_HALF_WIDTH = 0.9;

// How close to the axle a vertex has to be, as a fraction of wheel radius, to
// count as part of the hub plate. Loose enough to catch the spider and the bore
// lip, tight enough to exclude the spokes.
const HUB_RADIUS_THRESHOLD = 0.15;

// Used when a model has nothing near its axle at all, so the plate can't be
// located. Roughly a mid-dish wheel.
const FALLBACK_PLATE_FRACTION = 0.3;

// The plate sits (halfWidth - offset) in from the outboard flange, so for any
// offset a Miata could actually run it lands near a quarter of the width; even
// ET55 on a 6" wheel only reaches 0.14. A reading below that means the material
// nearest the axle isn't the plate at all -- usually a centre cap covering the
// bore out at the face -- and a reading of exactly 0 would divide by zero in
// the fitter. Clamping keeps a bad measurement merely inaccurate.
const MIN_PLATE_FRACTION = 0.1;
const MAX_PLATE_FRACTION = 0.45;

// The stand-in wheel drawn when no .glb design is selected: a thin disc at the
// mounting face with a barrel either side of it. Sizing and placement are read
// off these meshes even when a design hides them, so they exist at every size.
const PLATE_RADIUS_IN = 7;
const PLATE_THICKNESS_IN = 0.01;
const CYLINDER_SEGMENTS = 32;

// -------------------------------------------------------------------------

// One fetch, parse and normalise per design, shared by all four corners, and
// only for designs actually selected.
const wheelModelPromises = new Map<string, Promise<WheelModel>>();

// Bakes the .glb into a canonical shape the fitter can work in: Y is the axle
// with +Y outboard, Y runs 0 (inboard flange) to 1 (outboard flange), and the
// radial axes are centred on the axle with a max radius of 1. Doing this once
// means re-exporting the model at a different orientation or scale costs
// nothing.
function normalizeWheelModel(scene: THREE.Object3D, path: string): WheelModel {
    scene.updateWorldMatrix(true, true);

    const parts: WheelPart[] = [];
    scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);
        borrowMaterial(mesh.material);
        parts.push({ geometry, material: mesh.material });
    });

    const box = new THREE.Box3();
    for (const part of parts) {
        part.geometry.computeBoundingBox();
        box.union(part.geometry.boundingBox!);
    }
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // A wheel is always narrower than it is round, so the shortest side of the
    // bounding box is the axle.
    const toAxleY = new THREE.Matrix4();
    let axleLength: number;
    let radialLength: number;
    if (size.x <= size.y && size.x <= size.z) {
        toAxleY.makeRotationZ(Math.PI / 2);
        axleLength = size.x;
        radialLength = Math.max(size.y, size.z);
    } else if (size.y <= size.z) {
        axleLength = size.y;
        radialLength = Math.max(size.x, size.z);
    } else {
        toAxleY.makeRotationX(-Math.PI / 2);
        axleLength = size.z;
        radialLength = Math.max(size.x, size.y);
    }
    const normalize = new THREE.Matrix4()
        .multiply(new THREE.Matrix4().makeTranslation(0, 0.5, 0))
        .multiply(
            new THREE.Matrix4().makeScale(
                2 / radialLength,
                1 / axleLength,
                2 / radialLength,
            ),
        )
        .multiply(toAxleY)
        .multiply(
            new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z),
        );

    for (const part of parts) part.geometry.applyMatrix4(normalize);

    // Everything past here is measured off the model so a new design needs no
    // hand-entered numbers.
    //
    // The hub plate is whatever material sits closest to the axle, so the axle
    // positions of the near-axis vertices locate it. Median rather than mean,
    // so a stray vertex or a lug boss can't drag it.
    const hub: number[] = [];
    for (const part of parts) {
        const position = part.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < position.count; i++) {
            const radius = Math.hypot(position.getX(i), position.getZ(i));
            if (radius < HUB_RADIUS_THRESHOLD) hub.push(position.getY(i));
        }
    }

    if (!hub.length) {
        console.warn(
            "Wheel model has no material near its axle, so the hub plate " +
                "can't be located and the face may end up inboard",
            path,
        );
        return { parts, plateFraction: FALLBACK_PLATE_FRACTION };
    }

    hub.sort((a, b) => a - b);
    const plateAt = hub[hub.length >> 1];

    // A wheel's plate always sits nearer the face than the back, so the end the
    // plate leans towards is the outboard one. If that's the 0 end, the model is
    // back to front: flip it so +Y is outboard for every design.
    if (plateAt <= 0.5) {
        const flip = new THREE.Matrix4()
            .multiply(new THREE.Matrix4().makeTranslation(0, 1, 0))
            .multiply(new THREE.Matrix4().makeRotationX(Math.PI));
        for (const part of parts) part.geometry.applyMatrix4(flip);
    }

    // Whichever way it was facing, the plate is now this far in from the
    // outboard flange.
    return {
        parts,
        plateFraction: THREE.MathUtils.clamp(
            Math.min(plateAt, 1 - plateAt),
            MIN_PLATE_FRACTION,
            MAX_PLATE_FRACTION,
        ),
    };
}

function loadWheelModel(design: WheelDesign, path: string): Promise<WheelModel> {
    let promise = wheelModelPromises.get(design);
    if (!promise) {
        promise = new Promise((resolve, reject) => {
            new GLTFLoader().load(
                path,
                (gltf) => {
                    try {
                        resolve(normalizeWheelModel(gltf.scene, path));
                    } catch (error) {
                        reject(error);
                    } finally {
                        disposeObject(gltf.scene);
                    }
                },
                undefined,
                (error) => reject(error),
            );
        });
        wheelModelPromises.set(design, promise);
        void promise.catch(() => {
            if (wheelModelPromises.get(design) === promise) {
                wheelModelPromises.delete(design);
            }
        });
    }
    return promise;
}

// Pins the model's hub plate to plateY and grows the barrel and lip out from
// there to the flanges, rather than scaling the whole thing as one block. That
// keeps the face where the default wheel's plate is at any width, and leaves
// room for the plate to track offset later.
function fitWheelModel(
    parts: WheelPart[],
    wheelWidthIn: number,
    wheelDiameterIn: number,
    plateY: number,
    plateFraction: number,
) {
    // Same units as the default wheel: scene units are feet, specs are inches.
    const halfWidth = inchesToFeet((wheelWidthIn / 2) * WIDTH_FIT);
    const radius = inchesToFeet((wheelDiameterIn / 2) * DIAMETER_FIT);
    const plateLimit = halfWidth * MAX_PLATE_FRACTION_OF_HALF_WIDTH;
    const plate = THREE.MathUtils.clamp(plateY, -plateLimit, plateLimit);

    // Normalised axle coordinate of the model's plate, from the inboard flange.
    const plateAt = 1 - plateFraction;

    const group = new THREE.Group();
    for (const part of parts) {
        const geometry = part.geometry.clone();
        const position = geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < position.count; i++) {
            const a = position.getY(i);
            const y =
                a >= plateAt
                    ? plate + ((a - plateAt) / (1 - plateAt)) * (halfWidth - plate)
                    : -halfWidth + (a / plateAt) * (plate + halfWidth);
            position.setXYZ(
                i,
                position.getX(i) * radius,
                y,
                position.getZ(i) * radius,
            );
        }

        position.needsUpdate = true;
        // The stretch is non-uniform, so the baked normals no longer match the
        // surface. Hard edges survive because the export splits vertices there.
        geometry.computeVertexNormals();
        group.add(new THREE.Mesh(geometry, part.material));
    }
    return group;
}

export interface WheelBuild {
    wheel: THREE.Object3D;
    fitted?: Promise<THREE.Object3D>;
    hideFallback?: () => void;
}

export function makeWheels(
    wheelWidthIn: number,
    wheelDiameterIn: number,
    position: WheelPosition,
    settings: Settings,
    model: CarModel = "na",
    design: WheelDesign = "default"
): WheelBuild {
    const plateRadiusFt = inchesToFeet(PLATE_RADIUS_IN);
    const wheelGeometry = new THREE.CylinderGeometry(
        plateRadiusFt,
        plateRadiusFt,
        inchesToFeet(PLATE_THICKNESS_IN),
        CYLINDER_SEGMENTS,
    );
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    const barrelRadiusFt = inchesToFeet(wheelDiameterIn / 2);
    const sideCylinderGeometry = new THREE.CylinderGeometry(
        barrelRadiusFt,
        barrelRadiusFt,
        inchesToFeet(wheelWidthIn / 2),
        CYLINDER_SEGMENTS,
    );
    const sideCylinderMaterial = new THREE.MeshPhysicalMaterial({color: 0xFFFFFF});
    sideCylinderMaterial.roughness = 0.2;
    sideCylinderMaterial.metalness = .5;
    sideCylinderMaterial.specularIntensity = 1;
    sideCylinderMaterial.clearcoat = 1;
    sideCylinderMaterial.clearcoatRoughness = 0.1;

    // Two half-width barrels, each sitting a quarter of the width either side of
    // the plate, so together they span the full wheel.
    const barrelOffsetFt = inchesToFeet(wheelWidthIn / 4);

    const sideCylinder1 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder1.position.y = barrelOffsetFt;
    wheel.add(sideCylinder1);

    const sideCylinder2 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder2.position.y = -barrelOffsetFt;
    wheel.add(sideCylinder2);

    const wheelData = calculateWheelPosition(position, settings, model);

    wheel.rotation.x = wheelData.rotation.x;
    wheel.rotation.z = wheelData.rotation.z;
    wheel.position.x = wheelData.position.x;
    wheel.position.y = wheelData.position.y;
    wheel.position.z = wheelData.position.z;

    const modelPath = wheelModelPath(design);
    if (modelPath) {
        const isLeft = isLeftCorner(position);
        const { wheelOffsetMm } = axleSettings(position, settings);
        // The plate mesh sits at the wheel's centreline, so y = 0 is the plate.
        const plateY = PLATE_FOLLOWS_OFFSET ? mmToFeet(wheelOffsetMm) : 0;

        // The model arrives after this returns; the caller has already placed
        // the wheel by then, so it just pops in a frame later.
        const fitted = loadWheelModel(design, modelPath)
            .then((wheelModel) => {
                const model = fitWheelModel(
                    wheelModel.parts,
                    wheelWidthIn,
                    wheelDiameterIn,
                    plateY,
                    wheelModel.plateFraction,
                );
                // Both sides get the same rotation onto the axle, so local +Y
                // points outboard on the left of the car and inboard on the
                // right. Spin the right side round to keep the face outside.
                if (!isLeft) model.rotation.x = Math.PI;
                return model;
            });
        // The scene fitment owner decides whether this result is still current.
        return {
            wheel,
            fitted,
            hideFallback: () => {
                wheelMaterial.visible = false;
                sideCylinder1.visible = false;
                sideCylinder2.visible = false;
            },
        };
    }

    return { wheel };
}
