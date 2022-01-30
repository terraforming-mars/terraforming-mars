import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';

export class ApiCloneableGames extends Handler {
  public static readonly INSTANCE = new ApiCloneableGames();
  private constructor() {
    super();
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    Database.getInstance().getClonableGames(function(err, allGames) {
      if (err) {
        console.warn('Could not load cloneable games: ', err);
        ctx.route.internalServerError(req, res, err);
        return;
      }
      ctx.route.writeJson(res, allGames);
    });
  }
}
