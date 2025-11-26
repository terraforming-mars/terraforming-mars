import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {ServeApp} from '@/server/routes/ServeApp';
import {ServeAsset} from '@/server/routes/ServeAsset';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

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
