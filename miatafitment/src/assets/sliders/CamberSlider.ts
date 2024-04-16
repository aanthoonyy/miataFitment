import * as THREE from 'three';

export function camberSlider(camber: any, wheelPos: string){
    const frontCamberSlider = document.getElementById('frontCamberSlider');
    const rearCamberSlider = document.getElementById('rearCamberSlider');

    if (frontCamberSlider != null && (wheelPos === 'FL' || wheelPos === 'FR')) {
        frontCamberSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            camber.rotation.x = wheelPos === 'FL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
        });
    }

    if (rearCamberSlider != null && (wheelPos === 'BR' || wheelPos === 'BL')) {
        rearCamberSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            camber.rotation.x = wheelPos === 'BL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
        });
    }
}