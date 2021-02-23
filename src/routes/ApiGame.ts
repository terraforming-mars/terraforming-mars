import * as http from 'http';
import {Game, GameId} from '../Game';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Server} from '../server/ServerModel';

export class ApiGame extends Handler {
  public static readonly INSTANCE = new ApiGame();
  private constructor() {
    super();
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    // TODO(kberg): replace this regexp with ctx.url, which has already parsed the URL.
    const routeRegExp: RegExp = /^\/api\/game\?id\=([0-9a-z_]+)$/i;

    if (req.url === undefined) {
      ctx.route.notFound(req, res, 'url not defined');
      return;
    }

    if (!routeRegExp.test(req.url)) {
      ctx.route.notFound(req, res, 'id parameter missing');
      return;
    }

    const matches = req.url.match(routeRegExp);

    if (matches === null || matches[1] === undefined) {
      ctx.route.notFound(req, res, 'id parameter missing');
      return;
    }

    const gameId: GameId = matches[1];

    ctx.gameLoader.getByGameId(gameId, false, (game: Game | undefined) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'game not found');
        return;
      }
      const model = Server.getGameModel(game);
      ctx.route.writeJson(res, model);
    });
  }
}
