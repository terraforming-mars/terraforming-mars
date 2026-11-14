export type PlayerId = `p${string}`;
export type GameId = `g${string}`;
export type SpectatorId = `s${string}`;
export type ParticipantId = PlayerId | SpectatorId;
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type TwoDigits = `${Digit}${Digit}`;
export type SpaceId = `${TwoDigits}` | `c${TwoDigits}` | `m${TwoDigits}`;
export type Named<T> = {name: T};

export function isPlayerId(object: unknown): object is PlayerId {
  return typeof object === 'string' && object.charAt(0) === 'p';
}

export function isGameId(object: unknown): object is GameId {
  return typeof object === 'string' && object.charAt(0) === 'g';
}

export function isSpectatorId(object: unknown): object is SpectatorId {
  return typeof object === 'string' && object.charAt(0) === 's';
}

export function isSpaceId(object: unknown): object is SpaceId {
  return typeof object === 'string' && /^[cm]?[0-9][0-9]$/.test(object);
}

export function safeCast<T>(object: unknown, tester: (object: unknown) => object is T) {
  if (tester(object)) {
    return object;
  }
  throw new Error('failed cast: ' + tester.name);
}

/**
 * Very similar to `any` but only contains primitives, arrays of primitives, or dictionaries of primitives.
 *
 * An object of this type is guaranteed safe to serialize and deserialize.
 */
export type JSONValue =
    | undefined
    | string
    | number
    | boolean
    | JSONObject
    | Array<JSONValue>;

export type JSONObject = { [x: string]: JSONValue };

