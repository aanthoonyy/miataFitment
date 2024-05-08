import * as THREE from 'three';

export function toeSlider(caster: any, wheelPos: string){
    const frontToeSlider = document.getElementById('frontToeSlider');
    const rearToeSlider = document.getElementById('rearToeSlider');

    if (frontToeSlider != null && (wheelPos === 'FL' || wheelPos === 'FR')) {
        frontToeSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            caster.rotation.z = wheelPos === 'FL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
            console.log(caster.rotation.z)
        });
    }

    if (rearToeSlider != null && (wheelPos === 'BR' || wheelPos === 'BL')) {
        rearToeSlider.addEventListener('input', (event) => {
            let degrees = parseFloat((<HTMLInputElement>event.target).value);
            caster.rotation.z = wheelPos === 'BL' ? THREE.MathUtils.degToRad(degrees) : -THREE.MathUtils.degToRad(degrees);
            console.log(caster.rotation.z)
        });
    }
}