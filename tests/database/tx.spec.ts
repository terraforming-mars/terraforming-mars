import {expect, use} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {EventEmitter} from 'events';
import pg from 'pg';
import {tx} from '@/server/database/tx';

use(chaiAsPromised);

class FakeClient extends EventEmitter {
  public queries: Array<string> = [];
  public releases: Array<Error | boolean | undefined> = [];
  public failOn: string | undefined = undefined;

  public async query(sql: string): Promise<void> {
    this.queries.push(sql);
    if (sql === this.failOn) {
      throw new Error(sql + ' failed');
    }
  }

  public release(err?: Error | boolean): void {
    this.releases.push(err);
  }
}

describe('tx', () => {
  let client: FakeClient;
  let pool: Pick<pg.Pool, 'connect'>;

  beforeEach(() => {
    client = new FakeClient();
    pool = {connect: async () => client as unknown as pg.PoolClient};
  });

  it('commits and returns the result', async () => {
    const result = await tx(pool, async (c) => {
      await c.query('INSERT');
      return 42;
    });

    expect(result).eq(42);
    expect(client.queries).deep.eq(['BEGIN', 'INSERT', 'COMMIT']);
    expect(client.releases).deep.eq([false]);
  });

  it('rolls back and rethrows when fn rejects', async () => {
    const promise = tx(pool, async (c) => {
      await c.query('INSERT');
      throw new Error('boom');
    });

    await expect(promise).to.be.rejectedWith(/boom/);
    expect(client.queries).deep.eq(['BEGIN', 'INSERT', 'ROLLBACK']);
    expect(client.releases).deep.eq([false]);
  });

  it('rolls back when COMMIT fails', async () => {
    client.failOn = 'COMMIT';

    await expect(tx(pool, async () => {})).to.be.rejectedWith(/COMMIT failed/);
    expect(client.queries).deep.eq(['BEGIN', 'COMMIT', 'ROLLBACK']);
    expect(client.releases).deep.eq([false]);
  });

  it('discards the connection when ROLLBACK fails', async () => {
    client.failOn = 'ROLLBACK';

    await expect(tx(pool, async () => {
      throw new Error('boom');
    })).to.be.rejectedWith(/boom/);
    expect(client.queries).deep.eq(['BEGIN', 'ROLLBACK']);
    expect(client.releases).deep.eq([true]);
  });

  it('listens for connection errors until it releases the connection', async () => {
    await tx(pool, async () => {
      client.emit('error', new Error('connection lost'));
    });

    expect(client.queries).deep.eq(['BEGIN', 'COMMIT']);
    expect(client.listenerCount('error')).eq(0);
  });

  it('rejects without releasing when connect fails', async () => {
    pool = {connect: async () => {
      throw new Error('no connection');
    }};

    await expect(tx(pool, async () => {})).to.be.rejectedWith(/no connection/);
    expect(client.queries).is.empty;
    expect(client.releases).is.empty;
  });
});
