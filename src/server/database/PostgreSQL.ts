import type * as pg from 'pg';
import {IDatabase} from './IDatabase';
import {IGame, Score} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {GameId, ParticipantId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';
import {daysAgoToSeconds} from './utils';
import {GameIdLedger} from './IDatabase';
import {difference} from '../../common/utils/utils';

export class PostgreSQL implements IDatabase {
  private databaseName: string | undefined = undefined; // Use this only for stats.

  protected statistics = {
    saveCount: 0,
    saveErrorCount: 0,
    saveConflictUndoCount: 0,
    saveConflictNormalCount: 0,
  };
  private _client: pg.Pool | undefined;

  protected get client(): pg.Pool {
    if (this._client === undefined) {
      throw new Error('attempt to get client before intialized');
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

    if (config.database) {
      this.databaseName = config.database;
    } else if (config.connectionString) {
      try {
        // Remove leading / from pathname.
        this.databaseName = new URL(config.connectionString).pathname.replace(/^\//, '');
      } catch (e) {
        console.log(e);
      }
    }
  }

  public async initialize(): Promise<void> {
    const {Pool} = await import('pg');
    this._client = new Pool(this.config);
    await this.client.query('CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default now(), PRIMARY KEY (game_id, save_id))');
    await this.client.query('CREATE TABLE IF NOT EXISTS participants(game_id varchar, participants varchar[], PRIMARY KEY (game_id))');
    await this.client.query('CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))');
    await this.client.query('CREATE TABLE IF NOT EXISTS completed_game(game_id varchar not null, completed_time timestamp default now(), PRIMARY KEY (game_id))');

    await this.client.query('CREATE INDEX IF NOT EXISTS games_i1 on games(save_id)');
    await this.client.query('CREATE INDEX IF NOT EXISTS games_i2 on games(created_time)');
    await this.client.query('CREATE INDEX IF NOT EXISTS participants_idx_ids on participants USING GIN (participants)');
    await this.client.query('CREATE INDEX IF NOT EXISTS completed_game_idx_completed_time on completed_game(completed_time)');
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
    // To only load incomplete games add `WHERE status=\'running\'`
    // above "GROUP BY game_id) a"
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

  public loadCloneableGame(gameId: GameId): Promise<SerializedGame> {
    return this.getGameVersion(gameId, 0);
  }

  public async getGame(gameId: GameId): Promise<SerializedGame> {
    // Retrieve last save from database
    const res = await this.client.query('SELECT game game FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT 1', [gameId]);
    if (res.rows.length === 0 || res.rows[0] === undefined) {
      throw new Error(`Game ${gameId} not found`);
    }
    const json = JSON.parse(res.rows[0].game);
    return json;
  }

  public async getGameId(participantId: ParticipantId): Promise<GameId> {
    try {
      const res = await this.client.query('select game_id from participants where $1 = ANY(participants)', [participantId]);
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
    const res = await this.client.query('SELECT distinct save_id FROM games WHERE game_id = $1', [gameId]);
    const allSaveIds: Array<number> = [];
    res.rows.forEach((row) => {
      allSaveIds.push(row.save_id);
    });
    return Promise.resolve(allSaveIds);
  }

  async getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    const res = await this.client.query('SELECT game game FROM games WHERE game_id = $1 and save_id = $2', [gameId, saveId]);
    if (res.rowCount === 0) {
      throw new Error(`Game ${gameId} not found at save_id ${saveId}`);
    }
    return JSON.parse(res.rows[0].game);
  }

  saveGameResults(gameId: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    this.client.query('INSERT INTO game_results (game_id, seed_game_id, players, generations, game_options, scores) VALUES($1, $2, $3, $4, $5, $6)', [gameId, gameOptions.clonedGamedId, players, generations, gameOptions, JSON.stringify(scores)], (err) => {
      if (err) {
        console.error('PostgreSQL:saveGameResults', err);
        throw err;
      }
    });
  }

  async getMaxSaveId(gameId: GameId): Promise<number> {
    const res = await this.client.query('SELECT MAX(save_id) as save_id FROM games WHERE game_id = $1', [gameId]);
    return res.rows[0].save_id;
  }

  throwIf(err: any, condition: string) {
    if (err) {
      console.error('PostgreSQL', condition, err);
      throw err;
    }
  }

  async markFinished(gameId: GameId): Promise<void> {
    const promise1 = this.client.query('UPDATE games SET status = \'finished\' WHERE game_id = $1', [gameId]);
    const promise2 = this.client.query('INSERT INTO completed_game(game_id) VALUES ($1)', [gameId]);
    await Promise.all([promise1, promise2]);
  }

  // Purge unfinished games older than MAX_GAME_DAYS days. If this environment variable is absent, it uses the default of 10 days.
  async purgeUnfinishedGames(maxGameDays: string | undefined = process.env.MAX_GAME_DAYS): Promise<Array<GameId>> {
    const dateToSeconds = daysAgoToSeconds(maxGameDays, 10);
    const selectResult = await this.client.query('SELECT DISTINCT game_id FROM games WHERE created_time < to_timestamp($1)', [dateToSeconds]);
    const gameIds = selectResult.rows.slice(0, 1000).map((row) => row.game_id);
    console.log(`${gameIds.length} games to be purged.`);
    if (gameIds.length > 1000) {
      gameIds.length = 1000;
      console.log('Truncated purge to 1000 games.');
    }
    // https://github.com/brianc/node-postgres/wiki/FAQ#11-how-do-i-build-a-where-foo-in--query-to-find-rows-matching-an-array-of-values
    const deleteGamesResult = await this.client.query('DELETE FROM games WHERE game_id = ANY($1)', [gameIds]);
    console.log(`Purged ${deleteGamesResult.rowCount} rows from games`);
    const deleteParticipantsResult = await this.client.query('DELETE FROM participants WHERE game_id = ANY($1)', [gameIds]);
    console.log(`Purged ${deleteParticipantsResult.rowCount} rows from participants`);
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
      this.compressCompletedGame(gameId);
    }
  }

  async compressCompletedGame(gameId: GameId): Promise<pg.QueryResult<any>> {
    const maxSaveId = await this.getMaxSaveId(gameId);
    return this.client.query('DELETE FROM games WHERE game_id = $1 AND save_id < $2 AND save_id > 0', [gameId, maxSaveId])
      .then(() => {
        return this.client.query('DELETE FROM completed_game where game_id = $1', [gameId]);
      });
  }

  async saveGame(game: IGame): Promise<void> {
    const gameJSON = game.toJSON();
    this.statistics.saveCount++;
    if (game.gameOptions.undoOption) logForUndo(game.id, 'start save', game.lastSaveId);
    try {
      // Holding onto a value avoids certain race conditions where saveGame is called twice in a row.
      const thisSaveId = game.lastSaveId;
      // xmax = 0 is described at https://stackoverflow.com/questions/39058213/postgresql-upsert-differentiate-inserted-and-updated-rows-using-system-columns-x
      const res = await this.client.query(
        `INSERT INTO games (game_id, save_id, game, players)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (game_id, save_id) DO UPDATE SET game = $3
        RETURNING (xmax = 0) AS inserted`,
        [game.id, game.lastSaveId, gameJSON, game.getPlayers().length]);

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
        const participantIds: Array<ParticipantId> = game.getPlayers().map((p) => p.id);
        if (game.spectatorId) participantIds.push(game.spectatorId);
        await this.storeParticipants({gameId: game.id, participantIds: participantIds});
      }

      if (game.gameOptions.undoOption) logForUndo(game.id, 'increment save id, now', game.lastSaveId);
    } catch (err) {
      this.statistics.saveErrorCount++;
      console.error('PostgreSQL:saveGame', err);
    }
  }

  async deleteGameNbrSaves(gameId: GameId, rollbackCount: number): Promise<void> {
    if (rollbackCount <= 0) {
      console.error(`invalid rollback count for ${gameId}: ${rollbackCount}`);
      // Should this be an error?
      return;
    }
    logForUndo(gameId, 'deleting', rollbackCount, 'saves');
    const first = await this.getSaveIds(gameId);
    const res = await this.client.query('DELETE FROM games WHERE ctid IN (SELECT ctid FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT $2)', [gameId, rollbackCount]);
    logForUndo(gameId, 'deleted', res?.rowCount, 'rows');
    const second = await this.getSaveIds(gameId);
    logForUndo(gameId, 'second', second);
    logForUndo(gameId, 'Rollback difference', difference(first, second));
  }

  public async storeParticipants(entry: GameIdLedger): Promise<void> {
    await this.client.query('INSERT INTO participants (game_id, participants) VALUES($1, $2)', [entry.gameId, entry.participantIds]);
  }

  public async getParticipants(): Promise<Array<{gameId: GameId, participantIds: Array<ParticipantId>}>> {
    const res = await this.client.query('select game_id, participants from participants');
    return res.rows.map((row) => {
      return {gameId: row.game_id as GameId, participantIds: row.participants as Array<ParticipantId>};
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

    const dbsizes = await this.client.query(`
    SELECT
      pg_size_pretty(pg_total_relation_size('games')) as game_size,
      pg_size_pretty(pg_total_relation_size('game_results')) as game_results_size,
      pg_size_pretty(pg_total_relation_size('participants')) as participants_size,
      pg_size_pretty(pg_database_size($1)) as db_size
    `, [this.databaseName]);

    map['size-bytes-games'] = dbsizes.rows[0].game_size;
    map['size-bytes-game-results'] = dbsizes.rows[0].game_results_size;
    map['size-bytes-participants'] = dbsizes.rows[0].participants_size;
    map['size-bytes-database'] = dbsizes.rows[0].db_size;

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
    for (const table of ['games', 'game_results', 'participants']) {
      const result = await this.client.query('select count(*) as rowcount from ' + table);
      map['rows-' + table] = result.rows[0].rowcount;
    }
    return map;
  }
}

function logForUndo(gameId: string, ...message: any[]) {
  console.error(['TRACKING:', gameId, ...message]);
}
