import { rideHeightSlider } from "./sliders/RideHeightSlider";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function makeCar(THREE: any, scene: any, y: number){

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
        'src/assets/models/miatanowheels4.glb',
        function ( gltf ) {
            gltf.scene.scale.set(1/12, 1/12, 1/12);
            gltf.scene.rotation.y = Math.PI / 2;
            gltf.scene.position.y = y;
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
     
    return cube;
}

