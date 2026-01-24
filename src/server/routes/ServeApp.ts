import {Handler} from './Handler';
import {Context} from './IHandler';
import {ServeAsset} from './ServeAsset';
import {Request} from '../Request';
import {Response} from '../Response';

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
