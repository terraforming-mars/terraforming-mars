import * as http from 'http';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';


export class ApiGames extends AsyncHandler {
  public static readonly INSTANCE = new ApiGames();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    const list = await ctx.gameLoader.getLoadedGameIds();
    if (list === undefined) {
      ctx.route.notFound(req, res, 'could not load game list');
      return;
    }
    ctx.route.writeJson(res, list);
  }
}
