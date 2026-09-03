import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useCallback, useEffect, useRef } from "react";

import {
  addBody,
  buildBody,
  dropBody,
  paintBody,
  removeBody,
  syncBodyParts,
  type CarBody,
} from "@/assets/body";
import { makeCamera } from "@/assets/cameraMaker";
import { render } from "@/assets/renderer";
import { setUpLighting } from "@/assets/lighting";
import {
  addCorners,
  buildCorners,
  noCorners,
  placeCorners,
  removeCorners,
  type Corners,
} from "@/assets/corners";
import type { CarPaint } from "@/constants/carColors";
import { CORNERS } from "@/constants/wheelPositions";
import { useFitmentStore, useUIStore } from "@/stores";
import type { BounceState } from "@/types/bounce";
import {
  createBounceState,
  isBounceSettled,
  stepBounce,
} from "@/utils/bounceSimulation";
import { bounceCornerRotation } from "@/utils/bounceFrame";

// The two paint settings live flat in the store; the renderer takes them as
// one slice, and this is the only place they are put back together.
const currentPaint = (): CarPaint => {
  const { carColor, carMetallic } = useFitmentStore.getState();
  return { hex: carColor, metallic: carMetallic };
};

const SCENE_BACKGROUND_COLOR = "#d3d3d3";
const CAMERA_DISTANCE_FT = 25;
const SCENE_CONTAINER_ID = "three-container";

export const useThreeScene = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const bodyRef = useRef<CarBody | null>(null);
  const cornersRef = useRef<Corners>(noCorners());
  const bounceStateRef = useRef<BounceState | null>(null);
  const bounceClockRef = useRef(0);

  const model = useFitmentStore((s) => s.model);
  const settings = useFitmentStore((s) => s.settings);
  const wheelDesign = useFitmentStore((s) => s.wheelDesign);
  const bodyParts = useFitmentStore((s) => s.bodyParts);
  const carColor = useFitmentStore((s) => s.carColor);
  const carMetallic = useFitmentStore((s) => s.carMetallic);
  const bounceRequested = useUIStore((s) => s.bounceRequested);

  // Every callback below reads what it needs off the store rather than closing
  // over it, so all of them keep a stable identity and no effect has to silence
  // the exhaustive-deps rule to avoid being rebuilt each render.

  // Each model inside the body downloads on its own and attaches when it
  // lands, so this returns with an empty car that fills in over the next few
  // frames.
  const rebuildBody = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const { model: currentModel, bodyParts: parts } =
      useFitmentStore.getState();

    if (bodyRef.current) removeBody(scene, bodyRef.current);
    bodyRef.current = buildBody(currentModel, parts, currentPaint());
    addBody(scene, bodyRef.current);
  }, []);

  // Reloads only the slots that changed, so swapping a bumper does not take the
  // rest of the car down with it.
  const syncBody = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    const { model: currentModel, bodyParts: parts } =
      useFitmentStore.getState();
    syncBodyParts(body, currentModel, parts);
  }, []);

  const repaintBody = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;

    paintBody(body, currentPaint());
  }, []);

  const rebuildCorners = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const { settings: current, model: currentModel, wheelDesign: design } =
      useFitmentStore.getState();

    removeCorners(scene, cornersRef.current);
    cornersRef.current = buildCorners(current, currentModel, design);
    addCorners(scene, cornersRef.current);
  }, []);

  const applyBounceFrame = useCallback((bodyDropIn: number) => {
    const { settings: current } = useFitmentStore.getState();

    if (bodyRef.current) dropBody(bodyRef.current, bodyDropIn);

    CORNERS.forEach((corner, index) => {
      const { xRad, zRad } = bounceCornerRotation(corner, current, bodyDropIn);
      const { wheels, tires } = cornersRef.current;
      for (const object of [wheels[index], tires[index]]) {
        if (!object) continue;
        object.rotation.x = xRad;
        object.rotation.z = zRad;
      }
    });
  }, []);

  const settleBounce = useCallback(() => {
    bounceStateRef.current = null;
    if (bodyRef.current) dropBody(bodyRef.current, 0);

    const { settings: current, model: currentModel } =
      useFitmentStore.getState();
    placeCorners(cornersRef.current, current, currentModel);
  }, []);

  const stepBounceFrame = useCallback(() => {
    const state = bounceStateRef.current;
    if (!state) return;

    const now = performance.now() / 1000;
    const elapsedSeconds = now - bounceClockRef.current;
    bounceClockRef.current = now;

    const { springRateLbIn } = useFitmentStore.getState().settings;
    const stepped = stepBounce(state, elapsedSeconds, { springRateLbIn });
    bounceStateRef.current = stepped;

    applyBounceFrame(stepped.displacement);
    if (isBounceSettled(stepped)) settleBounce();
  }, [applyBounceFrame, settleBounce]);

  // These three run before the scene exists on the first render and bail out on
  // the null ref, which is why they are declared above the setup effect: React
  // runs effects in order, so setup does the first build itself rather than
  // having these repeat it.

  useEffect(() => {
    if (!bounceRequested) return;
    bounceStateRef.current = createBounceState(bounceStateRef.current);
    bounceClockRef.current = performance.now() / 1000;
    useUIStore.getState().clearBounceRequest();
  }, [bounceRequested]);

  useEffect(() => {
    rebuildBody();
  }, [model, rebuildBody]);

  useEffect(() => {
    syncBody();
  }, [bodyParts, syncBody]);

  useEffect(() => {
    repaintBody();
  }, [carColor, carMetallic, repaintBody]);

  useEffect(() => {
    rebuildCorners();
  }, [model, wheelDesign, settings, rebuildCorners]);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = render();
    renderer.setClearColor(SCENE_BACKGROUND_COLOR, 1);

    const { camera, controls } = makeCamera(renderer, CAMERA_DISTANCE_FT);
    controlsRef.current = controls;

    const disposeLighting = setUpLighting(scene, renderer);
    rebuildBody();
    rebuildCorners();

    let frameId = 0;
    const renderFrame = () => {
      frameId = requestAnimationFrame(renderFrame);
      controlsRef.current?.update?.();
      stepBounceFrame();
      renderer.render(scene, camera);
    };
    renderFrame();

    document
      .getElementById(SCENE_CONTAINER_ID)
      ?.appendChild(renderer.domElement);

    return () => {
      // Without all of these the scene leaks a live render loop and a WebGL
      // context on every unmount — including StrictMode's dev-only double
      // mount, which would otherwise run two loops at once.
      cancelAnimationFrame(frameId);
      controlsRef.current?.dispose?.();
      disposeLighting();
      if (bodyRef.current) removeBody(scene, bodyRef.current);
      bodyRef.current = null;
      removeCorners(scene, cornersRef.current);
      cornersRef.current = noCorners();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [rebuildBody, rebuildCorners, stepBounceFrame]);
};
