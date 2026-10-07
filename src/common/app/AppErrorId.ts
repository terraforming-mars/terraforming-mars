export const INVALID_RUN_ID = '#invalid-run-id' as const;
export const RESPONDING_TOO_QUICKLY = '#responding-too-quickly' as const;
export type AppErrorId = typeof INVALID_RUN_ID | typeof RESPONDING_TOO_QUICKLY;

export type AppErrorResponse = {
  id: AppErrorId | undefined;
  message: string;
}
