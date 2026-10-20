export type BodyLoadStatus = {
  phase: "idle" | "loading" | "ready" | "error";
  hasBody: boolean;
};
