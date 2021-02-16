import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class GamesOverview extends Handler {
  private constructor() {
    super({serverId: true});
  }

  public static newInstance(): GamesOverview {
    const handler = new GamesOverview();
    return handler;
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, _ctx: IContext): void {
    // Is this right?
    serveApp(req, res);
  }
}
