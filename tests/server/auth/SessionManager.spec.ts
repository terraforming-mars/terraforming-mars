import {expect} from 'chai';
import {fail, AssertionError} from 'assert';
import {SessionManager} from '../../../src/server/server/auth/SessionManager';
import {FakeClock} from '../../common/FakeClock';
import {InMemoryDatabase} from '../../testing/InMemoryDatabase';
import {DiscordUser} from '../../../src/server/server/auth/discord';

describe('SessionManager', () => {
  let fakeClock: FakeClock;
  let database: InMemoryDatabase;
  let user: DiscordUser;

  beforeEach(() => {
    fakeClock = new FakeClock();
    database = new InMemoryDatabase(fakeClock);
    user = {
      id: 'theid',
      username: 'thename',
      discriminator: 'discord-tag',
    };
  });

  it('sanity', async () => {
    const sessionManager = new SessionManager(
      fakeClock,
      database,
      /* expiration_time_millis= */1_000,
    );
    await sessionManager.initialize();

    const sessionId = await sessionManager.create(user);
    const actual = sessionManager.get(sessionId);

    expect(actual).deep.eq(user);
  });

  it('cannot initialize twice', async () => {
    const sessionManager = new SessionManager(
      fakeClock,
      database,
      /* expiration_time_millis= */1_000,
    );
    await sessionManager.initialize();
    try {
      await sessionManager.initialize();
      fail('Should not initialize twice');
    } catch (expected) {
      /** Only propagate assertion errors */
      if (expected instanceof AssertionError) {
        throw expected;
      }
    }
  });

  it('expire', async () => {
    const sessionManager = new SessionManager(
      fakeClock,
      database,
      /* expiration_time_millis= */1_000,
    );
    await sessionManager.initialize();

    const sessionId = await sessionManager.create(user);

    expect(sessionManager.get(sessionId)).is.not.undefined;

    await sessionManager.expire(sessionId);

    expect(sessionManager.get(sessionId)).is.undefined;
  });

  it('expire-by-clock', async () => {
    const sessionManager = new SessionManager(
      fakeClock,
      database,
      /* expiration_time_millis= */1_000,
    );
    await sessionManager.initialize();

    const sessionId = await sessionManager.create(user);

    expect(sessionManager.get(sessionId)).is.not.undefined;

    fakeClock.millis += 2000;

    expect(sessionManager.get(sessionId)).is.undefined;
  });

  it('initialize reads sessions', async () => {
    await database.createSession({
      id: 'session-id',
      data: {
        discordUser: user,
      },
      expirationTimeMillis: 1001,
    });

    fakeClock.millis = 1000;

    const sessionManager = new SessionManager(
      fakeClock,
      database,
      /* expiration_time_millis= */1_000,
    );
    await sessionManager.initialize();

    expect(sessionManager.get('session-id')).is.not.undefined;
  });
});
