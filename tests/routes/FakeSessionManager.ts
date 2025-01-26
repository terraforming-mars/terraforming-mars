import {ISessionManager} from '../../src/server/server/auth/SessionManager';
import {SessionId} from '../../src/server/auth/Session';
import {DiscordUser} from '../../src/server/server/auth/discord';

export class FakeSessionManager implements ISessionManager {
  public map: Map<SessionId, DiscordUser> = new Map();
  initialize(): Promise<void> {
    return Promise.resolve();
  }
  create(discordUser: DiscordUser): Promise<SessionId> {
    const sessionId = '1234';
    this.map.set(sessionId, discordUser);
    return Promise.resolve(sessionId);
  }
  get(sessionid: SessionId): DiscordUser | undefined {
    return this.map.get(sessionid);
  }
  expire(sessionid: SessionId): Promise<void> {
    this.map.delete(sessionid);
    return Promise.resolve();
  }
  sessionIds(): ReadonlyArray<SessionId> {
    return Array.from(this.map.keys());
  }
}
