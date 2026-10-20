import * as THREE from "three";
import { useCallback, useEffect, useRef } from "react";

import { createSceneFitment, type SceneFitment } from "@/assets/sceneFitment";
import { makeCamera } from "@/assets/cameraMaker";
import { render } from "@/assets/renderer";
import { setUpLighting } from "@/assets/lighting";
import { useFitmentStore, useUIStore } from "@/stores";
import type { BounceState } from "@/types/bounce";
import { createBounceState, isBounceSettled, stepBounce } from "@/utils/bounceSimulation";

const SCENE_BACKGROUND_COLOR = "#d3d3d3";
const CAMERA_DISTANCE_FT = 25;
const SCENE_CONTAINER_ID = "three-container";

export const useThreeScene = () => {
  const fitmentRef = useRef<SceneFitment | null>(null);
  const bounceStateRef = useRef<BounceState | null>(null);
  const bounceClockRef = useRef(0);

  const model = useFitmentStore((s) => s.model);
  const settings = useFitmentStore((s) => s.settings);
  const wheelDesign = useFitmentStore((s) => s.wheelDesign);
  const appearance = useFitmentStore((s) => s.appearance);
  const bounceRequested = useUIStore((s) => s.bounceRequested);

  const replaceFitment = useCallback(() => {
    const fitment = fitmentRef.current;
    if (!fitment) return;
    const { model, settings, wheelDesign, appearance } = useFitmentStore.getState();
    fitment.replaceFitment({ model, settings, wheelDesign, appearance });
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
    fitmentRef.current?.showBounce(stepped.displacement);
    if (isBounceSettled(stepped)) {
      bounceStateRef.current = null;
      fitmentRef.current?.showBounce(null);
    }
  }, []);

  useEffect(() => {
    if (!bounceRequested) return;
    bounceStateRef.current = createBounceState(bounceStateRef.current);
    bounceClockRef.current = performance.now() / 1000;
    useUIStore.getState().clearBounceRequest();
  }, [bounceRequested]);

  // Setup makes the first fitment; subsequent store changes use this effect.
  useEffect(() => {
    replaceFitment();
  }, [model, wheelDesign, settings, appearance, replaceFitment]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = render();
    renderer.setClearColor(SCENE_BACKGROUND_COLOR, 1);

    const { camera, controls } = makeCamera(renderer, CAMERA_DISTANCE_FT);
    const disposeLighting = setUpLighting(scene, renderer);
    fitmentRef.current = createSceneFitment(scene, ({ kind, cause }) => {
      console.error(`Failed to load ${kind} model`, cause);
    }, (status) => useUIStore.getState().setBodyLoadStatus(status));
    const unsubscribeRetry = useUIStore.subscribe((state, previous) => {
      if (state.bodyRetryRequest !== previous.bodyRetryRequest) replaceFitment();
    });
    replaceFitment();

    let frameId = 0;
    const renderFrame = () => {
      frameId = requestAnimationFrame(renderFrame);
      controls.update();
      stepBounceFrame();
      renderer.render(scene, camera);
    };
    renderFrame();

    document.getElementById(SCENE_CONTAINER_ID)?.appendChild(renderer.domElement);

    return () => {
      unsubscribeRetry();
      cancelAnimationFrame(frameId);
      controls.dispose();
      fitmentRef.current?.dispose();
      fitmentRef.current = null;
      useUIStore.getState().setBodyLoadStatus({ phase: "idle", hasBody: false });
      bounceStateRef.current = null;
      disposeLighting();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [replaceFitment, stepBounceFrame]);
};
