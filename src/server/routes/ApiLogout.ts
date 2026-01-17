import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';
import {sessionIdCookieName} from '@/server/server/auth/authcookies';

export class ApiLogout extends Handler {
  public static readonly INSTANCE = new ApiLogout();
  private constructor() {
    super();
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    if (ctx.sessionid) {
      await ctx.sessionManager.expire(ctx.sessionid);
      responses.clearCookie(res, sessionIdCookieName);
      responses.redirect(res, '/login');
    } else {
      responses.unprocessableEntity(req, res, 'Not logged in.');
    }
    return Promise.resolve();
  }
}
