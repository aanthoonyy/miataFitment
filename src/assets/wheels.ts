import { getCamberFront } from "./buttons/getCamberFront";
import { getCamberRear } from "./buttons/getCamberRear";
import { getCaster } from "./buttons/getCaster";
import { getRideHeight } from "./buttons/getRideHeight";
import { getTireSidewall } from "./buttons/getTireSidewall";
import { getTireWidth } from "./buttons/getTireWidth";
import { getToeFront } from "./buttons/getToeFront";
import { getToeRear } from "./buttons/getToeRear";
import { getWheelDiameter } from "./buttons/getWheelDiameter";
import { getWheelOffset } from "./buttons/getWheelOffset";
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
    const sideCylinderMaterial = new THREE.MeshBasicMaterial({color: 0xC0C0C0, transparent: true, opacity: 0.5});

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
        wheel.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  Math.sin(getToeFront())/12)
        wheel.position.x += (getCaster() / 5.74)/12;
        wheel.position.z -= getWheelOffset()/12;
        wheel.position.y = getRideHeight()
    }
    if (position === "FR"){
        wheel.rotation.x = Math.PI / 2 - getCamberFront()
        wheel.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  -Math.sin(getToeFront())/12)
        wheel.position.x += (getCaster() / 5.74)/12;
        wheel.position.z += getWheelOffset()/12;
        wheel.position.y = getRideHeight()

    }
    if (position === "BL"){
        wheel.rotation.x = Math.PI / 2 + getCamberRear()
        wheel.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  Math.sin(getToeRear())/12)
        wheel.position.z -= getWheelOffset()/12;
        wheel.position.y = getRideHeight()


    }
    if (position === "BR"){
        wheel.rotation.x = Math.PI / 2 - getCamberRear()
        wheel.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  -Math.sin(getToeRear())/12)
        wheel.position.z += getWheelOffset()/12;
        wheel.position.y = getRideHeight()

    }
    return wheel;
}