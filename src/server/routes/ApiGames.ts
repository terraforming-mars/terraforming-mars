import * as responses from './responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiGames extends Handler {
  public static readonly INSTANCE = new ApiGames();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const list = await ctx.gameLoader.getIds();
    if (list === undefined) {
      responses.notFound(req, res, 'could not load game list');
      return;
    }
    responses.writeJson(res, list);
  }
}
