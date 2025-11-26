import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {GameLogs} from '@/server/routes/GameLogs';
import {isPlayerId, isSpectatorId} from '@/common/Types';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

export class ApiGameLogs extends Handler {
  public static readonly INSTANCE = new ApiGameLogs();
  private constructor(private gameLogs = new GameLogs()) {
    super();
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const searchParams = ctx.url.searchParams;
    const id = searchParams.get('id');
    if (!id) {
      responses.badRequest(req, res, 'missing id parameter');
      return;
    }
    if (!isPlayerId(id) && !isSpectatorId(id)) {
      responses.badRequest(req, res, 'invalid player id');
      return;
    }
    const game = await ctx.gameLoader.getGame(id);
    if (game === undefined) {
      responses.notFound(req, res, 'game not found');
      return;
    }

    if (searchParams.get('full') !== null) {
      let logs = '';
      try {
        logs = this.gameLogs.getLogsForGameEnd(game).join('\n');
      } catch (e) {
        responses.badRequest(req, res, 'cannot fetch game-end log');
        return;
      }
      res.setHeader('Content-Type', 'text/plain');
      res.end(logs);
    } else {
      const generation = searchParams.get('generation');
      const logs = this.gameLogs.getLogsForGameView(id, game, generation);
      responses.writeJson(res, ctx, logs);
    }
  }
}

