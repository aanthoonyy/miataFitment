import { Settings } from "./common/settingsStore";
import rollingDiameter from "./common/rollingDiameter";

function barrelAndLipOffsetCalculation(totalWheelWidth: number) {
    const offset = 2 - (8 - totalWheelWidth) * 0.2;
    return offset;
}

export function makeWheels(
    THREE: any,
    x: number,
    y: number,
    z: number,
    wheelWidth: number,
    wheelDiameter: number,
    position: string,
    settings: Settings
) {
    const wheelGeometry = new THREE.CylinderGeometry(7/12, 7/12, 0.01/12, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    const sideCylinderGeometry = new THREE.CylinderGeometry(
        (wheelDiameter/2)/12,
        (wheelDiameter/2)/12,
        (wheelWidth/2)/12,
        32
    );
    const sideCylinderMaterial = new THREE.MeshPhysicalMaterial({color: 0xFFFFFF});
    sideCylinderMaterial.roughness = 0.2;
    sideCylinderMaterial.metalness = .5;
    sideCylinderMaterial.specularIntensity = 1;
    sideCylinderMaterial.clearcoat = 1;
    sideCylinderMaterial.clearcoatRoughness = 0.1;

    const sideCylinder1 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder1.position.y = (wheelWidth/4)/12;
    wheel.add(sideCylinder1);

    const sideCylinder2 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder2.position.y = -(wheelWidth/4)/12;
    wheel.add(sideCylinder2);

    wheel.rotation.x = Math.PI / 2;
    wheel.position.x = x;
    wheel.position.z = y;
    wheel.position.y = z;

    if (position === "FL"){
        const camberRad = (Math.min(Math.max(settings.frontCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.frontWheelDiameter, settings.frontTireWidth, settings.frontTireSidewall) * Math.sin(settings.frontToe)/12);
        const baseX = -4.45 + settings.frontCaster / 5.74 / 12;
        const baseZ = 3.04;
        const offset = -(settings.frontWheelOffset / 25.4);
        const spacer = settings.frontWheelSpacer / 25.4;
        const zPos = baseZ + offset + spacer;

        wheel.rotation.x = Math.PI / 2 + camberRad;
        wheel.rotation.z = toeRadiusComp;
        wheel.position.x = baseX;
        wheel.position.z = zPos;
        wheel.position.y = settings.rideHeightFront;
    }
    if (position === "FR"){
        const camberRad = (Math.min(Math.max(-settings.frontCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.frontWheelDiameter, settings.frontTireWidth, settings.frontTireSidewall) * -Math.sin(settings.frontToe)/12);
        const baseX = -4.45 + settings.frontCaster / 5.74 / 12;
        const baseZ = -3.04;
        const offset = settings.frontWheelOffset / 25.4;
        const spacer = -(settings.frontWheelSpacer / 25.4);
        const zPos = baseZ + offset + spacer;

        wheel.rotation.x = Math.PI / 2 + camberRad;
        wheel.rotation.z = toeRadiusComp;
        wheel.position.x = baseX;
        wheel.position.z = zPos;
        wheel.position.y = settings.rideHeightFront;
    }
    if (position === "BL"){
        const camberRad = (Math.min(Math.max(settings.rearCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.rearWheelDiameter, settings.rearTireWidth, settings.rearTireSidewall) * Math.sin(settings.rearToe)/12);
        const baseX = 4.45;
        const baseZ = 3.08;
        const offset = -(settings.rearWheelOffset / 25.4);
        const spacer = settings.rearWheelSpacer / 25.4;
        const zPos = baseZ + offset + spacer;

        wheel.rotation.x = Math.PI / 2 + camberRad;
        wheel.rotation.z = toeRadiusComp;
        wheel.position.x = baseX;
        wheel.position.z = zPos;
        wheel.position.y = settings.rideHeightRear;
    }
    if (position === "BR"){
        const camberRad = (Math.min(Math.max(-settings.rearCamber, -20), 1) * Math.PI) / 180;
        const toeRadiusComp = (rollingDiameter(settings.rearWheelDiameter, settings.rearTireWidth, settings.rearTireSidewall) * -Math.sin(settings.rearToe)/12);
        const baseX = 4.45;
        const baseZ = -3.08;
        const offset = settings.rearWheelOffset / 25.4;
        const spacer = -(settings.rearWheelSpacer / 25.4);
        const zPos = baseZ + offset + spacer;

        wheel.rotation.x = Math.PI / 2 + camberRad;
        wheel.rotation.z = toeRadiusComp;
        wheel.position.x = baseX;
        wheel.position.z = zPos;
        wheel.position.y = settings.rideHeightRear;
    }
    return wheel;
}