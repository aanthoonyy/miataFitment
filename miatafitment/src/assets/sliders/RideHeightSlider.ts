import * as THREE from 'three';

export function rideHeightSlider(model: THREE.Object3D){
    const rideHeightSlider = document.getElementById('rideHeightSlider');

    if (rideHeightSlider != null) {
        rideHeightSlider.addEventListener('input', (event) => {
            model.position.y = parseFloat((<HTMLInputElement>event.target).value);
        });
    }
}