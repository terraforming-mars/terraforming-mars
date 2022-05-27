import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';


export class ApiStats extends Handler {
  public static readonly INSTANCE = new ApiStats();
  private constructor() {
    super({validateServerId: true});
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    Database.getInstance().stats().then((stats) => {
      ctx.route.writeJson(res, stats);
    }).catch((err) => {
      console.error(err);
      ctx.route.badRequest(req, res, 'could not load admin stats');
    });
  }
}
