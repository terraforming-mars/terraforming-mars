export const RESPONDING_TOO_QUICKLY = '#responding-too-quickly' as const;
export const INVALID_REQUEST_ID = '#invalid-request-id' as const;
export type AppErrorId = typeof RESPONDING_TOO_QUICKLY | typeof INVALID_REQUEST_ID;

export type AppErrorResponse = {
  id: AppErrorId | undefined;
  message: string;
}
