import * as THREE from 'three';

export function camberSlider(camber: any, wheelPos: string){
    const frontCamberSlider = document.getElementById('frontCamberSlider');
    const rearCamberSlider = document.getElementById('rearCamberSlider');

    if (frontCamberSlider != null && (wheelPos === 'FL' || wheelPos === 'FR')) {
        frontCamberSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            camber.rotation.x = wheelPos === 'FL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
            console.log(camber.rotation.x)
        });
    }

    if (rearCamberSlider != null && (wheelPos === 'BR' || wheelPos === 'BL')) {
        rearCamberSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            camber.rotation.x = wheelPos === 'BL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
            console.log(camber.rotation.x)
        });
    }
}

// 1.2217 = -20 degrees
// 1.5708 = 0 degrees
// 1.5375 = -2 degrees
// 1.5219 = -3 degrees
// 1.5070 = -4 degrees
// 1.4900 = -5 degrees
// 1.4503 = -7 degrees
//https://www.fitmentindustries.com/wheel-offset-gallery/389516/1990-mazda-mx-5-miata-rota-rkr-hsd-coilovers-nankang-ns2