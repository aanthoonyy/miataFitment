import * as THREE from "three";
import FitmentSettings from "./fitmentSettings";
import { makeCar } from "./assets/carMaker";
import { animate } from "./assets/animate";
import { makeCamera } from "./assets/cameraMaker";
import { render } from "./assets/renderer";
import { setUpLighting } from "./assets/lighting";
import { makeWheels } from "./assets/wheels";
import { makeTires } from "./assets/tire";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import rollingDiameter from "./assets/common/rollingDiameter";

interface Settings {
  frontCamber: number;
  rearCamber: number;
  frontCaster: number;
  frontToe: number;
  rearToe: number;
  rideHeightFront: number;
  rideHeightRear: number;
  frontTireWidth: number;
  frontTireSidewall: number;
  frontWheelWidth: number;
  frontWheelDiameter: number;
  frontWheelOffset: number;
  frontWheelSpacer: number;
  rearTireWidth: number;
  rearTireSidewall: number;
  rearWheelWidth: number;
  rearWheelDiameter: number;
  rearWheelOffset: number;
  rearWheelSpacer: number;
}

enum WheelPosition {
  FRONT_LEFT = "FL",
  FRONT_RIGHT = "FR",
  REAR_LEFT = "BL",
  REAR_RIGHT = "BR",
}

const useThreeScene = (settings: Settings) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRefs = useRef<THREE.Object3D[]>([]);
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const tireRefs = useRef<THREE.Object3D[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);

  const updateWheelPosition = useCallback(
    (
      wheel: THREE.Object3D,
      tire: THREE.Object3D,
      position: string,
      settings: Settings
    ) => {
      // compute camber, offset, spacer, toe‐sign and base positions per corner
      let camberDeg = 0,
        offset = 0,
        spacer = 0,
        toe = 0,
        baseX = 0,
        baseZ = 0,
        rideY = 0;

      switch (position) {
        case WheelPosition.FRONT_LEFT:
          camberDeg = settings.frontCamber;
          offset = -(settings.frontWheelOffset / 25.4);
          spacer = settings.frontWheelSpacer / 25.4;
          toe = settings.frontToe;
          baseX = -4.45 + settings.frontCaster / 5.74 / 12;
          baseZ = 3.04;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.FRONT_RIGHT:
          camberDeg = -settings.frontCamber;
          offset = settings.frontWheelOffset / 25.4;
          spacer = -(settings.frontWheelSpacer / 25.4);
          toe = -settings.frontToe;
          baseX = -4.45 + settings.frontCaster / 5.74 / 12;
          baseZ = -3.04;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.REAR_LEFT:
          camberDeg = settings.rearCamber;
          offset = -(settings.rearWheelOffset / 25.4);
          spacer = settings.rearWheelSpacer / 25.4;
          toe = settings.rearToe;
          baseX = 4.45;
          baseZ = 3.08;
          rideY = settings.rideHeightRear;
          break;

        case WheelPosition.REAR_RIGHT:
          camberDeg = -settings.rearCamber;
          offset = settings.rearWheelOffset / 25.4;
          spacer = -(settings.rearWheelSpacer / 25.4);
          toe = -settings.rearToe;
          baseX = 4.45;
          baseZ = -3.08;
          rideY = settings.rideHeightRear;
          break;

        default:
          return;
      }

      const camberRad = (Math.min(Math.max(camberDeg, -20), 1) * Math.PI) / 180;
      const toeRadiusComp =
        (rollingDiameter(
          position.startsWith("F")
            ? settings.frontWheelDiameter
            : settings.rearWheelDiameter,
          position.startsWith("F")
            ? settings.frontTireWidth
            : settings.rearTireWidth,
          position.startsWith("F")
            ? settings.frontTireSidewall
            : settings.rearTireSidewall
        ) *
          Math.sin(toe)) /
        12;

      // apply to both wheel and tire **the same** Z‐offset
      const zPos = baseZ + offset + spacer;

      // rotation X is camber, rotation Z is toe slip
      const rotX = Math.PI / 2 + camberRad;
      const rotZ = toeRadiusComp;

      wheel.rotation.set(rotX, 0, rotZ);
      wheel.position.set(baseX, rideY, zPos);

      tire.rotation.set(rotX, 0, rotZ);
      tire.position.set(baseX, rideY, zPos);
    },
    []
  );

  const updateWheelAndTireSizes = useCallback((settings: Settings) => {
    if (sceneRef.current && wheelRefs.current.length > 0) {
      // Remove old wheels
      wheelRefs.current.forEach((wheel) => sceneRef.current?.remove(wheel));

      // Create and add new wheels with updated dimensions
      const wheels = [
        makeWheels(
          THREE,
          -4.45,
          3.04,
          1,
          settings.frontWheelWidth,
          settings.frontWheelDiameter,
          WheelPosition.FRONT_LEFT,
          settings
        ),
        makeWheels(
          THREE,
          4.45,
          3.08,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_LEFT,
          settings
        ),
        makeWheels(
          THREE,
          4.45,
          -3.08,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_RIGHT,
          settings
        ),
        makeWheels(
          THREE,
          -4.45,
          -3.04,
          1,
          settings.frontWheelWidth,
          settings.frontWheelDiameter,
          WheelPosition.FRONT_RIGHT,
          settings
        ),
      ];
      wheelRefs.current = wheels;
      wheels.forEach((wheel) => sceneRef.current?.add(wheel));

      // Update tire sizes
      tireRefs.current[0].scale.set(
        settings.frontTireWidth / 185,
        settings.frontTireSidewall / 55,
        settings.frontTireWidth / 185
      );
      tireRefs.current[1].scale.set(
        settings.rearTireWidth / 185,
        settings.rearTireSidewall / 55,
        settings.rearTireWidth / 185
      );
      tireRefs.current[2].scale.set(
        settings.rearTireWidth / 185,
        settings.rearTireSidewall / 55,
        settings.rearTireWidth / 185
      );
      tireRefs.current[3].scale.set(
        settings.frontTireWidth / 185,
        settings.frontTireSidewall / 55,
        settings.frontTireWidth / 185
      );
    }
  }, []);

  useEffect(() => {
    if (sceneRef.current && wheelRefs.current.length > 0) {
      // Update existing wheels and tires
      updateWheelPosition(
        wheelRefs.current[0],
        tireRefs.current[0],
        "FL",
        settings
      );
      updateWheelPosition(
        wheelRefs.current[1],
        tireRefs.current[1],
        "BL",
        settings
      );
      updateWheelPosition(
        wheelRefs.current[2],
        tireRefs.current[2],
        "BR",
        settings
      );
      updateWheelPosition(
        wheelRefs.current[3],
        tireRefs.current[3],
        "FR",
        settings
      );
      updateWheelAndTireSizes(settings);
    }
  }, [settings, updateWheelPosition, updateWheelAndTireSizes]);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = render();
    rendererRef.current = renderer;
    renderer.setClearColor("#d3d3d3", 1);

    const { camera, controls } = makeCamera(renderer, 100);
    cameraRef.current = camera;
    controlsRef.current = controls;
    setUpLighting(scene);

    const createAndAddCar = () => {
      const car = makeCar(THREE, -1.4);
      carRefs.current.push(car);
      scene.add(car);
    };

    const createAndAddTires = () => {
      const tires = [
        makeTires(
          THREE,
          -4.45,
          3.04,
          1,
          settings.frontWheelDiameter,
          settings.frontWheelWidth,
          settings.frontTireWidth,
          settings.frontTireSidewall,
          WheelPosition.FRONT_LEFT,
          settings
        ),
        makeTires(
          THREE,
          4.45,
          3.08,
          1,
          settings.rearWheelDiameter,
          settings.rearWheelWidth,
          settings.rearTireWidth,
          settings.rearTireSidewall,
          WheelPosition.REAR_LEFT,
          settings
        ),
        makeTires(
          THREE,
          4.45,
          -3.08,
          1,
          settings.rearWheelDiameter,
          settings.rearWheelWidth,
          settings.rearTireWidth,
          settings.rearTireSidewall,
          WheelPosition.REAR_RIGHT,
          settings
        ),
        makeTires(
          THREE,
          -4.45,
          -3.04,
          1,
          settings.frontWheelDiameter,
          settings.frontWheelWidth,
          settings.frontTireWidth,
          settings.frontTireSidewall,
          WheelPosition.FRONT_RIGHT,
          settings
        ),
      ];
      tireRefs.current = tires;
      tires.forEach((tire) => scene.add(tire));
    };

    // Create initial wheels
    const initialWheels = [
      makeWheels(
        THREE,
        -4.45,
        3.04,
        1,
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_LEFT,
        settings
      ),
      makeWheels(
        THREE,
        4.45,
        3.08,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_LEFT,
        settings
      ),
      makeWheels(
        THREE,
        4.45,
        -3.08,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_RIGHT,
        settings
      ),
      makeWheels(
        THREE,
        -4.45,
        -3.04,
        1,
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_RIGHT,
        settings
      ),
    ];
    wheelRefs.current = initialWheels;
    initialWheels.forEach((wheel) => scene.add(wheel));

    createAndAddCar();
    createAndAddTires();

    const animateLoop = () => {
      requestAnimationFrame(animateLoop);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animateLoop();

    const container = document.getElementById("three-container");
    if (container) {
      container.appendChild(renderer.domElement);
    }

    return () => {
      container?.removeChild(renderer.domElement);
    };
  }, []);

  return { sceneRef };
};

const MainComponent = () => {
  const [settings, setSettings] = useState<Settings>({
    frontCamber: -4.1,
    rearCamber: -4.1,
    frontCaster: 5,
    frontToe: 0,
    rearToe: 0,
    rideHeightFront: -2.51,
    rideHeightRear: -2.51,
    frontTireWidth: 185,
    frontTireSidewall: 55,
    frontWheelWidth: 8.5,
    frontWheelDiameter: 14,
    frontWheelOffset: -7,
    frontWheelSpacer: 5,
    rearTireWidth: 185,
    rearTireSidewall: 55,
    rearWheelWidth: 8.5,
    rearWheelDiameter: 14,
    rearWheelOffset: -7,
    rearWheelSpacer: 0,
  });

  const { sceneRef } = useThreeScene(settings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const theme = useTheme();

  const updateModel = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
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
