/**
 * "New game, same settings" button on the host summary DM.
 *
 * The bot is stateless, so the button carries the previous game's settings
 * in its own `value` (see views/prefill.ts). Clicking it reopens the modal
 * with those answers filled in - the host can tweak anything, or just hit
 * Create game. A stale or unreadable value falls back to a blank modal
 * rather than erroring.
 */

import type {
  AllMiddlewareArgs,
  BlockAction,
  ButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import {buildNewGameView} from '../views/newGameView.js';
import {decodePrefill} from '../views/prefill.js';

export const REMATCH_ACTION_ID = 'tm_rematch';

export async function onRematchAction(
  args: SlackActionMiddlewareArgs<BlockAction<ButtonAction>> & AllMiddlewareArgs,
): Promise<void> {
  const {ack, action, body, client, logger} = args;
  await ack();

  const prefill = decodePrefill(action.value);
  if (prefill === undefined) {
    logger.warn('[slack-bot] rematch button had no usable prefill; opening a blank modal');
  }

  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view: buildNewGameView(
        {hostUserId: body.user.id, channelId: body.channel?.id},
        prefill,
      ),
    });
  } catch (err) {
    logger.error('[slack-bot] views.open failed for rematch', err);
  }
}
