import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';

export class ApiCloneableGames extends Handler {
  public static readonly INSTANCE = new ApiCloneableGames();
  private constructor() {
    super();
  }

  public get(_req: http.IncomingMessage, res: http.ServerResponse, _ctx: IContext): void {
    Database.getInstance().getClonableGames(function(err, allGames) {
      if (err) {
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(allGames));
      res.end();
    });
  }
}
