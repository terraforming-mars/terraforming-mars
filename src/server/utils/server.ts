export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Set once, by server.ts, when running as the live request-serving process
// (never by build scripts like export_card_rendering.ts, or by tests).
// Lets code skip work whose only consumer is that build script.
let liveServer = false;

export function markAsLiveServer(): void {
  liveServer = true;
}

export function isLiveServer(): boolean {
  return liveServer;
}
