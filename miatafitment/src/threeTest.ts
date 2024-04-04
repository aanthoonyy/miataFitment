import * as THREE from "three";
import { floorMaker } from "./assets/floor";
import { makeCar } from "./assets/carMaker";
import { animate } from "./assets/animate";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";

const scene = new THREE.Scene();

const renderer = render();
const { camera, controls } = makeCamera(renderer, 100);

scene.add(makeCar(THREE));
scene.add(floorMaker(THREE, 10000, 10000));

animate(scene, camera, renderer, controls);
