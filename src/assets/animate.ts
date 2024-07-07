export function animate(scene: any, camera: any, renderer: any, controls: any) {
    requestAnimationFrame(() => animate(scene, camera, renderer, controls));

    controls.update();

    renderer.render(scene, camera);
}