import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {GameLogs} from './GameLogs';

export class ApiGameLogs extends Handler {
  private constructor(private gameLogs = new GameLogs()) {
    super();
  }

  public static newInstance(): ApiGameLogs {
    const handler = new ApiGameLogs();
    return handler;
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, _ctx: IContext): void {
    this.gameLogs.handle(req, res);
  }
}
