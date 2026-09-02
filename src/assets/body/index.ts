import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import {
    BODY_SLOTS,
    bodyPartModelPath,
    resolveBodyPart,
    shellModelPath,
    type BodyParts,
    type BodySlot,
} from "@/constants/bodyParts";
import type { CarModel } from "@/constants/wheelPositions";
import { inchesToFeet } from "@/utils/unitConversions";

// The car is a shell plus one model per slot, each loaded, swapped and torn
// down on its own. They share an origin, so none of them carries a transform:
// the whole car is scaled, turned and set down once, on the chassis group.

// The models are authored in inches; the scene works in feet.
const INCH_SCALE = inchesToFeet(1);
const CHASSIS_X_FT = 5;
const CHASSIS_Y_FT = -1.4;
const CHASSIS_ROTATION_Y_RAD = Math.PI / 2;

// The shell loads through the same path as a part, so it needs a slot name of
// its own to be tracked alongside them.
const SHELL = "shell";
type LoadSlot = BodySlot | typeof SHELL;
const LOAD_SLOTS: readonly LoadSlot[] = [SHELL, ...BODY_SLOTS];

export interface CarBody {
    // What the scene holds and the bounce moves. The chassis inside it carries
    // the placement every model shares.
    root: THREE.Group;
    chassis: THREE.Group;

    loaded: Record<LoadSlot, THREE.Object3D | null>;

    // Which part each slot is currently showing, so a settings change can tell
    // what actually has to be reloaded. null before anything has loaded.
    showing: Record<BodySlot, string | null>;

    // A slot can be swapped again while its file is still downloading, so each
    // carries a request id and discards anything that arrives stale.
    requestIds: Record<LoadSlot, number>;
}

const noneLoaded = () =>
    Object.fromEntries(LOAD_SLOTS.map((slot) => [slot, null])) as CarBody["loaded"];

const noneShowing = () =>
    Object.fromEntries(BODY_SLOTS.map((slot) => [slot, null])) as CarBody["showing"];

const noRequests = () =>
    Object.fromEntries(LOAD_SLOTS.map((slot) => [slot, 0])) as CarBody["requestIds"];

function disposeMaterial(material: THREE.Material) {
    for (const value of Object.values(material as unknown as Record<string, unknown>)) {
        if (value instanceof THREE.Texture) value.dispose();
    }
    material.dispose();
}

// `disposeObject` deliberately frees only geometries, because wheel designs
// share their materials out of a cache. A body model is parsed for this one car
// and owns everything it references, so its materials and textures go too.
function disposeBodyModel(object: THREE.Object3D) {
    const materials = new Set<THREE.Material>();

    object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        for (const material of ([] as THREE.Material[]).concat(mesh.material)) {
            materials.add(material);
        }
    });

    for (const material of materials) disposeMaterial(material);
}

function unload(body: CarBody, slot: LoadSlot) {
    const loaded = body.loaded[slot];
    if (!loaded) return;

    body.chassis.remove(loaded);
    disposeBodyModel(loaded);
    body.loaded[slot] = null;
}

// Bumping the request id is what makes this cancel an in-flight download as
// well as clear what is already on screen.
function load(body: CarBody, slot: LoadSlot, path: string | null) {
    const requestId = ++body.requestIds[slot];
    unload(body, slot);
    if (!path) return;

    new GLTFLoader().load(
        path,
        (gltf) => {
            if (requestId !== body.requestIds[slot]) {
                disposeBodyModel(gltf.scene);
                return;
            }
            body.loaded[slot] = gltf.scene;
            body.chassis.add(gltf.scene);
        },
        undefined,
        // One part failing leaves the rest of the car on screen, so this logs
        // rather than throwing.
        (error) => console.error("Failed to load body model", { slot, path }, error),
    );
}

// Loads whatever changed and leaves every other slot untouched, so swapping a
// bumper does not reload the car.
export function syncBodyParts(
    body: CarBody,
    model: CarModel,
    bodyParts: BodyParts,
) {
    for (const slot of BODY_SLOTS) {
        const part = resolveBodyPart(model, slot, bodyParts[slot]);
        if (part === body.showing[slot]) continue;

        body.showing[slot] = part;
        load(body, slot, bodyPartModelPath(model, slot, part));
    }
}

export function buildBody(model: CarModel, bodyParts: BodyParts): CarBody {
    const root = new THREE.Group();

    const chassis = new THREE.Group();
    chassis.scale.set(INCH_SCALE, INCH_SCALE, INCH_SCALE);
    chassis.rotation.y = CHASSIS_ROTATION_Y_RAD;
    chassis.position.set(CHASSIS_X_FT, CHASSIS_Y_FT, 0);
    root.add(chassis);

    // Every model arrives after this returns; the caller has already added the
    // body to the scene by then, so each piece pops in as it lands.
    const body: CarBody = {
        root,
        chassis,
        loaded: noneLoaded(),
        showing: noneShowing(),
        requestIds: noRequests(),
    };
    load(body, SHELL, shellModelPath(model));
    syncBodyParts(body, model, bodyParts);
    return body;
}

export function addBody(scene: THREE.Scene, body: CarBody) {
    scene.add(body.root);
}

export function removeBody(scene: THREE.Scene, body: CarBody) {
    for (const slot of LOAD_SLOTS) {
        body.requestIds[slot]++;
        unload(body, slot);
    }
    scene.remove(body.root);
}

// How far the body sits below where the settings put it, which is everything
// the bounce does to the car.
export function dropBody(body: CarBody, bodyDropIn: number) {
    body.root.position.y = -inchesToFeet(bodyDropIn);
}
