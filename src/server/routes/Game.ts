import {Handler} from './Handler';
import {Context} from './IHandler';
import {ServeAsset} from './ServeAsset';
import {Request} from '../Request';
import {Response} from '../Response';
import {ApiCreateGame} from './ApiCreateGame';

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

