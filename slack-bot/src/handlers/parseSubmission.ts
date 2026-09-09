/**
 * Parses the Slack view_submission payload (view.state.values) into a typed
 * intermediate shape, validates it, and assembles the final NewGameConfig.
 *
 * Split out from the handler so it can be unit-tested without spinning up Bolt.
 */

import {
  ActionIds,
  BlockIds,
  DEFAULT_STARTING_CORPORATIONS,
  DEFAULT_STARTING_PRELUDES,
  MAX_PLAYER_SLOTS,
  MAX_STARTING_CORPORATIONS,
  MIN_STARTING_CORPORATIONS,
  TOGGLES,
  type ToggleKey,
} from '../views/newGameView.js';
import type {Prefill} from '../views/prefill.js';
import {
  buildNewGameConfig,
  type PartialNewGameConfig,
} from '../tm/defaults.js';
import {
  DEFAULT_ESCAPE_VELOCITY,
  EXPANSIONS,
  PLAYER_COLORS,
  type BoardNameType,
  type Expansion,
  type NewGameConfig,
  type NewPlayerModel,
  type PlayerColor,
} from '../tm/types.js';

export interface RawSlot {
  index: number;
  slackUserId: string;
  color: PlayerColor;
}

export interface ParsedSubmission {
  slots: Array<RawSlot>;
  randomFirstPlayer: boolean;
  firstPlayerSlot: number | undefined;
  board: BoardNameType;
  expansions: Record<Expansion, boolean>;
  toggles: Record<ToggleKey, boolean>;
  startingPreludes: number;
  startingCorporations: number;
  escapeVelocityOn: boolean;
  escapeVelocityThresholdMinutes: number;
}

export interface ValidationErrors {
  errors: Record<string, string>;
}

type ViewState = Record<string, Record<string, unknown>>;

/** Type guard for the validation-error union. */
export function isErrors(x: ParsedSubmission | ValidationErrors): x is ValidationErrors {
  return (x as ValidationErrors).errors !== undefined;
}

export function parseSubmission(state: ViewState): ParsedSubmission | ValidationErrors {
  const errors: Record<string, string> = {};

  // -- Per-slot inputs --
  const slots: Array<RawSlot> = [];
  const seenUsers = new Set<string>();
  for (let i = 1; i <= MAX_PLAYER_SLOTS; i++) {
    const userId = readSelectedUser(state, BlockIds.slotUser(i), ActionIds.slotUser(i));
    if (userId === undefined) {
      continue;
    }
    if (seenUsers.has(userId)) {
      errors[BlockIds.slotUser(i)] = 'This Slack user is already in another slot.';
      continue;
    }
    seenUsers.add(userId);
    const colorValue =
      readSelectedValue(state, BlockIds.slotColor(i), ActionIds.slotColor(i)) ??
      PLAYER_COLORS[(i - 1) % PLAYER_COLORS.length]!;
    if (!isPlayerColor(colorValue)) {
      errors[BlockIds.slotColor(i)] = `Unknown color: ${colorValue}.`;
      continue;
    }
    slots.push({index: i, slackUserId: userId, color: colorValue});
  }
  if (slots.length < 1) {
    errors[BlockIds.slotUser(1)] = 'Pick at least one Slack user.';
  }

  // -- First-player choice --
  const randomFirstPlayer = readCheckboxValues(
    state,
    BlockIds.randomFirstPlayer,
    ActionIds.randomFirstPlayer,
  ).includes('random');
  const firstPlayerRaw = readSelectedValue(
    state,
    BlockIds.firstPlayerSlot,
    ActionIds.firstPlayerSlot,
  );
  const firstPlayerSlot = firstPlayerRaw !== undefined ? Number.parseInt(firstPlayerRaw, 10) : undefined;
  if (!randomFirstPlayer && firstPlayerSlot !== undefined) {
    const populated = slots.some((s) => s.index === firstPlayerSlot);
    if (!populated) {
      errors[BlockIds.firstPlayerSlot] = `Slot ${firstPlayerSlot} has no Slack user picked.`;
    }
  }

  // -- Board / expansions / toggles --
  const board = (readSelectedValue(state, BlockIds.board, ActionIds.board) ?? 'tharsis') as BoardNameType;

  const selectedExpansionValues = readMultiSelectValues(
    state,
    BlockIds.expansions,
    ActionIds.expansions,
  );
  const expansions = Object.fromEntries(
    EXPANSIONS.map((e) => [e, selectedExpansionValues.includes(e)]),
  ) as Record<Expansion, boolean>;

  const selectedToggleValues = readCheckboxValues(state, BlockIds.toggles, ActionIds.toggles);
  const toggles = Object.fromEntries(
    TOGGLES.map((t) => [t.value, selectedToggleValues.includes(t.value)]),
  ) as Record<ToggleKey, boolean>;

  // -- Numbers --
  const startingPreludes = parseNonNegInt(
    readTextInput(state, BlockIds.startingPreludes, ActionIds.startingPreludes),
    DEFAULT_STARTING_PRELUDES,
  );
  if (startingPreludes === undefined) {
    errors[BlockIds.startingPreludes] = 'Must be a whole number 0-20.';
  }
  const startingCorporations = parseIntInRange(
    readTextInput(state, BlockIds.startingCorporations, ActionIds.startingCorporations),
    DEFAULT_STARTING_CORPORATIONS,
    MIN_STARTING_CORPORATIONS,
    MAX_STARTING_CORPORATIONS,
  );
  if (startingCorporations === undefined) {
    errors[BlockIds.startingCorporations] =
      `Must be a whole number ${MIN_STARTING_CORPORATIONS}-${MAX_STARTING_CORPORATIONS}.`;
  }

  // -- Escape Velocity --
  const evValue = readSelectedValue(state, BlockIds.escapeVelocity, ActionIds.escapeVelocity);
  const escapeVelocityOn = evValue === 'on';
  const escapeVelocityThresholdMinutes = parseMinutes(
    readTextInput(state, BlockIds.escapeVelocityMinutes, ActionIds.escapeVelocityMinutes),
    DEFAULT_ESCAPE_VELOCITY.thresholdMinutes,
  );
  if (escapeVelocityOn && escapeVelocityThresholdMinutes === undefined) {
    errors[BlockIds.escapeVelocityMinutes] = 'Must be a whole number of minutes 1-180.';
  }

  if (Object.keys(errors).length > 0) {
    return {errors};
  }

  return {
    slots,
    randomFirstPlayer,
    firstPlayerSlot,
    board,
    expansions,
    toggles,
    startingPreludes: startingPreludes!,
    startingCorporations: startingCorporations!,
    escapeVelocityOn,
    escapeVelocityThresholdMinutes: escapeVelocityThresholdMinutes ?? DEFAULT_ESCAPE_VELOCITY.thresholdMinutes,
  };
}

/**
 * Auto-dedupe player colors. Mirrors src/client/components/create/CreateGameForm.vue lines 925-942.
 * Retains the first occurrence of each color and assigns the first available
 * unused color (in PLAYER_COLORS order) to subsequent duplicates.
 */
export function dedupeColors(slots: Array<RawSlot>): Array<RawSlot> {
  const used = new Set<PlayerColor>();
  const result: Array<RawSlot> = [];
  for (const slot of slots) {
    if (!used.has(slot.color)) {
      used.add(slot.color);
      result.push(slot);
      continue;
    }
    const replacement = PLAYER_COLORS.find((c) => !used.has(c));
    if (replacement === undefined) {
      // More slots than colors - shouldn't happen (PLAYER_COLORS has 8, MAX_PLAYER_SLOTS is 6).
      result.push(slot);
      continue;
    }
    used.add(replacement);
    result.push({...slot, color: replacement});
  }
  return result;
}

/** Map each slot's Slack user id to a display name to use as the player name. */
export type DisplayNameLookup = (slackUserId: string) => string | undefined;

export function toNewGameConfig(
  parsed: ParsedSubmission,
  lookup: DisplayNameLookup,
): {config: NewGameConfig; slackUserIds: Array<string>; slackUserIdByColor: Record<string, string>} {
  // The TM server ignores the `randomFirstPlayer` flag - it seats players in
  // the array order it receives and reads the per-player `first` flag. So we
  // do the randomization here, mirroring CreateGameForm.vue's serializeSettings:
  // shuffle the seating order and pick a random player to go first.
  let ordered = dedupeColors(parsed.slots);
  let firstIndex0: number;
  if (parsed.randomFirstPlayer) {
    ordered = shuffle(ordered);
    firstIndex0 = Math.floor(Math.random() * ordered.length);
  } else if (parsed.firstPlayerSlot !== undefined) {
    firstIndex0 = ordered.findIndex((s) => s.index === parsed.firstPlayerSlot);
  } else {
    firstIndex0 = -1;
  }

  const players: Array<NewPlayerModel> = ordered.map((slot, idx) => ({
    name: lookup(slot.slackUserId) ?? fallbackName(slot.color, idx),
    color: slot.color,
    beginner: false,
    handicap: 0,
    first: idx === firstIndex0,
  }));

  const overrides: PartialNewGameConfig = {
    players,
    expansions: parsed.expansions,
    board: parsed.board,
    seed: Math.random(),
    randomFirstPlayer: parsed.randomFirstPlayer,
    undoOption: parsed.toggles.undoOption,
    showTimers: parsed.toggles.showTimers,
    fastModeOption: parsed.toggles.fastModeOption,
    draftVariant: parsed.toggles.draftVariant,
    initialDraft: parsed.toggles.initialDraft,
    showOtherPlayersVP: parsed.toggles.showOtherPlayersVP,
    solarPhaseOption: parsed.toggles.solarPhaseOption,
    twoCorpsVariant: parsed.toggles.twoCorpsVariant,
    removeNegativeGlobalEventsOption: parsed.toggles.removeNegativeGlobalEventsOption,
    shuffleMapOption: parsed.toggles.shuffleMapOption,
    startingPreludes: parsed.startingPreludes,
    startingCorporations: parsed.startingCorporations,
    escapeVelocity: parsed.escapeVelocityOn
      ? {...DEFAULT_ESCAPE_VELOCITY, thresholdMinutes: parsed.escapeVelocityThresholdMinutes}
      : undefined,
  };

  // Map by color (unique per player and preserved by the server) so DMs stay
  // correct even though the server returns players in generation order, which
  // starts at the first player rather than our submission order.
  const slackUserIdByColor: Record<string, string> = {};
  for (const slot of ordered) {
    slackUserIdByColor[slot.color] = slot.slackUserId;
  }

  return {
    config: buildNewGameConfig(overrides),
    slackUserIds: ordered.map((s) => s.slackUserId),
    slackUserIdByColor,
  };
}

/**
 * Reduce a submission to the compact shape that reopens the modal with the
 * same answers. Colors come from the raw slots rather than the deduped
 * seating order so a rematch reproduces what the host actually picked.
 */
export function toPrefill(parsed: ParsedSubmission): Prefill {
  return {
    slots: parsed.slots.map((s) => ({...s})),
    randomFirstPlayer: parsed.randomFirstPlayer,
    firstPlayerSlot: parsed.firstPlayerSlot,
    board: parsed.board,
    expansions: EXPANSIONS.filter((e) => parsed.expansions[e]),
    toggles: TOGGLES.map((t) => t.value).filter((k) => parsed.toggles[k]),
    startingCorporations: parsed.startingCorporations,
    startingPreludes: parsed.startingPreludes,
    escapeVelocityOn: parsed.escapeVelocityOn,
    escapeVelocityThresholdMinutes: parsed.escapeVelocityThresholdMinutes,
  };
}

function fallbackName(color: PlayerColor, idx: number): string {
  return `${color.charAt(0).toUpperCase()}${color.slice(1)} (slot ${idx + 1})`;
}

/** Returns a new array with the elements in a random order (Fisher-Yates). */
function shuffle<T>(items: ReadonlyArray<T>): Array<T> {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

// --- view.state.values readers ---

function getAction(state: ViewState, blockId: string, actionId: string): unknown {
  const block = state[blockId];
  if (block === undefined) return undefined;
  return block[actionId];
}

function readSelectedUser(state: ViewState, blockId: string, actionId: string): string | undefined {
  const a = getAction(state, blockId, actionId) as {selected_user?: string | null} | undefined;
  const v = a?.selected_user;
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function readSelectedValue(state: ViewState, blockId: string, actionId: string): string | undefined {
  const a = getAction(state, blockId, actionId) as
    | {selected_option?: {value?: string} | null}
    | undefined;
  const v = a?.selected_option?.value;
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function readMultiSelectValues(state: ViewState, blockId: string, actionId: string): Array<string> {
  const a = getAction(state, blockId, actionId) as
    | {selected_options?: Array<{value?: string}>}
    | undefined;
  if (!a?.selected_options) return [];
  return a.selected_options.map((o) => o.value).filter((v): v is string => typeof v === 'string');
}

function readCheckboxValues(state: ViewState, blockId: string, actionId: string): Array<string> {
  return readMultiSelectValues(state, blockId, actionId);
}

function readTextInput(state: ViewState, blockId: string, actionId: string): string | undefined {
  const a = getAction(state, blockId, actionId) as {value?: string | null} | undefined;
  const v = a?.value;
  return typeof v === 'string' ? v : undefined;
}

function parseNonNegInt(raw: string | undefined, fallback: number): number | undefined {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0 || n > 20 || String(n) !== raw.trim()) return undefined;
  return n;
}

function parseIntInRange(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number | undefined {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < min || n > max || String(n) !== raw.trim()) return undefined;
  return n;
}

/** Escape Velocity threshold, in minutes. Mirrors the web form's 1-180 range. */
function parseMinutes(raw: string | undefined, fallback: number): number | undefined {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || n > 180 || String(n) !== raw.trim()) return undefined;
  return n;
}

function isPlayerColor(v: string): v is PlayerColor {
  return (PLAYER_COLORS as ReadonlyArray<string>).includes(v);
}
