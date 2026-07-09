import prometheus from 'prom-client';
import {IDatabase, GameIdLedger} from './IDatabase';
import {IGame, Score} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {GameId, ParticipantId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';
import {Session, SessionId} from '../auth/Session';

// Operation names that get routed to `maintenanceLatency` instead of `operationLatency`. These are
// batch/background jobs (purge, compress) that run on a much longer timescale than a typical
// request-path query, so they get their own, wider-bucketed histogram.
const MAINTENANCE_OPERATIONS: ReadonlySet<string> = new Set([
  'purgeUnfinishedGames',
  'compressCompletedGames',
  'compressCompletedGame',
  'trim',
  'collectSizeStats',
]);

// Shared across every IDatabase backend: applied generically below for whatever crosses the
// IDatabase interface boundary, and used directly by individual backends (e.g. PostgreSQL.ts) for the
// handful of operations that don't (private helpers, non-Promise methods).
export const databaseMetrics = {
  operationCount: new prometheus.Counter({
    name: 'database_operation_count',
    help: 'Number of database operations performed',
    labelNames: ['operation'],
    registers: [prometheus.register],
  }),
  operationErrors: new prometheus.Counter({
    name: 'database_operation_errors',
    help: 'Number of database operations that raised an error',
    labelNames: ['operation'],
    registers: [prometheus.register],
  }),
  operationLatency: new prometheus.Histogram({
    name: 'database_operation_latency',
    help: 'Database operation latency in milliseconds',
    labelNames: ['operation'],
    buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
    registers: [prometheus.register],
  }),
  maintenanceLatency: new prometheus.Histogram({
    name: 'database_maintenance_latency',
    help: 'Database maintenance operation latency in milliseconds',
    labelNames: ['operation'],
    buckets: [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 30000, 60000],
    registers: [prometheus.register],
  }),
};

// Increments operationCount/operationErrors and observes the right latency histogram (regular vs.
// maintenance, by operation name) around `fn`. Shared by MetricsDelegate (for whatever crosses the
// IDatabase boundary) and by individual backends instrumenting operations that don't.
export async function withDatabaseMetrics<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  const latencyMetric = MAINTENANCE_OPERATIONS.has(operation) ?
    databaseMetrics.maintenanceLatency :
    databaseMetrics.operationLatency;
  const startMs = Date.now();
  databaseMetrics.operationCount.inc({operation});
  try {
    return await fn();
  } catch (err) {
    databaseMetrics.operationErrors.inc({operation});
    throw err;
  } finally {
    latencyMetric.observe({operation}, Date.now() - startMs);
  }
}

/**
 * Wraps any IDatabase implementation with Prometheus operation-count, latency, and error metrics,
 * generically, for whatever crosses the IDatabase interface boundary.
 *
 * saveGameResults is intentionally left unwrapped and just passed through: it's void/callback-based,
 * not Promise-based, so this can't observe its real completion or errors the way it can for every
 * other method here. A backend that wants accurate metrics for it has to instrument it itself, using
 * the same `databaseMetrics` this class uses (see PostgreSQL.ts).
 */
export class MetricsDelegate implements IDatabase {
  constructor(private delegate: IDatabase) {}

  initialize(): Promise<unknown> {
    return withDatabaseMetrics('initialize', () => this.delegate.initialize());
  }

  getGame(gameId: string): Promise<SerializedGame> {
    return withDatabaseMetrics('getGame', () => this.delegate.getGame(gameId));
  }

  getGameId(id: ParticipantId): Promise<GameId> {
    return withDatabaseMetrics('getGameId', () => this.delegate.getGameId(id));
  }

  getSaveIds(gameId: GameId): Promise<Array<number>> {
    return withDatabaseMetrics('getSaveIds', () => this.delegate.getSaveIds(gameId));
  }

  getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    return withDatabaseMetrics('getGameVersion', () => this.delegate.getGameVersion(gameId, saveId));
  }

  getGameIds(): Promise<Array<GameId>> {
    return withDatabaseMetrics('getGameIds', () => this.delegate.getGameIds());
  }

  getPlayerCount(gameId: GameId): Promise<number> {
    return withDatabaseMetrics('getPlayerCount', () => this.delegate.getPlayerCount(gameId));
  }

  saveGame(game: IGame): Promise<void> {
    return withDatabaseMetrics('saveGame', () => this.delegate.saveGame(game));
  }

  saveGameResults(gameId: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    this.delegate.saveGameResults(gameId, players, generations, gameOptions, scores);
  }

  deleteGameNbrSaves(gameId: GameId, rollbackCount: number): Promise<void> {
    return withDatabaseMetrics('deleteGameNbrSaves', () => this.delegate.deleteGameNbrSaves(gameId, rollbackCount));
  }

  markFinished(gameId: GameId): Promise<void> {
    return withDatabaseMetrics('markFinished', () => this.delegate.markFinished(gameId));
  }

  purgeUnfinishedGames(maxGameDays?: string): Promise<Array<GameId>> {
    return withDatabaseMetrics('purgeUnfinishedGames', () => this.delegate.purgeUnfinishedGames(maxGameDays));
  }

  compressCompletedGames(maxGameDays?: string): Promise<unknown> {
    return withDatabaseMetrics('compressCompletedGames', () => this.delegate.compressCompletedGames(maxGameDays));
  }

  stats(): Promise<{[key: string]: string | number}> {
    return withDatabaseMetrics('stats', () => this.delegate.stats());
  }

  storeParticipants(entry: GameIdLedger): Promise<void> {
    return withDatabaseMetrics('storeParticipants', () => this.delegate.storeParticipants(entry));
  }

  getParticipants(): Promise<Array<GameIdLedger>> {
    return withDatabaseMetrics('getParticipants', () => this.delegate.getParticipants());
  }

  createSession(session: Session): Promise<void> {
    return withDatabaseMetrics('createSession', () => this.delegate.createSession(session));
  }

  deleteSession(sessionId: SessionId): Promise<void> {
    return withDatabaseMetrics('deleteSession', () => this.delegate.deleteSession(sessionId));
  }

  getSessions(): Promise<Array<Session>> {
    return withDatabaseMetrics('getSessions', () => this.delegate.getSessions());
  }
}
