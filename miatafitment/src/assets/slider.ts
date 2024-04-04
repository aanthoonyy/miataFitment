import * as THREE from 'three';

export function slider(cube: THREE.Mesh){
    const slider = document.getElementById('slider');

    // Add an event listener to the slider
    if (slider != null) {
        slider.addEventListener('input', (event) => {
            // Update the cube's y-axis position when the slider value changes
            cube.position.y = parseFloat((<HTMLInputElement>event.target).value);
        });
    }
}