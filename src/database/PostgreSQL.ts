import {DbLoadCallback, IDatabase} from './IDatabase';
import {Game, GameOptions, Score} from '../Game';
import {GameId} from '../common/Types';
import {IGameData} from '../common/game/IGameData';
import {SerializedGame} from '../SerializedGame';

import {Pool, ClientConfig, QueryResult} from 'pg';

export class PostgreSQL implements IDatabase {
  private client: Pool;

  constructor() {
    const config: ClientConfig = {
      connectionString: process.env.POSTGRES_HOST,
    };
    if (config.connectionString !== undefined && config.connectionString.startsWith('postgres')) {
      config.ssl = {
        // heroku uses self-signed certificates
        rejectUnauthorized: false,
      };
    }
    this.client = new Pool(config);
    this.client.query('CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default now(), PRIMARY KEY (game_id, save_id))', (err) => {
      if (err) {
        throw err;
      }
    });
    this.client.query('CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))', (err) => {
      if (err) {
        throw err;
      }
    });

    this.client.query('CREATE INDEX IF NOT EXISTS games_i1 on games(save_id)', (err) => {
      if (err) {
        throw err;
      }
    });
    this.client.query('CREATE INDEX IF NOT EXISTS games_i2 on games(created_time )', (err) => {
      if (err) {
        throw err;
      }
    });
  }

  async initialize(): Promise<void> {

  }

  getClonableGames(cb: (err: Error | undefined, allGames: Array<IGameData>) => void) {
    const allGames: Array<IGameData> = [];
    const sql = 'SELECT distinct game_id game_id, players players FROM games WHERE save_id = 0 order by game_id asc';

    this.client.query(sql, (err, res) => {
      if (err) {
        console.error('PostgreSQL:getClonableGames', err);
        cb(err, []);
        return;
      }
      for (const row of res.rows) {
        const gameId: GameId = row.game_id;
        const playerCount: number = row.players;
        const gameData: IGameData = {
          gameId,
          playerCount,
        };
        allGames.push(gameData);
      }
      cb(undefined, allGames);
    });
  }

  getClonableGameByGameId(game_id: GameId, cb: (err: Error | undefined, gameData: IGameData | undefined) => void) {
    const sql = 'SELECT players FROM games WHERE save_id = 0 AND game_id = $1 LIMIT 1';

    this.client.query(sql, [game_id], (err, res) => {
      if (err) {
        console.error('PostgreSQL:getClonableGameByGameId', err);
        cb(err, undefined);
        return;
      }
      if (res.rows.length === 0) {
        cb(undefined, undefined);
        return;
      }
      cb(undefined, {
        gameId: res.rows[0].game_id,
        playerCount: res.rows[0].players,
      });
    });
  }

  getGames(cb: (err: Error | undefined, allGames: Array<GameId>) => void) {
    const allGames: Array<GameId> = [];
    const sql: string = 'SELECT games.game_id FROM games, (SELECT max(save_id) save_id, game_id FROM games WHERE status=\'running\' GROUP BY game_id) a WHERE games.game_id = a.game_id AND games.save_id = a.save_id ORDER BY created_time DESC';
    this.client.query(sql, (err, res) => {
      if (err) {
        console.error('PostgreSQL:getGames', err);
        cb(err, []);
        return;
      }
      for (const row of res.rows) {
        allGames.push(row.game_id);
      }
      cb(undefined, allGames);
    });
  }

  loadCloneableGame(game_id: GameId, cb: DbLoadCallback<SerializedGame>) {
    // Retrieve first save from database
    this.client.query('SELECT game_id game_id, game game FROM games WHERE game_id = $1 AND save_id = 0', [game_id], (err: Error | undefined, res) => {
      if (err) {
        console.error('PostgreSQL:restoreReferenceGame', err);
        return cb(err, undefined);
      }
      if (res.rows.length === 0) {
        return cb(new Error(`Game ${game_id} not found`), undefined);
      }
      try {
        const json = JSON.parse(res.rows[0].game);
        return cb(undefined, json);
      } catch (exception) {
        const error = exception instanceof Error ? exception : new Error(String(exception));
        console.error(`Unable to restore game ${game_id}`, error);
        cb(error, undefined);
        return;
      }
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

  // TODO(kberg): throw an error if two game ids exist.
  getGameId(id: string, cb: (err: Error | undefined, gameId?: GameId) => void): void {
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

    this.client.query(sql, [id], (err: Error | null, res: QueryResult<any>) => {
      if (err) {
        console.error('PostgreSQL:getGameId', err);
        return cb(err ?? undefined);
      }
      if (res.rowCount === 0) {
        return cb(new Error(`Game for player id ${id} not found`));
      }
      const gameId = res.rows[0].game_id;
      cb(undefined, gameId);
    });
  }

  getGameVersion(game_id: GameId, save_id: number, cb: DbLoadCallback<SerializedGame>): void {
    this.client.query('SELECT game game FROM games WHERE game_id = $1 and save_id = $2', [game_id, save_id], (err: Error | null, res: QueryResult<any>) => {
      if (err) {
        console.error('PostgreSQL:getGameVersion', err);
        return cb(err, undefined);
      }
      if (res.rowCount === 0) {
        return cb(new Error(`Game ${game_id} not found at save_id ${save_id}`), undefined);
      }
      cb(undefined, JSON.parse(res.rows[0].game));
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
  purgeUnfinishedGames(): void {
    const envDays = parseInt(process.env.MAX_GAME_DAYS || '');
    const days = Number.isInteger(envDays) ? envDays : 10;
    this.client.query('DELETE FROM games WHERE created_time < now() - interval \'1 day\' * $1', [days], function(err?: Error, res?: QueryResult<any>) {
      if (res) {
        console.log(`Purged ${res.rowCount} rows`);
      }
      if (err) {
        return console.warn(err.message);
      }
    });
  }

  restoreGame(game_id: GameId, save_id: number, cb: DbLoadCallback<Game>): void {
    // Retrieve last save from database
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
        const json = JSON.parse(res.rows[0].game);
        const game = Game.deserialize(json);
        cb(undefined, game);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        cb(error, undefined);
      }
    });
  }

  saveGame(game: Game): Promise<void> {
    const gameJSON = game.toJSON();
    this.client.query(
      'INSERT INTO games (game_id, save_id, game, players) VALUES ($1, $2, $3, $4) ON CONFLICT (game_id, save_id) DO UPDATE SET game = $3',
      [game.id, game.lastSaveId, gameJSON, game.getPlayers().length], (err) => {
        if (err) {
          console.error('PostgreSQL:saveGame', err);
          return;
        }
      },
    );

    // This must occur after the save.
    game.lastSaveId++;
    return Promise.resolve();
  }

  deleteGameNbrSaves(game_id: GameId, rollbackCount: number): void {
    if (rollbackCount > 0) {
      this.client.query('DELETE FROM games WHERE ctid IN (SELECT ctid FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT $2)', [game_id, rollbackCount], (err) => {
        if (err) {
          return console.warn(err.message);
        }
      });
    }
  }
}
