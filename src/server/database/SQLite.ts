import * as fs from 'fs';
import * as path from 'path';
import type * as sqlite3 from 'sqlite3';

import {GameIdLedger, IDatabase} from './IDatabase';
import {IGame, Score} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {GameId, ParticipantId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';
import {daysAgoToSeconds} from './utils';
import {MultiMap} from 'mnemonist';
import {Session, SessionId} from '../auth/Session';
import {toID} from '../../common/utils/utils';

export const IN_MEMORY_SQLITE_PATH = ':memory:';

export class SQLite implements IDatabase {
  private _db: sqlite3.Database | undefined;

  protected get db(): sqlite3.Database {
    if (this._db === undefined) {
      throw new Error('attempt to get db before initialize');
    }
    return this._db;
  }

  constructor(private filename: undefined | string = undefined, private throwQuietFailures: boolean = false) {
  }

  public async initialize(): Promise<void> {
    const {Database} = await import('sqlite3');
    const dbFolder = path.resolve(process.cwd(), './db');
    const dbPath = path.resolve(dbFolder, 'game.db');
    if (this.filename === undefined) {
      this.filename = dbPath;
    }
    if (this.filename !== IN_MEMORY_SQLITE_PATH) {
      if (!fs.existsSync(dbFolder)) {
        fs.mkdirSync(dbFolder);
      }
    }
    this._db = new Database(String(this.filename));
    await this.asyncRun('CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default (strftime(\'%s\', \'now\')), PRIMARY KEY (game_id, save_id))');
    await this.asyncRun('CREATE TABLE IF NOT EXISTS participants(game_id varchar, participant varchar, PRIMARY KEY (game_id, participant))');
    await this.asyncRun('CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))');
    await this.asyncRun(
      `CREATE TABLE IF NOT EXISTS completed_game(
      game_id varchar not null,
      completed_time timestamp not null default (strftime('%s', 'now')),
      PRIMARY KEY (game_id))`);
    await this.asyncRun('DROP TABLE IF EXISTS purges');

    await this.asyncRun(
      `CREATE TABLE IF NOT EXISTS session(
        session_id varchar not null,
        data varchar not null,
        expiration_time timestamp not null,
        PRIMARY KEY (session_id)
      )`);
  }

  public async getPlayerCount(gameId: GameId): Promise<number> {
    const sql = 'SELECT players FROM games WHERE save_id = 0 AND game_id = ? LIMIT 1';
    const row = await this.asyncGet(sql, [gameId]);
    if (row === undefined) {
      throw new Error(`bad game id ${gameId}`);
    }
    return row.players;
  }

  public async getGameIds(): Promise<Array<GameId>> {
    const sql = 'SELECT distinct game_id game_id FROM games';
    const rows = await this.asyncAll(sql, []);
    return rows.map((row) => row.game_id);
  }

  saveGameResults(gameId: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    this.db.run(
      'INSERT INTO game_results (game_id, seed_game_id, players, generations, game_options, scores) VALUES($1, $2, $3, $4, $5, $6)',
      [gameId, gameOptions.clonedGamedId, players, generations, JSON.stringify(gameOptions), JSON.stringify(scores)], (err) => {
        if (err) {
          console.error('SQLite:saveGameResults', err);
          throw err;
        }
      },
    );
  }

  public async getGame(gameId: GameId): Promise<SerializedGame> {
    // Retrieve last save from database
    const row: { game: any; } = await this.asyncGet('SELECT game game FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT 1', [gameId]);
    if (row === undefined) {
      throw new Error(`bad game id ${gameId}`);
    }
    return JSON.parse(row.game);
  }

  public async getGameId(participantId: ParticipantId): Promise<GameId> {
    // Default sql is for player id;
    let sql = 'SELECT game_id from games, json_each(games.game, \'$.players\') e where json_extract(e.value, \'$.id\') = ?';
    if (participantId.charAt(0) === 's') {
      sql = 'SELECT game_id from games where json_extract(games.game, \'$.spectatorId\') = ?';
    } else if (participantId.charAt(0) !== 'p') {
      throw new Error(`id ${participantId} is neither a player id or spectator id`);
    }

    const row: { game_id: any; } = await this.asyncGet(sql, [participantId]);
    if (row === undefined) {
      throw new Error(`No game id found for participant id ${participantId}`);
    }
    return row.game_id;
  }

  public async getSaveIds(gameId: GameId): Promise<Array<number>> {
    const rows = await this.asyncAll('SELECT distinct save_id FROM games WHERE game_id = ?', [gameId]);
    return rows.map((row) => row.save_id);
  }

  public async getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    const sql = 'SELECT game_id, game FROM games WHERE game_id = ? and save_id = ?';
    const row: { game_id: GameId, game: any; } = await this.asyncGet(sql, [gameId, saveId]);
    if (row === undefined || row.game_id === undefined || row.game === undefined) {
      throw new Error(`Game ${gameId} not found`);
    }
    return JSON.parse(row.game);
  }

  async getMaxSaveId(gameId: GameId): Promise<number> {
    const row: { save_id: any; } = await this.asyncGet('SELECT MAX(save_id) AS save_id FROM games WHERE game_id = ?', [gameId]);
    if (row === undefined) {
      throw new Error(`bad game id ${gameId}`);
    }
    return row.save_id;
  }

  async markFinished(gameId: GameId): Promise<void> {
    const promise1 = this.asyncRun('INSERT into completed_game (game_id) values (?)', [gameId]);
    const promise2 = this.asyncRun('UPDATE games SET status = \'finished\' WHERE game_id = ?', [gameId]);
    await Promise.all([promise1, promise2]);
  }


  async purgeUnfinishedGames(maxGameDays: string | undefined = process.env.MAX_GAME_DAYS): Promise<Array<GameId>> {
    // Purge unfinished games older than MAX_GAME_DAYS days. If this .env variable is not present, unfinished games will not be purged.
    if (maxGameDays !== undefined) {
      const dateToSeconds = daysAgoToSeconds(maxGameDays, 0);
      const selectResult = await this.asyncAll('SELECT DISTINCT game_id game_id FROM games WHERE created_time < ? and status = \'running\'', [dateToSeconds]);
      let gameIds = selectResult.map((row) => row.game_id);
      if (gameIds.length > 1000) {
        console.log('Truncated purge to 1000 games.');
        gameIds = gameIds.slice(0, 1000);
      } else {
        console.log(`${gameIds.length} games to be purged.`);
      }

      if (gameIds.length > 0) {
        console.log(`About to purge ${gameIds.length} games`);
        const placeholders = gameIds.map(() => '?').join(', ');
        const deleteResult = await this.asyncRun(`DELETE FROM games WHERE game_id in ( ${placeholders} )`, [...gameIds]);
        console.log(`Purged ${deleteResult.changes} rows from games`);
        const deleteParticipantsResult = await this.asyncRun(`DELETE FROM participants WHERE game_id in ( ${placeholders} )`, [...gameIds]);
        console.log(`Purged ${deleteParticipantsResult.changes} rows from participants`);
      }
      return gameIds;
    } else {
      return Promise.resolve([]);
    }
  }

  async compressCompletedGames(compressCompletedGamesDays: string | undefined = process.env.COMPRESS_COMPLETED_GAMES_DAYS): Promise<void> {
    if (compressCompletedGamesDays === undefined) {
      return;
    }
    const dateToSeconds = daysAgoToSeconds(compressCompletedGamesDays, 0);
    const selectResult = await this.asyncAll('SELECT DISTINCT game_id FROM completed_game WHERE completed_time < ?', [dateToSeconds]);
    const gameIds = selectResult.map((row) => row.game_id);
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

  async compressCompletedGame(gameId: GameId): Promise<sqlite3.RunResult> {
    const maxSaveId = await this.getMaxSaveId(gameId);
    return this.asyncRun('DELETE FROM games WHERE game_id = ? AND save_id < ? AND save_id > 0', [gameId, maxSaveId])
      .then(() => {
        return this.asyncRun('DELETE FROM completed_games where game_id = ?', [gameId]);
      });
  }

  async saveGame(game: IGame): Promise<void> {
    const gameJSON = JSON.stringify(game.serialize());
    // Insert
    await this.runQuietly(
      'INSERT INTO games (game_id, save_id, game, players) VALUES (?, ?, ?, ?) ON CONFLICT (game_id, save_id) DO UPDATE SET game = ?',
      [game.id, game.lastSaveId, gameJSON, game.getPlayers().length, gameJSON]);

    // Save IDs on the very first save for this game. That's when the incoming saveId is 0, and also
    // when the database operation was an insert. (We should figure out why multiple saves occur and
    // try to stop them. But that's for another day.)
    if (game.lastSaveId === 0) {
      const participantIds: Array<ParticipantId> = game.getPlayers().map(toID);
      if (game.spectatorId) participantIds.push(game.spectatorId);
      try {
        await this.storeParticipants({gameId: game.id, participantIds: participantIds});
      } catch (e) {
        console.error(e);
      }
    }

    // This must occur after the save.
    game.lastSaveId++;
  }

  deleteGameNbrSaves(gameId: GameId, rollbackCount: number): Promise<void> {
    if (rollbackCount <= 0) {
      console.error(`invalid rollback count for ${gameId}: ${rollbackCount}`);
      // Should this be an error?
      return Promise.resolve();
    }
    return this.runQuietly('DELETE FROM games WHERE rowid IN (SELECT rowid FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT ?)', [gameId, rollbackCount]);
  }

  public stats(): Promise<{[key: string]: string | number}> {
    const size = this.filename === IN_MEMORY_SQLITE_PATH ? -1 : fs.statSync(String(this.filename)).size;

    return Promise.resolve({
      type: 'SQLite',
      path: String(this.filename),
      size_bytes: size,
    });
  }

  public async storeParticipants(entry: GameIdLedger): Promise<void> {
    // Sequence of '(?, ?)' pairs.
    const placeholders = entry.participantIds.map(() => '(?, ?)').join(', ');
    // Sequence of [game_id, id] pairs.
    const values: Array<GameId | ParticipantId> = entry.participantIds.map((participant) => [entry.gameId, participant]).flat();

    await this.asyncRun('INSERT INTO participants (game_id, participant) VALUES ' + placeholders, values);
  }

  public async getParticipants(): Promise<Array<GameIdLedger>> {
    const rows = await this.asyncAll('SELECT game_id, participant FROM participants');
    const multimap = new MultiMap<GameId, ParticipantId>();
    rows.forEach((row) => multimap.set(row.game_id, row.participant));
    const result: Array<GameIdLedger> = [];
    multimap.forEachAssociation((participantIds, gameId) => {
      result.push({gameId, participantIds});
    });
    return result;
  }

  public async createSession(session: Session): Promise<void> {
    await this.asyncRun('INSERT INTO session (session_id, data, expiration_time) VALUES($1, $2, $3)', [session.id, JSON.stringify(session.data), session.expirationTimeMillis / 1000]);
  }

  public async deleteSession(sessionId: SessionId): Promise<void> {
    await this.asyncRun('DELETE FROM session where session_id = $1', [sessionId]);
  }

  async getSessions(): Promise<Array<Session>> {
    const selectResult = await this.asyncAll('SELECT session_id, data, expiration_time FROM session where expiration_time > ?', [Date.now() / 1000]);
    return selectResult.map((row) => {
      return {
        id: row.session_id,
        data: JSON.parse(row.data),
        expirationTimeMillis: row.expiration_time * 1000,
      };
    });
  }

  protected asyncRun(sql: string, params?: any): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      // It is intentional that this is declared `function` and that the first
      // parameter is `this`.
      // See https://stackoverflow.com/questions/73523387/in-node-sqlite3-does-runs-first-callback-parameter-return-error
      function cb(this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          reject(err);
        } else {
          // eslint-disable-next-line no-invalid-this
          resolve(this);
        }
      }

      if (params !== undefined) {
        this.db.run(sql, params, cb);
      } else {
        this.db.run(sql, cb);
      }
    });
  }

  protected asyncGet(sql: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, function(err: Error | null, row: any) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  protected asyncAll(sql: string, params?: any): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, function(err, rows: Array<any>) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Run the given SQL but do not return errors.
  protected async runQuietly(sql: string, params: any): Promise<void> {
    try {
      await this.asyncRun(sql, params);
    } catch (err) {
      console.error(err);
      console.error('for sql: ' + sql);
      if (this.throwQuietFailures) {
        throw err;
      }
    }
  }
}
