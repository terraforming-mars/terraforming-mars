export type TimerModel = {
  sumElapsed: number;
  startedAt: number;
  running: boolean;
  afterFirstAction: boolean;
  lastStoppedAt: number;
}
