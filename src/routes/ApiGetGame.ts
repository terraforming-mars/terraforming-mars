import * as http from 'http';
import {GameLoader} from '../database/GameLoader';
import {Game, GameId} from '../Game';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Server} from '../server/ServerModel';

export class ApiGetGame extends Handler {
  public static readonly INSTANCE = new ApiGetGame();
  private constructor() {
    super();
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const routeRegExp: RegExp = /^\/api\/game\?id\=([0-9a-z_]+)$/i;

    if (req.url === undefined) {
      console.warn('url not defined');
      ctx.route.notFound(req, res);
      return;
    }

    if (!routeRegExp.test(req.url)) {
      console.warn('no match with regexp');
      ctx.route.notFound(req, res);
      return;
    }

    const matches = req.url.match(routeRegExp);

    if (matches === null || matches[1] === undefined) {
      console.warn('didn\'t find game id');
      ctx.route.notFound(req, res);
      return;
    }

    const gameId: GameId = matches[1];

    GameLoader.getInstance().getByGameId(gameId, false, (game: Game | undefined) => {
      if (game === undefined) {
        console.warn('game is undefined');
        ctx.route.notFound(req, res);
        return;
      }
      const model = Server.getGameModel(game);
      const json = JSON.stringify(model);

      res.setHeader('Content-Type', 'application/json');
      res.write(json);
      res.end();
    });
  }
}
