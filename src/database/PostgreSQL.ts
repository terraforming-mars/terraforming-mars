import {DbLoadCallback, IDatabase} from './IDatabase';
import {Game, GameOptions, Score} from '../Game';
import {GameId} from '../common/Types';
import {SerializedGame} from '../SerializedGame';

import {Pool, ClientConfig, QueryResult} from 'pg';

export class PostgreSQL implements IDatabase {
  protected client: Pool;
  private databaseName: string | undefined = undefined; // Use this only for stats.

  protected statistics = {
    saveCount: 0,
    saveErrorCount: 0,
    saveConflictUndoCount: 0,
    saveConflictNormalCount: 0,
  };

  constructor(
    config: ClientConfig = {
      connectionString: process.env.POSTGRES_HOST,
    }) {
    if (config.connectionString !== undefined && config.connectionString.startsWith('postgres')) {
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
    // Configuration stats saved for
    this.client = new Pool(config);
  }

  public initialize(): Promise<QueryResult<any>> {
    return this.client.query('CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default now(), PRIMARY KEY (game_id, save_id))')
      .then(() => this.client.query('CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))'))
      .then(() => this.client.query('CREATE INDEX IF NOT EXISTS games_i1 on games(save_id)'))
      .then(() => this.client.query('CREATE INDEX IF NOT EXISTS games_i2 on games(created_time)'))
      .catch((err) => {
        throw err;
      });
  }

  getPlayerCount(game_id: GameId): Promise<number> {
    const sql = 'SELECT players FROM games WHERE save_id = 0 AND game_id = $1 LIMIT 1';

    return this.client.query(sql, [game_id])
      .then((res) => {
        if (res.rows.length === 0) {
          throw new Error(`no rows found for game id ${game_id}`);
        }
        return res.rows[0].players;
      });
  }

  getGames(): Promise<Array<GameId>> {
    const sql: string = 'SELECT distinct game_id FROM games';
    return this.client.query(sql)
      .then((res) => {
        return res.rows.map((row) => row.game_id);
      }).catch((err) => {
        console.error('PostgreSQL:getGames', err);
        throw err;
      });
  }

  loadCloneableGame(game_id: GameId): Promise<SerializedGame> {
    // Retrieve first save from database
    return this.client.query('SELECT game_id, game FROM games WHERE game_id = $1 AND save_id = 0', [game_id])
      .then((res) => {
        if (res.rows.length === 0) {
          throw new Error(`Game ${game_id} not found`);
        }
        const json = JSON.parse(res.rows[0].game);
        return json;
      });
  }

  getGame(game_id: GameId, cb: (err: Error | undefined, game?: SerializedGame) => void): void {
    // Retrieve last save from database
    this.client.query('SELECT game game FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT 1', [game_id], (err, res) => {
      if (err) {
        console.error('PostgreSQL:getGame', err);
        return cb(err);
      }
      if (res.rows.length === 0 || res.rows[0] === undefined) {
        return cb(new Error('Game not found'));
      }
      cb(undefined, JSON.parse(res.rows[0].game));
    });
  }

  getGameId(id: string): Promise<GameId> {
    let sql = undefined;
    if (id.charAt(0) === 'p') {
      sql =
        `SELECT game_id
          FROM games, json_array_elements(CAST(game AS JSON)->'players') AS e
          WHERE save_id = 0 AND e->>'id' = $1`;
    } else if (id.charAt(0) === 's') {
      sql =
        `SELECT game_id
        FROM games
        WHERE save_id = 0 AND CAST(game AS JSON)->>'spectatorId' = $1`;
    } else {
      throw new Error(`id ${id} is neither a player id or spectator id`);
    }

    return this.client.query(sql, [id])
      .then((res: QueryResult<any>) => {
        if (res.rowCount === 0) {
          throw new Error(`Game for player id ${id} not found`);
        }
        return res.rows[0].game_id;
      }).catch((err) => {
        if (err) {
          console.error('PostgreSQL:getGameId', err);
          throw err;
        }
      });
  }

  public async getSaveIds(gameId: GameId): Promise<Array<number>> {
    const res = await this.client.query('SELECT distinct save_id FROM games WHERE game_id = $1', [gameId]);
    const allSaveIds: Array<number> = [];
    res.rows.forEach((row) => {
      allSaveIds.push(row.save_id);
    });
    return Promise.resolve(allSaveIds);
  }

  getGameVersion(game_id: GameId, save_id: number): Promise<SerializedGame> {
    return this.client.query('SELECT game game FROM games WHERE game_id = $1 and save_id = $2', [game_id, save_id])
      .then((res) => {
        if (res.rowCount === 0) {
          throw new Error(`Game ${game_id} not found at save_id ${save_id}`);
        }
        return JSON.parse(res.rows[0].game);
      });
  }

  saveGameResults(game_id: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    this.client.query('INSERT INTO game_results (game_id, seed_game_id, players, generations, game_options, scores) VALUES($1, $2, $3, $4, $5, $6)', [game_id, gameOptions.clonedGamedId, players, generations, gameOptions, JSON.stringify(scores)], (err) => {
      if (err) {
        console.error('PostgreSQL:saveGameResults', err);
        throw err;
      }
    });
  }

  getMaxSaveId(game_id: GameId, cb: DbLoadCallback<number>): void {
    this.client.query('SELECT MAX(save_id) as save_id FROM games WHERE game_id = $1', [game_id], (err: Error | null, res: QueryResult<any>) => {
      if (err) {
        return cb(err ?? undefined, undefined);
      }
      cb(undefined, res.rows[0].save_id);
    });
  }

  throwIf(err: any, condition: string) {
    if (err) {
      console.error('PostgreSQL', condition, err);
      throw err;
    }
  }

  cleanSaves(game_id: GameId): void {
    this.getMaxSaveId(game_id, ((err, save_id) => {
      this.throwIf(err, 'cleanSaves0');
      if (save_id === undefined) throw new Error('saveId is undefined for ' + game_id);
      // DELETE all saves except initial and last one
      this.client.query('DELETE FROM games WHERE game_id = $1 AND save_id < $2 AND save_id > 0', [game_id, save_id], (err) => {
        this.throwIf(err, 'cleanSaves1');
        // Flag game as finished
        this.client.query('UPDATE games SET status = \'finished\' WHERE game_id = $1', [game_id], (err2) => {
          this.throwIf(err2, 'cleanSaves2');
          // Purge after setting the status as finished so it does not delete the game.
          this.purgeUnfinishedGames();
        });
      });
    }));
  }

  // Purge unfinished games older than MAX_GAME_DAYS days. If this environment variable is absent, it uses the default of 10 days.
  purgeUnfinishedGames(maxGameDays: string | undefined = process.env.MAX_GAME_DAYS): void {
    const envDays = parseInt(maxGameDays || '');
    const days = Number.isInteger(envDays) ? envDays : 10;
    this.client.query('SELECT DISTINCT game_id FROM games WHERE created_time < now() - interval \'1 day\' * $1', [days])
      .then((result) => {
        result.rows.forEach((row) => {
          console.log(row.game_id);
        });
      })
      .then(() => {
        this.client.query('DELETE FROM games WHERE created_time < now() - interval \'1 day\' * $1', [days], function(err?: Error, res?: QueryResult<any>) {
          if (res) {
            console.log(`Purged ${res.rowCount} rows`);
          }
          if (err) {
            return console.warn(err.message);
          }
        });
      });
  }

  restoreGame(game_id: GameId, save_id: number, cb: DbLoadCallback<SerializedGame>): void {
    // Retrieve last save from database
    logForUndo(game_id, 'restore to', save_id);
    this.client.query('SELECT game game FROM games WHERE game_id = $1 AND save_id = $2 ORDER BY save_id DESC LIMIT 1', [game_id, save_id], (err, res) => {
      if (err) {
        console.error('PostgreSQL:restoreGame', err);
        cb(err, undefined);
        return;
      }
      if (res.rows.length === 0) {
        console.error('PostgreSQL:restoreGame', `Game ${game_id} not found`);
        cb(err, undefined);
        return;
      }
      try {
        // Transform string to json
        const game = JSON.parse(res.rows[0].game);
        logForUndo(game.id, 'restored to', game.lastSaveId, 'from', save_id);
        cb(undefined, game);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        cb(error, undefined);
      }
    });
  }

  async saveGame(game: Game): Promise<void> {
    const gameJSON = game.toJSON();
    this.statistics.saveCount++;
    if (game.gameOptions.undoOption) logForUndo(game.id, 'start save', game.lastSaveId);
    // xmax = 0 is described at https://stackoverflow.com/questions/39058213/postgresql-upsert-differentiate-inserted-and-updated-rows-using-system-columns-x
    return this.client.query(
      `INSERT INTO games (game_id, save_id, game, players)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (game_id, save_id) DO UPDATE SET game = $3
      RETURNING (xmax = 0) AS inserted`,
      [game.id, game.lastSaveId, gameJSON, game.getPlayers().length])
      .then((res) => {
        let inserted: boolean = true;
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

        game.lastSaveId++;
        if (game.gameOptions.undoOption) logForUndo(game.id, 'increment save id, now', game.lastSaveId);
      })
      .catch((err) => {
        this.statistics.saveErrorCount++;
        console.error('PostgreSQL:saveGame', err);
      });
  }

  deleteGameNbrSaves(game_id: GameId, rollbackCount: number): void {
    if (rollbackCount <= 0) {
      console.error(`invalid rollback count for ${game_id}: $rollbackCount`);
      return;
    }
    logForUndo(game_id, 'deleting', rollbackCount, 'saves');
    this.getSaveIds(game_id)
      .then((first) => {
        this.client.query('DELETE FROM games WHERE ctid IN (SELECT ctid FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT $2)', [game_id, rollbackCount], (err, res) => {
          if (err) {
            console.error(err.message);
          }
          logForUndo(game_id, 'deleted', res.rowCount, 'rows');
          this.getSaveIds(game_id)
            .then((second) => {
              const difference = first.filter((x) => !second.includes(x));
              logForUndo(game_id, 'second', second);
              logForUndo(game_id, 'Rollback difference', difference);
            });
        });
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
      'save-confict-normal-count': this.statistics.saveConflictNormalCount,
      'save-confict-undo-count': this.statistics.saveConflictUndoCount,
    };

    // TODO(kberg): return row counts
    return this.client.query(`
    SELECT
      pg_size_pretty(pg_total_relation_size(\'games\')) as game_size,
      pg_size_pretty(pg_total_relation_size(\'game_results\')) as game_result_size,
      pg_size_pretty(pg_database_size($1)) as db_size
    `, [this.databaseName])
      .then((result) => {
        map['size-bytes-games'] = result.rows[0].game_size;
        map['size-bytes-game-results'] = result.rows[0].game_result_size;
        map['size-bytes-database'] = result.rows[0].db_size;
        return map;
      });
  }
}

function logForUndo(gameId: string, ...message: any[]) {
  console.error(['TRACKING:', gameId, ...message]);
}
