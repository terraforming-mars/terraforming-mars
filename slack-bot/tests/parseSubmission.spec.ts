import {describe, expect, it} from 'vitest';
import {
  dedupeColors,
  isErrors,
  parseSubmission,
  toNewGameConfig,
  toPrefill,
  type ParsedSubmission,
  type RawSlot,
} from '../src/handlers/parseSubmission.js';
import {ActionIds, BlockIds, TOGGLES} from '../src/views/newGameView.js';
import {EXPANSIONS, PLAYER_COLORS} from '../src/tm/types.js';

/**
 * Build a fake view.state.values payload matching the shape Slack sends for
 * view_submission. Caller passes per-slot user/color and we fill in the rest
 * with sensible defaults.
 */
function makeState(opts: {
  slots: Array<{i: number; user?: string; color?: string}>;
  selectedExpansions?: Array<string>;
  selectedToggles?: Array<string>;
  board?: string;
  randomFirst?: boolean;
  firstSlot?: number;
  startingPreludes?: string;
  startingCorporations?: string;
  escapeVelocity?: 'off' | 'on';
  escapeVelocityMinutes?: string;
}): Record<string, Record<string, unknown>> {
  const state: Record<string, Record<string, unknown>> = {};
  for (const slot of opts.slots) {
    if (slot.user !== undefined) {
      state[BlockIds.slotUser(slot.i)] = {
        [ActionIds.slotUser(slot.i)]: {type: 'users_select', selected_user: slot.user},
      };
    }
    if (slot.color !== undefined) {
      state[BlockIds.slotColor(slot.i)] = {
        [ActionIds.slotColor(slot.i)]: {
          type: 'static_select',
          selected_option: {value: slot.color, text: {type: 'plain_text', text: slot.color}},
        },
      };
    }
  }
  state[BlockIds.board] = {
    [ActionIds.board]: {
      type: 'static_select',
      selected_option: {value: opts.board ?? 'tharsis', text: {type: 'plain_text', text: 'Tharsis'}},
    },
  };
  state[BlockIds.expansions] = {
    [ActionIds.expansions]: {
      type: 'multi_static_select',
      selected_options: (opts.selectedExpansions ?? ['corpera']).map((v) => ({
        value: v,
        text: {type: 'plain_text', text: v},
      })),
    },
  };
  state[BlockIds.toggles] = {
    [ActionIds.toggles]: {
      type: 'checkboxes',
      selected_options: (opts.selectedToggles ?? []).map((v) => ({
        value: v,
        text: {type: 'plain_text', text: v},
      })),
    },
  };
  state[BlockIds.randomFirstPlayer] = {
    [ActionIds.randomFirstPlayer]: {
      type: 'checkboxes',
      selected_options:
        opts.randomFirst ?? true
          ? [{value: 'random', text: {type: 'plain_text', text: 'random'}}]
          : [],
    },
  };
  if (opts.firstSlot !== undefined) {
    state[BlockIds.firstPlayerSlot] = {
      [ActionIds.firstPlayerSlot]: {
        type: 'static_select',
        selected_option: {
          value: String(opts.firstSlot),
          text: {type: 'plain_text', text: `Player ${opts.firstSlot}`},
        },
      },
    };
  }
  state[BlockIds.startingPreludes] = {
    [ActionIds.startingPreludes]: {type: 'plain_text_input', value: opts.startingPreludes ?? '4'},
  };
  state[BlockIds.startingCorporations] = {
    [ActionIds.startingCorporations]: {
      type: 'plain_text_input',
      value: opts.startingCorporations ?? '3',
    },
  };
  state[BlockIds.escapeVelocity] = {
    [ActionIds.escapeVelocity]: {
      type: 'radio_buttons',
      selected_option: {value: opts.escapeVelocity ?? 'off', text: {type: 'plain_text', text: 'off'}},
    },
  };
  state[BlockIds.escapeVelocityMinutes] = {
    [ActionIds.escapeVelocityMinutes]: {
      type: 'plain_text_input',
      value: opts.escapeVelocityMinutes ?? '20',
    },
  };
  return state;
}

describe('parseSubmission', () => {
  it('parses a minimal 2-player form', () => {
    const state = makeState({
      slots: [
        {i: 1, user: 'U_ALICE', color: 'red'},
        {i: 2, user: 'U_BOB', color: 'blue'},
      ],
    });
    const result = parseSubmission(state);
    expect(isErrors(result)).toBe(false);
    const parsed = result as ParsedSubmission;
    expect(parsed.slots).toHaveLength(2);
    expect(parsed.slots[0]).toEqual({index: 1, slackUserId: 'U_ALICE', color: 'red'});
    expect(parsed.slots[1]).toEqual({index: 2, slackUserId: 'U_BOB', color: 'blue'});
    expect(parsed.board).toBe('tharsis');
    expect(parsed.expansions.corpera).toBe(true);
    expect(parsed.expansions.venus).toBe(false);
    expect(parsed.escapeVelocityOn).toBe(false);
  });

  it('errors when zero slots are populated', () => {
    const state = makeState({slots: []});
    const result = parseSubmission(state);
    expect(isErrors(result)).toBe(true);
    expect((result as {errors: Record<string, string>}).errors[BlockIds.slotUser(1)]).toMatch(
      /at least one/i,
    );
  });

  it('errors when the same Slack user appears in two slots', () => {
    const state = makeState({
      slots: [
        {i: 1, user: 'U_ALICE', color: 'red'},
        {i: 2, user: 'U_ALICE', color: 'blue'},
      ],
    });
    const result = parseSubmission(state);
    expect(isErrors(result)).toBe(true);
    expect((result as {errors: Record<string, string>}).errors[BlockIds.slotUser(2)]).toMatch(
      /already/i,
    );
  });

  it('rejects non-numeric starting preludes', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      startingPreludes: 'abc',
    });
    const result = parseSubmission(state);
    expect(isErrors(result)).toBe(true);
    expect((result as {errors: Record<string, string>}).errors[BlockIds.startingPreludes]).toBeDefined();
  });

  it('defaults starting corporations to 3 when the field is blank', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      startingCorporations: '',
    });
    const parsed = parseSubmission(state) as ParsedSubmission;
    expect(parsed.startingCorporations).toBe(3);
  });

  it('parses an explicit starting corporations count', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      startingCorporations: '5',
    });
    const parsed = parseSubmission(state) as ParsedSubmission;
    expect(parsed.startingCorporations).toBe(5);
  });

  it('rejects a starting corporations count outside the web form 1-6 range', () => {
    for (const value of ['0', '7', 'x']) {
      const state = makeState({
        slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
        startingCorporations: value,
      });
      const result = parseSubmission(state);
      expect(isErrors(result), `expected ${value} to be rejected`).toBe(true);
      expect(
        (result as {errors: Record<string, string>}).errors[BlockIds.startingCorporations],
      ).toBeDefined();
    }
  });

  it('rejects firstPlayerSlot pointing to an empty slot when random is off', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      randomFirst: false,
      firstSlot: 4,
    });
    const result = parseSubmission(state);
    expect(isErrors(result)).toBe(true);
    expect((result as {errors: Record<string, string>}).errors[BlockIds.firstPlayerSlot]).toMatch(
      /no Slack user/i,
    );
  });

  it('parses selected toggles into the toggle record', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      selectedToggles: ['undoOption', 'fastModeOption'],
    });
    const parsed = parseSubmission(state) as ParsedSubmission;
    expect(parsed.toggles.undoOption).toBe(true);
    expect(parsed.toggles.fastModeOption).toBe(true);
    expect(parsed.toggles.draftVariant).toBe(false);
    // every defined toggle key is present
    for (const t of TOGGLES) {
      expect(parsed.toggles[t.value]).toBeTypeOf('boolean');
    }
  });

  it('parses the escape velocity time input', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      escapeVelocity: 'on',
      escapeVelocityMinutes: '45',
    });
    const parsed = parseSubmission(state) as ParsedSubmission;
    expect(parsed.escapeVelocityOn).toBe(true);
    expect(parsed.escapeVelocityThresholdMinutes).toBe(45);
  });

  it('defaults the escape velocity time to 20 minutes', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      escapeVelocity: 'on',
      escapeVelocityMinutes: '',
    });
    const parsed = parseSubmission(state) as ParsedSubmission;
    expect(parsed.escapeVelocityThresholdMinutes).toBe(20);
  });

  it('rejects an out-of-range escape velocity time when on', () => {
    const state = makeState({
      slots: [{i: 1, user: 'U_ALICE', color: 'red'}],
      escapeVelocity: 'on',
      escapeVelocityMinutes: '999',
    });
    const result = parseSubmission(state);
    expect(isErrors(result)).toBe(true);
    expect((result as {errors: Record<string, string>}).errors[BlockIds.escapeVelocityMinutes]).toBeDefined();
  });
});

describe('dedupeColors', () => {
  it('does nothing when colors are unique', () => {
    const slots: Array<RawSlot> = [
      {index: 1, slackUserId: 'A', color: 'red'},
      {index: 2, slackUserId: 'B', color: 'blue'},
    ];
    expect(dedupeColors(slots)).toEqual(slots);
  });

  it('reassigns later duplicates to the next unused PLAYER_COLORS entry', () => {
    const slots: Array<RawSlot> = [
      {index: 1, slackUserId: 'A', color: 'red'},
      {index: 2, slackUserId: 'B', color: 'red'},
      {index: 3, slackUserId: 'C', color: 'red'},
    ];
    const out = dedupeColors(slots);
    expect(out.map((s) => s.color)).toEqual(['red', PLAYER_COLORS[1], PLAYER_COLORS[2]]);
  });
});

describe('toNewGameConfig', () => {
  const parsed: ParsedSubmission = {
    slots: [
      {index: 1, slackUserId: 'U_ALICE', color: 'red'},
      {index: 2, slackUserId: 'U_BOB', color: 'blue'},
    ],
    randomFirstPlayer: false,
    firstPlayerSlot: 2,
    board: 'hellas',
    expansions: Object.fromEntries(EXPANSIONS.map((e) => [e, e === 'corpera'])) as Record<
      typeof EXPANSIONS[number],
      boolean
    >,
    toggles: Object.fromEntries(TOGGLES.map((t) => [t.value, false])) as Record<
      typeof TOGGLES[number]['value'],
      boolean
    >,
    startingPreludes: 4,
    startingCorporations: 3,
    escapeVelocityOn: true,
    escapeVelocityThresholdMinutes: 20,
  };

  it('produces a complete NewGameConfig and tracks slackUserIds in player order', () => {
    const {config, slackUserIds} = toNewGameConfig(parsed, (id) =>
      id === 'U_ALICE' ? 'Alice' : 'Bob',
    );
    expect(config.players).toHaveLength(2);
    expect(config.players[0]).toMatchObject({name: 'Alice', color: 'red', first: false});
    expect(config.players[1]).toMatchObject({name: 'Bob', color: 'blue', first: true});
    expect(slackUserIds).toEqual(['U_ALICE', 'U_BOB']);
    expect(config.board).toBe('hellas');
    expect(config.expansions.corpera).toBe(true);
    expect(config.expansions.venus).toBe(false);
    expect(config.startingPreludes).toBe(4);
    expect(config.startingCorporations).toBe(3);
    expect(config.escapeVelocity).toBeDefined();
    expect(config.escapeVelocity?.thresholdMinutes).toBe(20);
    // empty long-list fields per design
    expect(config.bannedCards).toEqual([]);
    expect(config.customCorporationsList).toEqual([]);
    // default-only fields are present
    expect(typeof config.politicalAgendasExtension).toBe('string');
  });

  it('honors a custom escape velocity threshold', () => {
    const out = toNewGameConfig({...parsed, escapeVelocityThresholdMinutes: 45}, () => 'X');
    expect(out.config.escapeVelocity?.thresholdMinutes).toBe(45);
  });

  it('marks exactly one player as first and keeps players<->slackUserIds aligned when random', () => {
    const slots: Array<RawSlot> = [
      {index: 1, slackUserId: 'U_ALICE', color: 'red'},
      {index: 2, slackUserId: 'U_BOB', color: 'blue'},
      {index: 3, slackUserId: 'U_CARLA', color: 'green'},
    ];
    const names: Record<string, string> = {U_ALICE: 'Alice', U_BOB: 'Bob', U_CARLA: 'Carla'};
    const out = toNewGameConfig(
      {...parsed, slots, randomFirstPlayer: true},
      (id) => names[id],
    );
    expect(out.config.players.filter((p) => p.first === true)).toHaveLength(1);
    // Each player keeps the slackUserId at the same array position.
    out.config.players.forEach((player, idx) => {
      expect(player.name).toBe(names[out.slackUserIds[idx]!]);
    });
    expect([...out.slackUserIds].sort()).toEqual(['U_ALICE', 'U_BOB', 'U_CARLA']);
    // The color map is the source of truth for DMs - it must point each
    // player's color at the correct Slack user regardless of seating order.
    expect(out.slackUserIdByColor).toEqual({
      red: 'U_ALICE',
      blue: 'U_BOB',
      green: 'U_CARLA',
    });
  });

  it('keeps the slackUserId->color map correct after color dedupe', () => {
    const slots: Array<RawSlot> = [
      {index: 1, slackUserId: 'U_ALICE', color: 'red'},
      {index: 2, slackUserId: 'U_BOB', color: 'red'},
    ];
    const out = toNewGameConfig({...parsed, slots, randomFirstPlayer: false, firstPlayerSlot: undefined}, (id) => id);
    // Bob's duplicate red was reassigned; the map must reflect the final colors.
    out.config.players.forEach((player) => {
      expect(out.slackUserIdByColor[player.color]).toBe(player.name);
    });
    expect(Object.values(out.slackUserIdByColor).sort()).toEqual(['U_ALICE', 'U_BOB']);
  });

  it('falls back to a sensible name if Slack lookup returns undefined', () => {
    const out = toNewGameConfig(parsed, () => undefined);
    expect(out.config.players[0]!.name).toMatch(/red/i);
  });
});

describe('toPrefill', () => {
  const parsed: ParsedSubmission = {
    slots: [
      {index: 1, slackUserId: 'U_ALICE', color: 'red'},
      {index: 4, slackUserId: 'U_BOB', color: 'pink'},
    ],
    randomFirstPlayer: false,
    firstPlayerSlot: 4,
    board: 'hellas',
    expansions: Object.fromEntries(
      EXPANSIONS.map((e) => [e, e === 'corpera' || e === 'venus']),
    ) as Record<typeof EXPANSIONS[number], boolean>,
    toggles: Object.fromEntries(
      TOGGLES.map((t) => [t.value, t.value === 'undoOption']),
    ) as Record<typeof TOGGLES[number]['value'], boolean>,
    startingPreludes: 4,
    startingCorporations: 3,
    escapeVelocityOn: true,
    escapeVelocityThresholdMinutes: 45,
  };

  it('keeps only the enabled expansions and toggles', () => {
    const prefill = toPrefill(parsed);
    expect(prefill.expansions).toEqual(['corpera', 'venus']);
    expect(prefill.toggles).toEqual(['undoOption']);
  });

  it('preserves slot indices, colors and every numeric answer', () => {
    const prefill = toPrefill(parsed);
    expect(prefill.slots).toEqual([
      {index: 1, slackUserId: 'U_ALICE', color: 'red'},
      {index: 4, slackUserId: 'U_BOB', color: 'pink'},
    ]);
    expect(prefill.board).toBe('hellas');
    expect(prefill.randomFirstPlayer).toBe(false);
    expect(prefill.firstPlayerSlot).toBe(4);
    expect(prefill.startingCorporations).toBe(3);
    expect(prefill.startingPreludes).toBe(4);
    expect(prefill.escapeVelocityOn).toBe(true);
    expect(prefill.escapeVelocityThresholdMinutes).toBe(45);
  });
});
