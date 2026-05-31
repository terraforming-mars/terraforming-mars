import * as responses from '../server/responses';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {IPlayer} from '../IPlayer';
import {isPlayerId} from '../../common/Types';
import {Request} from '../Request';
import {Response} from '../Response';
import {appendCanceledLogMessages} from '../logs/appendCanceledLogMessages';
import {hasRevealedHiddenInformation} from '../game/hasRevealedHiddenInformation';

/**
 * Reloads the game from the last action.
 *
 * This may only be called by the active player. It reloads the game.
 * Now, given the current save behavior. The game isn't saved after every action.
 * I think it's saved after every action when undo is on. So, there's that.
 * But I forget when the game is saved in solo. Probably all will be well.
 *
 * It refuses to reload once the current action has revealed hidden information.
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

    if (game.players.length > 1 && game.gameOptions.undoOption !== true) {
      responses.badRequest(req, res, 'Cancel action requires undo to be enabled');
      return;
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
    if (player.game.activePlayer.id !== player.id) {
      responses.badRequest(req, res, 'Not the active player');
      return;
    }

    try {
      const currentGame = player.game;
      const reloadedGame = await ctx.gameLoader.getGame(currentGame.id, /** force reload */ true);
      if (reloadedGame !== undefined) {
        if (hasRevealedHiddenInformation(currentGame, reloadedGame, player)) {
          await ctx.gameLoader.add(currentGame);
          responses.badRequest(req, res, 'Cannot cancel action after hidden information was revealed');
          return;
        }

        appendCanceledLogMessages(currentGame, reloadedGame);
        const reloadedPlayer = reloadedGame.getPlayerById(player.id);
        reloadedGame.inputsThisRound = 0;
        reloadedGame.undoCount = Math.max(reloadedGame.undoCount, currentGame.undoCount) + 1;
        responses.writeJson(res, ctx, Server.getPlayerModel(reloadedPlayer));
        return;
      }
    } catch (err) {
      console.error(err);
    }
    responses.badRequest(req, res, 'Could not reset');
  }
}
