import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {ServeAsset} from './ServeAsset';

export class ServeApp extends Handler {
  public static INSTANCE: ServeApp = new ServeApp();
  private constructor() {
    super();
  }
  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
