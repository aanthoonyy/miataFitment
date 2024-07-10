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
import { getWheelSpacer } from "./buttons/getWheelSpacer";
// import { getWheelWidth } from "./buttons/getWheelWidth";
import rollingDiameter from "./common/rollingDiameter";

export function makeTires(THREE: any, x: number, y: number, z: number, wheelDiameter: number, tireWidth: number, tireSideWall: number, position: string) {
    const totalDiameter = rollingDiameter(wheelDiameter, tireWidth, tireSideWall);
    const tireGeometry = new THREE.CylinderGeometry(totalDiameter / 2 / 12, totalDiameter / 2 / 12, (tireWidth -0 ) / 25.4 / 12, 32);
    const tireMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);



    // const stretch = new THREE.CylinderGeometry(getWheelDiameter() / 2 / 12, totalDiameter /2 / 12, 0.6/12, 32);
    // const stretch = new THREE.CylinderGeometry(getWheelDiameter() / 2 / 12, totalDiameter /2 / 12, 0.6/12, 32, 64,64, true);
    // const stretchMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    // const stretchMesh = new THREE.Mesh(stretch, stretchMaterial);
    // stretchMesh.position.y = getWheelWidth() /12 /2 - 0.4/12;
    // tire.add(stretchMesh);

    tire.rotation.x = Math.PI / 2;
    tire.position.x = x;
    tire.position.z = y;
    tire.position.y = z;
    
    if (position === "FL"){
        tire.rotation.x = Math.PI / 2 + getCamberFront()
        tire.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  Math.sin(getToeFront())/12)
        tire.position.x += (getCaster() / 5.74)/12;
        tire.position.z -= getWheelOffset()/12;
        tire.position.z -= getWheelSpacer()/12;
        tire.position.y = getRideHeight()

    }
    if (position === "FR"){
        tire.rotation.x = Math.PI / 2 - getCamberFront()
        tire.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  -Math.sin(getToeFront())/12)
        tire.position.x += (getCaster() / 5.74)/12;
        tire.position.z += getWheelOffset()/12;
        tire.position.z += getWheelSpacer()/12;
        tire.position.y = getRideHeight()

    }
    if (position === "BL"){
        tire.rotation.x = Math.PI / 2 + getCamberRear()
        tire.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  Math.sin(getToeRear())/12)
        tire.position.z -= getWheelOffset()/12;
        tire.position.z -= getWheelSpacer()/12;
        tire.position.y = getRideHeight()


    }
    if (position === "BR"){
        tire.rotation.x = Math.PI / 2 - getCamberRear()
        tire.rotation.z = (rollingDiameter(getWheelDiameter(), getTireWidth(), getTireSidewall()) *  -Math.sin(getToeRear())/12)
        tire.position.z += getWheelOffset()/12;
        tire.position.z += getWheelSpacer()/12;
        tire.position.y = getRideHeight()

    }

    return tire;
}