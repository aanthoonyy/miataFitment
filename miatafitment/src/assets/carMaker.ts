import { getRideHeight } from "./buttons/getRideHeight";
import { rideHeightSlider } from "./sliders/RideHeightSlider";
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

    const loader = new GLTFLoader();
    loader.load(
        'src/assets/miata.glb',
        function ( gltf ) {
            gltf.scene.scale.set(4, 4, 4);
            gltf.scene.rotation.y = Math.PI / 2;
            gltf.scene.position.y = getRideHeight();
            rideHeightSlider(gltf.scene);
            scene.add( gltf.scene );
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened', error );
        }
    );

    // Wheels
    // let wheels = 0;
    // const wheelsFL = makeWheels(THREE, 4.65, 3.12, 1, testWheel);
    // camberSlider(wheelsFL, "FL");
    // toeSlider(wheelsFL, "FL");
    // casterSlider(wheelsFL, "FL");
    // scene.add(wheelsFL);  
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

    // const tiresFL = makeTire(THREE, 4.65, 3.09, 1);
    // camberSlider(tiresFL, "FL");
    // toeSlider(tiresFL, "FL");
    // casterSlider(tiresFL, "FL");
    // scene.add(tiresFL);
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

