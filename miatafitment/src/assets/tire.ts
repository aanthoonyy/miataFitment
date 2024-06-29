import { getWheelOffset } from "./buttons/getWheelOffset";

function milliMeterToInch(mm: number){
    return mm / 25.4;
}
function rollingDiameter(wheelDiameter: number, tireWidth: number, tireSideWall: number) {
    let sidewallHeightInInches = milliMeterToInch(tireWidth * (tireSideWall / 100));
    let totalDiameter = wheelDiameter + (2 * sidewallHeightInInches);
    return totalDiameter;
}

export function makeTires(THREE: any, x: number, y: number, z: number, wheelDiameter: number, tireWidth: number, tireSideWall: number) {
    const totalDiameter = rollingDiameter(wheelDiameter, tireWidth, tireSideWall);
    const tireGeometry = new THREE.CylinderGeometry(totalDiameter / 2 / 12, totalDiameter / 2 / 12, tireWidth / 25.4 / 12, 32);
    const tireMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);

    tire.rotation.x = Math.PI / 2;
    tire.position.x = x;
    tire.position.z = y;
    tire.position.y = z;

    tire.position.z -= getWheelOffset() / 12;

    return tire;
}