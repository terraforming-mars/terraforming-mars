import {describe, expect, it} from 'vitest';
import {
  decodePrefill,
  encodePrefill,
  MAX_PREFILL_VALUE_LENGTH,
  type Prefill,
} from '../src/views/prefill.js';
import {MAX_PLAYER_SLOTS, TOGGLES} from '../src/views/newGameView.js';
import {EXPANSIONS, PLAYER_COLORS} from '../src/tm/types.js';

const sample: Prefill = {
  slots: [
    {index: 1, slackUserId: 'U_ALICE', color: 'red'},
    {index: 3, slackUserId: 'U_BOB', color: 'pink'},
  ],
  randomFirstPlayer: false,
  firstPlayerSlot: 3,
  board: 'hellas',
  expansions: ['corpera', 'venus'],
  toggles: ['undoOption', 'draftVariant'],
  startingCorporations: 5,
  startingPreludes: 2,
  escapeVelocityOn: true,
  escapeVelocityThresholdMinutes: 45,
};

describe('encodePrefill / decodePrefill', () => {
  it('round-trips a submission', () => {
    const encoded = encodePrefill(sample);
    expect(encoded).toBeDefined();
    expect(decodePrefill(encoded)).toEqual(sample);
  });

  it('round-trips an undefined firstPlayerSlot', () => {
    const p = {...sample, firstPlayerSlot: undefined, randomFirstPlayer: true};
    expect(decodePrefill(encodePrefill(p))).toEqual(p);
  });

  it('fits Slack 2000-char button value limit at maximum size', () => {
    // Worst case: every slot filled, every expansion and toggle enabled.
    const maxed: Prefill = {
      slots: Array.from({length: MAX_PLAYER_SLOTS}, (_, i) => ({
        index: i + 1,
        // Slack user ids are 9-11 chars; pad generously.
        slackUserId: `UW${String(i).repeat(12)}`,
        color: PLAYER_COLORS[i]!,
      })),
      randomFirstPlayer: true,
      firstPlayerSlot: MAX_PLAYER_SLOTS,
      board: 'vastitas borealis nova',
      expansions: [...EXPANSIONS],
      toggles: TOGGLES.map((t) => t.value),
      startingCorporations: 6,
      startingPreludes: 20,
      escapeVelocityOn: true,
      escapeVelocityThresholdMinutes: 180,
    };
    const encoded = encodePrefill(maxed);
    expect(encoded).toBeDefined();
    expect(encoded!.length).toBeLessThanOrEqual(MAX_PREFILL_VALUE_LENGTH);
    expect(decodePrefill(encoded)).toEqual(maxed);
  });

  it('returns undefined rather than an oversized value', () => {
    const huge: Prefill = {
      ...sample,
      slots: [{index: 1, slackUserId: 'U'.repeat(MAX_PREFILL_VALUE_LENGTH), color: 'red'}],
    };
    expect(encodePrefill(huge)).toBeUndefined();
  });

  it('returns undefined for missing, malformed or foreign-version values', () => {
    expect(decodePrefill(undefined)).toBeUndefined();
    expect(decodePrefill('')).toBeUndefined();
    expect(decodePrefill('not json')).toBeUndefined();
    expect(decodePrefill(JSON.stringify({v: 99, s: [[1, 'U', 'red']]}))).toBeUndefined();
    // No usable slots left after filtering.
    expect(decodePrefill(JSON.stringify({v: 1, s: [[9, 'U', 'red']]}))).toBeUndefined();
  });

  it('drops unknown expansions, toggles, colors and boards', () => {
    const raw = JSON.stringify({
      v: 1,
      s: [[1, 'U_ALICE', 'red'], [2, 'U_BOB', 'chartreuse']],
      r: 0,
      b: 'phobos',
      e: ['corpera', 'ghost'],
      t: ['undoOption', 'ghost'],
      c: 3,
      p: 4,
      ev: 0,
      em: 20,
    });
    const decoded = decodePrefill(raw);
    expect(decoded).toBeDefined();
    expect(decoded!.slots).toEqual([{index: 1, slackUserId: 'U_ALICE', color: 'red'}]);
    expect(decoded!.board).toBe('random all');
    expect(decoded!.expansions).toEqual(['corpera']);
    expect(decoded!.toggles).toEqual(['undoOption']);
  });
});
