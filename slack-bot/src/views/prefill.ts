/**
 * Compact serialization of a parsed modal submission, used to reopen the
 * modal with the previous game's answers ("New game, same settings").
 *
 * The bot is stateless - there is no database - so the payload rides along
 * in the Block Kit button's `value` on the host summary DM. Slack caps that
 * field at 2000 characters, hence the one-letter keys and the
 * `MAX_PREFILL_VALUE_LENGTH` guard in `encodePrefill`.
 */

import {
  BOARDS,
  EXPANSIONS,
  PLAYER_COLORS,
  type BoardNameType,
  type Expansion,
  type PlayerColor,
} from '../tm/types.js';
import {MAX_PLAYER_SLOTS, TOGGLES, type ToggleKey} from './newGameView.js';

/** Slack's hard limit on a button element's `value`. */
export const MAX_PREFILL_VALUE_LENGTH = 2000;

export const PREFILL_VERSION = 1;

export interface PrefillSlot {
  index: number;
  slackUserId: string;
  color: PlayerColor;
}

/** Everything the modal needs to reproduce the previous submission. */
export interface Prefill {
  slots: Array<PrefillSlot>;
  randomFirstPlayer: boolean;
  firstPlayerSlot: number | undefined;
  board: BoardNameType;
  /** Only the enabled expansions, so the payload stays short. */
  expansions: Array<Expansion>;
  /** Only the enabled toggles. */
  toggles: Array<ToggleKey>;
  startingCorporations: number;
  startingPreludes: number;
  escapeVelocityOn: boolean;
  escapeVelocityThresholdMinutes: number;
}

/** Wire shape. Keys are abbreviated purely to fit Slack's 2000-char cap. */
interface WirePrefill {
  v: number;
  s: Array<[number, string, string]>;
  r: 0 | 1;
  f?: number;
  b: string;
  e: Array<string>;
  t: Array<string>;
  c: number;
  p: number;
  ev: 0 | 1;
  em: number;
}

/**
 * Serialize a prefill. Returns undefined when the result would exceed the
 * Slack button-value limit, so callers can simply omit the button.
 */
export function encodePrefill(prefill: Prefill): string | undefined {
  const wire: WirePrefill = {
    v: PREFILL_VERSION,
    s: prefill.slots.map((s) => [s.index, s.slackUserId, s.color]),
    r: prefill.randomFirstPlayer ? 1 : 0,
    b: prefill.board,
    e: [...prefill.expansions],
    t: [...prefill.toggles],
    c: prefill.startingCorporations,
    p: prefill.startingPreludes,
    ev: prefill.escapeVelocityOn ? 1 : 0,
    em: prefill.escapeVelocityThresholdMinutes,
  };
  if (prefill.firstPlayerSlot !== undefined) {
    wire.f = prefill.firstPlayerSlot;
  }
  const encoded = JSON.stringify(wire);
  return encoded.length > MAX_PREFILL_VALUE_LENGTH ? undefined : encoded;
}

/**
 * Parse a prefill produced by `encodePrefill`. Returns undefined for anything
 * malformed or from a future version - the caller then opens a fresh modal
 * rather than failing, since a stale button is not worth an error DM.
 */
export function decodePrefill(raw: string | undefined): Prefill | undefined {
  if (raw === undefined || raw === '') return undefined;
  let wire: Partial<WirePrefill>;
  try {
    wire = JSON.parse(raw) as Partial<WirePrefill>;
  } catch {
    return undefined;
  }
  if (wire.v !== PREFILL_VERSION || !Array.isArray(wire.s)) return undefined;

  const slots: Array<PrefillSlot> = [];
  for (const entry of wire.s) {
    if (!Array.isArray(entry) || entry.length < 3) continue;
    const [index, slackUserId, color] = entry;
    if (typeof index !== 'number' || index < 1 || index > MAX_PLAYER_SLOTS) continue;
    if (typeof slackUserId !== 'string' || slackUserId === '') continue;
    if (!isPlayerColor(color)) continue;
    slots.push({index, slackUserId, color});
  }
  if (slots.length === 0) return undefined;

  return {
    slots,
    randomFirstPlayer: wire.r === 1,
    firstPlayerSlot: typeof wire.f === 'number' ? wire.f : undefined,
    board: isBoard(wire.b) ? wire.b : 'random all',
    expansions: keepKnown(wire.e, EXPANSIONS),
    toggles: keepKnown(wire.t, TOGGLES.map((t) => t.value)),
    startingCorporations: typeof wire.c === 'number' ? wire.c : 3,
    startingPreludes: typeof wire.p === 'number' ? wire.p : 4,
    escapeVelocityOn: wire.ev === 1,
    escapeVelocityThresholdMinutes: typeof wire.em === 'number' ? wire.em : 20,
  };
}

function keepKnown<T extends string>(
  values: unknown,
  known: ReadonlyArray<T>,
): Array<T> {
  if (!Array.isArray(values)) return [];
  return values.filter((v): v is T => typeof v === 'string' && (known as ReadonlyArray<string>).includes(v));
}

function isPlayerColor(v: unknown): v is PlayerColor {
  return typeof v === 'string' && (PLAYER_COLORS as ReadonlyArray<string>).includes(v);
}

function isBoard(v: unknown): v is BoardNameType {
  return typeof v === 'string' && BOARDS.some((b) => b.value === v);
}
