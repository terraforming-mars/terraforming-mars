import * as responses from './responses';
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
    responses.writeJson(res, Server.getSpectatorModel(game));
  }
}
