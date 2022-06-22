import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {ServeAsset} from './ServeAsset';

export class ServeApp extends Handler {
  public static INSTANCE: ServeApp = new ServeApp();
  private constructor() {
    super();
  }
  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    req.url = '/assets/index.html';
    ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
