import prometheus from 'prom-client';
import pg from 'pg';
import {IDatabase} from './IDatabase';
import {IGame, Score} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {GameId, ParticipantId, isGameId, safeCast} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';
import {daysAgoToSeconds, stringToNumber} from './utils';
import {GameIdLedger} from './IDatabase';
import {Session, SessionId} from '../auth/Session';
import {toID} from '../../common/utils/utils';
import {databaseMetrics, withDatabaseMetrics} from './MetricsDelegate';
import {ThrottledCache} from './ThrottledCache';
import {Clock} from '@/common/Timer';

type StoredSerializedGame = Omit<SerializedGame, 'gameOptions' | 'gameLog'> & {logLength: number};

export const POSTGRESQL_TABLES = ['game', 'games', 'game_results', 'participants', 'completed_game', 'session'] as const;

const POSTGRES_TRIM_COUNT = stringToNumber(process.env.POSTGRES_TRIM_COUNT, 10);

// How often the (expensive) table/database size stats are actually recomputed. Scrapes that land
// between refreshes just get the cached values.
const SIZE_STATS_COLLECTION_INTERVAL_MS = 5 * 60_000;

let activeDatabase: PostgreSQL | undefined;

const metrics = {
  tableSizeBytes: new prometheus.Gauge({
    name: 'postgresql_table_size_bytes',
    help: 'Total size (table + indexes) of a PostgreSQL table, in bytes',
    labelNames: ['table'],
    registers: [prometheus.register],
    collect() {
      activeDatabase?.metricsScrapeCache.get();
    },
  }),
  databaseSizeBytes: new prometheus.Gauge({
    name: 'postgresql_database_size_bytes',
    help: 'Size of the PostgreSQL database, in bytes',
    registers: [prometheus.register],
    collect() {
      activeDatabase?.metricsScrapeCache.get();
    },
  }),
  tableRows: new prometheus.Gauge({
    name: 'postgresql_table_rows',
    help: 'Row count of a PostgreSQL table (select count(*))',
    labelNames: ['table'],
    registers: [prometheus.register],
    collect() {
      activeDatabase?.metricsScrapeCache.get();
    },
  }),
};

export class PostgreSQL implements IDatabase {
  protected trimCount = POSTGRES_TRIM_COUNT;

  protected statistics = {
    saveCount: 0,
    saveErrorCount: 0,
    saveConflictUndoCount: 0,
    saveConflictNormalCount: 0,
  };
  public metricsScrapeCache: ThrottledCache<void>;

  private _client: pg.Pool | undefined;

  protected get client(): pg.Pool {
    if (this._client === undefined) {
      throw new Error('attempt to get client before initialized');
    }
    return this._client;
  }

  constructor(
    private config: pg.ClientConfig = {
      connectionString: process.env.POSTGRES_HOST,
    }) {
    if (config.connectionString?.startsWith('postgres')) {
      config.ssl = {
        // heroku uses self-signed certificates
        rejectUnauthorized: false,
      };
    }
    this.metricsScrapeCache = new ThrottledCache(
      new Clock(),
      SIZE_STATS_COLLECTION_INTERVAL_MS,
      () => this.collectSizeStats());

    activeDatabase = this;
  }

  public async initialize(): Promise<void> {
    this._client = new pg.Pool(this.config);

    const sql = `
    CREATE TABLE IF NOT EXISTS games(
      game_id varchar,
      players integer,
      save_id integer,
      game text,
      status text default 'running',
      created_time timestamp default now(),
      PRIMARY KEY (game_id, save_id));

    /* A single game, storing the log and the options. Normalizing out some of the game state. */
    CREATE TABLE IF NOT EXISTS game(
      game_id varchar NOT NULL,
      log text NOT NULL,
      options text NOT NULL,
      status text default 'running' NOT NULL,
      created_time timestamp default now() NOT NULL,
      PRIMARY KEY (game_id));

    /* A list of the players and spectator IDs, which optimizes loading unloaded for a specific player. */
    CREATE TABLE IF NOT EXISTS participants(
      game_id varchar,
      participants varchar[],
      PRIMARY KEY (game_id));

    CREATE TABLE IF NOT EXISTS game_results(
      game_id varchar not null,
      seed_game_id varchar,
      players integer,
      generations integer,
      game_options text,
      scores text,
      PRIMARY KEY (game_id));

    CREATE TABLE IF NOT EXISTS completed_game(
      game_id varchar not null,
      completed_time timestamp default now(),
      PRIMARY KEY (game_id));

    CREATE TABLE IF NOT EXISTS session(
      session_id varchar not null,
      data varchar not null,
      expiration_time timestamp not null,
      PRIMARY KEY (session_id));

    CREATE INDEX IF NOT EXISTS games_i1 on games(save_id);
    CREATE INDEX IF NOT EXISTS games_i2 on games(created_time);
    CREATE INDEX IF NOT EXISTS participants_idx_ids on participants USING GIN (participants);
    CREATE INDEX IF NOT EXISTS completed_game_idx_completed_time on completed_game(completed_time);
    CREATE INDEX IF NOT EXISTS session_idx_expiration_time on session(expiration_time);
    `;
    await this.client.query(sql);
  }

  public async getPlayerCount(gameId: GameId): Promise<number> {
    const sql = 'SELECT players FROM games WHERE save_id = 0 AND game_id = $1 LIMIT 1';

    const res = await this.client.query(sql, [gameId]);
    if (res.rows.length === 0) {
      throw new Error(`no rows found for game id ${gameId}`);
    }
    return res.rows[0].players;
  }

  public async getGameIds(): Promise<Array<GameId>> {
    const sql: string =
    `SELECT games.game_id
    FROM games, (
      SELECT max(save_id) save_id, game_id
      FROM games
      GROUP BY game_id) a
    WHERE games.game_id = a.game_id
    AND games.save_id = a.save_id
    ORDER BY created_time DESC`;
    const res = await this.client.query(sql);
    return res.rows.map((row) => row.game_id);
  }

  private compose(game: string, log: string, options: string): SerializedGame {
    const stored: StoredSerializedGame = JSON.parse(game);
    const {logLength, ...remainder} = stored;
    // console.log(log, options, stored.logLength);
    // TODO(kberg): Remove the outer join, and the else of this conditional by 2025-01-01
    if (stored.logLength !== undefined) {
      const gameLog = JSON.parse(log);
      gameLog.length = logLength;
      const gameOptions = JSON.parse(options);
      return {...remainder, gameOptions, gameLog};
    } else {
      return remainder as SerializedGame;
    }
  }

  public async getGameId(participantId: ParticipantId): Promise<GameId> {
    try {
      const res = await this.client.query('SELECT game_id FROM participants WHERE $1 = ANY(participants)', [participantId]);
      if (res.rowCount === 0) {
        throw new Error(`Game for player id ${participantId} not found`);
      }
      return res.rows[0].game_id;
    } catch (err) {
      console.error('PostgreSQL:getGameId', err);
      throw err;
    }
  }

  public async getSaveIds(gameId: GameId): Promise<Array<number>> {
    const res = await this.client.query('SELECT DISTINCT save_id FROM games WHERE game_id = $1', [gameId]);
    const allSaveIds: Array<number> = [];
    res.rows.forEach((row) => {
      allSaveIds.push(row.save_id);
    });
    return Promise.resolve(allSaveIds);
  }

  public async getGame(gameId: GameId): Promise<SerializedGame> {
    // Retrieve last save from database
    const res = await this.client.query(
      `SELECT
        games.game as game,
        game.log as log,
        game.options as options
      FROM games
      LEFT JOIN game on game.game_id = games.game_id
      WHERE games.game_id = $1
      ORDER BY save_id DESC
      LIMIT 1`,
      [gameId],
    );
    if (res.rows.length === 0 || res.rows[0] === undefined) {
      throw new Error(`Game ${gameId} not found`);
    }
    const row = res.rows[0];
    return this.compose(row.game, row.log, row.options);
  }

  async getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    const res = await this.client.query(
      `SELECT
        games.game as game,
        game.log as log,
        game.options as options
      FROM games
      LEFT JOIN game on game.game_id = games.game_id
      WHERE games.game_id = $1
      AND games.save_id = $2`,
      [gameId, saveId],
    );

    if (res.rowCount === 0) {
      throw new Error(`Game ${gameId} not found at save_id ${saveId}`);
    }
    const row = res.rows[0];
    return this.compose(row.game, row.log, row.options);
  }

  // Not part of IDatabase: void/callback-based, so MetricsDelegate can't observe its completion or
  // errors the way it can for Promise-returning methods. Instrumented directly here instead.
  saveGameResults(gameId: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    const operation = 'saveGameResults';
    const startMs = Date.now();
    databaseMetrics.operationCount.inc({operation});
    this.client.query('INSERT INTO game_results (game_id, seed_game_id, players, generations, game_options, scores) VALUES($1, $2, $3, $4, $5, $6)', [gameId, gameOptions.clonedGamedId, players, generations, gameOptions, JSON.stringify(scores)], (err) => {
      databaseMetrics.operationLatency.observe({operation}, Date.now() - startMs);
      if (err) {
        databaseMetrics.operationErrors.inc({operation});
        console.error('PostgreSQL:saveGameResults', err);
        throw err;
      }
    });
  }

  // Not part of IDatabase: a PostgreSQL-only helper, invisible to MetricsDelegate. Instrumented
  // directly here instead.
  getMaxSaveId(gameId: GameId): Promise<number> {
    return withDatabaseMetrics('getMaxSaveId', async () => {
      const res = await this.client.query('SELECT MAX(save_id) as save_id FROM games WHERE game_id = $1', [gameId]);
      return res.rows[0].save_id;
    });
  }

  throwIf(err: any, condition: string) {
    if (err) {
      console.error('PostgreSQL', condition, err);
      throw err;
    }
  }

  async markFinished(gameId: GameId): Promise<void> {
    const promise1 = this.client.query('UPDATE games SET status = \'finished\' WHERE game_id = $1', [gameId]);
    const promise2 = this.client.query('UPDATE game SET status = \'finished\' WHERE game_id = $1', [gameId]);
    const promise3 = this.client.query('INSERT INTO completed_game(game_id) VALUES ($1)', [gameId]);
    await Promise.all([promise1, promise2, promise3]);
  }

  // Purge unfinished games older than MAX_GAME_DAYS days. If this environment variable is absent, it uses the default of 10 days.
  async purgeUnfinishedGames(maxGameDays: string | undefined = process.env.MAX_GAME_DAYS): Promise<Array<GameId>> {
    const dateToSeconds = daysAgoToSeconds(maxGameDays, 10);
    const selectResult = await this.client.query('SELECT DISTINCT game_id FROM games WHERE created_time < to_timestamp($1) AND status = \'running\'', [dateToSeconds]);
    let gameIds = selectResult.rows.map((row) => row.game_id);
    if (gameIds.length > 1000) {
      console.log('Truncated purge to 1000 games.');
      gameIds = gameIds.slice(0, 1000);
    } else {
      console.log(`${gameIds.length} games to be purged.`);
    }

    if (gameIds.length > 0) {
      // https://github.com/brianc/node-postgres/wiki/FAQ#11-how-do-i-build-a-where-foo-in--query-to-find-rows-matching-an-array-of-values
      const deleteGamesResult = await this.client.query('DELETE FROM games WHERE game_id = ANY($1)', [gameIds]);
      console.log(`Purged ${deleteGamesResult.rowCount} rows from games`);
      const deleteParticipantsResult = await this.client.query('DELETE FROM participants WHERE game_id = ANY($1)', [gameIds]);
      console.log(`Purged ${deleteParticipantsResult.rowCount} rows from participants`);
      const deleteGameResult = await this.client.query('DELETE FROM game WHERE game_id = ANY($1)', [gameIds]);
      console.log(`Purged ${deleteGameResult.rowCount} rows from game`);
    }
    return gameIds;
  }


  async compressCompletedGames(compressCompletedGamesDays: string | undefined = process.env.COMPRESS_COMPLETED_GAMES_DAYS): Promise<void> {
    if (compressCompletedGamesDays === undefined) {
      return;
    }
    const dateToSeconds = daysAgoToSeconds(compressCompletedGamesDays, 0);
    const selectResult = await this.client.query('SELECT DISTINCT game_id FROM completed_game WHERE completed_time < to_timestamp($1)', [dateToSeconds]);
    const gameIds = selectResult.rows.slice(0, 1000).map((row) => row.game_id);
    console.log(`${gameIds.length} completed games to be compressed.`);
    if (gameIds.length > 1000) {
      gameIds.length = 1000;
      console.log('Compressing 1000 games.');
    }
    for (const gameId of gameIds) {
      // This isn't using await because nothing really depends on it.
      await this.compressCompletedGame(gameId);
    }
  }

  // Not part of IDatabase (only the batch compressCompletedGames is), invisible to MetricsDelegate.
  // Instrumented directly here instead, so per-game maintenance latency isn't lost inside the batch.
  compressCompletedGame(gameId: GameId): Promise<void> {
    return withDatabaseMetrics('compressCompletedGame', async () => {
      const maxSaveId = await this.getMaxSaveId(gameId);
      await this.client.query('DELETE FROM games WHERE game_id = $1 AND save_id < $2 AND save_id > 0', [gameId, maxSaveId]);
      await this.client.query('DELETE FROM completed_game where game_id = $1', [gameId]);
    });
  }

  async saveGame(game: IGame): Promise<void> {
    const serialized = game.serialize();
    const options = JSON.stringify(serialized.gameOptions);
    const log = JSON.stringify(serialized.gameLog);

    const storedSerialized: StoredSerializedGame = {...serialized, logLength: game.gameLog.length};
    (storedSerialized as any).gameLog = [];
    (storedSerialized as any).gameOptions = {};
    const gameJSON = JSON.stringify(storedSerialized);

    this.statistics.saveCount++;
    try {
      await this.client.query('BEGIN');

      // Holding onto a value avoids certain race conditions where saveGame is called twice in a row.
      const thisSaveId = game.lastSaveId;
      // xmax = 0 is described at https://stackoverflow.com/questions/39058213/postgresql-upsert-differentiate-inserted-and-updated-rows-using-system-columns-x
      const res = await this.client.query(
        `INSERT INTO games (game_id, save_id, game, players)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (game_id, save_id) DO UPDATE SET game = $3
        RETURNING (xmax = 0) AS inserted`,
        [game.id, game.lastSaveId, gameJSON, game.players.length]);

      await this.client.query(
        `INSERT INTO game (game_id, log, options)
        VALUES ($1, $2, $3)
        ON CONFLICT (game_id)
        DO UPDATE SET log = $2`,
        [game.id, log, options]);

      game.lastSaveId = thisSaveId + 1;

      let inserted = true;
      try {
        inserted = res.rows[0].inserted;
      } catch (err) {
        console.error(err);
      }
      if (inserted === false) {
        if (game.gameOptions.undoOption) {
          this.statistics.saveConflictUndoCount++;
        } else {
          this.statistics.saveConflictNormalCount++;
        }
      }

      // Save IDs on the very first save for this game. That's when the incoming saveId is 0, and also
      // when the database operation was an insert. (We should figure out why multiple saves occur and
      // try to stop them. But that's for another day.)
      if (inserted === true && thisSaveId === 0) {
        const participantIds: Array<ParticipantId> = game.players.map(toID);
        if (game.spectatorId) {
          participantIds.push(game.spectatorId);
        }
        await this.storeParticipants({gameId: game.id, participantIds: participantIds});
      }

      await this.client.query('COMMIT');
    } catch (err) {
      await this.client.query('ROLLBACK');
      this.statistics.saveErrorCount++;
      // saveGame deliberately never rejects (see below), so MetricsDelegate's generic wrapper never
      // sees this error. It's the only way this operation's error count gets recorded.
      databaseMetrics.operationErrors.inc({operation: 'saveGame'});
      console.error('PostgreSQL:saveGame', err);
    }
    this.trim(game);
  }

  // Not part of IDatabase, invisible to MetricsDelegate, and invoked fire-and-forget (not awaited) by
  // saveGame above. Instrumented directly here instead.
  private trim(game: IGame) {
    return withDatabaseMetrics('trim', async () => {
      if (this.trimCount <= 0) {
        return;
      }
      if (game.lastSaveId % this.trimCount === 0) {
        const maxSaveId = game.lastSaveId - this.trimCount;
        await this.client.query(
          'DELETE FROM games WHERE game_id = $1 AND save_id > 0 AND save_id < $2', [game.id, maxSaveId]);
      }
    });
  }

  async deleteGameNbrSaves(gameId: GameId, rollbackCount: number): Promise<void> {
    if (rollbackCount <= 0) {
      console.error(`invalid rollback count for ${gameId}: ${rollbackCount}`);
      // Should this be an error?
      return;
    }
    await this.client.query('DELETE FROM games WHERE ctid IN (SELECT ctid FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT $2)', [gameId, rollbackCount]);
  }

  public async storeParticipants(entry: GameIdLedger): Promise<void> {
    await this.client.query('INSERT INTO participants (game_id, participants) VALUES($1, $2) ON CONFLICT (game_id) DO NOTHING', [entry.gameId, entry.participantIds]);
  }

  public async getParticipants(): Promise<Array<{gameId: GameId, participantIds: Array<ParticipantId>}>> {
    const res = await this.client.query('select game_id, participants from participants');
    return res.rows.map((row) => {
      return {gameId: safeCast(row.game_id, isGameId), participantIds: row.participants as Array<ParticipantId>};
    });
  }

  public async stats(): Promise<{[key: string]: string | number}> {
    const map: {[key: string]: string | number}= {
      'type': 'POSTGRESQL',
      'pool-total-count': this.client.totalCount,
      'pool-idle-count': this.client.idleCount,
      'pool-waiting-count': this.client.waitingCount,
      'save-count': this.statistics.saveCount,
      'save-error-count': this.statistics.saveErrorCount,
      'save-conflict-normal-count': this.statistics.saveConflictNormalCount,
      'save-conflict-undo-count': this.statistics.saveConflictUndoCount,
    };

    function varz(x: string) {
      return x.replaceAll('_', '-');
    }

    // Rows with no matching game_id in `games` — these are unreachable via getGame()/getGameVersion()
    // and are safe to delete.
    for (const table of ['participants', 'game']) {
      const result = await this.client.query(
        `select count(*) as rowcount from ${table} t where not exists (select 1 from games where games.game_id = t.game_id)`);
      map['orphaned-rows-' + varz(table)] = result.rows[0].rowcount;
    }
    return map;
  }

  // The actual (expensive) size-stat queries: table/index sizes, database size, and row counts.
  // Throttled by collectSizeStatsIfStale() above; not intended to be called directly elsewhere.
  private collectSizeStats(): Promise<void> {
    if (this._client === undefined) {
      return Promise.resolve();
    }

    return withDatabaseMetrics('collectSizeStats', async () => {
      const columns = POSTGRESQL_TABLES.map((table) => `pg_total_relation_size('${table}') as ${table}_size`);
      const sql = `SELECT ${columns.join(', ')}, pg_database_size(current_database()) as db_size`;
      const result = await this.client.query(sql);
      const row = result.rows[0];
      POSTGRESQL_TABLES.forEach((table) => {
        metrics.tableSizeBytes.set({table}, Number(row[`${table}_size`]));
      });
      metrics.databaseSizeBytes.set(Number(row.db_size));

      // Using count(*) is inefficient, but the estimates from here
      // https://stackoverflow.com/questions/7943233/fast-way-to-discover-the-row-count-of-a-table-in-postgresql
      // seem wildly inaccurate.
      //
      // heroku pg:bloat --app terraforming-mars
      // shows some bloat
      // and the postgres command
      // VACUUM (VERBOSE) shows a fairly reasonable vacumm (no rows locked, for instance),
      // so it's not clear why those wrong. But these select count(*) commands seem pretty quick
      // in testing. :fingers-crossed:
      for (const table of POSTGRESQL_TABLES) {
        const result = await this.client.query(`select count(*) as rowcount from ${table}`);
        metrics.tableRows.set({table}, Number(result.rows[0].rowcount));
      }
    });
  }

  public async createSession(session: Session): Promise<void> {
    await this.client.query('INSERT INTO session (session_id, data, expiration_time) VALUES($1, $2, $3)', [session.id, JSON.stringify(session.data), new Date(session.expirationTimeMillis)]);
  }

  public async deleteSession(sessionId: SessionId): Promise<void> {
    await this.client.query('DELETE FROM session where session_id = $1', [sessionId]);
  }

  // TODO(kberg): this doesn't prune expired sessions.
  async getSessions(): Promise<Array<Session>> {
    const res = await this.client.query('SELECT session_id, data, expiration_time FROM session WHERE expiration_time > to_timestamp($1)', [Date.now() / 1000]);
    return res.rows.map((row) => {
      return {
        id: row.session_id,
        data: JSON.parse(row.data),
        expirationTimeMillis: row.expiration_time.getTime(),
      };
    });
  }
}
