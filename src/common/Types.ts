export type PlayerId = `p${string}`;
export type GameId = `g${string}`;
export type SpectatorId = `s${string}`;
export type ParticipantId = PlayerId | SpectatorId;
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type TwoDigits = `${Digit}${Digit}`;
export type SpaceId = `${TwoDigits}` | `m${TwoDigits}`;

export function isPlayerId(object: any): object is PlayerId {
  return object?.charAt?.(0) === 'p';
}

export function isGameId(object: any): object is GameId {
  return object?.charAt?.(0) === 'g';
}

export function isSpectatorId(object: any): object is SpectatorId {
  return object?.charAt?.(0) === 's';
}

export function isSpaceId(object: string): object is SpaceId {
  return /^m?[0-9][0-9]$/.test(object);
}
