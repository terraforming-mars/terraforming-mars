import {expect} from 'chai';
import {EventEmitter} from 'events';
import pg from 'pg';
import {PostgreSQL} from '../../src/server/database/PostgreSQL';
import {testGame} from '../TestGame';
import {IGame} from '../../src/server/IGame';

type Statement = {connection: string, sql: string};

// Hands out numbered connections and records which one ran each statement. 'pool' marks a
// statement sent through pool.query(), which can land on any connection.
class FakePool {
  public statements: Array<Statement> = [];
  public released: Array<{connection: string, err: Error | boolean | undefined}> = [];
  // Statements that start with any of these fail.
  public failing: Array<string> = [];
  public failConnect = false;
  // Statements that start with a key fail with a deadlock error, as many times as its value.
  public deadlocks = new Map<string, number>();
  private connections = 0;

  // Statements that start with any of these kill the socket: like pg, the client emits 'error'.
  public dropSocket: Array<string> = [];
  public clients: Array<EventEmitter> = [];

  private run(connection: string, sql: string, client?: EventEmitter) {
    this.statements.push({connection, sql: sql.trim().split(/\s+/).slice(0, 3).join(' ')});
    const text = sql.trim().replace(/\s+/g, ' ');
    if (client !== undefined && this.dropSocket.some((prefix) => text.startsWith(prefix))) {
      // pg fails the pending query, then emits from the socket handler, outside any caller's try.
      return new Promise((_resolve, reject) => {
        setImmediate(() => {
          const err = new Error('socket closed');
          reject(err);
          client.emit('error', err);
        });
      });
    }
    for (const [prefix, remaining] of this.deadlocks) {
      if (remaining > 0 && text.startsWith(prefix)) {
        this.deadlocks.set(prefix, remaining - 1);
        return Promise.reject(Object.assign(new Error('deadlock detected'), {code: '40P01'}));
      }
    }
    if (this.failing.some((prefix) => text.startsWith(prefix))) {
      return Promise.reject(new Error('failed: ' + text));
    }
    return Promise.resolve({rows: [{inserted: true}]});
  }

  public query(sql: string) {
    return this.run('pool', sql);
  }

  public connect() {
    if (this.failConnect) {
      return Promise.reject(new Error('no connection'));
    }
    const connection = 'conn' + (++this.connections);
    const client = Object.assign(new EventEmitter(), {
      query: (sql: string) => this.run(connection, sql, client),
      release: (err?: Error | boolean) => {
        this.released.push({connection, err});
      },
    });
    this.clients.push(client);
    return Promise.resolve(client);
  }
}

class TestPostgreSQL extends PostgreSQL {
  constructor(public readonly pool: FakePool) {
    super();
    // trim() runs outside the transaction and isn't under test here.
    this.trimCount = 0;
  }

  protected override get client(): pg.Pool {
    return this.pool as unknown as pg.Pool;
  }
}

describe('PostgreSQL', () => {
  let pool: FakePool;
  let db: TestPostgreSQL;
  let game: IGame;

  beforeEach(() => {
    pool = new FakePool();
    db = new TestPostgreSQL(pool);
    [game] = testGame(2);
    game.lastSaveId = 0;
  });

  it('runs the whole save on one checked-out connection', async () => {
    await db.saveGame(game);

    expect(pool.statements).deep.eq([
      {connection: 'conn1', sql: 'BEGIN'},
      {connection: 'conn1', sql: 'INSERT INTO games'},
      {connection: 'conn1', sql: 'INSERT INTO game'},
      {connection: 'conn1', sql: 'INSERT INTO participants'},
      {connection: 'conn1', sql: 'COMMIT'},
    ]);
    expect(pool.released).deep.eq([{connection: 'conn1', err: undefined}]);
    expect(game.lastSaveId).eq(1);
  });

  it('gives concurrent saves their own connections', async () => {
    const [other] = testGame(2);
    other.lastSaveId = 5;

    await Promise.all([db.saveGame(game), db.saveGame(other)]);

    const connectionsOf = (sql: string) => pool.statements.filter((s) => s.sql === sql).map((s) => s.connection);
    expect(connectionsOf('BEGIN')).has.members(['conn1', 'conn2']);
    expect(connectionsOf('COMMIT')).has.members(['conn1', 'conn2']);
    expect(pool.statements.filter((s) => s.connection === 'pool')).is.empty;
    expect(pool.released.map((r) => r.connection)).has.members(['conn1', 'conn2']);
  });

  it('rolls back on the same connection when an insert fails', async () => {
    pool.failing = ['INSERT INTO game (game_id, log'];

    await db.saveGame(game);

    expect(pool.statements.map((s) => s.connection + ' ' + s.sql)).deep.eq([
      'conn1 BEGIN',
      'conn1 INSERT INTO games',
      'conn1 INSERT INTO game',
      'conn1 ROLLBACK',
    ]);
    expect(pool.released).deep.eq([{connection: 'conn1', err: undefined}]);
    expect(game.lastSaveId).eq(0);
  });

  it('does not advance lastSaveId when the commit fails', async () => {
    pool.failing = ['COMMIT'];

    await db.saveGame(game);

    expect(pool.statements.at(-1)).deep.eq({connection: 'conn1', sql: 'ROLLBACK'});
    expect(game.lastSaveId).eq(0);
  });

  it('discards the connection when the rollback fails', async () => {
    pool.failing = ['BEGIN', 'ROLLBACK'];

    await db.saveGame(game);

    expect(pool.statements.map((s) => s.sql)).deep.eq(['BEGIN', 'ROLLBACK']);
    expect(pool.released).has.length(1);
    expect(pool.released[0].err).is.not.undefined;
    expect(game.lastSaveId).eq(0);
  });

  it('handles the connection dying mid-save', async () => {
    pool.dropSocket = ['INSERT INTO games', 'ROLLBACK'];

    // Without an 'error' listener, EventEmitter.emit('error') throws.
    await db.saveGame(game);

    expect(pool.released).has.length(1);
    expect(pool.released[0].err).is.not.undefined;
    expect(game.lastSaveId).eq(0);
  });

  it('does not leave error listeners behind on the client', async () => {
    await db.saveGame(game);

    expect(pool.clients[0].listenerCount('error')).eq(0);
  });

  it('survives failing to get a connection', async () => {
    pool.failConnect = true;

    await db.saveGame(game);

    expect(pool.statements).is.empty;
    expect(pool.released).is.empty;
    expect(game.lastSaveId).eq(0);
  });
  async function markFinishedError(): Promise<unknown> {
    try {
      await db.markFinished(game.id);
    } catch (err) {
      return err;
    }
    return undefined;
  }

  it('marks a game finished in one transaction', async () => {
    await db.markFinished(game.id);

    expect(pool.statements.map((s) => s.connection + ' ' + s.sql)).deep.eq([
      'conn1 BEGIN',
      'conn1 UPDATE games SET',
      'conn1 UPDATE game SET',
      'conn1 INSERT INTO completed_game(game_id)',
      'conn1 COMMIT',
    ]);
    expect(pool.released).deep.eq([{connection: 'conn1', err: undefined}]);
  });

  it('retries marking a game finished after a deadlock', async () => {
    pool.deadlocks.set('UPDATE games SET', 1);

    await db.markFinished(game.id);

    expect(pool.statements.map((s) => s.connection + ' ' + s.sql)).deep.eq([
      'conn1 BEGIN',
      'conn1 UPDATE games SET',
      'conn1 ROLLBACK',
      'conn2 BEGIN',
      'conn2 UPDATE games SET',
      'conn2 UPDATE game SET',
      'conn2 INSERT INTO completed_game(game_id)',
      'conn2 COMMIT',
    ]);
    expect(pool.released.map((r) => r.connection)).deep.eq(['conn1', 'conn2']);
  });

  it('stops retrying after repeated deadlocks', async () => {
    pool.deadlocks.set('UPDATE games SET', 5);

    const err = await markFinishedError();

    expect((err as {code?: string}).code).eq('40P01');
    expect(pool.statements.filter((s) => s.sql === 'BEGIN')).has.length(3);
    expect(pool.statements.filter((s) => s.sql === 'COMMIT')).is.empty;
    expect(pool.released).has.length(3);
  });

  it('does not retry other errors when marking a game finished', async () => {
    pool.failing = ['INSERT INTO completed_game'];

    const err = await markFinishedError();

    expect(err).is.instanceOf(Error);
    expect(pool.statements.map((s) => s.sql)).deep.eq([
      'BEGIN',
      'UPDATE games SET',
      'UPDATE game SET',
      'INSERT INTO completed_game(game_id)',
      'ROLLBACK',
    ]);
    expect(pool.released).deep.eq([{connection: 'conn1', err: undefined}]);
  });
});
