import * as THREE from 'three';

export function rideHeightSlider(model: THREE.Object3D){
    const rideHeightSlider = document.getElementById('rideHeightSlider');
    console.log("in ride height")
    if (rideHeightSlider != null) {
        rideHeightSlider.addEventListener('input', (event) => {
            model.position.y = parseFloat((<HTMLInputElement>event.target).value);
        });
    }
}