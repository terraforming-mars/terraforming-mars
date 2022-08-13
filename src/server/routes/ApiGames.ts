import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';


export class ApiGames extends Handler {
  public static readonly INSTANCE = new ApiGames();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    const list = await ctx.gameLoader.getIds();
    if (list === undefined) {
      ctx.route.notFound(req, res, 'could not load game list');
      return;
    }
    ctx.route.writeJson(res, list);
  }
}
