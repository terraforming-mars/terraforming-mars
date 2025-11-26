import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

export class ApiGames extends Handler {
  public static readonly INSTANCE = new ApiGames();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const list = await ctx.gameLoader.getIds();
    if (list === undefined) {
      responses.notFound(req, res, 'could not load game list');
      return;
    }
    responses.writeJson(res, ctx, list);
  }
}
