import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {Database} from '@/server/database/Database';
import {isGameId} from '@/common/Types';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

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
  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (gameId === null) {
      responses.badRequest(req, res, 'missing id parameter');
      return;
    }
    if (!isGameId(gameId)) {
      responses.badRequest(req, res, 'invalid game id');
      return;
    }
    await Database.getInstance().getPlayerCount(gameId)
      .then((playerCount) => {
        responses.writeJson(res, ctx, {gameId, playerCount});
      })
      .catch((err) => {
        console.warn('Could not load cloneable game: ', err);
        responses.notFound(req, res);
      });
  }
}
