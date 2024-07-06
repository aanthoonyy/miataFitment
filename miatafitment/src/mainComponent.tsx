import * as THREE from "three";
import { floorMaker } from "./assets/floor";
import { makeCar } from "./assets/carMaker";
import { animate } from "./assets/animate";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";
import { makeWheels } from "./assets/wheels";
import { makeTires } from "./assets/tire";
import FitmentSettings from "./fitmentSettings";
import { getTireSidewall } from "./assets/buttons/getTireSidewall";
import { getTireWidth } from "./assets/buttons/getTireWidth";
import { getWheelDiameter } from "./assets/buttons/getWheelDiameter";
import { getWheelWidth } from "./assets/buttons/getWheelWidth";
import { getRideHeight } from "./assets/buttons/getRideHeight";
import { useCallback, useEffect, useRef, useState } from "react";

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
    renderer.setClearColor(0x424242, 1);

    const { camera, controls } = makeCamera(renderer, 100);
    setUpLighting(scene);

    const createAndAddCar = () => {
      const car = makeCar(THREE, scene, -1.4);
      carRefs.current.push(car);
      scene.add(car);
    };

    const createAndAddWheels = (
      x: number,
      y: number,
      z: number,
      position: string
    ) => {
      const wheels = makeWheels(
        THREE,
        x,
        y,
        z,
        getWheelWidth(),
        getWheelDiameter(),
        position
      );

      wheelRefs.current.push(wheels);
      scene.add(wheels);
    };

    createAndAddCar();
    createAndAddWheels(4.45, 3.04, 1, "FL");
    createAndAddWheels(-4.45, 3.08, 1, "BL");
    createAndAddWheels(-4.45, -3.08, 1, "BR");
    createAndAddWheels(4.45, -3.04, 1, "FR");

    const createAndAddTires = (
      x: number,
      y: number,
      z: number,
      position: string
    ) => {
      const tires = makeTires(
        THREE,
        x,
        y,
        z,
        getWheelDiameter(),
        getTireWidth(),
        getTireSidewall(),
        position
      );
      tireRefs.current.push(tires);
      scene.add(tires);
    };

    createAndAddTires(4.45, 3.04, 1, "FL");
    createAndAddTires(-4.45, 3.08, 1, "BL");
    createAndAddTires(-4.45, -3.08, 1, "BR");
    createAndAddTires(4.45, -3.04, 1, "FR");

    // scene.add(floorMaker(THREE, 10000, 10000));

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
          position: string
        ) => {
          const wheels = makeWheels(
            THREE,
            x,
            y,
            z,
            getWheelWidth(),
            getWheelDiameter(),
            position
          );
          wheelRefs.current.push(wheels);
          sceneRef.current?.add(wheels);
        };

        createAndAddWheels(-10, 2.52, 1, "FL");
        createAndAddWheels(-2.2, 2.55, 1, "BL");
        createAndAddWheels(-2.2, -2.55, 1, "BR");
        createAndAddWheels(-10, -2.52, 1, "FR");
      });

      updateWheelsAndTires(tireRefs, () => {
        const createAndAddTires = (
          x: number,
          y: number,
          z: number,
          position: string
        ) => {
          const tires = makeTires(
            THREE,
            x,
            y,
            z,
            getWheelDiameter(),
            getTireWidth(),
            getTireSidewall(),
            position
          );
          tireRefs.current.push(tires);
          sceneRef.current?.add(tires);
        };

        createAndAddTires(-10, 2.52, 1, "FL");
        createAndAddTires(-2.2, 2.55, 1, "BL");
        createAndAddTires(-2.2, -2.55, 1, "BR");
        createAndAddTires(-10, -2.52, 1, "FR");
      });

      // updateWheelsAndTires(carRefs, () => {
      //   const createAndAddCar = () => {
      //     const car = makeCar(THREE, sceneRef.current, getRideHeight());
      //     carRefs.current = [];
      //     carRefs.current.push(car);
      //     sceneRef.current?.add(car);
      //   };

      //   createAndAddCar();
      // });
    }
  }, [settings, sceneRef, wheelRefs, tireRefs, carRefs]);

  return (
    <div>
      <FitmentSettings updateModel={updateModel} />
      <div id="three-container" style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default MainComponent;
