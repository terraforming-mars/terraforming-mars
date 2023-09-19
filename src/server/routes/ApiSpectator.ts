import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {IGame} from '../IGame';
import {isSpectatorId} from '../../common/Types';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiSpectator extends Handler {
  public static readonly INSTANCE = new ApiSpectator();

  private constructor() {
    super();
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const id = ctx.url.searchParams.get('id');
    if (!id) {
      ctx.route.badRequest(req, res, 'invalid id');
      return;
    }
    let game: IGame | undefined;
    if (isSpectatorId(id)) {
      game = await ctx.gameLoader.getGame(id);
    }
    if (game === undefined) {
      ctx.route.notFound(req, res);
      return;
    }
    ctx.route.writeJson(res, Server.getSpectatorModel(game));
  }
}
