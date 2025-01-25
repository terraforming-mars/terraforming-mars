import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {SessionManager} from '../server/auth/SessionManager';

export class ApiLogout extends Handler {
  public static readonly INSTANCE = new ApiLogout();
  private constructor() {
    super();
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    if (ctx.sessionid) {
      await SessionManager.getInstance().expire(ctx.sessionid);
      responses.redirect(res, '/login');
    } else {
      responses.internalServerError(req, res, 'Already logged out.');
    }
    return Promise.resolve();
  }
}
