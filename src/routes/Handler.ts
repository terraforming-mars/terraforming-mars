import * as http from 'http';
import {IHandler, IContext} from './IHandler';

export namespace Handler {
  export interface Options {
    validateServerId?: boolean;
  }
}

export abstract class Handler implements IHandler {
  private validateServerId: boolean = false;
  constructor(options?: Handler.Options) {
    this.validateServerId = options?.validateServerId === true;
  }

  private isServerIdValid(ctx: IContext): boolean {
    const serverId = ctx.url.searchParams.get('serverId');
    if (
      serverId === null ||
      serverId !== ctx.serverId
    ) {
      console.warn('No or invalid serverId given');
      return false;
    }
    return true;
  }

  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    if (this.validateServerId && !this.isServerIdValid(ctx)) {
      ctx.route.notAuthorized(req, res);
      return Promise.resolve();
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

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    ctx.route.notFound(req, res);
    return Promise.resolve();
  }
  public put(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    ctx.route.notFound(req, res);
    return Promise.resolve();
  }
  public post(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    ctx.route.notFound(req, res);
    return Promise.resolve();
  }
}
