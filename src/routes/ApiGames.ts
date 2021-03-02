import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiGames extends Handler {
  public static readonly INSTANCE = new ApiGames();
  private constructor() {
    super({validateServerId: true});
  }

  public get(_req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const ids = ctx.gameLoader.getLoadedGameIds();
    ctx.route.writeJson(res, ids);
  }
}
