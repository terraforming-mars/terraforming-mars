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
  // Statements that start with any of these finish on a later tick, and are added to finished then.
  public slow: Array<string> = [];
  public finished: Array<string> = [];
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
    if (this.failing.some((prefix) => text.startsWith(prefix))) {
      return Promise.reject(new Error('failed: ' + text));
    }
    if (this.slow.some((prefix) => text.startsWith(prefix))) {
      return new Promise((resolve) => {
        setImmediate(() => {
          this.finished.push(text);
          resolve({rows: []});
        });
      });
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
  // trim() runs outside the transaction, so it's off unless a test turns it on.
  constructor(public readonly pool: FakePool, trimCount = 0) {
    super();
    this.trimCount = trimCount;
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

  it('gives overlapping saves of one game consecutive save ids', async () => {
    await Promise.all([db.saveGame(game), db.saveGame(game)]);

    expect(game.lastSaveId).eq(2);
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

  // GameLoader.completeGame calls markFinished right after the last save. While that save's trim
  // was still deleting rows, the two deadlocked.
  it('finishes trimming before the save resolves', async () => {
    db = new TestPostgreSQL(pool, 1);
    pool.slow = ['DELETE FROM games'];

    await db.saveGame(game);

    expect(pool.statements.at(-1)).deep.eq({connection: 'pool', sql: 'DELETE FROM games'});
    expect(pool.finished).has.length(1);
  });

  it('still saves when trimming fails', async () => {
    db = new TestPostgreSQL(pool, 1);
    pool.failing = ['DELETE FROM games'];

    await db.saveGame(game);

    expect(pool.statements.at(-1)).deep.eq({connection: 'pool', sql: 'DELETE FROM games'});
    expect(pool.statements.map((s) => s.sql)).includes('COMMIT');
    expect(game.lastSaveId).eq(1);
  });
});
