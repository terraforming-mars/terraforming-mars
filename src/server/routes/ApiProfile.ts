import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

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
