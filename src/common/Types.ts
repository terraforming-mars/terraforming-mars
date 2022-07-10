export type PlayerId = `p${string}`;
export type GameId = `g${string}`;
export type SpectatorId = `s${string}`;
export type SpaceId = string;

export function isPlayerId(object: any): object is PlayerId {
  return object?.charAt?.(0) === 'p';
}

export function isGameId(object: any): object is GameId {
  return object?.charAt?.(0) === 'g';
}

export function isSpectatorId(object: any): object is SpectatorId {
  return object?.charAt?.(0) === 's';
}
