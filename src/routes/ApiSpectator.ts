import * as http from 'http';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiSpectator extends Handler {
  public static readonly INSTANCE = new ApiSpectator();

  private constructor() {
    super();
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const id = ctx.url.searchParams.get('id');
    const spectatorId = String(id);
    ctx.gameLoader.getBySpectatorId(spectatorId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      ctx.route.writeJson(res, Server.getSpectatorModel(game));
    });
  }
}
