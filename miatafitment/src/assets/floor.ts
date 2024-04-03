export function floorMaker(THREE: any, scene: any) {
  // Create a plane geometry for the floor
  const size = 10;
  const divisions = 10;
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // grey
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / -2; // Rotate the floor 90 degrees
  return floor;
}
