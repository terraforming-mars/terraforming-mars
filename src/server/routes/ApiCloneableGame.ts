import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {Request} from '../Request';
import {Response} from '../Response';
import {RouteError} from './RouteError';

export class ApiCloneableGame extends Handler {
  public static readonly INSTANCE = new ApiCloneableGame();
  private constructor() {
    super();
  }

  /**
   * Returns information about the identified game. Specifically, the number of
   * players it is for.
   *
   * This is used by the frontend to ensure that the cloned game will match the
   * player count in the game the frontend wants to create.
   */
  public override async get(_req: Request, res: Response, ctx: Context): Promise<void> {
    const gameId = ctx.urlParams.gameId('id');
    await Database.getInstance().getPlayerCount(gameId)
      .then((playerCount) => {
        responses.writeJson(res, ctx, {gameId, playerCount});
      })
      .catch((err) => {
        console.warn('Could not load cloneable game: ', err);
        throw RouteError.notFound();
      });
  }
}
