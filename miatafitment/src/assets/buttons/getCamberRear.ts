import * as THREE from 'three';

function getCamberRear() {
    let camber = document.getElementById('rearCamber') as HTMLInputElement;

    let camb = camber?.value ? parseFloat(camber?.value) : 14;
    
    return THREE.MathUtils.degToRad(camb);
}

export { getCamberRear };