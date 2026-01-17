import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {ServeAsset} from '@/server/routes/ServeAsset';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';
import {ApiCreateGame} from '@/server/routes/ApiCreateGame';

// Oh, this could be called Game, but that would introduce all kinds of issues.
// Calling get() feeds the game to the player (I think, and calling put creates a game.)
// So, that should be fixed, you know.
export class GameHandler extends Handler {
  public static readonly INSTANCE = new GameHandler();

  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }

  // TODO(kberg): Retire this endpoint.
  public override put(req: Request, res: Response, ctx: Context): Promise<void> {
    return ApiCreateGame.INSTANCE.put(req, res, ctx);
  }
}

