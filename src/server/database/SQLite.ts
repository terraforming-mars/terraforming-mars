import {GameIdLedger, IDatabase} from './IDatabase';
import {Game, Score} from '../Game';
import {GameOptions} from '../GameOptions';
import {GameId, PlayerId, SpectatorId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';

import sqlite3 = require('sqlite3');
import {RunResult} from 'sqlite3';
import {daysAgoToSeconds} from './utils.ts';
import {MultiMap} from 'mnemonist';
const path = require('path');
const fs = require('fs');
const dbFolder = path.resolve(process.cwd(), './db');
const dbPath = path.resolve(dbFolder, 'game.db');

export const IN_MEMORY_SQLITE_PATH = ':memory:';

export class SQLite implements IDatabase {
  protected db: sqlite3.Database;

  constructor(private filename: string = dbPath, private throwQuietFailures: boolean = false) {
    if (filename !== IN_MEMORY_SQLITE_PATH) {
      if (!fs.existsSync(dbFolder)) {
        fs.mkdirSync(dbFolder);
      }
    }
    this.db = new sqlite3.Database(filename);
  }

  public async initialize(): Promise<void> {
    await this.asyncRun('CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default (strftime(\'%s\', \'now\')), PRIMARY KEY (game_id, save_id))');
    await this.asyncRun('CREATE TABLE IF NOT EXISTS participants(game_id varchar, participant varchar, PRIMARY KEY (game_id, participant))');
    await this.asyncRun('CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))');
    await this.asyncRun(
      `CREATE TABLE IF NOT EXISTS purges(
        game_id varchar not null,
        last_save_id number not null,
        completed_time timestamp not null default (strftime('%s', 'now')),
        PRIMARY KEY (game_id))`);
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

  // TODO(kberg): Remove repetition between this and getGameVersion.
  // this is basically getGameVersion with save ID 0.
  // This method has more content, so that has to be reconciled.
  public async loadCloneableGame(game_id: GameId): Promise<SerializedGame> {
    const sql = 'SELECT game_id, game FROM games WHERE game_id = ? AND save_id = 0';
    const row: { game_id: GameId, game: any; } = await this.asyncGet(sql, [game_id]);
    if (row === undefined || row.game_id === undefined || row.game === undefined) {
      throw new Error(`Game ${game_id} not found`);
    }

    const json = JSON.parse(row.game);
    return json;
  }

  saveGameResults(game_id: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    this.db.run(
      'INSERT INTO game_results (game_id, seed_game_id, players, generations, game_options, scores) VALUES($1, $2, $3, $4, $5, $6)',
      [game_id, gameOptions.clonedGamedId, players, generations, JSON.stringify(gameOptions), JSON.stringify(scores)], (err) => {
        if (err) {
          console.error('SQLite:saveGameResults', err);
          throw err;
        }
      },
    );
  }

  public async getGame(game_id: GameId): Promise<SerializedGame> {
    // Retrieve last save from database
    const row: { game: any; } = await this.asyncGet('SELECT game game FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT 1', [game_id]);
    if (row === undefined) {
      throw new Error(`bad game id ${game_id}`);
    }
    return JSON.parse(row.game);
  }

  // TODO(kberg): throw an error if two game ids exist.
  public async getGameId(id: PlayerId | SpectatorId): Promise<GameId> {
    // Default sql is for player id;
    let sql = 'SELECT game_id from games, json_each(games.game, \'$.players\') e where json_extract(e.value, \'$.id\') = ?';
    if (id.charAt(0) === 's') {
      sql = 'SELECT game_id from games where json_extract(games.game, \'$.spectatorId\') = ?';
    } else if (id.charAt(0) !== 'p') {
      throw new Error(`id ${id} is neither a player id or spectator id`);
    }

    const row: { game_id: any; } = await this.asyncGet(sql, [id]);
    if (row === undefined) {
      throw new Error(`No game id found for participant id ${id}`);
    }
    return row.game_id;
  }

  public async getSaveIds(gameId: GameId): Promise<Array<number>> {
    const rows = await this.asyncAll('SELECT distinct save_id FROM games WHERE game_id = ?', [gameId]);
    return rows.map((row) => row.save_id);
  }

  public async getGameVersion(game_id: GameId, save_id: number): Promise<SerializedGame> {
    const row: { game: any; } = await this.asyncGet(
      'SELECT game FROM games WHERE game_id = ? and save_id = ?',
      [game_id, save_id]);
    if (row === undefined) {
      throw new Error(`bad game id ${game_id}`);
    }
    return JSON.parse(row.game);
  }

  async getMaxSaveId(game_id: GameId): Promise<number> {
    const row: { save_id: any; } = await this.asyncGet('SELECT MAX(save_id) AS save_id FROM games WHERE game_id = ?', [game_id]);
    if (row === undefined) {
      throw new Error(`bad game id ${game_id}`);
    }
    return row.save_id;
  }

  async cleanGame(game_id: GameId): Promise<void> {
    try {
      const save_id = await this.getMaxSaveId(game_id);
      // Purges isn't used yet
      await this.asyncRun('INSERT into purges (game_id, last_save_id) values (?, ?)', [game_id, save_id]);
      // DELETE all saves except initial and last one
      await this.asyncRun('DELETE FROM games WHERE game_id = ? AND save_id < ? AND save_id > 0', [game_id, save_id]);
      await this.asyncRun('UPDATE games SET status = \'finished\' WHERE game_id = ?', [game_id]);
      await this.purgeUnfinishedGames();
    } catch (err) {
      console.error(`SQLite: cleanGame for ${game_id} ` + err);
    }
  }

  async purgeUnfinishedGames(maxGameDays: string | undefined = process.env.MAX_GAME_DAYS): Promise<void> {
    // Purge unfinished games older than MAX_GAME_DAYS days. If this .env variable is not present, unfinished games will not be purged.
    if (maxGameDays) {
      const dateToSeconds = daysAgoToSeconds(maxGameDays, 0);
      const selectResult = await this.asyncAll('SELECT distinct game_id game_id FROM games WHERE created_time < ? and status = \'running\'', [dateToSeconds]);
      const gameIds = selectResult.map((row) => row.game_id);
      console.log(`About to purge ${gameIds} games`);
      const placeholders = gameIds.map(() => '?').join(', ');
      if (gameIds.length > 0) {
        const deleteResult = await this.asyncRun(`DELETE FROM games WHERE game_id in ( ${placeholders} )`, [gameIds]);
        console.log(`Purged ${deleteResult.changes} rows from games`);
        const deleteParticipantsResult = await this.asyncRun(`DELETE FROM participants WHERE game_id in ( ${placeholders} )`, [gameIds]);
        console.log(`Purged ${deleteParticipantsResult.changes} rows from participants`);
      }
    } else {
      return Promise.resolve();
    }
  }

  restoreGame(game_id: GameId, save_id: number): Promise<SerializedGame> {
    // I don't think this is tested. Once it is use this.asyncGet
    return new Promise((resolve, reject) => {
      // Retrieve last save from database
      this.db.get('SELECT game game FROM games WHERE game_id = ? AND save_id = ? ORDER BY save_id DESC LIMIT 1', [game_id, save_id], (err: Error | null, row: { game: any; }) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        try {
          const json = JSON.parse(row.game);
          resolve(json);
        } catch (e) {
          const error = e instanceof Error ? e : new Error(String(e));
          reject(error);
        }
      });
    });
  }

  async saveGame(game: Game): Promise<void> {
    const gameJSON = game.toJSON();
    // Insert
    await this.runQuietly(
      'INSERT INTO games (game_id, save_id, game, players) VALUES (?, ?, ?, ?) ON CONFLICT (game_id, save_id) DO UPDATE SET game = ?',
      [game.id, game.lastSaveId, gameJSON, game.getPlayers().length, gameJSON]);

    // Save IDs on the very first save for this game. That's when the incoming saveId is 0, and also
    // when the database operation was an insert. (We should figure out why multiple saves occur and
    // try to stop them. But that's for another day.)
    if (game.lastSaveId === 0) {
      const participantIds: Array<PlayerId | SpectatorId> = game.getPlayers().map((p) => p.id);
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

  deleteGameNbrSaves(game_id: GameId, rollbackCount: number): Promise<void> {
    if (rollbackCount <= 0) {
      console.error(`invalid rollback count for ${game_id}: ${rollbackCount}`);
      // Should this be an error?
      return Promise.resolve();
    }
    return this.runQuietly('DELETE FROM games WHERE rowid IN (SELECT rowid FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT ?)', [game_id, rollbackCount]);
  }

  public stats(): Promise<{[key: string]: string | number}> {
    const size = this.filename === IN_MEMORY_SQLITE_PATH ? -1 : fs.statSync(this.filename).size;

    return Promise.resolve({
      type: 'SQLite',
      path: this.filename,
      size_bytes: size,
    });
  }

  public async storeParticipants(entry: GameIdLedger): Promise<void> {
    // Sequence of '(?, ?)' pairs.
    const placeholders = entry.participantIds.map(() => '(?, ?)').join(', ');
    // Sequence of [game_id, id] pairs.
    const values: Array<GameId | PlayerId | SpectatorId> = entry.participantIds.map((participant) => [entry.gameId, participant]).flat();

    await this.asyncRun('INSERT INTO participants (game_id, participant) VALUES ' + placeholders, values);
  }

  public async getParticipants(): Promise<Array<GameIdLedger>> {
    const rows = await this.asyncAll('SELECT game_id, participant FROM participants');
    const multimap = new MultiMap<GameId, PlayerId | SpectatorId>();
    rows.forEach((row) => multimap.set(row.game_id, row.participant));
    const result: Array<GameIdLedger> = [];
    multimap.forEachAssociation((participantIds, gameId) => {
      result.push({gameId, participantIds});
    });
    return result;
  }

  private asyncRun(sql: string, params?: any): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      // It is intentional that this is declared `function` and that the first
      // parameter is `this`.
      // See https://stackoverflow.com/questions/73523387/in-node-sqlite3-does-runs-first-callback-parameter-return-error
      function cb(this: RunResult, err: Error | null) {
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

  private asyncGet(sql: string, params?: any): Promise<any> {
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

  private asyncAll(sql: string, params?: any): Promise<Array<any>> {
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
  private async runQuietly(sql: string, params: any): Promise<void> {
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
