import {IGameLoader} from '../database/IGameLoader';
import {IPTracker} from '../server/IPTracker';
import {Request} from '../Request';
import {Response} from '../Response';
import {Clock} from '../../common/Timer';
import {SessionId} from '../auth/Session';
import {DiscordUser} from '../server/auth/discord';
import {ISessionManager} from '../server/auth/SessionManager';

// Processes a request for a specific path.
//
// Don't impement this directly, use `Handler`.
export interface IHandler {
  /**
   * Process an inbound HTTP request.
   *
   * @param req the inbound request
   * @param res the outbound response
   * @param ctx details about the inbound request
   */
  processRequest(req: Request, res: Response, ctx: Context): Promise<void>;
}

export type Context = {
  /** The inbound URL */
  url: URL,
  /** The IP inferred from the inbound request. */
  ip: string,
  gameLoader: IGameLoader,
  sessionManager: ISessionManager,
  ipTracker: IPTracker,
  ids: {
    serverId: string,
    statsId: string,
  },
  clock: Clock;
  // The session id from the inbound cookie
  sessionid?: SessionId;
  // The user associated with the session ID, if any.
  user?: DiscordUser;
}
