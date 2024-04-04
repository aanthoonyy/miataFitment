import * as THREE from 'three';

export function slider(cube: THREE.Mesh){
    const slider = document.getElementById('slider');

    if (slider != null) {
        slider.addEventListener('input', (event) => {
            cube.position.y = parseFloat((<HTMLInputElement>event.target).value);
        });
    }
}