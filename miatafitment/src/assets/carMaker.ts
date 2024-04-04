import { slider } from "./slider";

export function makeCar(THREE: any){
    const lengthInFeet = 156 / 12;
    const widthInFeet = 65.9 / 12;
    const heightInFeet = 48.6 / 12;
    
    const geometry = new THREE.BoxGeometry(lengthInFeet, heightInFeet, widthInFeet);
    const materials = [
        new THREE.MeshBasicMaterial({color: 0xff0000}), // red
        new THREE.MeshBasicMaterial({color: 0x00ff00}), // green
        new THREE.MeshBasicMaterial({color: 0x0000ff}), // blue
        new THREE.MeshBasicMaterial({color: 0xffff00}), // yellow
        new THREE.MeshBasicMaterial({color: 0xff00ff}), // magenta
        new THREE.MeshBasicMaterial({color: 0x00ffff})  // cyan
    ];
    
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.y = 2;
    slider(cube);

    return cube;
}