import * as http from 'http';
import {GameLoader} from '../database/GameLoader';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiGetGames extends Handler {
  private constructor() {
    super({serverId: true});
  }

  public static newInstance(): ApiGetGames {
    const handler = new ApiGetGames();
    return handler;
  }

  public get(_req: http.IncomingMessage, res: http.ServerResponse, _ctx: IContext): void {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(GameLoader.getInstance().getLoadedGameIds()));
    res.end();
  }
}

