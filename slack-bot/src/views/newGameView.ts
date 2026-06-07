/**
 * Block Kit view builder for the /tm-newgame modal.
 *
 * The modal renders 6 fixed (optional) player slots rather than dynamically
 * refreshing the view when a player-count selector changes. This keeps the
 * code simple - no block_actions handler, no state preservation logic - at
 * the cost of always showing 6 slots. The submission handler ignores slots
 * with no Slack user picked.
 */

import type {KnownBlock, ModalView, PlainTextOption} from '@slack/types';
import {
  BOARDS,
  DEFAULT_ESCAPE_VELOCITY,
  EXPANSIONS,
  EXPANSION_LABELS,
  PLAYER_COLORS,
} from '../tm/types.js';

export const VIEW_CALLBACK_ID = 'tm_newgame_modal';
export const MAX_PLAYER_SLOTS = 6;

/** Block IDs referenced by onViewSubmission when reading view.state.values. */
export const BlockIds = {
  slotUser: (i: number) => `slot_${i}_user`,
  slotColor: (i: number) => `slot_${i}_color`,
  board: 'board',
  expansions: 'expansions',
  toggles: 'toggles',
  startingPreludes: 'starting_preludes',
  startingCeos: 'starting_ceos',
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
  startingCeos: 'starting_ceos_action',
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

export function buildNewGameView(privateMetadata: PrivateMetadata): ModalView {
  const blocks: Array<KnownBlock> = [];

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Set up a Terraforming Mars game.* Pick 1-6 Slack teammates below. Each player will receive a DM with their personal game link.',
    },
  });
  blocks.push({type: 'divider'});

  for (let i = 1; i <= MAX_PLAYER_SLOTS; i++) {
    blocks.push(slotUserBlock(i));
    blocks.push(slotColorBlock(i));
  }

  blocks.push({type: 'divider'});
  blocks.push(boardBlock());
  blocks.push(expansionsBlock());
  blocks.push(togglesBlock());
  blocks.push(randomFirstPlayerBlock());
  blocks.push(firstPlayerSlotBlock());
  blocks.push(startingPreludesBlock());
  blocks.push(startingCeosBlock());
  blocks.push(escapeVelocityBlock());
  blocks.push(escapeVelocityMinutesBlock());

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

function slotUserBlock(i: number): KnownBlock {
  return {
    type: 'input',
    block_id: BlockIds.slotUser(i),
    optional: i > 1, // slot 1 required, rest optional
    label: {type: 'plain_text', text: `Player ${i}`},
    element: {
      type: 'users_select',
      action_id: ActionIds.slotUser(i),
      placeholder: {type: 'plain_text', text: 'Pick a teammate'},
    },
  };
}

function slotColorBlock(i: number): KnownBlock {
  const defaultColor = PLAYER_COLORS[(i - 1) % PLAYER_COLORS.length]!;
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

function boardBlock(): KnownBlock {
  const options = BOARDS.map((b) => ({
    text: {type: 'plain_text' as const, text: b.label},
    value: b.value,
  }));
  return {
    type: 'input',
    block_id: BlockIds.board,
    label: {type: 'plain_text', text: 'Board'},
    element: {
      type: 'static_select',
      action_id: ActionIds.board,
      initial_option: options[11]!,
      options,
    },
  };
}

function expansionsBlock(): KnownBlock {
  const options = EXPANSIONS.map((key) => ({
    text: {type: 'plain_text' as const, text: EXPANSION_LABELS[key]},
    value: key,
  }));
  const initial = options.filter((o) => DEFAULT_EXPANSION_KEYS.includes(o.value));
  return {
    type: 'input',
    block_id: BlockIds.expansions,
    optional: true,
    label: {type: 'plain_text', text: 'Expansions'},
    element: {
      type: 'multi_static_select',
      action_id: ActionIds.expansions,
      initial_options: initial,
      options,
    },
  };
}

function togglesBlock(): KnownBlock {
  const options = TOGGLES.map((t) => ({
    text: {type: 'plain_text' as const, text: t.text},
    value: t.value,
  }));
  const initial = options.filter((o) =>
    (DEFAULT_TOGGLES as ReadonlyArray<string>).includes(o.value),
  );
  return {
    type: 'input',
    block_id: BlockIds.toggles,
    optional: true,
    label: {type: 'plain_text', text: 'Options'},
    element: {
      type: 'checkboxes',
      action_id: ActionIds.toggles,
      initial_options: initial,
      options,
    },
  };
}

function randomFirstPlayerBlock(): KnownBlock {
  const option = {
    text: {type: 'plain_text' as const, text: 'Pick first player randomly'},
    value: 'random',
  };
  return {
    type: 'input',
    block_id: BlockIds.randomFirstPlayer,
    optional: true,
    label: {type: 'plain_text', text: 'First player'},
    element: {
      type: 'checkboxes',
      action_id: ActionIds.randomFirstPlayer,
      initial_options: [option],
      options: [option],
    },
  };
}

function firstPlayerSlotBlock(): KnownBlock {
  const options = Array.from({length: MAX_PLAYER_SLOTS}, (_, i) => ({
    text: {type: 'plain_text' as const, text: `Player ${i + 1}`},
    value: String(i + 1),
  }));
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
      placeholder: {type: 'plain_text', text: 'Choose a slot'},
      options,
    },
  };
}

function startingPreludesBlock(): KnownBlock {
  return {
    type: 'input',
    block_id: BlockIds.startingPreludes,
    optional: true,
    label: {type: 'plain_text', text: 'Starting preludes per player'},
    element: {
      type: 'plain_text_input',
      action_id: ActionIds.startingPreludes,
      initial_value: '4',
      max_length: 2,
    },
  };
}

function startingCeosBlock(): KnownBlock {
  return {
    type: 'input',
    block_id: BlockIds.startingCeos,
    optional: true,
    label: {type: 'plain_text', text: 'Starting CEOs per player'},
    element: {
      type: 'plain_text_input',
      action_id: ActionIds.startingCeos,
      initial_value: '3',
      max_length: 2,
    },
  };
}

function escapeVelocityBlock(): KnownBlock {
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
      initial_option: on,
      options: [off, on],
    },
  };
}

function escapeVelocityMinutesBlock(): KnownBlock {
  return {
    type: 'input',
    block_id: BlockIds.escapeVelocityMinutes,
    optional: true,
    label: {type: 'plain_text', text: 'Escape Velocity time (minutes, ignored when Off)'},
    element: {
      type: 'plain_text_input',
      action_id: ActionIds.escapeVelocityMinutes,
      initial_value: String(DEFAULT_ESCAPE_VELOCITY.thresholdMinutes),
      max_length: 3,
    },
  };
}
