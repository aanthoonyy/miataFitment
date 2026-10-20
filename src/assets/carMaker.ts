import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { inchesToFeet } from '@/utils/unitConversions';
import { disposeObject } from './common/disposeObject';

const INCH_SCALE = inchesToFeet(1);

// The mesh the .glb is attached to. It is a zero-sized box and never drawn, so
// the colour only shows if a model fails to attach.
const CAR_PLACEHOLDER_COLOR = 0xff0000;

const CAR_MODELS = {
  na: '/na_render.glb',
  nb: '/nb_render.glb',
  nd: '/nd_render.glb',
};

export function makeCar(y: number, model: string = 'na') {
    const material = new THREE.MeshPhysicalMaterial({ color: CAR_PLACEHOLDER_COLOR });
    const geometry = new THREE.BoxGeometry(0, 0, 0);
    const car = new THREE.Mesh(geometry, material);

    const loader = new GLTFLoader();
    const modelPath = CAR_MODELS[model as keyof typeof CAR_MODELS] || CAR_MODELS.na;

    return new Promise<THREE.Object3D>((resolve, reject) => {
        loader.load(
            modelPath,
            (gltf) => {
                // The model is authored in inches; the scene works in feet.
                gltf.scene.scale.set(INCH_SCALE, INCH_SCALE, INCH_SCALE);
                gltf.scene.rotation.y = Math.PI / 2;
                gltf.scene.position.y = y;
                gltf.scene.position.x = +5;
                car.add(gltf.scene);
                resolve(car);
            },
            undefined,
            // Without this the promise never settles when the .glb 404s or
            // fails to parse, and the car silently never appears.
            (error) => {
                disposeObject(car);
                reject(error);
            },
        );
    });
}
