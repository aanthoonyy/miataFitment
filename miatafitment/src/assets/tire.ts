import * as THREE from 'three';
import { camberSlider } from './sliders/CamberSlider';

export function makeTire(THREE: any, x: number, y: number, z: number){
    const tireGeometry = new THREE.CylinderGeometry(11.3/12, 11.3/12, 7.2/12, 32); // radiusTop, radiusBottom, height, radialSegments
    const tireMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);


    // const tireSideWallGeometry = new THREE.CylinderGeometry(8.5/12, 14/12, 1.3/12, 32);
    // const tireSideWallMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    // const tireSideWall = new THREE.Mesh(tireSideWallGeometry, tireSideWallMaterial);
    // tireSideWall.position.y = 4.2/12;
    // tire.add(tireSideWall);

    
    tire.rotation.x = Math.PI / 2;
    tire.position.x = x;
    tire.position.z = y;
    tire.position.y = z;

    return tire;
}