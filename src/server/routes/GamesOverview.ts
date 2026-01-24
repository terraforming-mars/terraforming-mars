import {Handler} from './Handler';
import {Context} from './IHandler';
import {ServeApp} from './ServeApp';
import {ServeAsset} from './ServeAsset';
import {Request} from '../Request';
import {Response} from '../Response';

// A strange way to get a games overview, by serving index.html with a validated server id.
// Is this hackable?
export class GamesOverview extends Handler {
  public static INSTANCE: ServeApp = new GamesOverview();
  private constructor() {
    super({validateServerId: true});
  }
  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
