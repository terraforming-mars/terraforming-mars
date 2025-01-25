import {DiscordUser} from './discord';
import {Session, SessionId} from '../../auth/Session';
import {v4 as uuidv4} from 'uuid';
import {Clock} from '../../../common/Timer';
import {ISessionStore, SessionStore} from './SessionStore';

export interface ISessionManager {
  create(discordUser: DiscordUser): Promise<SessionId>;
}

export class SessionManager implements ISessionManager {
  private static readonly INSTANCE = new SessionManager();

  public static getInstance() {
    return this.INSTANCE;
  }

  private sessions: Map<SessionId, Session>;
  private clock: Clock;
  private store: ISessionStore;

  private constructor(clock: Clock = new Clock()) {
    this.clock = clock;
    this.sessions = new Map();
    this.store = new SessionStore();
  }

  public async initialize() {
    try {
      const store = await this.store.read();
      for (const [k, v] of store.entries()) {
        this.sessions.set(k, v);
      }
      console.log('initialized session manager with ' + this.sessions.size + ' sessions.');
    } catch (e) {
      console.error('Cannot load sessions: ', e);
    }
  }

  async create(discordUser: DiscordUser): Promise<SessionId> {
    const sessionid = uuidv4();
    this.sessions.set(sessionid, {
      id: sessionid,
      discordUser,
      expirationDateMillis: this.clock.now() + (30 * 60 * 1000), // 30m expiration
    });
    await this.store.write(this.sessions);
    return Promise.resolve(sessionid);
  }

  get(sessionid: SessionId): DiscordUser | undefined {
    const session = this.sessions.get(sessionid);

    if (session !== undefined) {
      if (this.clock.now() < session.expirationDateMillis) {
        return session.discordUser;
      } else {
        // Not awaiting this since it doesn't need to be immediate.
        this.expire(sessionid);
      }
    }
    return undefined;
  }

  expire(sessionid: SessionId): Promise<void> {
    this.sessions.delete(sessionid);
    return this.store.write(this.sessions);
  }
}
