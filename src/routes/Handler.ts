import * as http from 'http';
import * as querystring from 'querystring';
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

  private isServerIdValid(req: http.IncomingMessage, ctx: IContext): boolean {
    const queryParams = querystring.parse(req.url!.replace(/^.*\?/, ''));
    if (
      queryParams.serverId === undefined ||
      queryParams.serverId !== ctx.serverId
    ) {
      console.warn('No or invalid serverId given');
      return false;
    }
    return true;
  }

  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    if (this.validateServerId && !this.isServerIdValid(req, ctx)) {
      ctx.route.notAuthorized(req, res);
      return;
    }

    switch (req.method) {
    case 'GET':
      this.get(req, res, ctx);
      break;
    case 'PUT':
      this.put(req, res, ctx);
      break;
    case 'POST':
      this.post(req, res, ctx);
      break;
    }
  }

  get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    ctx.route.notFound(req, res);
  }
  put(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    ctx.route.notFound(req, res);
  }
  post(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    ctx.route.notFound(req, res);
  }
}
