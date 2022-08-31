import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {GameLogs} from './GameLogs';
import {isPlayerId, isSpectatorId} from '../../common/Types';

export class ApiGameLogs extends Handler {
  public static readonly INSTANCE = new ApiGameLogs();
  private constructor(private gameLogs = new GameLogs()) {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    const searchParams = ctx.url.searchParams;
    const id = searchParams.get('id');
    if (!id) {
      ctx.route.badRequest(req, res, 'missing id parameter');
      return;
    }
    if (!isPlayerId(id) && !isSpectatorId(id)) {
      ctx.route.badRequest(req, res, 'invalid player id');
      return;
    }
    const game = await ctx.gameLoader.getGame(id);
    if (game === undefined) {
      ctx.route.notFound(req, res, 'game not found');
      return;
    }

    if (searchParams.get('full') !== null) {
      let logs = '';
      try {
        logs = this.gameLogs.getLogsForGameEnd(game).join('\n');
      } catch (e) {
        ctx.route.badRequest(req, res, 'cannot fetch game-end log');
        return;
      }
      res.setHeader('Content-Type', 'text/plain');
      res.end(logs);
    } else {
      const generation = searchParams.get('generation');
      const logs = this.gameLogs.getLogsForGameView(id, game, generation);
      ctx.route.writeJson(res, logs);
    }
  }
}

