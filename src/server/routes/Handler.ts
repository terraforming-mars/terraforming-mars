import * as http from 'http';
import {IHandler, Context} from './IHandler';

export type Options = {
  validateServerId: boolean;
  validateStatsId: boolean;
}

export abstract class Handler implements IHandler {
  private options: Options;
  constructor(options?: Partial<Options>) {
    this.options = {
      validateServerId: options?.validateServerId === true,
      validateStatsId: options?.validateStatsId === true,
    };
  }

  private isServerIdValid(ctx: Context): boolean {
    const serverId = ctx.url.searchParams.get('serverId');
    return serverId !== null && serverId === ctx.ids.serverId;
  }

  private isStatsIdValid(ctx: Context): boolean {
    const serverId = ctx.url.searchParams.get('serverId');
    return serverId !== null && serverId === ctx.ids.statsId;
  }

  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    if (this.options.validateServerId && !this.isServerIdValid(ctx)) {
      ctx.route.notAuthorized(req, res);
      return Promise.resolve();
    }

    if (this.options.validateStatsId) {
      if (this.isServerIdValid(ctx)) {
        ctx.route.downgradeRedirect(req, res, ctx);
        return Promise.resolve();
      }

      if (!this.isStatsIdValid(ctx)) {
        ctx.route.notAuthorized(req, res);
        return Promise.resolve();
      }
    }

    switch (req.method) {
    case 'GET':
      return this.get(req, res, ctx);
    case 'PUT':
      return this.put(req, res, ctx);
    case 'POST':
      return this.post(req, res, ctx);
    default:
      ctx.route.badRequest(req, res, 'Bad method');
      return Promise.resolve();
    }
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    ctx.route.notFound(req, res);
    return Promise.resolve();
  }
  public put(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    ctx.route.notFound(req, res);
    return Promise.resolve();
  }
  public post(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    ctx.route.notFound(req, res);
    return Promise.resolve();
  }
}
