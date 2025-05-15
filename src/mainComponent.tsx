import * as THREE from "three";
import FitmentSettings from "./fitmentSettings";
import { makeCar } from "./assets/carMaker";
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

const mmToFeet = (mm: number) => mm / 25.4 / 12;

// Wheel position configuration
// All measurements are in feet (1 unit = 1 foot in Three.js)
// X: Positive values move wheels towards rear of car, negative towards front
// Z: Positive values move wheels towards left side, negative towards right
// Y (ride height): Controlled by settings.rideHeightFront/Rear
// Right = left looking at the front of the car
// Left = right looking at the front of the car
let WHEEL_POSITIONS = {
  FRONT: {
    LEFT: {
      x: -15.35, // Distance from car center to front wheel center (negative = front of car)
      z: 2.5, // Distance from car centerline to wheel center (positive = left side)
      casterOffset: 5.74 / 12, // Used to calculate caster effect (converts degrees to feet)
    },
    RIGHT: {
      x: -15.35, // Same as left, but mirrored
      z: -2.5, // Negative of left side (mirrored)
      casterOffset: 5.74 / 12, // Same as left side
    },
  },
  REAR: {
    LEFT: {
      x: 2.85, // Distance from car center to rear wheel center (positive = rear of car)
      z: 2.525, // Slightly wider than front for typical rear track width
    },
    RIGHT: {
      x: 2.85, // Same as left, but mirrored
      z: -2.525, // Negative of left side (mirrored)
    },
  },
};

// Export the wheel positions so they can be imported by other files
export { WHEEL_POSITIONS };

enum WheelPosition {
  FRONT_LEFT = "FL",
  FRONT_RIGHT = "FR",
  REAR_LEFT = "BL",
  REAR_RIGHT = "BR",
}

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
          offset = -mmToFeet(settings.frontWheelOffset); // Convert mm to feet
          spacer = mmToFeet(settings.frontWheelSpacer); // Convert mm to feet
          toe = settings.frontToe;
          baseX =
            WHEEL_POSITIONS.FRONT.LEFT.x +
            settings.frontCaster / WHEEL_POSITIONS.FRONT.LEFT.casterOffset;
          baseZ = WHEEL_POSITIONS.FRONT.LEFT.z;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.FRONT_RIGHT:
          camberDeg = -settings.frontCamber;
          offset = mmToFeet(settings.frontWheelOffset); // Convert mm to feet
          spacer = -mmToFeet(settings.frontWheelSpacer); // Convert mm to feet
          toe = -settings.frontToe;
          baseX =
            WHEEL_POSITIONS.FRONT.RIGHT.x +
            settings.frontCaster / WHEEL_POSITIONS.FRONT.RIGHT.casterOffset;
          baseZ = WHEEL_POSITIONS.FRONT.RIGHT.z;
          rideY = settings.rideHeightFront;
          break;

        case WheelPosition.REAR_LEFT:
          camberDeg = settings.rearCamber;
          offset = -mmToFeet(settings.rearWheelOffset); // Convert mm to feet
          spacer = mmToFeet(settings.rearWheelSpacer); // Convert mm to feet
          toe = settings.rearToe;
          baseX = WHEEL_POSITIONS.REAR.LEFT.x;
          baseZ = WHEEL_POSITIONS.REAR.LEFT.z;
          rideY = settings.rideHeightRear;
          break;

        case WheelPosition.REAR_RIGHT:
          camberDeg = -settings.rearCamber;
          offset = mmToFeet(settings.rearWheelOffset); // Convert mm to feet
          spacer = -mmToFeet(settings.rearWheelSpacer); // Convert mm to feet
          toe = -settings.rearToe;
          baseX = WHEEL_POSITIONS.REAR.RIGHT.x;
          baseZ = WHEEL_POSITIONS.REAR.RIGHT.z;
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
      // Remove old wheels and tires
      wheelRefs.current.forEach((wheel) => sceneRef.current?.remove(wheel));
      tireRefs.current.forEach((tire) => sceneRef.current?.remove(tire));

      // Create and add new wheels with updated dimensions
      const wheels = [
        makeWheels(
          THREE,
          WHEEL_POSITIONS.FRONT.LEFT.x,
          WHEEL_POSITIONS.FRONT.LEFT.z,
          1,
          settings.frontWheelWidth,
          settings.frontWheelDiameter,
          WheelPosition.FRONT_LEFT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.REAR.LEFT.x,
          WHEEL_POSITIONS.REAR.LEFT.z,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_LEFT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.REAR.RIGHT.x,
          WHEEL_POSITIONS.REAR.RIGHT.z,
          1,
          settings.rearWheelWidth,
          settings.rearWheelDiameter,
          WheelPosition.REAR_RIGHT,
          settings
        ),
        makeWheels(
          THREE,
          WHEEL_POSITIONS.FRONT.RIGHT.x,
          WHEEL_POSITIONS.FRONT.RIGHT.z,
          1,
          settings.frontWheelWidth,
          settings.frontWheelDiameter,
          WheelPosition.FRONT_RIGHT,
          settings
        ),
      ];
      wheelRefs.current = wheels;
      wheels.forEach((wheel) => sceneRef.current?.add(wheel));

      // Create and add new tires with updated dimensions
      const tires = [
        makeTires(
          THREE,
          WHEEL_POSITIONS.FRONT.LEFT.x,
          WHEEL_POSITIONS.FRONT.LEFT.z,
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
          WHEEL_POSITIONS.REAR.LEFT.x,
          WHEEL_POSITIONS.REAR.LEFT.z,
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
          WHEEL_POSITIONS.REAR.RIGHT.x,
          WHEEL_POSITIONS.REAR.RIGHT.z,
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
          WHEEL_POSITIONS.FRONT.RIGHT.x,
          WHEEL_POSITIONS.FRONT.RIGHT.z,
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
      tires.forEach((tire) => sceneRef.current?.add(tire));
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
          WHEEL_POSITIONS.FRONT.LEFT.x,
          WHEEL_POSITIONS.FRONT.LEFT.z,
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
          WHEEL_POSITIONS.REAR.LEFT.x,
          WHEEL_POSITIONS.REAR.LEFT.z,
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
          WHEEL_POSITIONS.REAR.RIGHT.x,
          WHEEL_POSITIONS.REAR.RIGHT.z,
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
          WHEEL_POSITIONS.FRONT.RIGHT.x,
          WHEEL_POSITIONS.FRONT.RIGHT.z,
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
        WHEEL_POSITIONS.FRONT.LEFT.x,
        WHEEL_POSITIONS.FRONT.LEFT.z,
        1,
        settings.frontWheelWidth,
        settings.frontWheelDiameter,
        WheelPosition.FRONT_LEFT,
        settings
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.REAR.LEFT.x,
        WHEEL_POSITIONS.REAR.LEFT.z,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_LEFT,
        settings
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.REAR.RIGHT.x,
        WHEEL_POSITIONS.REAR.RIGHT.z,
        1,
        settings.rearWheelWidth,
        settings.rearWheelDiameter,
        WheelPosition.REAR_RIGHT,
        settings
      ),
      makeWheels(
        THREE,
        WHEEL_POSITIONS.FRONT.RIGHT.x,
        WHEEL_POSITIONS.FRONT.RIGHT.z,
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
            right: "20px",
            top: "20px",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
            opacity: isSettingsOpen ? 0 : 1,
            visibility: isSettingsOpen ? "hidden" : "visible",
            transition: theme.transitions.create(["opacity", "visibility"], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <SettingsIcon />
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
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setIsSettingsOpen(false)}
            sx={{
              position: "absolute",
              right: "8px",
              top: "8px",
              zIndex: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <FitmentSettings updateModel={updateModel} />
        </Box>
      </Box>
    </Box>
  );
};

export default MainComponent;
