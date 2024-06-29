import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { floorMaker } from "./assets/floor";
import { makeCar } from "./assets/carMaker";
import { animate } from "./assets/animate";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";
import { makeWheels } from "./assets/wheels";
import { getWheelWidth } from "./assets/buttons/getWheelWidth";
import { getWheelDiameter } from "./assets/buttons/getWheelDiameter";
import FitmentSettings from "./fitmentSettings";
import { makeTires } from "./assets/tire";
import { getTireWidth } from "./assets/buttons/getTireWidth";
import { getTireSidewall } from "./assets/buttons/getTireSidewall";

const MainComponent = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRef = useRef<THREE.Object3D | null>(null);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]); // Add tireRefs
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
  });

  const updateModel = useCallback(
    (
      newSettings: React.SetStateAction<{
        tireWidth: number;
        tireSidewall: number;
        tireRadius: number;
        wheelWidth: number;
        wheelDiameter: number;
        wheelOffset: number;
        frontCamber: number;
        rearCamber: number;
        frontCaster: number;
        frontToe: number;
        rearToe: number;
      }>
    ) => {
      setSettings(newSettings);
    },
    []
  );

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = render();
    rendererRef.current = renderer;
    renderer.setClearColor(0x424242, 1);

    const { camera, controls } = makeCamera(renderer, 100);
    setUpLighting(scene);

    const car = makeCar(THREE, scene);
    carRef.current = car;
    scene.add(car);

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

    // Tires
    const tiresFL = makeTires(
      THREE,
      4.65,
      3.12,
      1,
      getWheelDiameter(),
      getTireWidth(),
      getTireSidewall()
    );
    tireRefs.current.push(tiresFL);
    scene.add(tiresFL);

    const tiresFR = makeTires(
      THREE,
      -4.45,
      3.08,
      1,
      getWheelDiameter(),
      getTireWidth(),
      getTireSidewall()
    );
    tireRefs.current.push(tiresFR);
    scene.add(tiresFR);

    const tiresBL = makeTires(
      THREE,
      -4.45,
      -3.08,
      1,
      getWheelDiameter(),
      getTireWidth(),
      getTireSidewall()
    );
    tireRefs.current.push(tiresBL);
    scene.add(tiresBL);

    const tiresBR = makeTires(
      THREE,
      4.65,
      -3,
      1,
      getWheelDiameter(),
      getTireWidth(),
      getTireSidewall()
    );
    tireRefs.current.push(tiresBR);
    scene.add(tiresBR);

    scene.add(floorMaker(THREE, 10000, 10000));

    animate(scene, camera, renderer, controls);

    const container = document.getElementById("three-container");
    if (container) {
      container.appendChild(renderer.domElement);
    }

    return () => {
      container?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (
      sceneRef.current &&
      wheelRefs.current.length &&
      tireRefs.current.length
    ) {
      // Remove all existing wheels
      wheelRefs.current.forEach((wheel) => {
        wheel.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current?.remove(wheel);
      });
      wheelRefs.current = [];

      const newWheelsFL = makeWheels(
        THREE,
        4.65,
        3.12,
        1,
        getWheelWidth(),
        getWheelDiameter()
      );
      wheelRefs.current.push(newWheelsFL);
      sceneRef.current.add(newWheelsFL);

      const newWheelsFR = makeWheels(
        THREE,
        -4.45,
        3.08,
        1,
        getWheelWidth(),
        getWheelDiameter()
      );
      wheelRefs.current.push(newWheelsFR);
      sceneRef.current.add(newWheelsFR);

      const newWheelsBL = makeWheels(
        THREE,
        -4.45,
        -3.08,
        1,
        getWheelWidth(),
        getWheelDiameter()
      );
      wheelRefs.current.push(newWheelsBL);
      sceneRef.current.add(newWheelsBL);

      const newWheelsBR = makeWheels(
        THREE,
        4.65,
        -3,
        1,
        getWheelWidth(),
        getWheelDiameter()
      );
      wheelRefs.current.push(newWheelsBR);
      sceneRef.current.add(newWheelsBR);

      // Remove all existing tires
      tireRefs.current.forEach((tire) => {
        tire.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current?.remove(tire);
      });
      tireRefs.current = [];

      const newTiresFL = makeTires(
        THREE,
        4.65,
        3.12,
        1,
        getWheelDiameter(),
        getTireWidth(),
        getTireSidewall()
      );
      tireRefs.current.push(newTiresFL);
      sceneRef.current.add(newTiresFL);

      const newTiresFR = makeTires(
        THREE,
        -4.45,
        3.08,
        1,
        getWheelDiameter(),
        getTireWidth(),
        getTireSidewall()
      );
      tireRefs.current.push(newTiresFR);
      sceneRef.current.add(newTiresFR);

      const newTiresBL = makeTires(
        THREE,
        -4.45,
        -3.08,
        1,
        getWheelDiameter(),
        getTireWidth(),
        getTireSidewall()
      );
      tireRefs.current.push(newTiresBL);
      sceneRef.current.add(newTiresBL);

      const newTiresBR = makeTires(
        THREE,
        4.65,
        -3,
        1,
        getWheelDiameter(),
        getTireWidth(),
        getTireSidewall()
      );
      tireRefs.current.push(newTiresBR);
      sceneRef.current.add(newTiresBR);
    }
  }, [settings]);

  return (
    <div>
      <FitmentSettings updateModel={updateModel} />
      <div id="three-container" style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default MainComponent;
