/**
 * tm_newgame_modal view_submission handler.
 *
 * 1. Parse view.state.values into a typed shape.
 * 2. Validate. If errors, ack with response_action='errors' (keeps modal open).
 * 3. Otherwise ack() to close the modal.
 * 4. Schedule background work via waitUntil:
 *    - Look up each Slack user's display name (users.info).
 *    - Build the NewGameConfig.
 *    - POST it to /api/creategame.
 *    - DM each player their link, then DM the host a summary. The summary
 *      carries a "New game, same settings" button holding this submission.
 *    - On failure, DM the host the error.
 */

import type {
  AllMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from '@slack/bolt';
import {waitUntil} from '@vercel/functions';

import {decodePrivateMetadata} from '../views/newGameView.js';
import {
  isErrors,
  parseSubmission,
  toNewGameConfig,
  toPrefill,
} from './parseSubmission.js';
import {encodePrefill} from '../views/prefill.js';
import {
  createGame,
  hostGameUrl,
  playerUrl,
  spectatorUrl,
  tmBaseUrl,
  TmApiError,
} from '../tm/createGame.js';
import {
  buildHostSummaryFromGameModel,
  dmHostError,
  dmHostSummary,
  dmPlayerLink,
  lookupDisplayName,
  type PlayerDmResult,
} from '../slack/notify.js';

export {VIEW_CALLBACK_ID} from '../views/newGameView.js';

export async function onViewSubmission(
  args: SlackViewMiddlewareArgs<ViewSubmitAction> & AllMiddlewareArgs,
): Promise<void> {
  const {ack, view, client, logger} = args;

  const state = view.state.values as Record<string, Record<string, unknown>>;
  const parsed = parseSubmission(state);

  if (isErrors(parsed)) {
    await ack({response_action: 'errors', errors: parsed.errors});
    return;
  }

  await ack();

  const meta = decodePrivateMetadata(view.private_metadata);

  waitUntil(
    (async () => {
      try {
        // Look up display names in parallel.
        const lookups = await Promise.all(
          parsed.slots.map(async (s) => {
            const name = await lookupDisplayName(client, s.slackUserId);
            return [s.slackUserId, name] as const;
          }),
        );
        const nameMap = new Map<string, string | undefined>(lookups);

        const {config, slackUserIdByColor} = toNewGameConfig(parsed, (id) => nameMap.get(id));

        const game = await createGame(config);
        const base = tmBaseUrl();

        const dmResults: Array<PlayerDmResult> = await Promise.all(
          game.players.map((player) => {
            const slackUserId = slackUserIdByColor[player.color] ?? '';
            return dmPlayerLink(
              client,
              slackUserId,
              player.name,
              game.name,
              playerUrl(base, player.id),
            );
          }),
        );

        const summary = buildHostSummaryFromGameModel(
          game.players,
          slackUserIdByColor,
          dmResults,
          base,
          game.name,
          hostGameUrl(base, game.id),
          game.spectatorId !== undefined ? spectatorUrl(base, game.spectatorId) : undefined,
          encodePrefill(toPrefill(parsed)),
        );
        await dmHostSummary(client, meta.hostUserId, summary);
      } catch (err) {
        const message = formatBackgroundError(err);
        logger.error('[slack-bot] background work failed', err);
        await dmHostError(client, meta.hostUserId, message);
      }
    })(),
  );
}

function formatBackgroundError(err: unknown): string {
  if (err instanceof TmApiError) {
    if (err.status === 429) {
      return 'The Terraforming Mars server is rate-limiting new games for now. Try again in a few minutes.';
    }
    return `Terraforming Mars rejected the request (HTTP ${err.status}). ${err.responseBody.slice(0, 200)}`;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}
