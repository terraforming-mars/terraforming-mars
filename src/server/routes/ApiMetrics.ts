import * as prometheus from 'prom-client';
import * as responses from './responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiMetrics extends Handler {
  public static readonly INSTANCE = new ApiMetrics();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: Request, res: Response, _ctx: Context): Promise<void> {
    try {
      const register = prometheus.register;
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      console.error(err);
      responses.badRequest(req, res, 'could not load metrics');
    }
  }
}
