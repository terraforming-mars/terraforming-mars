import {Handler} from './Handler';
import {Context} from './IHandler';
import {ServeAsset} from './ServeAsset';
import {Request} from '../Request';
import {Response} from '../Response';

// Oh, this could be called Game, but that would introduce all kinds of issues.
// Calling get() feeds the game to the player.
export class GameHandler extends Handler {
  public static readonly INSTANCE = new GameHandler();

  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }
}

