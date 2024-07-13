import * as THREE from 'three';
export function setUpLighting(scene: any){
    const ambientLight = new THREE.AmbientLight(0x202125); // soft white light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // white, half intensity
    scene.add(directionalLight);
}