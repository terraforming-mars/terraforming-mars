import {IPlayer} from '../IPlayer';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {RouteError} from './RouteError';

/**
 * Toggle the player's autopass setting.
 */
export class Autopass extends Handler {
  public static readonly INSTANCE = new Autopass();

  public override async get(_req: Request, _res: Response, ctx: Context): Promise<void> {
    const playerId = ctx.urlParams.playerId('id');
    ctx.ipTracker.addParticipant(playerId, ctx.ip);
    const autopass = ctx.urlParams.stringOrUndefined('autopass') === 'true';
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      throw RouteError.notFound('cannot find game for that player');
    }
    let player: IPlayer;
    try {
      player = game.getPlayerById(playerId);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
      throw RouteError.notFound('player not found');
    }

    // This doesn't get saved.
    player.autopass = autopass;
  }
}
