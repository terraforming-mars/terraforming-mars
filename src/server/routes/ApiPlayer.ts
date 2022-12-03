import * as http from 'http';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {getPlayerFromRequest} from './util';

export class ApiPlayer extends Handler {
  public static readonly INSTANCE = new ApiPlayer();

  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    const player = await getPlayerFromRequest(req, res, ctx);
    if (player === undefined) {
      return;
    }
    ctx.route.writeJson(res, Server.getPlayerModel(player));
  }
}
