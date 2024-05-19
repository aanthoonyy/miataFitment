import { camberSlider } from "./sliders/CamberSlider";
import { casterSlider } from "./sliders/CasterSlider";
import { rideHeightSlider } from "./sliders/RideHeightSlider";
import { toeSlider } from "./sliders/ToeSlider";
import { makeTire } from "./tire";
import { makeWheels } from "./wheels";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function makeCar(THREE: any, scene: any){

    // materials
    const material = new THREE.MeshBasicMaterial({color: 0xff0000}, 0); // this is red
    material.visible = false;
    // cube
    const lengthInFeet = 156 / 12;
    const widthInFeet = 65.9 / 12;
    const heightInFeet = 28.6 / 12;
    
    let geometry = new THREE.BoxGeometry(lengthInFeet, heightInFeet, widthInFeet);
    const cube = new THREE.Mesh(geometry, material);

    cube.position.y = 2.5;
    rideHeightSlider(cube);


    // windshield
    // let windshieldGeometry = new THREE.BoxGeometry(48/12, 12/12, widthInFeet);

    // let windshield = new THREE.Mesh(windshieldGeometry, material);

    // windshield.rotation.z = -Math.PI / 4;

    // windshield.position.x = 1.75;
    // windshield.position.y = 2;
    // cube.add(windshield);

    const loader = new GLTFLoader();
    loader.load(
        // URL to the 3D model file
        'src/assets/miata.glb',
        // Function when resource is loaded
        function ( gltf ) {
            gltf.scene.scale.set(4, 4, 4);
            gltf.scene.rotation.y = Math.PI / 2;
            gltf.scene.position.y = -0.4
            rideHeightSlider(gltf.scene);
            scene.add( gltf.scene );
        },
        // Function called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // Function called when loading has errors
        function ( error ) {
            console.log( 'An error happened', error );
        }
    );

    // Wheels
    // let wheels = 0;
    const wheelsFL = makeWheels(THREE,4.65, 3.12, 1);
    camberSlider(wheelsFL, "FL");
    toeSlider(wheelsFL, "FL");
    casterSlider(wheelsFL, "FL");
    scene.add(wheelsFL);  
    // const wheelsFR = makeWheels(THREE, -4.45, 3.08, 1);
    // camberSlider(wheelsFR, "BL");
    // toeSlider(wheelsFR, "BL");
    // scene.add(wheelsFR);
    // const wheelsBL = makeWheels(THREE, -4.45, -3.08, 1);
    // camberSlider(wheelsBL, "BR");
    // toeSlider(wheelsBL, "BR");
    // scene.add(wheelsBL);
    // const wheelsBR = makeWheels(THREE, 4.65, -3, 1);
    // camberSlider(wheelsBR, "FR");
    // toeSlider(wheelsBR, "FR");
    // casterSlider(wheelsBR, "FR");
    // scene.add(wheelsBR);

    const tiresFL = makeTire(THREE, 4.65, 3.12, 1);
    camberSlider(tiresFL, "FL");
    toeSlider(tiresFL, "FL");
    casterSlider(tiresFL, "FL");
    scene.add(tiresFL);
    // const tiresBL = makeTire(THREE, -4.45, 3.08, 1);
    // camberSlider(tiresBL, "BL");
    // toeSlider(tiresBL, "BL");
    // scene.add(tiresBL);
    // const tiresFR = makeTire(THREE, -4.5, -3.08, 1);
    // camberSlider(tiresFR, "BR");
    // toeSlider(tiresFR, "BR");
    // scene.add(tiresFR);
    // const tiresBR = makeTire(THREE, 4.65, -3, 1);
    // camberSlider(tiresBR, "FR");
    // toeSlider(tiresBR, "FR");
    // casterSlider(tiresBR, "FR");
    // scene.add(tiresBR);
    
    return cube;
}

