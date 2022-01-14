import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {GameId, SpectatorId} from '../Game';
import {PlayerId} from '../Player';


export class ApiGames extends Handler {
  public static readonly INSTANCE = new ApiGames();
  private constructor() {
    super({validateServerId: true});
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    ctx.gameLoader.getLoadedGameIds((list: Array<{id: GameId, participants: Array<SpectatorId | PlayerId>}> | undefined) => {
      if (list === undefined) {
        ctx.route.notFound(req, res, 'could not load game list');
        return;
      }
      ctx.route.writeJson(res, list);
    });
  }
}
