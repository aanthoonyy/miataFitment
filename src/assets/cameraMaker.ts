import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export function makeCamera(renderer: THREE.WebGLRenderer, cameraZ: number){
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = cameraZ;
    const controls = new OrbitControls(camera, renderer.domElement);
    const targetPoint = new THREE.Vector3(0, -3, 0);
    controls.target.copy(targetPoint);
    controls.update();

    return {camera, controls};
}
