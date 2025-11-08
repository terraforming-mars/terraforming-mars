import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {sessionIdCookieName} from '../server/auth/authcookies';

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
