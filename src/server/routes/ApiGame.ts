import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {Server} from '@/server/models/ServerModel';
import {isGameId} from '@/common/Types';
import {IGame} from '@/server/IGame';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

/**
 * Returns a light view of a game.
 */
export class ApiGame extends Handler {
  public static readonly INSTANCE = new ApiGame();
  private constructor() {
    super();
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      responses.badRequest(req, res, 'missing id parameter');
      return;
    }

    let game: IGame | undefined;
    if (isGameId(gameId)) {
      game = await ctx.gameLoader.getGame(gameId);
    }
    if (game === undefined) {
      responses.notFound(req, res, 'game not found');
      return;
    }
    const model = Server.getSimpleGameModel(game);
    responses.writeJson(res, ctx, model);
  }
}
