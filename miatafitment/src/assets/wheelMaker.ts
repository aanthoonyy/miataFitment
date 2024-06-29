import { getWheelDiameter } from "./buttons/getWheelDiameter";
import { getWheelWidth } from "./buttons/getWheelWidth";
import { makeWheels } from "./wheels";

 function createWheels(THREE: any, wheelRefs: any, scene: any, x?: number, y?: number, z?: number, width?: any, diameter?: any) {
 // Wheels
 const wheelsFL = makeWheels(
    THREE,
    4.65,
    3.12,
    1,
    getWheelWidth(),
    getWheelDiameter()
  );
  wheelRefs.current.push(wheelsFL);
  scene.add(wheelsFL);

  const wheelsFR = makeWheels(
    THREE,
    -4.45,
    3.08,
    1,
    getWheelWidth(),
    getWheelDiameter()
  );
  wheelRefs.current.push(wheelsFR);
  scene.add(wheelsFR);

  const wheelsBL = makeWheels(
    THREE,
    -4.45,
    -3.08,
    1,
    getWheelWidth(),
    getWheelDiameter()
  );
  wheelRefs.current.push(wheelsBL);
  scene.add(wheelsBL);

  const wheelsBR = makeWheels(
    THREE,
    4.65,
    -3,
    1,
    getWheelWidth(),
    getWheelDiameter()
  );
  wheelRefs.current.push(wheelsBR);
  scene.add(wheelsBR);
  
 }
 
