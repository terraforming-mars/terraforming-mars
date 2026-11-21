import pg from 'pg';
import {databaseMetrics} from './MetricsDelegate';

/**
 * Runs `fn` in a transaction on a single pooled connection.
 *
 * Commits when `fn` resolves, rolls back and rethrows when it rejects. A transaction must run on one
 * connection; pool.query() can pick a different one per call.
 */
export async function tx<T>(pool: Pick<pg.Pool, 'connect'>, fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  // The pool stops listening for a connection's 'error' events while it is checked out.
  const onError = () => databaseMetrics.operationErrors.inc({operation: 'tx:connection'});
  client.on('error', onError);
  // A failed ROLLBACK leaves the connection in an unknown state, so the pool discards it.
  let discard = false;
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      discard = true;
      console.error('tx: ROLLBACK failed', rollbackErr);
    }
    throw err;
  } finally {
    client.removeListener('error', onError);
    client.release(discard);
  }
}
