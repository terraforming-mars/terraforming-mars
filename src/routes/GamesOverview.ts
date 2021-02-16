import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {ServeAsset} from './ServeAsset';

export class GamesOverview extends Handler {
  public static readonly INSTANCE = new GamesOverview();

  private constructor() {
    super({serverId: true});
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    req.url = '/assets/index.html';
    ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
