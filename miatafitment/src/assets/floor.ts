export function floorMaker(THREE: any) {
  // Create a plane geometry for the floor
  const size = 10000;
  const divisions = 10000;
  const gridHelper = new THREE.GridHelper(size, divisions);
  //scene.add(gridHelper);

//   const floorGeometry = new THREE.PlaneGeometry(10, 10);
//   const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // grey
//   const floor = new THREE.Mesh(floorGeometry);
//   floor.rotation.x = Math.PI / -2; // Rotate the floor 90 degrees
  return gridHelper;
}
