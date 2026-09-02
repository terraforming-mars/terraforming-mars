import {Handler} from './Handler';
import {Context} from './IHandler';
import {GameLogs} from './GameLogs';
import {Request} from '../Request';
import {Response} from '../Response';
import {RouteError} from './RouteError';

export class EndGameLog extends Handler {
  public static readonly INSTANCE = new EndGameLog();
  private constructor(private gameLogs = new GameLogs()) {
    super();
  }

  public override async get(_req: Request, res: Response, ctx: Context): Promise<void> {
    const id = ctx.urlParams.participantId('id');
    const game = await ctx.gameLoader.getGame(id);
    if (game === undefined) {
      throw RouteError.notFound('game not found');
    }

    let logs = '';
    try {
      logs = this.gameLogs.getLogsForGameEnd(game).join('\n');
    } catch (e) {
      throw RouteError.badRequest('cannot fetch game-end log');
    }
    res.setHeader('Content-Type', 'text/plain');
    res.end(logs);
  }
}

