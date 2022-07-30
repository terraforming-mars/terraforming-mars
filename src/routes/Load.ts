import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {ServeApp} from './ServeApp';

export class Load extends Handler {
  public static readonly INSTANCE = new Load();
  private constructor() {
    super();
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    req.url = '/assets/index.html';
    return ServeApp.INSTANCE.get(req, res, ctx);
  }
}
