import {describe, expect, it} from 'vitest';
import {
  BlockIds,
  buildNewGameView,
  decodePrivateMetadata,
  encodePrivateMetadata,
  MAX_PLAYER_SLOTS,
  TOGGLES,
  VIEW_CALLBACK_ID,
} from '../src/views/newGameView.js';
import {BOARDS, EXPANSIONS, PLAYER_COLORS} from '../src/tm/types.js';

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

  it('stays well under Slack 100-block modal limit', () => {
    const view = buildNewGameView(meta);
    expect(view.blocks.length).toBeLessThan(100);
  });
});

function findBlock(view: ReturnType<typeof buildNewGameView>, blockId: string) {
  const b = view.blocks.find((x) => (x as {block_id?: string}).block_id === blockId);
  if (!b) throw new Error(`block not found: ${blockId}`);
  return b;
}
