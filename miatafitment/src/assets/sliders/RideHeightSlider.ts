import * as THREE from 'three';

export function rideHeightSlider(cube: THREE.Mesh){
    const rideHeightSlider = document.getElementById('rideHeightSlider');

    if (rideHeightSlider != null) {
        rideHeightSlider.addEventListener('input', (event) => {
            cube.position.y = parseFloat((<HTMLInputElement>event.target).value);
        });
    }
    
}