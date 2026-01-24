import * as responses from '../server/responses';
import {IHandler, Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {DiscordId} from '../server/auth/discord';

export type Options = {
  validateServerId: boolean;
  validateStatsId: boolean;
  auth: boolean;
}

const DISCORD_ADMIN_USER_IDS: Array<string> = [];

{
  const idsString = process.env.DISCORD_ADMIN_USER_IDS ?? '';
  for (const idString of idsString.split(';')) {
    if (idString === '') {
      continue;
    }
    const id = Number(idString);
    if (isNaN(id) || id <= 0) {
      console.error('invalid discord admin id ' + idString);
      continue;
    }
    DISCORD_ADMIN_USER_IDS.push(idString);
  }
}

/**
 * Processes an inbound HTTP request, and behaves as middleware.
 *
 * Inbound calls are passed to processRequest, which are then handed off to get post and put.
 * Subclasses should implemented get, post, and put, as expected.
 */
export abstract class Handler implements IHandler {
  private options: Options;
  constructor(options?: Partial<Options>) {
    this.options = {
      validateServerId: options?.validateServerId === true,
      validateStatsId: options?.validateStatsId === true,
      auth: options?.auth === true,
    };
  }

  protected isUser(userId: DiscordId | undefined, ctx: Context): boolean {
    // Nobody's data to protect
    if (userId === undefined) {
      return true;
    }
    if (ctx.user?.id === undefined) {
      return false;
    }
    if (ctx.user.id === userId) {
      return true;
    }
    if (DISCORD_ADMIN_USER_IDS.includes(ctx.user?.id)) {
      return true;
    }
    return false;
  }

  private isServerIdValid(ctx: Context): boolean {
    if (ctx.user?.id && DISCORD_ADMIN_USER_IDS.includes(ctx.user?.id)) {
      return true;
    }
    const serverId = ctx.url.searchParams.get('serverId');
    if (serverId !== null && serverId === ctx.ids.serverId) {
      return true;
    }
    return false;
  }

  private isStatsIdValid(ctx: Context): boolean {
    const serverId = ctx.url.searchParams.get('serverId');
    return serverId !== null && serverId === ctx.ids.statsId;
  }

  processRequest(req: Request, res: Response, ctx: Context): Promise<void> {
    if (this.options.validateServerId && !this.isServerIdValid(ctx)) {
      responses.notAuthorized(req, res);
      return Promise.resolve();
    }

    if (this.options.validateStatsId) {
      if (this.isServerIdValid(ctx)) {
        responses.downgradeRedirect(req, res, ctx);
        return Promise.resolve();
      }

      if (!this.isStatsIdValid(ctx)) {
        responses.notAuthorized(req, res);
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
      responses.badRequest(req, res, 'Bad method');
      return Promise.resolve();
    }
  }

  public get(req: Request, res: Response, _ctx: Context): Promise<void> {
    responses.notFound(req, res);
    return Promise.resolve();
  }
  public put(req: Request, res: Response, _ctx: Context): Promise<void> {
    responses.notFound(req, res);
    return Promise.resolve();
  }
  public post(req: Request, res: Response, _ctx: Context): Promise<void> {
    responses.notFound(req, res);
    return Promise.resolve();
  }
}
