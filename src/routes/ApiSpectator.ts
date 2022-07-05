import * as http from 'http';
import {Server} from '../models/ServerModel';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';

export class ApiSpectator extends AsyncHandler {
  public static readonly INSTANCE = new ApiSpectator();

  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    const id = ctx.url.searchParams.get('id');
    const spectatorId = String(id);
    const game = await ctx.gameLoader.getByParticipantId(spectatorId);
    if (game === undefined) {
      ctx.route.notFound(req, res);
      return;
    }
    ctx.route.writeJson(res, Server.getSpectatorModel(game));
  }
}
