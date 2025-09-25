
// Types for the directions JSON
export type Route = {
  name: string;
  distanceMeters: number;
  durationSeconds: number;
  transportType: string;
  hasTolls: boolean;
  stepIndexes: number[];
};
export type Step = {
  stepPathIndex: number;
  distanceMeters: number;
  durationSeconds: number;
  instruction?: string;
}
export type StepPath = Array<{ latitude: number; longitude: number }>;
export type DirectionJson = {
  polyline: {
    origin: { coordinate: { latitude: number; longitude: number } };
    destination: { coordinate: { latitude: number; longitude: number } };
    routes: Route[];
    steps: Step[];
    stepPaths: StepPath[];
  };
};