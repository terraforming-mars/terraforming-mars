import * as http from 'http';
import {Server} from '../server/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiSpectator extends Handler {
  public static readonly INSTANCE = new ApiSpectator();

  private constructor() {
    super();
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const spectatorId = String(ctx.url.searchParams.get('id'));
    ctx.gameLoader.getBySpectatorId(spectatorId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      ctx.route.writeJson(res, Server.getSpectatorModel(game));
    });
  }
}
