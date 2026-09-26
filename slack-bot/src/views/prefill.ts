/**
 * Compact serialization of a parsed modal submission, used to reopen the
 * modal with the previous game's answers ("New game, same settings").
 *
 * The bot is stateless - there is no database - so the payload rides along
 * in the Block Kit button's `value` on the host summary DM. Slack caps that
 * field at 2000 characters, hence the one-letter keys and the
 * `MAX_PREFILL_VALUE_LENGTH` guard in `encodePrefill`.
 *
 * Versions:
 *   1 - original shape.
 *   2 - adds the Claude seat (`k`, its color) and lets `f` be `'c'` for
 *       "Claude goes first". v1 payloads (from buttons posted by an older
 *       deploy) still decode; they simply have no Claude seat.
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

/** First-player choice: a human slot index, Claude, or none. */
export type FirstPlayerChoice = number | 'claude' | undefined;

/** Slack's hard limit on a button element's `value`. */
export const MAX_PREFILL_VALUE_LENGTH = 2000;

export const PREFILL_VERSION = 2;
/** Versions decodePrefill accepts. Older buttons stay usable after a deploy. */
const SUPPORTED_PREFILL_VERSIONS: ReadonlyArray<number> = [1, 2];

/** Wire value of `f` meaning "Claude goes first". */
const CLAUDE_FIRST_WIRE = 'c';

export interface PrefillSlot {
  index: number;
  slackUserId: string;
  color: PlayerColor;
}

/** Everything the modal needs to reproduce the previous submission. */
export interface Prefill {
  slots: Array<PrefillSlot>;
  randomFirstPlayer: boolean;
  firstPlayerSlot: FirstPlayerChoice;
  /** Claude's color when "Claude plays" was checked; undefined when it wasn't. */
  claudeColor: PlayerColor | undefined;
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
  f?: number | typeof CLAUDE_FIRST_WIRE;
  /** Claude's color; present only when Claude plays (v2+). */
  k?: string;
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
    wire.f = prefill.firstPlayerSlot === 'claude' ? CLAUDE_FIRST_WIRE : prefill.firstPlayerSlot;
  }
  if (prefill.claudeColor !== undefined) {
    wire.k = prefill.claudeColor;
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
  if (typeof wire.v !== 'number' || !SUPPORTED_PREFILL_VERSIONS.includes(wire.v) || !Array.isArray(wire.s)) {
    return undefined;
  }

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

  const claudeColor = isPlayerColor(wire.k) ? wire.k : undefined;
  let firstPlayerSlot: FirstPlayerChoice;
  if (typeof wire.f === 'number') {
    firstPlayerSlot = wire.f;
  } else if (wire.f === CLAUDE_FIRST_WIRE && claudeColor !== undefined) {
    firstPlayerSlot = 'claude';
  }

  return {
    slots,
    randomFirstPlayer: wire.r === 1,
    firstPlayerSlot,
    claudeColor,
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
