/**
 * Direct-message helpers. After a game is created, we DM:
 *   - each player their personal /player?id=... link
 *   - the host a summary block listing every player + URL plus the host
 *     dashboard (/game?id=...) and spectator (/spectator?id=...) links
 *
 * If `conversations.open` fails for a particular Slack user (they've left
 * the workspace, blocked the bot, etc.) we log it and return the failure so
 * the summary can include the affected link as a fallback.
 */

import type {WebClient} from '@slack/web-api';
import type {KnownBlock} from '@slack/types';
import type {PlayerColor, SimplePlayerModel} from '../tm/types.js';
import {REMATCH_ACTION_ID} from '../handlers/onRematchAction.js';

export interface PlayerDmResult {
  slackUserId: string;
  ok: boolean;
  error?: string;
}

export interface HostSummaryPlayer {
  slackUserId: string;
  name: string;
  color: PlayerColor;
  url: string;
  dmFailed: boolean;
}

export interface HostSummary {
  gameName: string;
  hostDashboardUrl: string;
  spectatorUrl: string | undefined;
  players: Array<HostSummaryPlayer>;
  /**
   * Encoded prefill (see views/prefill.ts) carried by the "New game, same
   * settings" button. The bot has no database, so this message is where the
   * previous game's settings live. Undefined omits the button.
   */
  rematchValue?: string | undefined;
}

export async function dmPlayerLink(
  client: WebClient,
  slackUserId: string,
  playerName: string,
  gameName: string,
  url: string,
): Promise<PlayerDmResult> {
  try {
    const dm = await client.conversations.open({users: slackUserId});
    const channel = dm.channel?.id;
    if (channel === undefined) {
      return {slackUserId, ok: false, error: 'No DM channel id returned'};
    }
    await client.chat.postMessage({
      channel,
      text: `It's go-time on Mars. Your personal link for *${gameName}*: ${url}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:rocket: *Terraforming Mars - ${gameName}*\nHi ${escapeMrkdwn(playerName)}, your personal game link is below. Click to play. Don't share - this link IS your seat at the table.`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {type: 'plain_text', text: 'Open game'},
              url,
              style: 'primary',
            },
          ],
        },
        {
          type: 'context',
          elements: [{type: 'mrkdwn', text: `Raw URL: ${url}`}],
        },
      ],
    });
    return {slackUserId, ok: true};
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[slack-bot] dmPlayerLink failed', {slackUserId, error: message});
    return {slackUserId, ok: false, error: message};
  }
}

export async function dmHostSummary(
  client: WebClient,
  hostSlackUserId: string,
  summary: HostSummary,
): Promise<PlayerDmResult> {
  const blocks: Array<KnownBlock> = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:white_check_mark: *${escapeMrkdwn(summary.gameName)}* is live. Every player has been DMed their personal link. Players who didn't receive a DM are flagged below; share their link manually.`,
      },
    },
    {type: 'divider'},
    ...summary.players.map(playerSummaryBlock),
    {type: 'divider'},
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: [
          `*Host dashboard:* <${summary.hostDashboardUrl}|Open>`,
          summary.spectatorUrl !== undefined
            ? `*Spectator link:* <${summary.spectatorUrl}|Open>`
            : undefined,
        ]
          .filter((s): s is string => s !== undefined)
          .join('\n'),
      },
    },
  ];

  if (summary.rematchValue !== undefined) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {type: 'plain_text', text: 'New game, same settings'},
          action_id: REMATCH_ACTION_ID,
          value: summary.rematchValue,
        },
      ],
    });
  }

  try {
    const dm = await client.conversations.open({users: hostSlackUserId});
    const channel = dm.channel?.id;
    if (channel === undefined) {
      return {slackUserId: hostSlackUserId, ok: false, error: 'No DM channel id returned'};
    }
    await client.chat.postMessage({
      channel,
      text: `${summary.gameName}: game created. Open the host dashboard: ${summary.hostDashboardUrl}`,
      blocks,
    });
    return {slackUserId: hostSlackUserId, ok: true};
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[slack-bot] dmHostSummary failed', {hostSlackUserId, error: message});
    return {slackUserId: hostSlackUserId, ok: false, error: message};
  }
}

export async function dmHostError(
  client: WebClient,
  hostSlackUserId: string,
  message: string,
): Promise<void> {
  try {
    const dm = await client.conversations.open({users: hostSlackUserId});
    const channel = dm.channel?.id;
    if (channel === undefined) return;
    await client.chat.postMessage({
      channel,
      text: `:x: Could not create your Terraforming Mars game: ${message}`,
    });
  } catch (err) {
    console.error('[slack-bot] dmHostError failed', err);
  }
}

/** Best-effort lookup of a Slack user's display name. */
export async function lookupDisplayName(
  client: WebClient,
  slackUserId: string,
): Promise<string | undefined> {
  try {
    const res = await client.users.info({user: slackUserId});
    const profile = res.user?.profile;
    return (
      profile?.display_name_normalized ||
      profile?.display_name ||
      profile?.real_name_normalized ||
      profile?.real_name ||
      res.user?.real_name ||
      res.user?.name ||
      undefined
    );
  } catch (err) {
    console.error('[slack-bot] lookupDisplayName failed', {slackUserId, err});
    return undefined;
  }
}

function playerSummaryBlock(player: HostSummaryPlayer): KnownBlock {
  const dot = colorEmoji(player.color);
  const flag = player.dmFailed ? ' :warning: _DM failed - share this link manually_' : '';
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${dot} *${escapeMrkdwn(player.name)}* (<@${player.slackUserId}>) — <${player.url}|player link>${flag}`,
    },
  };
}

function colorEmoji(color: PlayerColor): string {
  const map: Record<PlayerColor, string> = {
    red: ':red_circle:',
    green: ':large_green_circle:',
    yellow: ':large_yellow_circle:',
    blue: ':large_blue_circle:',
    black: ':black_circle:',
    purple: ':large_purple_circle:',
    orange: ':large_orange_circle:',
    pink: ':rose:',
  };
  return map[color] ?? ':white_circle:';
}

function escapeMrkdwn(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Convenience export used by the test suite. */
export function buildHostSummaryFromGameModel(
  players: ReadonlyArray<SimplePlayerModel>,
  slackUserIdByColor: Record<string, string>,
  dmResults: ReadonlyArray<PlayerDmResult>,
  baseUrl: string,
  gameName: string,
  hostDashboardUrl: string,
  spectator: string | undefined,
  rematchValue?: string | undefined,
): HostSummary {
  const failedSet = new Set(dmResults.filter((r) => !r.ok).map((r) => r.slackUserId));
  return {
    gameName,
    hostDashboardUrl,
    spectatorUrl: spectator,
    rematchValue,
    // Match each returned player back to its Slack user by color, since the
    // server returns players in generation order rather than submission order.
    players: players.map((p) => {
      const slackUserId = slackUserIdByColor[p.color] ?? '?';
      return {
        slackUserId,
        name: p.name,
        color: p.color,
        url: `${baseUrl}/player?id=${encodeURIComponent(p.id)}`,
        dmFailed: failedSet.has(slackUserId),
      };
    }),
  };
}
