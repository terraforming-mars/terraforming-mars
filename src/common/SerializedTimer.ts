// Note: This is the only interface representing serialization in common. I kinda hate it.
// It's because in this case serialization is not just about its io but its general operation.
// So, it's OK. Renaming this wouldn't make me sad.
export interface SerializedTimer {
  sumElapsed: number;
  startedAt: number;
  running: boolean;
  afterFirstAction: boolean;
  lastStoppedAt: number;
}
