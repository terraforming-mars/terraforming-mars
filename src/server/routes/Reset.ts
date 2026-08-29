import * as responses from '../server/responses';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {IPlayer} from '../IPlayer';
import {Request} from '../Request';
import {Response} from '../Response';
import {RouteError} from './RouteError';

/**
 * Reloads the game from the last action.
 *
 * This may only be called by the active player. It reloads the game.
 * Now, given the current save behavior. The game isn't saved after every action.
 * I think it's saved after every action when undo is on. So, there's that.
 * But I forget when the game is saved in solo. Probably all will be well.
 *
 * Eventually, this will not be callable once cards are drawn.
 */
export class Reset extends Handler {
  public static readonly INSTANCE = new Reset();
  private constructor() {
    super();
  }

  public override async get(_req: Request, res: Response, ctx: Context): Promise<void> {
    const playerId = ctx.urlParams.playerId('id');

    // This is the exact same code as in `ApiPlayer`. I bet it's not the only place.
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      throw RouteError.notFound();
    }

    // While prototyping, this is only available for solo games
    if (game.players.length > 1) {
      throw new Error('Reset is only available for solo games at the moment.');
    }

    let player: IPlayer | undefined;
    try {
      player = game.getPlayerById(playerId);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
    }
    if (player === undefined) {
      throw RouteError.notFound();
    }
    if (player.game.activePlayer.id !== player.id) {
      throw RouteError.badRequest('Not the active player');
    }

    const reloadedGame = await ctx.gameLoader.getGame(player.game.id, /** force reload */ true);
    if (reloadedGame === undefined) {
      throw RouteError.badRequest('Could not reset');
    }
    const reloadedPlayer = reloadedGame.getPlayerById(player.id);
    reloadedGame.inputsThisRound = 0;
    responses.writeJson(res, ctx, Server.getPlayerModel(reloadedPlayer));
  }
}
