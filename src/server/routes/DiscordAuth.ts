import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {getDiscordUser} from '../server/auth/discord';
import {paths} from '../../common/app/paths';
import {sessionIdCookieName} from '../server/auth/authcookies';

/** Receives the authentication response from Discord. */
export class DiscordAuth extends Handler {
  public static readonly INSTANCE = new DiscordAuth();

  public override async get(_req: Request, res: Response, ctx: Context): Promise<void> {
    const url = ctx.url;
    const code = url.searchParams.get('code');
    if (code === null) {
      return;
    }
    const discordUser = await getDiscordUser(code);
    const sessionId = await ctx.sessionManager.create(discordUser);

    // Find or create user in your database
    // let user = await db.findUserByDiscordId(discordUser.id);
    // if (!user) {
    //   user = await db.createUser({discordId: discordUser.id, username: discordUser.username /* ...other data */});

    responses.setCookie(res, sessionIdCookieName, sessionId, 86400);
    responses.redirect(res, '/' + paths.LOGIN);
  }
}
