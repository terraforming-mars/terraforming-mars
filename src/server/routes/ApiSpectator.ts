import * as responses from '@/server/server/responses';
import {Server} from '@/server/models/ServerModel';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {IGame} from '@/server/IGame';
import {isSpectatorId} from '@/common/Types';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

export class ApiSpectator extends Handler {
  public static readonly INSTANCE = new ApiSpectator();

  private constructor() {
    super();
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const id = ctx.url.searchParams.get('id');
    if (!id) {
      responses.badRequest(req, res, 'invalid id');
      return;
    }
    let game: IGame | undefined;
    if (isSpectatorId(id)) {
      game = await ctx.gameLoader.getGame(id);
    }
    if (game === undefined) {
      responses.notFound(req, res);
      return;
    }
    responses.writeJson(res, ctx, Server.getSpectatorModel(game));
  }
}
