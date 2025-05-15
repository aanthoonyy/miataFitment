import { Settings } from "./common/settingsStore";
import rollingDiameter from "./common/rollingDiameter";
import { calculateWheelPosition, WheelPosition } from "./common/wheelPositionCalculator";

export function makeTires(
    THREE: any,
    x: number,
    y: number,
    z: number,
    wheelDiameter: number,
    wheelWidth: number,
    tireWidth: number,
    tireSidewall: number,
    position: WheelPosition,
    settings: Settings
) {
    const totalDiameter = rollingDiameter(wheelDiameter, tireWidth, tireSidewall);
    let points = [];
    let beadleft = new THREE.Vector2(wheelDiameter/2, -1 * (wheelWidth - 0.0)/2);
    let treadleft = new THREE.Vector2(totalDiameter/2, -1 * tireWidth/2/12/2);
    let treadright = new THREE.Vector2(totalDiameter/2, tireWidth/2/12/2);
    let treadmidpoint = new THREE.Vector2(totalDiameter/2, 0);
    let beadright = new THREE.Vector2(wheelDiameter/2, (wheelWidth - 0.0)/2);
    beadleft = beadleft.divideScalar(12);
    treadleft = treadleft.divideScalar(12);
    treadright = treadright.divideScalar(12);
    treadmidpoint = treadmidpoint.divideScalar(12);
    beadright = beadright.divideScalar(12);

    let bevelpercent = 0.1;
    let betweenbeadleftandtreadleft = beadleft.clone().lerp(treadleft, 1 - bevelpercent);
    let betweentreadleftandmidpoint = treadleft.clone().lerp(treadmidpoint, bevelpercent);
    let betweentreadrightandmidpoint = treadright.clone().lerp(treadmidpoint, bevelpercent);
    let betweenbeadrightandtreadright = beadright.clone().lerp(treadright, 1 - bevelpercent);

    points.push(beadleft);

    let numpoints = 10;
    for (let i = 0; i < numpoints; i++){
        let t = i / numpoints;
        let x = (1 - t) * (1 - t) * betweenbeadleftandtreadleft.x + 2 * (1 - t) * t * treadleft.x + t * t * betweentreadleftandmidpoint.x;
        let y = (1 - t) * (1 - t) * betweenbeadleftandtreadleft.y + 2 * (1 - t) * t * treadleft.y + t * t * betweentreadleftandmidpoint.y;
        points.push(new THREE.Vector2(x, y));
    }
    for (let i = numpoints; i > 0; i--){
        let t = i / numpoints;
        let x = (1 - t) * (1 - t) * betweenbeadrightandtreadright.x + 2 * (1 - t) * t * treadright.x + t * t * betweentreadrightandmidpoint.x;
        let y = (1 - t) * (1 - t) * betweenbeadrightandtreadright.y + 2 * (1 - t) * t * treadright.y + t * t * betweentreadrightandmidpoint.y;
        points.push(new THREE.Vector2(x, y));
    }

    points.push(beadright);
    const tireGeometry = new THREE.LatheGeometry(points, 64);
    let tireMaterial = new THREE.MeshPhysicalMaterial({color: 0x202227}, false);
    tireMaterial.roughness = 0.5;
    tireMaterial.metalness = 0;
    tireMaterial.specularIntensity = 0.1;
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);

    const wheelData = calculateWheelPosition(position, settings);
    
    tire.rotation.x = wheelData.rotation.x;
    tire.rotation.z = wheelData.rotation.z;
    tire.position.x = wheelData.position.x;
    tire.position.y = wheelData.position.y;
    tire.position.z = wheelData.position.z;

    return tire;
}