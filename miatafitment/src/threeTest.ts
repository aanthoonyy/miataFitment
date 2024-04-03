import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { floorMaker } from './assets/floor';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 1, 1);
const materials = [
	new THREE.MeshBasicMaterial({color: 0xff0000}), // red
	new THREE.MeshBasicMaterial({color: 0x00ff00}), // green
	new THREE.MeshBasicMaterial({color: 0x0000ff}), // blue
	new THREE.MeshBasicMaterial({color: 0xffff00}), // yellow
	new THREE.MeshBasicMaterial({color: 0xff00ff}), // magenta
	new THREE.MeshBasicMaterial({color: 0x00ffff})  // cyan
];

const cube = new THREE.Mesh(geometry, materials);
cube.position.y = 0.5;
scene.add(cube);

scene.add(floorMaker(THREE, scene));

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
	requestAnimationFrame(animate);

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

	controls.update();

	renderer.render(scene, camera);
}

animate();