import {Color} from '@/common/Color';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';

/**
 * The `my_color` preference: the viewer sees themselves in their chosen color, and
 * whoever really has that color shows in the viewer's real color. Only this browser
 * sees the swap. Models are swapped when they arrive from the server, and colors
 * sent back to the server are swapped back with `serverColor`.
 */

// Keys in the server models that hold a player color, or an array of them.
const COLOR_KEYS: ReadonlySet<string> = new Set([
  'color', 'coOwner', 'excavator', 'chairman', 'partyLeader', 'visitor', 'activePlayer',
  'lobby', 'passedPlayers', 'colonies', 'players', 'waitingFor',
]);

type Swap = ReadonlyMap<string, Color>;

let current: Swap | undefined;

export function colorSwap(own: Color, preferred: Color | ''): Swap | undefined {
  if (preferred === '' || preferred === own) {
    return undefined;
  }
  return new Map([[own, preferred], [preferred, own]]);
}

export function swapColors<T>(value: T, swap: Swap | undefined): T {
  return swap === undefined ? value : walk(value, swap, undefined) as T;
}

function walk(value: unknown, swap: Swap, key: string | undefined): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => walk(v, swap, key));
  }
  if (typeof value === 'string') {
    return key !== undefined && COLOR_KEYS.has(key) ? swap.get(value) ?? value : value;
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = walk(v, swap, k);
  }
  // Log message data, where `value` is a player color only for the PLAYER type.
  if (out.type === LogMessageDataType.PLAYER && typeof out.value === 'string') {
    out.value = swap.get(out.value) ?? out.value;
  }
  return out;
}

/** Swaps a player view, and remembers the swap for the models that follow it. */
export function localPlayerView(model: PlayerViewModel): PlayerViewModel {
  current = colorSwap(model.thisPlayer.color, getPreferences().my_color);
  return swapColors(model, current);
}

/** Swaps any other model for the player whose view arrived last. */
export function localColors<T>(value: T): T {
  return swapColors(value, current);
}

/** Turns a color the viewer picked back into the color the server knows. */
export function serverColor<T extends string>(color: T): T {
  return (current?.get(color) ?? color) as T;
}

export function resetLocalColorsForTest(): void {
  current = undefined;
}
