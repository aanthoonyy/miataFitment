import * as THREE from "three";
import FitmentSettings from "./fitmentSettings";
import { makeCar } from "./assets/carMaker";
import { animate } from "./assets/animate";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";
import { makeWheels } from "./assets/wheels";
import { makeTires } from "./assets/tire";
import { getTireWidthFront } from "./assets/buttons/getTireWidthFront";
import { getWheelDiameterFront } from "./assets/buttons/getWheelDiameterFront";
import { getWheelDiameterRear } from "./assets/buttons/getWheelDiameterRear";
import { getWheelWidthFront } from "./assets/buttons/getWheelWidthFront";
import { useCallback, useEffect, useRef, useState } from "react";
import { getWheelWidthRear } from "./assets/buttons/getWheelWidthRear";
import { getTireWidthRear } from "./assets/buttons/getTireWidthRear";
import { getTireSidewallFront } from "./assets/buttons/getTireSidewallFront";
import { getTireSidewallRear } from "./assets/buttons/getTireSidewallRear";
import { adjustCar } from "./assets/common/wheelPosition";

const useThreeScene = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRefs = useRef<THREE.Object3D[]>([]);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = render();
    rendererRef.current = renderer;
    renderer.setClearColor("#d3d3d3", 1);

    const { camera, controls } = makeCamera(renderer, 100);
    setUpLighting(scene);

    const createAndAddCar = () => {
      const car = makeCar(THREE, -1.4);
      carRefs.current.push(car);
      scene.add(car);
    };

    const createAndAddWheels = (
      x: number,
      y: number,
      z: number,
      position: string,
      wheelDiameter: number,
      wheelWidth: number
    ) => {
      const wheels = makeWheels(
        THREE,
        x,
        y,
        z,
        wheelWidth,
        wheelDiameter,
        position
      );

      wheelRefs.current.push(wheels);
      scene.add(wheels);
    };

    createAndAddCar();
    createAndAddWheels(
      4.45 - adjustCar(),
      3.04 - adjustCar(),
      1,
      "FL",
      getWheelDiameterFront(),
      getWheelWidthFront()
    );
    createAndAddWheels(
      -4.45,
      3.08,
      1,
      "BL",
      getWheelDiameterRear(),
      getWheelWidthRear()
    );
    createAndAddWheels(
      -4.45,
      -3.08,
      1,
      "BR",
      getWheelDiameterRear(),
      getWheelWidthRear()
    );
    createAndAddWheels(
      4.45,
      -3.04,
      1,
      "FR",
      getWheelDiameterFront(),
      getWheelWidthFront()
    );

    const createAndAddTires = (
      x: number,
      y: number,
      z: number,
      position: string,
      wheelDiameter: number,
      wheelWidth: number,
      tireWidth: number,
      tireSidewall: number
    ) => {
      const tires = makeTires(
        THREE,
        x,
        y,
        z,
        wheelDiameter,
        wheelWidth,
        tireWidth,
        tireSidewall,
        position
      );
      tireRefs.current.push(tires);
      scene.add(tires);
    };

    createAndAddTires(
      4.45 - adjustCar(),
      3.04 - adjustCar(),
      1,
      "FL",
      getWheelDiameterFront(),
      getWheelWidthFront(),
      getTireWidthFront(),
      getTireSidewallFront()
    );
    createAndAddTires(
      -4.45,
      3.08,
      1,
      "BL",
      getWheelDiameterRear(),
      getWheelWidthRear(),
      getTireWidthRear(),
      getTireSidewallRear()
    );
    createAndAddTires(
      -4.45,
      -3.08,
      1,
      "BR",
      getWheelDiameterRear(),
      getWheelWidthRear(),
      getTireWidthRear(),
      getTireSidewallRear()
    );
    createAndAddTires(
      4.45,
      -3.04,
      1,
      "FR",
      getWheelDiameterFront(),
      getWheelDiameterFront(),
      getTireWidthFront(),
      getTireSidewallFront()
    );

    animate(scene, camera, renderer, controls);

    const container = document.getElementById("three-container");
    if (container) {
      container.appendChild(renderer.domElement);
    }

    return () => {
      container?.removeChild(renderer.domElement);
    };
  }, []);

  return { sceneRef, wheelRefs, tireRefs, carRefs };
};

const MainComponent = () => {
  const { sceneRef, wheelRefs, tireRefs, carRefs } = useThreeScene();
  const [settings, setSettings] = useState({
    tireWidth: 0,
    tireSidewall: 0,
    tireRadius: 0,
    wheelWidth: 5.5,
    wheelDiameter: 14,
    wheelOffset: 0,
    frontCamber: 0,
    rearCamber: 0,
    frontCaster: 0,
    frontToe: 0,
    rearToe: 0,
    rideHeight: 0,
    spacer: 0,
  });

  const updateModel = useCallback((newSettings: any) => {
    setSettings(newSettings);
  }, []);

  useEffect(() => {
    if (
      sceneRef.current &&
      wheelRefs.current.length &&
      tireRefs.current.length &&
      carRefs.current.length
    ) {
      // @ts-ignore
      const car = carRefs.current[0];

      const updateWheelsAndTires = (refs: any, createFn: any) => {
        refs.current.forEach((object: any) => {
          object.traverse((obj: any) => {
            if (obj instanceof THREE.Mesh) {
              obj.geometry.dispose();
              if (Array.isArray(obj.material)) {
                obj.material.forEach((material) => material.dispose());
              } else {
                obj.material.dispose();
              }
            }
          });
          sceneRef.current?.remove(object);
        });
        refs.current = [];
        createFn();
      };

      updateWheelsAndTires(wheelRefs, () => {
        const createAndAddWheels = (
          x: number,
          y: number,
          z: number,
          position: string,
          wheelDiameter: number,
          wheelWidth: number
        ) => {
          const wheels = makeWheels(
            THREE,
            x,
            y,
            z,
            wheelWidth,
            wheelDiameter,
            position
          );
          wheelRefs.current.push(wheels);
          sceneRef.current?.add(wheels);
        };

        createAndAddWheels(
          -10 - adjustCar(),
          2.52,
          1,
          "FL",
          getWheelDiameterFront(),
          getWheelWidthFront()
        );
        createAndAddWheels(
          -2.2 - adjustCar(),
          2.55,
          1,
          "BL",
          getWheelDiameterRear(),
          getWheelWidthRear()
        );
        createAndAddWheels(
          -2.2 - adjustCar(),
          -2.55,
          1,
          "BR",
          getWheelDiameterRear(),
          getWheelWidthRear()
        );
        createAndAddWheels(
          -10 - adjustCar(),
          -2.52,
          1,
          "FR",
          getWheelDiameterFront(),
          getWheelWidthFront()
        );
      });

      updateWheelsAndTires(tireRefs, () => {
        const createAndAddTires = (
          x: number,
          y: number,
          z: number,
          position: string,
          wheelDiameter: number,
          wheelWidth: number,
          tireWidth: number,
          tireSidewall: number
        ) => {
          const tires = makeTires(
            THREE,
            x,
            y,
            z,
            wheelDiameter,
            wheelWidth,
            tireWidth,
            tireSidewall,
            position
          );
          tireRefs.current.push(tires);
          sceneRef.current?.add(tires);
        };

        createAndAddTires(
          -10 - adjustCar(),
          2.52,
          1,
          "FL",
          getWheelDiameterFront(),
          getWheelWidthFront(),
          getTireWidthFront(),
          getTireSidewallFront()
        );
        createAndAddTires(
          -2.2 - adjustCar(),
          2.55,
          1,
          "BL",
          getWheelDiameterRear(),
          getWheelWidthRear(),
          getTireWidthRear(),
          getTireSidewallRear()
        );
        createAndAddTires(
          -2.2 - adjustCar(),
          -2.55,
          1,
          "BR",
          getWheelDiameterRear(),
          getWheelWidthRear(),
          getTireWidthRear(),
          getTireSidewallRear()
        );
        createAndAddTires(
          -10 - adjustCar(),
          -2.52,
          1,
          "FR",
          getWheelDiameterFront(),
          getWheelWidthFront(),
          getTireWidthFront(),
          getTireSidewallFront()
        );
      });
    }
  }, [settings, sceneRef, wheelRefs, tireRefs, carRefs]);

  return (
    <div>
      <FitmentSettings updateModel={updateModel} />
      <div
        id="three-container"
        style={{ width: "100%", height: "100vh", overflow: "hidden" }}
      />
    </div>
  );
};

export default MainComponent;
