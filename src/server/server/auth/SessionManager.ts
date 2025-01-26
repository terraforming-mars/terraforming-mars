import {DiscordUser} from './discord';
import {Session, SessionId} from '../../auth/Session';
import {v4 as uuidv4} from 'uuid';
import {Clock} from '../../../common/Timer';
import {IDatabase} from '../../database/IDatabase';
import {Database} from '../../database/Database';
import {durationToMilliseconds} from '../../../server/utils/durations';

export interface ISessionManager {
  create(discordUser: DiscordUser): Promise<SessionId>;
}

const DEFAULT_EXPIRATION_TIME = durationToMilliseconds(process.env.SESSION_DURATION || '30m');
export class SessionManager implements ISessionManager {
  private static readonly INSTANCE = new SessionManager();

  public static getInstance() {
    return this.INSTANCE;
  }

  private sessions: Map<SessionId, Session> = new Map();
  private clock: Clock;
  private database: IDatabase;
  private expirationTimeMillis: number;

  public constructor(
    clock: Clock = new Clock(),
    database: IDatabase = Database.getInstance(),
    expirationTimeMillis = DEFAULT_EXPIRATION_TIME) {
    this.clock = clock;
    this.database = database;
    this.expirationTimeMillis = expirationTimeMillis;
  }

  public async initialize() {
    try {
      const sessions = await(Database.getInstance().getSessions());
      for (const session of sessions) {
        this.sessions.set(session.id, session);
      }
      console.log('initialized session manager with ' + this.sessions.size + ' sessions.');
    } catch (e) {
      console.error('Cannot load sessions: ', e);
    }
  }

  async create(discordUser: DiscordUser): Promise<SessionId> {
    const sessionid = uuidv4();
    const session: Session = {
      id: sessionid,
      data: {discordUser},
      expirationTimeMillis: this.clock.now() + this.expirationTimeMillis,
    };

    await this.database.createSession(session);
    this.sessions.set(sessionid, session);
    return Promise.resolve(sessionid);
  }

  get(sessionid: SessionId): DiscordUser | undefined {
    const session = this.sessions.get(sessionid);

    if (session !== undefined) {
      if (this.clock.now() < session.expirationTimeMillis) {
        return session.data.discordUser;
      } else {
        // Not awaiting this since it doesn't need to be immediate.
        this.expire(sessionid);
      }
    }
    return undefined;
  }

  async expire(sessionid: SessionId): Promise<void> {
    this.sessions.delete(sessionid);
    await this.database.deleteSession(sessionid);
  }
}
