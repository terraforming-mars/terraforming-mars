import * as http from 'http';
import {GameLoader} from '../database/GameLoader';
import {Server} from '../server/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiSpectator extends Handler {
  public static readonly INSTANCE = new ApiSpectator();

  private constructor() {
    super();
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const spectatorId = ctx.url.searchParams.get('id');
    GameLoader.getInstance().getBySpectatorId(spectatorId as string, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      ctx.route.writeJson(res, Server.getSpectatorModel(game));
    });
  }
}
