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
        wheel.rotation.x = Math.PI / 2 + (settings.frontCamber * Math.PI) / 180;
        wheel.rotation.z = (rollingDiameter(settings.frontWheelDiameter, settings.frontTireWidth, settings.frontTireSidewall) * Math.sin(settings.frontToe)/12);
        wheel.position.x += (settings.frontCaster / 5.74)/12;
        wheel.position.z -= settings.frontWheelOffset/12;
        wheel.position.z -= settings.frontWheelSpacer/12;
        wheel.position.y = settings.rideHeightFront;
    }
    if (position === "FR"){
        wheel.rotation.x = Math.PI / 2 - (settings.frontCamber * Math.PI) / 180;
        wheel.rotation.z = (rollingDiameter(settings.frontWheelDiameter, settings.frontTireWidth, settings.frontTireSidewall) * -Math.sin(settings.frontToe)/12);
        wheel.position.x += (settings.frontCaster / 5.74)/12;
        wheel.position.z += settings.frontWheelOffset/12;
        wheel.position.z += settings.frontWheelSpacer/12;
        wheel.position.y = settings.rideHeightFront;
    }
    if (position === "BL"){
        wheel.rotation.x = Math.PI / 2 + (settings.rearCamber * Math.PI) / 180;
        wheel.rotation.z = (rollingDiameter(settings.rearWheelDiameter, settings.rearTireWidth, settings.rearTireSidewall) * Math.sin(settings.rearToe)/12);
        wheel.position.z -= settings.rearWheelOffset/12;
        wheel.position.z -= settings.rearWheelSpacer/12;
        wheel.position.y = settings.rideHeightRear;
    }
    if (position === "BR"){
        wheel.rotation.x = Math.PI / 2 - (settings.rearCamber * Math.PI) / 180;
        wheel.rotation.z = (rollingDiameter(settings.rearWheelDiameter, settings.rearTireWidth, settings.rearTireSidewall) * -Math.sin(settings.rearToe)/12);
        wheel.position.z += settings.rearWheelOffset/12;
        wheel.position.z += settings.rearWheelSpacer/12;
        wheel.position.y = settings.rideHeightRear;
    }
    return wheel;
}