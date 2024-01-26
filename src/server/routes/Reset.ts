import * as responses from './responses';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {IPlayer} from '../IPlayer';
import {isPlayerId} from '../../common/Types';
import {Request} from '../Request';
import {Response} from '../Response';

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

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const playerId = ctx.url.searchParams.get('id');
    if (playerId === null) {
      responses.badRequest(req, res, 'missing id parameter');
      return;
    }

    if (!isPlayerId(playerId)) {
      responses.badRequest(req, res, 'invalid player id');
      return;
    }

    // This is the exact same code as in `ApiPlayer`. I bet it's not the only place.
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      responses.notFound(req, res);
      return;
    }

    // While prototyping, this is only available for solo games
    if (game.getPlayers().length > 1) {
      throw new Error('Reset is only available for solo games at the moment.');
    }

    let player: IPlayer | undefined;
    try {
      player = game.getPlayerById(playerId);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
    }
    if (player === undefined) {
      responses.notFound(req, res);
      return;
    }
    if (player.game.activePlayer !== player.id) {
      responses.badRequest(req, res, 'Not the active player');
      return;
    }

    try {
      const game = await ctx.gameLoader.getGame(player.game.id, /** force reload */ true);
      if (game !== undefined) {
        const reloadedPlayer = game.getPlayerById(player.id);
        game.inputsThisRound = 0;
        responses.writeJson(res, Server.getPlayerModel(reloadedPlayer));
        return;
      }
    } catch (err) {
      console.error(err);
    }
    responses.badRequest(req, res, 'Could not reset');
  }
}
