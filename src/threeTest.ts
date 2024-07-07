import * as THREE from "three";
import { floorMaker } from "./assets/floor";
import { makeCar } from "./assets/carMaker";
import { animate } from "./assets/animate";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";

const scene = new THREE.Scene();

const renderer = render();
renderer.setClearColor( 0x424242, 1 );
const { camera, controls } = makeCamera(renderer, 100);
setUpLighting(scene);

scene.add(makeCar(THREE, scene));
scene.add(floorMaker(THREE, 10000, 10000));

animate(scene, camera, renderer, controls);
