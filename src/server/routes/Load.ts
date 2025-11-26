import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {ServeApp} from '@/server/routes/ServeApp';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

export class Load extends Handler {
  public static readonly INSTANCE = new Load();
  private constructor() {
    super({validateServerId: true});
  }

  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    req.url = '/assets/index.html';
    return ServeApp.INSTANCE.get(req, res, ctx);
  }
}
