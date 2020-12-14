export interface SerializedTimer {
  sumElapsed: number;
  startedAt: number;
  running: boolean;
  afterFirstAction: boolean;
  lastStoppedAt: number;
}
