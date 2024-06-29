import * as THREE from 'three';

function getCamberFront() {
    let camber = document.getElementById('frontCamber') as HTMLInputElement;

    let camb = camber?.value ? parseFloat(camber?.value) : 14;
    
    return THREE.MathUtils.degToRad(camb);
}

export { getCamberFront };