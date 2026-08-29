import * as responses from '../server/responses';
import {IHandler, Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {DiscordId} from '../server/auth/discord';
import {RouteError} from './RouteError';
import {assertNever} from '../../common/utils/utils';

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

  // TODO(kberg): provide a good not authorized path. This collapses two failures into
  // one boolean: no session at all (401) and someone else's data (403). Callers can only
  // report `forbidden`.
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
    const serverId = ctx.urlParams.stringOrUndefined('serverId');
    return serverId === ctx.ids.serverId;
  }

  private isStatsIdValid(ctx: Context): boolean {
    const serverId = ctx.urlParams.stringOrUndefined('serverId');
    return serverId !== null && serverId === ctx.ids.statsId;
  }

  /* Routes are async, so a thrown RouteError surfaces as a rejection, not a synchronous throw. */
  private handleError(e: unknown, req: Request, res: Response): void {
    if (e instanceof RouteError) {
      switch (e.kind) {
      case 'badRequest':
        responses.badRequest(req, res, e.detail);
        break;
      case 'forbidden':
        responses.forbidden(req, res);
        break;
      case 'notFound':
        responses.notFound(req, res, e.detail);
        break;
      case 'internalServerError':
        responses.internalServerError(req, res, e.detail);
        break;
      default:
        assertNever(e.kind);
      }
      return;
    }
    responses.internalServerError(req, res, e);
  }

  public async processRequest(req: Request, res: Response, ctx: Context): Promise<void> {
    try {
      if (this.options.validateServerId && !this.isServerIdValid(ctx)) {
        throw RouteError.forbidden();
      }

      if (this.options.validateStatsId) {
        if (this.isServerIdValid(ctx)) {
          responses.downgradeRedirect(req, res, ctx);
          return Promise.resolve();
        }

        if (!this.isStatsIdValid(ctx)) {
          throw RouteError.forbidden();
        }
      }

      switch (req.method) {
      case 'GET':
        return await this.get(req, res, ctx);
      case 'POST':
        return await this.post(req, res, ctx);
      case 'PUT':
        return await this.put(req, res, ctx);
      default:
        throw RouteError.badRequest('Bad method');
      }
    } catch (e) {
      this.handleError(e, req, res);
      return Promise.resolve();
    }
  }

  public get(_req: Request, _res: Response, _ctx: Context): Promise<void> {
    throw RouteError.notFound();
  }
  public put(_req: Request, _res: Response, _ctx: Context): Promise<void> {
    throw RouteError.notFound();
  }
  public post(_req: Request, _res: Response, _ctx: Context): Promise<void> {
    throw RouteError.notFound();
  }
}
