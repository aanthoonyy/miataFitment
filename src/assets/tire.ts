import { getCamberFront } from "./buttons/getCamberFront";
import { getCamberRear } from "./buttons/getCamberRear";
import { getCaster } from "./buttons/getCaster";
import { getRideHeightFront } from "./buttons/getRideHeightFront";
import { getRideHeightRear } from "./buttons/getRideHeightRear";
import { getTireSidewallFront } from "./buttons/getTireSidewallFront";
import { getTireSidewallRear } from "./buttons/getTireSidewallRear";
import { getTireWidthFront } from "./buttons/getTireWidthFront";
import { getTireWidthRear } from "./buttons/getTireWidthRear";
import { getToeFront } from "./buttons/getToeFront";
import { getToeRear } from "./buttons/getToeRear";
import { getWheelDiameterFront } from "./buttons/getWheelDiameterFront";
import { getWheelDiameterRear } from "./buttons/getWheelDiameterRear";
import { getWheelOffsetFront } from "./buttons/getWheelOffsetFront";
import { getWheelOffsetRear } from "./buttons/getWheelOffsetRear";
import { getWheelSpacerFront } from "./buttons/getWheelSpacerFront";
import { getWheelSpacerRear } from "./buttons/getWheelSpacerRear";
import rollingDiameter from "./common/rollingDiameter";

export function makeTires(THREE: any, x: number, y: number, z: number, wheelDiameter: number, wheelWidth: number, tireWidth: number, tireSideWall: number, position: string) {
    const totalDiameter = rollingDiameter(wheelDiameter, tireWidth, tireSideWall);
    let points = [];
    let beadleft = new THREE.Vector2( wheelDiameter/2, -1 * (wheelWidth - 0.25)/2);
    let treadleft = new THREE.Vector2( totalDiameter/2, -1 * tireWidth/2/12/2);
    let treadright = new THREE.Vector2( totalDiameter/2, tireWidth/2/12/2);
    let treadmidpoint = new THREE.Vector2( totalDiameter/2, 0);
    let beadright = new THREE.Vector2( wheelDiameter/2, (wheelWidth - 0.25)/2);
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

    // generate bezier points
    let numpoints = 10;
    for (let i = 0; i < numpoints; i++){
        let t = i / numpoints;
        let x = (1 - t) * (1 - t) * betweenbeadleftandtreadleft.x + 2 * (1 - t) * t * treadleft.x + t * t * betweentreadleftandmidpoint.x;
        let y = (1 - t) * (1 - t) * betweenbeadleftandtreadleft.y + 2 * (1 - t) * t * treadleft.y + t * t * betweentreadleftandmidpoint.y;
        points.push(new THREE.Vector2(x, y));
    }
    // mirror the bezier points
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
    

    tire.rotation.x = Math.PI / 2;
    tire.position.x = x;
    tire.position.z = y;
    tire.position.y = z;
    
    if (position === "FL"){
        tire.rotation.x = Math.PI / 2 + getCamberFront()
        tire.rotation.z = (rollingDiameter(getWheelDiameterFront(), getTireWidthFront(), getTireSidewallFront()) *  Math.sin(getToeFront())/12)
        tire.position.x += (getCaster() / 5.74)/12;
        tire.position.z -= getWheelOffsetFront()/12;
        tire.position.z -= getWheelSpacerFront()/12;
        tire.position.y = getRideHeightFront()

    }
    if (position === "FR"){
        tire.rotation.x = Math.PI / 2 - getCamberFront()
        tire.rotation.z = (rollingDiameter(getWheelDiameterFront(), getTireWidthRear(), getTireSidewallFront()) *  -Math.sin(getToeFront())/12)
        tire.position.x += (getCaster() / 5.74)/12;
        tire.position.z += getWheelOffsetFront()/12;
        tire.position.z += getWheelSpacerFront()/12;
        tire.position.y = getRideHeightFront()

    }
    if (position === "BL"){
        tire.rotation.x = Math.PI / 2 + getCamberRear()
        tire.rotation.z = (rollingDiameter(getWheelDiameterRear(), getTireWidthRear(), getTireSidewallRear()) *  Math.sin(getToeRear())/12)
        tire.position.z -= getWheelOffsetRear()/12;
        tire.position.z -= getWheelSpacerRear()/12;
        tire.position.y = getRideHeightRear()


    }
    if (position === "BR"){
        tire.rotation.x = Math.PI / 2 - getCamberRear()
        tire.rotation.z = (rollingDiameter(getWheelDiameterRear(), getTireWidthFront(), getTireSidewallRear()) *  -Math.sin(getToeRear())/12)
        tire.position.z += getWheelOffsetRear()/12;
        tire.position.z += getWheelSpacerRear()/12;
        tire.position.y = getRideHeightRear()

    }

    return tire;
}