import { camberSlider } from "./sliders/CamberSlider";
import { rideHeightSlider } from "./sliders/RideHeightSlider";
import { makeTire } from "./tire";
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
    rideHeightSlider(cube);


    // windshield
    let windshieldGeometry = new THREE.BoxGeometry(48/12, 12/12, widthInFeet);

    let windshield = new THREE.Mesh(windshieldGeometry, material);

    windshield.rotation.z = -Math.PI / 4;

    windshield.position.x = 1.75;
    windshield.position.y = 2;
    cube.add(windshield);


    // Wheels
    // let wheels = 0;
    const wheelsFL = makeWheels(THREE, 4, 2.75, 1);
    camberSlider(wheelsFL, "FL");
    scene.add(wheelsFL);  
    const wheelsFR = makeWheels(THREE, -4, 2.75, 1);
    camberSlider(wheelsFR, "BL");
    scene.add(wheelsFR);
    const wheelsBL = makeWheels(THREE, -4, -2.75, 1);
    camberSlider(wheelsBL, "BR");
    scene.add(wheelsBL);
    const wheelsBR = makeWheels(THREE, 4, -2.75, 1);
    camberSlider(wheelsBR, "FR");
    scene.add(wheelsBR);

    const tiresFL = makeTire(THREE, 4, 2.75, 1);
    camberSlider(tiresFL, "FL");
    scene.add(tiresFL);
    const tiresBL = makeTire(THREE, -4, 2.75, 1);
    camberSlider(tiresBL, "BL");
    scene.add(tiresBL);
    const tiresFR = makeTire(THREE, -4, -2.75, 1);
    camberSlider(tiresFR, "BR");
    scene.add(tiresFR);
    const tiresBR = makeTire(THREE, 4, -2.75, 1);
    camberSlider(tiresBR, "FR");
    scene.add(tiresBR);
    
    return cube;
}

