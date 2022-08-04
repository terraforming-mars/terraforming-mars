import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import * as prometheus from 'prom-client';


export class ApiMetrics extends Handler {
  public static readonly INSTANCE = new ApiMetrics();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    try {
      const register = prometheus.register;
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      console.error(err);
      ctx.route.badRequest(req, res, 'could not load metrics');
    }
  }
}
