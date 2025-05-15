import { Settings } from "../assets/common/settingsStore";
import { calculateWheelPosition, WheelPosition } from "./common/wheelPositionCalculator";


export function makeWheels(
    THREE: any,
    x: number,
    y: number,
    z: number,
    wheelWidth: number,
    wheelDiameter: number,
    position: WheelPosition,
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

    // Calculate wheel position and rotation
    const wheelData = calculateWheelPosition(position, settings);
    
    // Apply position and rotation
    wheel.rotation.x = wheelData.rotation.x;
    wheel.rotation.z = wheelData.rotation.z;
    wheel.position.x = wheelData.position.x;
    wheel.position.y = wheelData.position.y;
    wheel.position.z = wheelData.position.z;

    return wheel;
}