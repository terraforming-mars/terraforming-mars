import {expect} from 'chai';
import {EventEmitter} from 'events';
import pg from 'pg';
import {PostgreSQL} from '../../src/server/database/PostgreSQL';
import {testGame} from '../TestGame';
import {IGame} from '../../src/server/IGame';

type Statement = {connection: string, sql: string};

// Covers what the integration tests can't show: which connection ran each statement, and a socket
// dying mid-save. 'pool' marks a statement sent through pool.query(), which can land on any connection.
class FakePool {
  public statements: Array<Statement> = [];
  public released: Array<{connection: string, err: Error | boolean | undefined}> = [];
  public clients: Array<EventEmitter> = [];
  // Statements that start with any of these kill the socket: like pg, the client emits 'error'.
  public dropSocket: Array<string> = [];
  private connections = 0;

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
    return Promise.resolve({rows: [{inserted: true}]});
  }

  public query(sql: string) {
    return this.run('pool', sql);
  }

  public connect() {
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
    // trim() runs outside the transaction.
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
    expect(pool.clients[0].listenerCount('error')).eq(0);
  });

  it('handles the connection dying mid-save', async () => {
    pool.dropSocket = ['INSERT INTO games', 'ROLLBACK'];

    // Without an 'error' listener, EventEmitter.emit('error') throws.
    await db.saveGame(game);

    expect(pool.released).has.length(1);
    expect(pool.released[0].err).is.not.undefined;
    expect(game.lastSaveId).eq(0);
  });
});
