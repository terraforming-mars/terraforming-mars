import * as http from 'http';
import * as querystring from 'querystring';
import {Game} from '../Game';
import {Player} from '../Player';
import {Server} from '../server/ServerModel';
import {IHandler, IContext} from './IHandler';

export abstract class Handler implements IHandler {
  private validateServerId: boolean = false;
  constructor(options?: {serverId?: boolean}) {
    this.validateServerId = options?.serverId === true;
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

  public getGameModelJSON(game: Game): string {
    const model = Server.getGameModel(game);
    return JSON.stringify(model);
  }

  public getPlayerModelJSON(player: Player): string {
    const model = Server.getPlayerModel(player, player.game);
    return JSON.stringify(model);
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
