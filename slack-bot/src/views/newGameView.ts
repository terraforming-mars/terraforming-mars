/**
 * Block Kit view builder for the /tm-newgame modal.
 *
 * The modal renders 6 fixed (optional) player slots rather than dynamically
 * refreshing the view when a player-count selector changes. This keeps the
 * code simple - no block_actions handler, no state preservation logic - at
 * the cost of always showing 6 slots. The submission handler ignores slots
 * with no Slack user picked.
 *
 * Every block also accepts an optional prefill so the "New game, same
 * settings" button on the host summary DM can reopen the modal with the
 * previous game's answers already filled in.
 */

import type {KnownBlock, ModalView, PlainTextOption} from '@slack/types';
import {
  BOARDS,
  DEFAULT_ESCAPE_VELOCITY,
  EXPANSIONS,
  EXPANSION_LABELS,
  PLAYER_COLORS,
} from '../tm/types.js';
import type {Prefill} from './prefill.js';

export const VIEW_CALLBACK_ID = 'tm_newgame_modal';
export const MAX_PLAYER_SLOTS = 6;

/** Web form's `min`/`max` on the starting-corporations input. */
export const MIN_STARTING_CORPORATIONS = 1;
export const MAX_STARTING_CORPORATIONS = 6;
export const DEFAULT_STARTING_CORPORATIONS = 3;
export const DEFAULT_STARTING_PRELUDES = 4;

/** Block IDs referenced by onViewSubmission when reading view.state.values. */
export const BlockIds = {
  slotUser: (i: number) => `slot_${i}_user`,
  slotColor: (i: number) => `slot_${i}_color`,
  board: 'board',
  expansions: 'expansions',
  toggles: 'toggles',
  startingPreludes: 'starting_preludes',
  startingCorporations: 'starting_corporations',
  escapeVelocity: 'escape_velocity',
  escapeVelocityMinutes: 'escape_velocity_minutes',
  randomFirstPlayer: 'random_first_player',
  firstPlayerSlot: 'first_player_slot',
} as const;

/** Action IDs referenced inside the input elements. */
export const ActionIds = {
  slotUser: (i: number) => `slot_${i}_user_action`,
  slotColor: (i: number) => `slot_${i}_color_action`,
  board: 'board_action',
  expansions: 'expansions_action',
  toggles: 'toggles_action',
  startingPreludes: 'starting_preludes_action',
  startingCorporations: 'starting_corporations_action',
  escapeVelocity: 'escape_velocity_action',
  escapeVelocityMinutes: 'escape_velocity_minutes_action',
  randomFirstPlayer: 'random_first_player_action',
  firstPlayerSlot: 'first_player_slot_action',
} as const;

/** Values for the toggles checkboxes block. Keys map 1:1 to NewGameConfig fields. */
export const TOGGLES = [
  {value: 'undoOption', text: 'Allow undo'},
  {value: 'showTimers', text: 'Show timers'},
  {value: 'fastModeOption', text: 'Fast mode'},
  {value: 'draftVariant', text: 'Draft variant'},
  {value: 'initialDraft', text: 'Initial draft'},
  {value: 'showOtherPlayersVP', text: "Show others' VP"},
  {value: 'solarPhaseOption', text: 'Solar phase (Venus)'},
  {value: 'twoCorpsVariant', text: 'Two corporations'},
  {value: 'removeNegativeGlobalEventsOption', text: 'No negative global events'},
  {value: 'shuffleMapOption', text: 'Shuffle map'},
] as const;
export type ToggleKey = typeof TOGGLES[number]['value'];

const DEFAULT_TOGGLES: ReadonlyArray<ToggleKey> = ['undoOption', 'draftVariant', 'showTimers', 'showOtherPlayersVP'];
const DEFAULT_EXPANSION_KEYS: ReadonlyArray<string> = ['corpera', 'promo', 'venus', 'colonies', 'prelude', 'prelude2'];

export interface PrivateMetadata {
  /** Slack user who ran /tm-newgame, used for the final summary DM. */
  hostUserId: string;
  /** Channel the slash command was invoked from, included in the summary. */
  channelId: string | undefined;
}

export function encodePrivateMetadata(meta: PrivateMetadata): string {
  return JSON.stringify(meta);
}

export function decodePrivateMetadata(raw: string): PrivateMetadata {
  return JSON.parse(raw) as PrivateMetadata;
}

export function buildNewGameView(privateMetadata: PrivateMetadata, prefill?: Prefill): ModalView {
  const blocks: Array<KnownBlock> = [];

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: prefill === undefined
        ? '*Set up a Terraforming Mars game.* Pick 1-6 Slack teammates below. Each player will receive a DM with their personal game link.'
        : '*Same players and options as your last game.* Change anything you like, then hit Create game.',
    },
  });
  blocks.push({type: 'divider'});

  for (let i = 1; i <= MAX_PLAYER_SLOTS; i++) {
    blocks.push(slotUserBlock(i, prefill));
    blocks.push(slotColorBlock(i, prefill));
  }

  blocks.push({type: 'divider'});
  blocks.push(boardBlock(prefill));
  blocks.push(expansionsBlock(prefill));
  blocks.push(togglesBlock(prefill));
  blocks.push(randomFirstPlayerBlock(prefill));
  blocks.push(firstPlayerSlotBlock(prefill));
  blocks.push(startingCorporationsBlock(prefill));
  blocks.push(startingPreludesBlock(prefill));
  blocks.push(escapeVelocityBlock(prefill));
  blocks.push(escapeVelocityMinutesBlock(prefill));

  return {
    type: 'modal',
    callback_id: VIEW_CALLBACK_ID,
    private_metadata: encodePrivateMetadata(privateMetadata),
    // NB Slack caps title/submit/close at 24 characters each.
    title: {type: 'plain_text', text: 'Terraforming Mars game'},
    submit: {type: 'plain_text', text: 'Create game'},
    close: {type: 'plain_text', text: 'Cancel'},
    blocks,
  };
}

function slotUserBlock(i: number, prefill?: Prefill): KnownBlock {
  const initialUser = prefill?.slots.find((s) => s.index === i)?.slackUserId;
  return {
    type: 'input',
    block_id: BlockIds.slotUser(i),
    optional: i > 1, // slot 1 required, rest optional
    label: {type: 'plain_text', text: `Player ${i}`},
    element: {
      type: 'users_select',
      action_id: ActionIds.slotUser(i),
      ...(initialUser !== undefined ? {initial_user: initialUser} : {}),
      placeholder: {type: 'plain_text', text: 'Pick a teammate'},
    },
  };
}

function slotColorBlock(i: number, prefill?: Prefill): KnownBlock {
  const defaultColor =
    prefill?.slots.find((s) => s.index === i)?.color ??
    PLAYER_COLORS[(i - 1) % PLAYER_COLORS.length]!;
  return {
    type: 'input',
    block_id: BlockIds.slotColor(i),
    optional: true,
    label: {type: 'plain_text', text: `Color (player ${i})`},
    element: {
      type: 'static_select',
      action_id: ActionIds.slotColor(i),
      initial_option: colorOption(defaultColor),
      options: PLAYER_COLORS.map(colorOption),
    },
  };
}

function colorOption(color: string): PlainTextOption {
  const label = color.charAt(0).toUpperCase() + color.slice(1);
  return {
    text: {type: 'plain_text', text: label},
    value: color,
  };
}

function boardBlock(prefill?: Prefill): KnownBlock {
  const options = BOARDS.map((b) => ({
    text: {type: 'plain_text' as const, text: b.label},
    value: b.value,
  }));
  const wanted = prefill?.board ?? 'random all';
  const defaultOption = options.find((o) => o.value === wanted) ??
    options.find((o) => o.value === 'random all') ??
    options[0]!;
  return {
    type: 'input',
    block_id: BlockIds.board,
    label: {type: 'plain_text', text: 'Board'},
    element: {
      type: 'static_select',
      action_id: ActionIds.board,
      initial_option: defaultOption,
      options,
    },
  };
}

function expansionsBlock(prefill?: Prefill): KnownBlock {
  const options = EXPANSIONS.map((key) => ({
    text: {type: 'plain_text' as const, text: EXPANSION_LABELS[key]},
    value: key,
  }));
  const selected: ReadonlyArray<string> = prefill?.expansions ?? DEFAULT_EXPANSION_KEYS;
  const initial = options.filter((o) => selected.includes(o.value));
  return {
    type: 'input',
    block_id: BlockIds.expansions,
    optional: true,
    label: {type: 'plain_text', text: 'Expansions'},
    element: {
      type: 'multi_static_select',
      action_id: ActionIds.expansions,
      // Slack rejects an empty initial_options array.
      ...(initial.length > 0 ? {initial_options: initial} : {}),
      options,
    },
  };
}

function togglesBlock(prefill?: Prefill): KnownBlock {
  const options = TOGGLES.map((t) => ({
    text: {type: 'plain_text' as const, text: t.text},
    value: t.value,
  }));
  const selected: ReadonlyArray<string> = prefill?.toggles ?? DEFAULT_TOGGLES;
  const initial = options.filter((o) => selected.includes(o.value));
  return {
    type: 'input',
    block_id: BlockIds.toggles,
    optional: true,
    label: {type: 'plain_text', text: 'Options'},
    element: {
      type: 'checkboxes',
      action_id: ActionIds.toggles,
      ...(initial.length > 0 ? {initial_options: initial} : {}),
      options,
    },
  };
}

function randomFirstPlayerBlock(prefill?: Prefill): KnownBlock {
  const option = {
    text: {type: 'plain_text' as const, text: 'Pick first player randomly'},
    value: 'random',
  };
  const checked = prefill?.randomFirstPlayer ?? true;
  return {
    type: 'input',
    block_id: BlockIds.randomFirstPlayer,
    optional: true,
    label: {type: 'plain_text', text: 'First player'},
    element: {
      type: 'checkboxes',
      action_id: ActionIds.randomFirstPlayer,
      ...(checked ? {initial_options: [option]} : {}),
      options: [option],
    },
  };
}

function firstPlayerSlotBlock(prefill?: Prefill): KnownBlock {
  const options = Array.from({length: MAX_PLAYER_SLOTS}, (_, i) => ({
    text: {type: 'plain_text' as const, text: `Player ${i + 1}`},
    value: String(i + 1),
  }));
  const initial = options.find((o) => o.value === String(prefill?.firstPlayerSlot));
  return {
    type: 'input',
    block_id: BlockIds.firstPlayerSlot,
    optional: true,
    label: {
      type: 'plain_text',
      text: 'Or pick a specific first player (ignored if "random" is checked)',
    },
    element: {
      type: 'static_select',
      action_id: ActionIds.firstPlayerSlot,
      ...(initial !== undefined ? {initial_option: initial} : {}),
      placeholder: {type: 'plain_text', text: 'Choose a slot'},
      options,
    },
  };
}

function startingCorporationsBlock(prefill?: Prefill): KnownBlock {
  return {
    type: 'input',
    block_id: BlockIds.startingCorporations,
    optional: true,
    label: {type: 'plain_text', text: 'Corporations dealt per player'},
    element: {
      type: 'plain_text_input',
      action_id: ActionIds.startingCorporations,
      initial_value: String(prefill?.startingCorporations ?? DEFAULT_STARTING_CORPORATIONS),
      max_length: 1,
    },
  };
}

function startingPreludesBlock(prefill?: Prefill): KnownBlock {
  return {
    type: 'input',
    block_id: BlockIds.startingPreludes,
    optional: true,
    label: {type: 'plain_text', text: 'Starting preludes per player'},
    element: {
      type: 'plain_text_input',
      action_id: ActionIds.startingPreludes,
      initial_value: String(prefill?.startingPreludes ?? DEFAULT_STARTING_PRELUDES),
      max_length: 2,
    },
  };
}

function escapeVelocityBlock(prefill?: Prefill): KnownBlock {
  const off = {text: {type: 'plain_text' as const, text: 'Off'}, value: 'off'};
  const on = {
    text: {type: 'plain_text' as const, text: `On (+${DEFAULT_ESCAPE_VELOCITY.bonusSectionsPerAction}s/action)`},
    value: 'on',
  };
  return {
    type: 'input',
    block_id: BlockIds.escapeVelocity,
    optional: true,
    label: {type: 'plain_text', text: 'Escape Velocity'},
    element: {
      type: 'radio_buttons',
      action_id: ActionIds.escapeVelocity,
      initial_option: prefill !== undefined && !prefill.escapeVelocityOn ? off : on,
      options: [off, on],
    },
  };
}

function escapeVelocityMinutesBlock(prefill?: Prefill): KnownBlock {
  return {
    type: 'input',
    block_id: BlockIds.escapeVelocityMinutes,
    optional: true,
    label: {type: 'plain_text', text: 'Escape Velocity time (minutes, ignored when Off)'},
    element: {
      type: 'plain_text_input',
      action_id: ActionIds.escapeVelocityMinutes,
      initial_value: String(
        prefill?.escapeVelocityThresholdMinutes ?? DEFAULT_ESCAPE_VELOCITY.thresholdMinutes,
      ),
      max_length: 3,
    },
  };
}
