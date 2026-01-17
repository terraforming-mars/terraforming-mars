import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';
import {ServeAsset} from '@/server/routes/ServeAsset';

/**
 * Show the Login page.
 */
export class Login extends Handler {
  public static readonly INSTANCE = new Login();
  private constructor() {
    super();
  }

  public override get(req: Request, res: Response, ctx: Context): Promise<void> {
    if (!process.env.DISCORD_CLIENT_ID) {
      responses.notFound(req, res, 'Auth is not configured for this server.');
      return Promise.resolve();
    }
    req.url = '/assets/index.html';
    return ServeAsset.INSTANCE.get(req, res, ctx);
  }
}
