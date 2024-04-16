export function floorMaker(THREE: any, size: number = 10, divisions: number = 10) {
  const gridHelper = new THREE.GridHelper(size, divisions);

  // Get the renderer
  const renderer = new THREE.WebGLRenderer();

  // Set the background color
  renderer.setClearColor(0x474747);

  return gridHelper;
}