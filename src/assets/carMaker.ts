import { rideHeightSlider } from "./sliders/RideHeightSlider";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function makeCar(THREE: any, scene: any, y: number){

    const material = new THREE.MeshPhysicalMaterial({color: 0xff0000}, 0); // this is red
    
    let geometry = new THREE.BoxGeometry(0,0,0);
    const car = new THREE.Mesh(geometry, material);

    const loader = new GLTFLoader();
    loader.load(
        '/MiataFixed.glb',
        ( gltf ) => {
            gltf.scene.scale.set(1/12, 1/12, 1/12);
            gltf.scene.rotation.y = Math.PI / 2;
            gltf.scene.position.y = y;
            rideHeightSlider(gltf.scene);
            //scene.add( gltf.scene );
            car.add(gltf.scene);
        },
         ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
         ( error ) => {
            console.log( 'An error happened', error );
        }
    );
     
    return car;
}

