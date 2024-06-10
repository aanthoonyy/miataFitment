import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CarSettings from "./carSettings";
import { floorMaker } from "./assets/floor";
import { makeCar } from "./assets/carMaker";
import { animate } from "./assets/animate";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";
import { makeWheels } from "./assets/wheels";
import { getWheelWidth } from "./assets/buttons/getWheelWidth";
import { getWheelDiameter } from "./assets/buttons/getWheelDiameter";

const MainComponent = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRef = useRef<THREE.Object3D | null>(null);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const [settings, setSettings] = useState({
    tireWidth: 0,
    tireSidewall: 0,
    tireRadius: 0,
    wheelWidth: 5.5,
    wheelDiameter: 14,
    wheelOffset: 0,
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
    if (sceneRef.current && wheelRefs.current.length) {
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

      // Create new wheels with updated settings
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
    }
  }, [settings]);

  return (
    <div>
      <CarSettings updateModel={updateModel} />
      <div id="three-container" style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default MainComponent;
