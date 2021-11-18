import {DbLoadCallback, IDatabase} from './IDatabase';
import {Game, GameId, GameOptions, Score} from '../Game';
import {IGameData} from './IDatabase';
import {SerializedGame} from '../SerializedGame';

import {Pool, ClientConfig, QueryResult} from 'pg';

export class PostgreSQL implements IDatabase {
  private client: Pool;

  constructor(
    config: ClientConfig = {
      connectionString: process.env.POSTGRES_HOST,
    },
    private beLoud: boolean = false) {
    if (config.connectionString !== undefined && config.connectionString.startsWith('postgres')) {
      config.ssl = {
        // heroku uses self-signed certificates
        rejectUnauthorized: false,
      };
    }
    this.client = new Pool(config);
  }

  async initialize(): Promise<void> {
    this.runLoudly('initialize1', 'CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default now(), PRIMARY KEY (game_id, save_id))')
      .then(() => this.runLoudly('initialize2', 'CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))'))
      .then(() => this.runLoudly('initialize3', 'CREATE INDEX IF NOT EXISTS games_i1 on games(save_id)'))
      .then(() => this.runLoudly('initialize4', 'CREATE INDEX IF NOT EXISTS games_i2 on games(created_time )'));
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
      if (res.rows.length === 0) {
        return cb(new Error('Game not found'));
      }
      cb(undefined, JSON.parse(res.rows[0].game));
    });
  }

  // TODO(kberg): throw an error if two game ids exist.
  getGameId(playerId: string, cb: (err: Error | undefined, gameId?: GameId) => void): void {
    const sql =
      `SELECT game_id
      FROM games, json_array_elements(CAST(game AS JSON)->'players') AS e
      WHERE save_id = 0 AND e->>'id' = $1`;

    this.client.query(sql, [playerId], (err: Error | null, res: QueryResult<any>) => {
      if (err) {
        console.error('PostgreSQL:getGameId', err);
        return cb(err ?? undefined);
      }
      if (res.rowCount === 0) {
        return cb(new Error('Game not found'));
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
      cb(undefined, JSON.parse(res.rows[0].game));
    });
  }

  saveGameResults(game_id: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    this.runQuietly('saveGameResults', 'INSERT INTO game_results (game_id, seed_game_id, players, generations, game_options, scores) VALUES($1, $2, $3, $4, $5, $6)', [game_id, gameOptions.clonedGamedId, players, generations, gameOptions, JSON.stringify(scores)]);
  }

  cleanSaves(game_id: GameId, save_id: number): Promise<void> {
    // DELETE all saves except initial and last one
    const cleanGame = this.runQuietly('cleanSaves', 'DELETE FROM games WHERE game_id = $1 AND save_id < $2 AND save_id > 0', [game_id, save_id]);
    // Flag game as finished
    const setStatus = this.runQuietly('cleanSaves2', 'UPDATE games SET status = \'finished\' WHERE game_id = $1', [game_id]);
    return cleanGame
      .then(() => setStatus)
      .then(this.purgeUnfinishedGames);
  }

  // Purge unfinished games older than MAX_GAME_DAYS days. If this environment variable is absent, it uses the default of 10 days.
  purgeUnfinishedGames(): Promise<void> {
    const envDays = parseInt(process.env.MAX_GAME_DAYS || '');
    const days = Number.isInteger(envDays) ? envDays : 10;
    return this.runQuietly('purgeUnfinishedGames', 'DELETE FROM games WHERE created_time < now() - interval \'1 day\' * $1', [days])
      .then((res: QueryResult<any>) => console.log(`Purged ${res.rowCount} rows`));
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

  async saveGame(game: Game): Promise<void> {
    const gameJSON = game.toJSON();
    return this.runQuietly('saveGame',
      'INSERT INTO games (game_id, save_id, game, players) VALUES ($1, $2, $3, $4) ON CONFLICT (game_id, save_id) DO UPDATE SET game = $3',
      [game.id, game.lastSaveId, gameJSON, game.getPlayers().length]).then(() => {
      // This must occur after the save.
      game.lastSaveId++;
    });
  }

  deleteGameNbrSaves(game_id: GameId, rollbackCount: number): void {
    if (rollbackCount > 0) {
      this.runQuietly('deleteGameNbrSaves', 'DELETE FROM games WHERE ctid IN (SELECT ctid FROM games WHERE game_id = $1 ORDER BY save_id DESC LIMIT $2)', [game_id, rollbackCount]);
    }
  }

  runLoudly(source: string, sql: string, params: any = []): Promise<QueryResult<any>> {
    return this.run(source, sql, params, true);
  }
  runQuietly(source: string, sql: string, params: any = []): Promise<QueryResult<any>> {
    return this.run(source, sql, params, false);
  }
  run(source: string, sql: string, params: any, loud: boolean): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
      this.client.query(
        sql, params,
        (err: Error, res: QueryResult<any>) => {
          if (err) {
            console.error('PostgreSQL ' + source + ': ' + err);
            if (loud || this.beLoud) {
              reject(err);
              return;
            }
          } else {
            resolve(res);
          }
        },
      );
    });
  }
}
