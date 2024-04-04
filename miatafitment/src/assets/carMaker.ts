import { slider } from "./slider";
import { makeWheels } from "./wheels";

export function makeCar(THREE: any, scene: any){

    // materials
    const material = new THREE.MeshBasicMaterial({color: 0xff0000}); // this is red

    // cube
    const lengthInFeet = 156 / 12;
    const widthInFeet = 65.9 / 12;
    const heightInFeet = 28.6 / 12;
    
    let geometry = new THREE.BoxGeometry(lengthInFeet, heightInFeet, widthInFeet);
    const cube = new THREE.Mesh(geometry, material);

    cube.position.y = 2.5;
    slider(cube);


    // windshield
    let windshieldGeometry = new THREE.BoxGeometry(48/12, 12/12, widthInFeet);

    let windshield = new THREE.Mesh(windshieldGeometry, material);

    windshield.rotation.z = -Math.PI / 4;

    windshield.position.x = 1.75;
    windshield.position.y = 2;
    cube.add(windshield);


    // Wheels
    let wheels = 0;
    wheels = makeWheels(THREE, 4, 2.75, 1);
    scene.add(wheels);  
    wheels = makeWheels(THREE, -4, 2.75, 1);
    scene.add(wheels);
    wheels = makeWheels(THREE, -4, -2.75, 1);
    scene.add(wheels);
    wheels = makeWheels(THREE, 4, -2.75, 1);
    scene.add(wheels);
    return cube;
}

