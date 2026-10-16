import {expect} from 'chai';
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
  private connections = 0;

  private run(connection: string, sql: string) {
    this.statements.push({connection, sql: sql.trim().split(/\s+/).slice(0, 3).join(' ')});
    const text = sql.trim().replace(/\s+/g, ' ');
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
    return Promise.resolve({
      query: (sql: string) => this.run(connection, sql),
      release: (err?: Error | boolean) => {
        this.released.push({connection, err});
      },
    });
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

  it('survives failing to get a connection', async () => {
    pool.failConnect = true;

    await db.saveGame(game);

    expect(pool.statements).is.empty;
    expect(pool.released).is.empty;
    expect(game.lastSaveId).eq(0);
  });
});
