import * as http from 'http';
import {Database} from '../database/Database';
import {GameLoader} from '../database/GameLoader';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class LoadGame extends Handler {
  private constructor() {
    super();
  }

  public static newInstance(): LoadGame {
    const handler = new LoadGame();
    return handler;
  }

  public put(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    let body = '';
    req.on('data', function(data) {
      body += data.toString();
    });
    req.once('end', () => {
      try {
        const gameReq = JSON.parse(body);

        const game_id = gameReq.game_id;
        const rollbackCount = gameReq.rollbackCount;
        if (rollbackCount > 0) {
          Database.getInstance().deleteGameNbrSaves(game_id, rollbackCount);
        }
        GameLoader.getInstance().getByGameId(game_id, true, (game) => {
          if (game === undefined) {
            console.warn(`unable to find ${game_id} in database`);
            ctx.route.notFound(req, res);
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.write(super.getGameModelJSON(game));
          res.end();
        });
      } catch (error) {
        ctx.route.internalServerError(req, res, error);
      }
    });
  }
}
