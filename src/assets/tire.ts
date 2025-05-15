import rollingDiameter from "./common/rollingDiameter";
import { Settings } from "./common/settingsStore";

export function makeTires(
    THREE: any,
    x: number,
    y: number,
    z: number,
    wheelDiameter: number,
    wheelWidth: number,
    tireWidth: number,
    tireSideWall: number,
    position: string,
    settings: Settings
) {
    const totalDiameter = rollingDiameter(wheelDiameter, tireWidth, tireSideWall);
    let points = [];
    let beadleft = new THREE.Vector2( wheelDiameter/2, -1 * (wheelWidth - 0.0)/2);
    let treadleft = new THREE.Vector2( totalDiameter/2, -1 * tireWidth/2/12/2);
    let treadright = new THREE.Vector2( totalDiameter/2, tireWidth/2/12/2);
    let treadmidpoint = new THREE.Vector2( totalDiameter/2, 0);
    let beadright = new THREE.Vector2( wheelDiameter/2, (wheelWidth - 0.0)/2);
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
        const camberRad = (Math.min(Math.max(settings.frontCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.frontWheelDiameter, settings.frontTireWidth, settings.frontTireSidewall) * Math.sin(settings.frontToe)/12);
        const baseX = -4.45 + settings.frontCaster / 5.74 / 12;
        const baseZ = 3.04;
        const offset = -(settings.frontWheelOffset / 25.4);
        const spacer = settings.frontWheelSpacer / 25.4;
        const zPos = baseZ + offset + spacer;

        tire.rotation.x = Math.PI / 2 + camberRad;
        tire.rotation.z = toeRadiusComp;
        tire.position.x = baseX;
        tire.position.z = zPos;
        tire.position.y = settings.rideHeightFront;
    }
    if (position === "FR"){
        const camberRad = (Math.min(Math.max(-settings.frontCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.frontWheelDiameter, settings.frontTireWidth, settings.frontTireSidewall) * -Math.sin(settings.frontToe)/12);
        const baseX = -4.45 + settings.frontCaster / 5.74 / 12;
        const baseZ = -3.04;
        const offset = settings.frontWheelOffset / 25.4;
        const spacer = -(settings.frontWheelSpacer / 25.4);
        const zPos = baseZ + offset + spacer;

        tire.rotation.x = Math.PI / 2 + camberRad;
        tire.rotation.z = toeRadiusComp;
        tire.position.x = baseX;
        tire.position.z = zPos;
        tire.position.y = settings.rideHeightFront;
    }
    if (position === "BL"){
        const camberRad = (Math.min(Math.max(settings.rearCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.rearWheelDiameter, settings.rearTireWidth, settings.rearTireSidewall) * Math.sin(settings.rearToe)/12);
        const baseX = 4.45;
        const baseZ = 3.08;
        const offset = -(settings.rearWheelOffset / 25.4);
        const spacer = settings.rearWheelSpacer / 25.4;
        const zPos = baseZ + offset + spacer;

        tire.rotation.x = Math.PI / 2 + camberRad;
        tire.rotation.z = toeRadiusComp;
        tire.position.x = baseX;
        tire.position.z = zPos;
        tire.position.y = settings.rideHeightRear;
    }
    if (position === "BR"){
        const camberRad = (Math.min(Math.max(-settings.rearCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.rearWheelDiameter, settings.rearTireWidth, settings.rearTireSidewall) * -Math.sin(settings.rearToe)/12);
        const baseX = 4.45;
        const baseZ = -3.08;
        const offset = settings.rearWheelOffset / 25.4;
        const spacer = -(settings.rearWheelSpacer / 25.4);
        const zPos = baseZ + offset + spacer;

        tire.rotation.x = Math.PI / 2 + camberRad;
        tire.rotation.z = toeRadiusComp;
        tire.position.x = baseX;
        tire.position.z = zPos;
        tire.position.y = settings.rideHeightRear;
    }

    return tire;
}