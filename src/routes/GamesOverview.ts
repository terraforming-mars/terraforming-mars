import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {ServeApp} from './ServeApp';
import {ServeAsset} from './ServeAsset';

// A strange way to get a games overview, by serving index.html with a validated server id.
// Is this hackable?
export class GamesOverview extends Handler {
  public static INSTANCE: ServeApp = new GamesOverview();
  private constructor() {
    super({validateServerId: true});
  }
  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    req.url = '/assets/index.html';
    ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
