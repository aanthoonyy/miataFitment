export function animate(scene: any, camera: any, renderer: any, controls: any) {
    requestAnimationFrame((timestamp: number) => animate(scene, camera, renderer, controls));

    controls.update();

    renderer.render(scene, camera);
}