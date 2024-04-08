import * as responses from './responses';
import {Database} from '../database/Database';
import {GameLoader} from '../database/GameLoader';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {LoadGameFormModel} from '../../common/models/LoadGameFormModel';
import {Request} from '../Request';
import {Response} from '../Response';
import {isGameId} from '../../common/Types';

export class LoadGame extends Handler {
  public static readonly INSTANCE = new LoadGame();
  private constructor() {
    super();
  }

  public override put(req: Request, res: Response, _ctx: Context): Promise<void> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', function(data) {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const gameReq: LoadGameFormModel = JSON.parse(body);

          const gameId = gameReq.gameId;
          if (!isGameId(gameId)) {
            throw new Error('Invalid game id');
          }
          // This should probably be behind some kind of verification that prevents just
          // anyone from rolling back a large number of steps.
          const rollbackCount = gameReq.rollbackCount;
          if (rollbackCount > 0) {
            Database.getInstance().deleteGameNbrSaves(gameId, rollbackCount);
          }
          const game = await GameLoader.getInstance().getGame(gameId, /* bypassCache */ true);
          if (game === undefined) {
            console.warn(`unable to find ${gameId} in database`);
            responses.notFound(req, res, 'game_id not found');
          } else {
            responses.writeJson(res, Server.getSimpleGameModel(game));
          }
        } catch (error) {
          responses.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}
