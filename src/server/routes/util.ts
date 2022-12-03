import * as http from 'http';
import {Player} from '../Player';
import {Context} from './IHandler';
import {isPlayerId} from '../../common/Types';

export async function getPlayerFromRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<Player | undefined> {
  const playerId = ctx.url.searchParams.get('id');
  if (playerId === null) {
    ctx.route.badRequest(req, res, 'missing id parameter');
    return;
  }

  if (!isPlayerId(playerId)) {
    ctx.route.badRequest(req, res, 'invalid player id');
    return;
  }

  const game = await ctx.gameLoader.getGame(playerId);
  if (game === undefined) {
    ctx.route.notFound(req, res);
    return;
  }
  let player: Player | undefined;

  try {
    player = game.getPlayerById(playerId);
  } catch (err) {
    console.warn(`unable to find player ${playerId}`, err);
  }
  if (player === undefined) {
    ctx.route.notFound(req, res);
    return;
  }

  return player;
}
