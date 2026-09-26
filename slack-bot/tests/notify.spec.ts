import {afterEach, describe, expect, it, vi} from 'vitest';
import type {WebClient} from '@slack/web-api';
import {
  buildHostSummaryFromGameModel,
  dmClaudeSeat,
  dmHostSummary,
} from '../src/slack/notify.js';
import {
  claudeCodeCommand,
  claudeOperatorSetting,
  claudePlayerName,
  claudeSeatMarkerLine,
  DEFAULT_CLAUDE_OPERATOR,
  resolveClaudeOperator,
  type UsersListClient,
} from '../src/claude.js';

const URL = 'https://tm.example/player?id=pCLAUDE';

type PostArgs = {channel: string; text: string; blocks: Array<Record<string, unknown>>};

function fakeClient(opts: {openFails?: boolean} = {}) {
  const posted: Array<PostArgs> = [];
  const opened: Array<string> = [];
  const client = {
    conversations: {
      open: vi.fn(async ({users}: {users: string}) => {
        opened.push(users);
        if (opts.openFails) throw new Error('user_not_found');
        return {channel: {id: `D_${users}`}};
      }),
    },
    chat: {
      postMessage: vi.fn(async (args: PostArgs) => {
        posted.push(args);
        return {ok: true};
      }),
    },
  };
  return {client: client as unknown as WebClient, posted, opened};
}

/** Every text string found anywhere in a block tree. */
function blockTexts(blocks: Array<Record<string, unknown>>): Array<string> {
  const out: Array<string> = [];
  const walk = (x: unknown) => {
    if (Array.isArray(x)) {
      x.forEach(walk);
    } else if (x !== null && typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) {
        if (k === 'text' && typeof v === 'string') out.push(v);
        else walk(v);
      }
    }
  };
  walk(blocks);
  return out;
}

afterEach(() => {
  delete process.env.CLAUDE_PLAYER_NAME;
  delete process.env.CLAUDE_OPERATOR_SLACK_USER_ID;
  delete process.env.CLAUDE_OPERATOR;
});

describe('claude env helpers', () => {
  it('defaults the player name to Claude and honors CLAUDE_PLAYER_NAME', () => {
    expect(claudePlayerName()).toBe('Claude');
    process.env.CLAUDE_PLAYER_NAME = '  ';
    expect(claudePlayerName()).toBe('Claude');
    process.env.CLAUDE_PLAYER_NAME = 'Claude Bot';
    expect(claudePlayerName()).toBe('Claude Bot');
  });

  it('uses env overrides, else the hardcoded default operator', () => {
    expect(claudeOperatorSetting()).toBe(DEFAULT_CLAUDE_OPERATOR);
    process.env.CLAUDE_OPERATOR = ' Someone Else ';
    expect(claudeOperatorSetting()).toBe('Someone Else');
    process.env.CLAUDE_OPERATOR_SLACK_USER_ID = ' U0OPERATOR ';
    expect(claudeOperatorSetting()).toBe('U0OPERATOR');
  });
});

describe('resolveClaudeOperator', () => {
  const member = (id: string, real: string, extra: object = {}) =>
    ({id, name: real.toLowerCase().replace(/ /g, '.'), real_name: real, profile: {real_name: real, display_name: ''}, ...extra});
  const client = (pages: Array<Array<object>>) => {
    const list = vi.fn(async ({cursor}: {cursor?: string}) => {
      const i = cursor === undefined ? 0 : Number(cursor);
      return {members: pages[i], response_metadata: {next_cursor: i + 1 < pages.length ? String(i + 1) : ''}};
    });
    return {users: {list}} as unknown as UsersListClient & {users: {list: typeof list}};
  };

  it('returns a member id setting without calling Slack', async () => {
    process.env.CLAUDE_OPERATOR_SLACK_USER_ID = 'U0OPERATOR';
    const c = client([[]]);
    expect(await resolveClaudeOperator(c, 'U_HOST')).toBe('U0OPERATOR');
    expect(c.users.list).not.toHaveBeenCalled();
  });

  it('resolves the default name across pages, case-insensitively, skipping bots and deactivated users', async () => {
    const c = client([
      [member('U1', 'Alice A'), member('UBOT', 'Simas Glinskis', {is_bot: true})],
      [member('UOLD', 'simas  glinskis', {deleted: true}), member('U0SIMAS', 'simas glinskis')],
    ]);
    expect(await resolveClaudeOperator(c, 'U_HOST')).toBe('U0SIMAS');
    expect(c.users.list).toHaveBeenCalledTimes(2);
  });

  it('matches display name too', async () => {
    process.env.CLAUDE_OPERATOR = 'simas';
    const c = client([[member('U2', 'Somebody', {profile: {real_name: 'Somebody', display_name: 'Simas'}})]]);
    expect(await resolveClaudeOperator(c, 'U_HOST')).toBe('U2');
  });

  it('falls back to the host when no one matches or the lookup throws', async () => {
    expect(await resolveClaudeOperator(client([[member('U1', 'Alice A')]]), 'U_HOST')).toBe('U_HOST');
    const failing = {users: {list: vi.fn(async () => { throw new Error('missing_scope'); })}} as unknown as UsersListClient;
    expect(await resolveClaudeOperator(failing, 'U_HOST')).toBe('U_HOST');
  });

  it('formats the marker line and the Claude Code command', () => {
    expect(claudeSeatMarkerLine(URL)).toBe(`TM-CLAUDE-SEAT ${URL}`);
    expect(claudeCodeCommand(URL)).toBe(`/terraforming-mars ${URL} play`);
  });
});

describe('dmClaudeSeat', () => {
  it('DMs the operator the marker line, URL and Claude Code command', async () => {
    const {client, posted, opened} = fakeClient();
    const result = await dmClaudeSeat(client, 'U_OP', 'Claude', 'Mars-42', URL, 'U_HOST', 'orange');
    expect(result).toEqual({slackUserId: 'U_OP', ok: true, color: 'orange'});
    expect(opened).toEqual(['U_OP']);
    expect(posted).toHaveLength(1);
    const msg = posted[0]!;

    // Fallback text: marker on its own first line, plus URL and command.
    const lines = msg.text.split('\n');
    expect(lines[0]).toBe(`TM-CLAUDE-SEAT ${URL}`);
    expect(msg.text).toContain('Mars-42');
    expect(msg.text).toContain(`/terraforming-mars ${URL} play`);

    const texts = blockTexts(msg.blocks);
    // Marker visible in blocks, exactly, as plain text.
    const context = msg.blocks.find((b) => b.type === 'context') as {
      elements: Array<{type: string; text: string}>;
    };
    expect(context.elements[0]).toMatchObject({type: 'plain_text', text: `TM-CLAUDE-SEAT ${URL}`});
    // Command in a code block.
    expect(texts.some((t) => t.includes('```/terraforming-mars ' + URL + ' play```'))).toBe(true);
    expect(texts.some((t) => t.includes('Mars-42') && t.includes(URL))).toBe(true);
    // Operator is not the host, so the host is credited.
    expect(texts.some((t) => t.includes('<@U_HOST>'))).toBe(true);
  });

  it('does not mention the host when the host is the operator', async () => {
    const {client, posted} = fakeClient();
    await dmClaudeSeat(client, 'U_HOST', 'Claude', 'Mars-42', URL, 'U_HOST');
    expect(blockTexts(posted[0]!.blocks).some((t) => t.includes('<@U_HOST>'))).toBe(false);
  });

  it('reports failure instead of throwing', async () => {
    const {client} = fakeClient({openFails: true});
    const result = await dmClaudeSeat(client, 'U_OP', 'Claude', 'Mars-42', URL, 'U_HOST', 'orange');
    expect(result.ok).toBe(false);
    expect(result.color).toBe('orange');
    expect(result.error).toMatch(/user_not_found/);
  });
});

describe('host summary with Claude', () => {
  const players = [
    {id: 'pALICE', name: 'Alice', color: 'red' as const},
    {id: 'pCLAUDE', name: 'Claude', color: 'orange' as const},
  ];
  const byColor = {red: 'U_ALICE'};
  const claude = {color: 'orange' as const, operatorUserId: 'U_ALICE'};

  it('shows Claude as sent to the operator', async () => {
    const summary = buildHostSummaryFromGameModel(
      players,
      byColor,
      [
        {slackUserId: 'U_ALICE', ok: true, color: 'red'},
        {slackUserId: 'U_ALICE', ok: true, color: 'orange'},
      ],
      'https://tm.example',
      'Mars-42',
      'https://tm.example/game?id=g1',
      undefined,
      undefined,
      claude,
    );
    const row = summary.players.find((p) => p.color === 'orange')!;
    expect(row).toMatchObject({isClaude: true, slackUserId: 'U_ALICE', dmFailed: false});
    expect(summary.players.find((p) => p.color === 'red')!.isClaude).toBeUndefined();

    const {client, posted} = fakeClient();
    await dmHostSummary(client, 'U_HOST', summary);
    const texts = blockTexts(posted[0]!.blocks);
    expect(texts.some((t) => t.includes(':robot_face: *Claude* — link sent to <@U_ALICE>'))).toBe(true);
  });

  it('flags only the Claude row when the operator DM failed, and shows the raw link', async () => {
    // The operator is also a human player: their own DM worked, Claude's did not.
    const summary = buildHostSummaryFromGameModel(
      players,
      byColor,
      [
        {slackUserId: 'U_ALICE', ok: true, color: 'red'},
        {slackUserId: 'U_ALICE', ok: false, color: 'orange'},
      ],
      'https://tm.example',
      'Mars-42',
      'https://tm.example/game?id=g1',
      undefined,
      undefined,
      claude,
    );
    expect(summary.players.find((p) => p.color === 'red')!.dmFailed).toBe(false);
    expect(summary.players.find((p) => p.color === 'orange')!.dmFailed).toBe(true);

    const {client, posted} = fakeClient();
    await dmHostSummary(client, 'U_HOST', summary);
    const texts = blockTexts(posted[0]!.blocks);
    expect(texts.some((t) => t.includes(':warning:') && t.includes(URL))).toBe(true);
  });

  it('still matches failures by Slack id when results carry no color', () => {
    const summary = buildHostSummaryFromGameModel(
      [players[0]!],
      byColor,
      [{slackUserId: 'U_ALICE', ok: false}],
      'https://tm.example',
      'Mars-42',
      'https://tm.example/game?id=g1',
      undefined,
    );
    expect(summary.players[0]!.dmFailed).toBe(true);
  });
});
