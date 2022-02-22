import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {ServeAsset} from './ServeAsset';

export class AdminApp extends Handler {
  public static INSTANCE: AdminApp = new AdminApp();
  private constructor() {
    super();
  }
  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    req.url = '/assets/admin.html';
    ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
