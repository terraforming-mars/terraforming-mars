import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {ServeAsset} from '@/server/routes/ServeAsset';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

export class ServeApp extends Handler {
  public static INSTANCE: ServeApp = new ServeApp();
  private constructor() {
    super();
  }
  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
