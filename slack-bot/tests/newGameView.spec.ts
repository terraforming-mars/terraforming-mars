import {describe, expect, it} from 'vitest';
import {
  BlockIds,
  buildNewGameView,
  CLAUDE_OPTION_VALUE,
  decodePrivateMetadata,
  defaultClaudeColor,
  encodePrivateMetadata,
  MAX_PLAYER_SLOTS,
  TOGGLES,
  VIEW_CALLBACK_ID,
} from '../src/views/newGameView.js';
import {BOARDS, EXPANSIONS, PLAYER_COLORS} from '../src/tm/types.js';
import type {Prefill} from '../src/views/prefill.js';

describe('buildNewGameView', () => {
  const meta = {hostUserId: 'U123', channelId: 'C456'};

  it('produces a valid modal view skeleton', () => {
    const view = buildNewGameView(meta);
    expect(view.type).toBe('modal');
    expect(view.callback_id).toBe(VIEW_CALLBACK_ID);
    expect(view.title?.text).toMatch(/Terraforming Mars/);
    expect(view.submit?.text).toBe('Create game');
    expect(view.close?.text).toBe('Cancel');
  });

  it('respects Slack 24-char limit on title/submit/close button text', () => {
    // Slack returns invalid_arguments with "must be less than 25 characters"
    // for any of these three fields. Keep them <= 24.
    const view = buildNewGameView(meta);
    expect(view.title.text.length).toBeLessThanOrEqual(24);
    expect(view.submit!.text.length).toBeLessThanOrEqual(24);
    expect(view.close!.text.length).toBeLessThanOrEqual(24);
  });

  it('round-trips private metadata', () => {
    const view = buildNewGameView(meta);
    expect(decodePrivateMetadata(view.private_metadata!)).toEqual(meta);
    expect(view.private_metadata).toBe(encodePrivateMetadata(meta));
  });

  it('renders one user-select + one color-select per slot', () => {
    const view = buildNewGameView(meta);
    const blockIds = new Set(view.blocks.map((b) => (b as {block_id?: string}).block_id ?? ''));
    for (let i = 1; i <= MAX_PLAYER_SLOTS; i++) {
      expect(blockIds.has(BlockIds.slotUser(i))).toBe(true);
      expect(blockIds.has(BlockIds.slotColor(i))).toBe(true);
    }
  });

  it('marks only the first slot as required', () => {
    const view = buildNewGameView(meta);
    for (let i = 1; i <= MAX_PLAYER_SLOTS; i++) {
      const block = findBlock(view, BlockIds.slotUser(i));
      expect((block as {optional?: boolean}).optional ?? false).toBe(i > 1);
    }
  });

  it('exposes every PLAYER_COLOR in each slot color select', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.slotColor(1));
    const options = (block as {element: {options: Array<{value: string}>}}).element.options;
    expect(options.map((o) => o.value)).toEqual([...PLAYER_COLORS]);
  });

  it('lists every BOARDS entry in the board select', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.board);
    const options = (block as {element: {options: Array<{value: string}>}}).element.options;
    expect(options.map((o) => o.value)).toEqual(BOARDS.map((b) => b.value));
  });

  it('lists every EXPANSION in the expansions multi-select with the base set defaulted', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.expansions);
    const el = (block as {
      element: {options: Array<{value: string}>; initial_options?: Array<{value: string}>};
    }).element;
    expect(el.options.map((o) => o.value)).toEqual([...EXPANSIONS]);
    expect(el.initial_options?.map((o) => o.value).sort()).toEqual(
      ['colonies', 'corpera', 'prelude', 'prelude2', 'promo', 'venus'],
    );
  });

  it('lists every TOGGLE in the options checkboxes block', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.toggles);
    const el = (block as {element: {options: Array<{value: string}>}}).element;
    expect(el.options.map((o) => o.value)).toEqual(TOGGLES.map((t) => t.value));
  });

  it('offers a starting-corporations input defaulting to 3', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.startingCorporations);
    expect((block as {element: {initial_value?: string}}).element.initial_value).toBe('3');
  });

  it('no longer offers a starting-CEOs input', () => {
    const view = buildNewGameView(meta);
    const blockIds = view.blocks.map((b) => (b as {block_id?: string}).block_id ?? '');
    expect(blockIds.some((id) => /ceo/i.test(id))).toBe(false);
  });

  it('offers an optional, unchecked "Claude plays" checkbox', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.claude) as {
      optional?: boolean;
      element: {type: string; options: Array<{value: string}>; initial_options?: unknown};
    };
    expect(block.optional).toBe(true);
    expect(block.element.type).toBe('checkboxes');
    expect(block.element.options.map((o) => o.value)).toEqual([CLAUDE_OPTION_VALUE]);
    expect(block.element.initial_options).toBeUndefined();
  });

  it('defaults the Claude color to the first color not used by a human slot', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.claudeColor) as {
      element: {initial_option: {value: string}; options: Array<{value: string}>};
    };
    // Slots 1-6 default to the first six colors.
    expect(block.element.initial_option.value).toBe(PLAYER_COLORS[MAX_PLAYER_SLOTS]);
    expect(block.element.options.map((o) => o.value)).toEqual([...PLAYER_COLORS]);
  });

  it('places the Claude blocks right after the human slots', () => {
    const view = buildNewGameView(meta);
    const ids = view.blocks.map((b) => (b as {block_id?: string}).block_id ?? '');
    const lastSlot = ids.indexOf(BlockIds.slotColor(MAX_PLAYER_SLOTS));
    expect(ids[lastSlot + 1]).toBe(BlockIds.claude);
    expect(ids[lastSlot + 2]).toBe(BlockIds.claudeColor);
  });

  it('offers Claude in the first-player select', () => {
    const view = buildNewGameView(meta);
    const block = findBlock(view, BlockIds.firstPlayerSlot) as {
      element: {options: Array<{value: string}>};
    };
    const values = block.element.options.map((o) => o.value);
    expect(values).toHaveLength(MAX_PLAYER_SLOTS + 1);
    expect(values[values.length - 1]).toBe(CLAUDE_OPTION_VALUE);
  });

  it('stays well under Slack 100-block modal limit', () => {
    const view = buildNewGameView(meta);
    expect(view.blocks.length).toBeLessThan(100);
  });
});

describe('buildNewGameView with a prefill', () => {
  const meta = {hostUserId: 'U123', channelId: 'C456'};
  const prefill: Prefill = {
    slots: [
      {index: 1, slackUserId: 'U_ALICE', color: 'pink'},
      {index: 3, slackUserId: 'U_BOB', color: 'black'},
    ],
    randomFirstPlayer: false,
    firstPlayerSlot: 3,
    claudeColor: undefined,
    board: 'hellas',
    expansions: ['corpera', 'turmoil'],
    toggles: ['fastModeOption'],
    startingCorporations: 5,
    startingPreludes: 2,
    escapeVelocityOn: false,
    escapeVelocityThresholdMinutes: 45,
  };

  it('preselects the previous players in their original slots', () => {
    const view = buildNewGameView(meta, prefill);
    const el = (i: number) =>
      (findBlock(view, BlockIds.slotUser(i)) as {element: {initial_user?: string}}).element;
    expect(el(1).initial_user).toBe('U_ALICE');
    expect(el(2).initial_user).toBeUndefined();
    expect(el(3).initial_user).toBe('U_BOB');
  });

  it('preselects the previous colors, leaving empty slots on their defaults', () => {
    const view = buildNewGameView(meta, prefill);
    const color = (i: number) =>
      (findBlock(view, BlockIds.slotColor(i)) as {element: {initial_option: {value: string}}})
        .element.initial_option.value;
    expect(color(1)).toBe('pink');
    expect(color(3)).toBe('black');
    expect(color(2)).toBe(PLAYER_COLORS[1]);
  });

  it('preselects board, expansions and toggles', () => {
    const view = buildNewGameView(meta, prefill);
    const board = (findBlock(view, BlockIds.board) as {
      element: {initial_option: {value: string}};
    }).element.initial_option.value;
    expect(board).toBe('hellas');
    const initialValues = (blockId: string) =>
      ((findBlock(view, blockId) as {element: {initial_options?: Array<{value: string}>}})
        .element.initial_options ?? []).map((o) => o.value);
    expect(initialValues(BlockIds.expansions)).toEqual(['corpera', 'turmoil']);
    expect(initialValues(BlockIds.toggles)).toEqual(['fastModeOption']);
  });

  it('restores the first-player choice', () => {
    const view = buildNewGameView(meta, prefill);
    const randomBlock = findBlock(view, BlockIds.randomFirstPlayer) as {
      element: {initial_options?: Array<{value: string}>};
    };
    expect(randomBlock.element.initial_options).toBeUndefined();
    const slot = (findBlock(view, BlockIds.firstPlayerSlot) as {
      element: {initial_option?: {value: string}};
    }).element.initial_option;
    expect(slot?.value).toBe('3');
  });

  it('restores the numeric answers and the escape velocity radio', () => {
    const view = buildNewGameView(meta, prefill);
    const value = (blockId: string) =>
      (findBlock(view, blockId) as {element: {initial_value?: string}}).element.initial_value;
    expect(value(BlockIds.startingCorporations)).toBe('5');
    expect(value(BlockIds.startingPreludes)).toBe('2');
    expect(value(BlockIds.escapeVelocityMinutes)).toBe('45');
    const ev = (findBlock(view, BlockIds.escapeVelocity) as {
      element: {initial_option: {value: string}};
    }).element.initial_option.value;
    expect(ev).toBe('off');
  });

  it('leaves Claude unchecked when the previous game had no Claude', () => {
    const view = buildNewGameView(meta, prefill);
    const el = (findBlock(view, BlockIds.claude) as unknown as {element: Record<string, unknown>}).element;
    expect('initial_options' in el).toBe(false);
    // Default color skips every color preselected in a human slot
    // (pink, empty-slot default green, black, and the slot 4-6 defaults).
    expect(defaultClaudeColor(prefill)).toBe('red');
  });

  it('restores the Claude seat, its color and Claude as first player', () => {
    const view = buildNewGameView(meta, {...prefill, claudeColor: 'orange', firstPlayerSlot: 'claude'});
    const claude = findBlock(view, BlockIds.claude) as {
      element: {initial_options?: Array<{value: string}>};
    };
    expect(claude.element.initial_options?.map((o) => o.value)).toEqual([CLAUDE_OPTION_VALUE]);
    const color = (findBlock(view, BlockIds.claudeColor) as {
      element: {initial_option: {value: string}};
    }).element.initial_option.value;
    expect(color).toBe('orange');
    const first = (findBlock(view, BlockIds.firstPlayerSlot) as {
      element: {initial_option?: {value: string}};
    }).element.initial_option;
    expect(first?.value).toBe(CLAUDE_OPTION_VALUE);
  });

  it('omits initial_options entirely when nothing was selected', () => {
    // Slack rejects an empty initial_options array.
    const view = buildNewGameView(meta, {...prefill, expansions: [], toggles: []});
    for (const blockId of [BlockIds.expansions, BlockIds.toggles]) {
      const el = (findBlock(view, blockId) as unknown as {element: Record<string, unknown>}).element;
      expect('initial_options' in el).toBe(false);
    }
  });
});

function findBlock(view: ReturnType<typeof buildNewGameView>, blockId: string) {
  const b = view.blocks.find((x) => (x as {block_id?: string}).block_id === blockId);
  if (!b) throw new Error(`block not found: ${blockId}`);
  return b;
}
