import {Handler} from './Handler';
import {Context} from './IHandler';
import {ServeApp} from './ServeApp';
import {Request} from '../Request';
import {Response} from '../Response';

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
