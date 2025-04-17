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
import { Box, IconButton, useTheme } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";

const useThreeScene = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRefs = useRef<THREE.Object3D[]>([]);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]);

  const createAndAddWheels = useCallback(
    (
      x: number,
      y: number,
      z: number,
      position: string,
      wheelDiameter: number,
      wheelWidth: number
    ) => {
      if (!sceneRef.current) return;
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
      sceneRef.current.add(wheels);
    },
    []
  );

  const createAndAddTires = useCallback(
    (
      x: number,
      y: number,
      z: number,
      position: string,
      wheelDiameter: number,
      wheelWidth: number,
      tireWidth: number,
      tireSidewall: number
    ) => {
      if (!sceneRef.current) return;
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
      sceneRef.current.add(tires);
    },
    []
  );

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
      getWheelWidthFront(),
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
  }, [createAndAddWheels, createAndAddTires]);

  return { sceneRef, wheelRefs, tireRefs, carRefs };
};

const MainComponent = () => {
  const { sceneRef, wheelRefs, tireRefs, carRefs } = useThreeScene();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const theme = useTheme();

  const updateModel = useCallback((newSettings: any) => {
    // Update the model with new settings
    console.log("Updating model with settings:", newSettings);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          flex: 1,
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          id="three-container"
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <IconButton
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          sx={{
            position: "absolute",
            right: isSettingsOpen ? "350px" : "20px",
            top: "20px",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
            transition: theme.transitions.create(["right"], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          {isSettingsOpen ? <CloseIcon /> : <SettingsIcon />}
        </IconButton>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "350px",
          bgcolor: "background.paper",
          borderLeft: "1px solid",
          borderColor: "divider",
          zIndex: 1,
          transform: isSettingsOpen ? "translateX(0)" : "translateX(100%)",
          transition: theme.transitions.create(["transform"], {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
          boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <FitmentSettings updateModel={updateModel} />
      </Box>
    </Box>
  );
};

export default MainComponent;
