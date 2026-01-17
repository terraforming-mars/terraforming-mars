import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

/**
 * This is a vestigial API command whose purpose is to return the _user in the JSON response.
 */
export class ApiProfile extends Handler {
  public static readonly INSTANCE = new ApiProfile();

  public override get(_req: Request, res: Response, ctx: Context): Promise<void> {
    responses.writeJson(res, ctx, {success: true});
    return Promise.resolve();
  }
}
