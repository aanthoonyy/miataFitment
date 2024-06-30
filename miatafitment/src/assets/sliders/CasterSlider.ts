export function casterSlider(caster: any, wheelPos: string){
    const frontCasterSlider = document.getElementById('frontCasterSlider');

    if (frontCasterSlider != null && (wheelPos === 'FL' || wheelPos === 'FR')) {
        frontCasterSlider.addEventListener('input', (event) => {
            let position = parseFloat((<HTMLInputElement>event.target).value);
            caster.position.x = wheelPos === 'FL' ? position : -position;
            console.log(caster.position.x)
        });
    }
}