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

function barrelAndLipOffsetCalculation(totalWheelWidth: number) {
    const offset = 2 - (8 - totalWheelWidth) * 0.2;

    return offset;
}

export function makeWheels(THREE: any, x: number, y: number, z: number, wheelWidth: number, wheelDiameter: number, position: string) {
    const wheelGeometry = new THREE.CylinderGeometry(7/12, 7/12, 0.01/12, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    const sideCylinderGeometry = new THREE.CylinderGeometry((wheelDiameter/2)/12, (wheelDiameter/2)/12, (wheelWidth/2)/12, 32);
    const sideCylinderMaterial = new THREE.MeshPhysicalMaterial({color: 0xFFFFFF});
    sideCylinderMaterial.roughness = 0.2;
    sideCylinderMaterial.metalness = .5;
    sideCylinderMaterial.specularIntensity = 1;
    sideCylinderMaterial.clearcoat = 1;
    sideCylinderMaterial.clearcoatRoughness = 0.1;


    const sideCylinder1 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder1.position.y = barrelAndLipOffsetCalculation(wheelWidth)/12;
    wheel.add(sideCylinder1);

    const sideCylinder2 = new THREE.Mesh(sideCylinderGeometry, sideCylinderMaterial);
    sideCylinder2.position.y = -barrelAndLipOffsetCalculation(wheelWidth)/12;
    wheel.add(sideCylinder2);

    wheel.rotation.x = Math.PI / 2;
    wheel.position.x = x;
    wheel.position.z = y;
    wheel.position.y = z;

    
    if (position === "FL"){
        wheel.rotation.x = Math.PI / 2 + getCamberFront()
        wheel.rotation.z = (rollingDiameter(getWheelDiameterFront(), getTireWidthFront(), getTireSidewallFront()) *  Math.sin(getToeFront())/12)
        wheel.position.x += (getCaster() / 5.74)/12;
        wheel.position.z -= getWheelOffsetFront()/12;
        wheel.position.z -= getWheelSpacerFront()/12;
        wheel.position.y = getRideHeightFront()
    }
    if (position === "FR"){
        wheel.rotation.x = Math.PI / 2 - getCamberFront()
        wheel.rotation.z = (rollingDiameter(getWheelDiameterFront(), getTireWidthRear(), getTireSidewallFront()) *  -Math.sin(getToeFront())/12)
        wheel.position.x += (getCaster() / 5.74)/12;
        wheel.position.z += getWheelOffsetFront()/12;
        wheel.position.z += getWheelSpacerFront()/12;
        wheel.position.y = getRideHeightFront()

    }
    if (position === "BL"){
        wheel.rotation.x = Math.PI / 2 + getCamberRear()
        wheel.rotation.z = (rollingDiameter(getWheelDiameterRear(), getTireWidthFront(), getTireSidewallRear()) *  Math.sin(getToeRear())/12)
        wheel.position.z -= getWheelOffsetRear()/12;
        wheel.position.z -= getWheelSpacerRear()/12;
        wheel.position.y = getRideHeightRear()


    }
    if (position === "BR"){
        wheel.rotation.x = Math.PI / 2 - getCamberRear()
        wheel.rotation.z = (rollingDiameter(getWheelDiameterRear(), getTireWidthRear(), getTireSidewallRear()) *  -Math.sin(getToeRear())/12)
        wheel.position.z += getWheelOffsetRear()/12;
        wheel.position.z += getWheelSpacerRear()/12;
        wheel.position.y = getRideHeightRear()

    }
    return wheel;
}