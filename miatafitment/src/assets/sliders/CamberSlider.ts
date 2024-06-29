import * as THREE from 'three';

export function camberSlider(camber: any, wheelPos: string): number {
    const frontCamberSlider = document.getElementById('frontCamber');
    const rearCamberSlider = document.getElementById('rearCamber');

    if (frontCamberSlider != null && (wheelPos === 'FL' || wheelPos === 'FR')) {
        frontCamberSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            camber.rotation.x = wheelPos === 'FL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
            console.log(camber.rotation.x);
            return camber.rotation.x;
        });
    }

    if (rearCamberSlider != null && (wheelPos === 'BR' || wheelPos === 'BL')) {
        rearCamberSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            camber.rotation.x = wheelPos === 'BL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
            console.log(camber.rotation.x);
            return camber.rotation.x;
        });
    }

    return 0;
}
