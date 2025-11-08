import * as responses from '../server/responses';
import {isPlayerId} from '../../common/Types';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiPlayer extends Handler {
  public static readonly INSTANCE = new ApiPlayer();

  private constructor() {
    super();
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const playerId = ctx.url.searchParams.get('id');
    if (playerId === null) {
      responses.badRequest(req, res, 'missing id parameter');
      return;
    }
    if (!isPlayerId(playerId)) {
      responses.badRequest(req, res, 'invalid player id');
      return;
    }
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      responses.notFound(req, res);
      return;
    }
    try {
      const player = game.getPlayerById(playerId);
      if (!this.isUser(player.user, ctx)) {
        responses.notAuthorized(req, res);
        return;
      }

      ctx.ipTracker.addParticipant(playerId, ctx.ip);
      responses.writeJson(res, ctx, Server.getPlayerModel(player));
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
      responses.notFound(req, res);
      return;
    }
  }
}
