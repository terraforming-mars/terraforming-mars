import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {GameLogs} from './GameLogs';

export class ApiGameLogs extends Handler {
  public static readonly INSTANCE = new ApiGameLogs();
  private constructor(private gameLogs = new GameLogs()) {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    await this.gameLogs.handle(req, res, ctx);
  }
}
