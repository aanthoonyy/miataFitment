export function floorMaker(THREE: any, size: number = 10, divisions: number = 10) {
  const gridHelper = new THREE.GridHelper(size, divisions);

  return gridHelper;
}