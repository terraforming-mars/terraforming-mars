import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ServeApp extends Handler {
  private constructor() {
    super();
  }

  public static newInstance(): ServeApp {
    const handler = new ServeApp();
    return handler;
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, _ctx: IContext): void {
    req.url = '/assets/index.html';
    serveAsset(req, res);
  }
}
