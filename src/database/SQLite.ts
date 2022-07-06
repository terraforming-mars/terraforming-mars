import {IDatabase} from './IDatabase';
import {Game, GameOptions, Score} from '../Game';
import {GameId, PlayerId, SpectatorId} from '../common/Types';
import {SerializedGame} from '../SerializedGame';

import sqlite3 = require('sqlite3');
import {daysAgoToSeconds} from './utils.ts';
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

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default (strftime(\'%s\', \'now\')), PRIMARY KEY (game_id, save_id))', (err) => {
        if (err) {
          reject(err);
          return;
        }
        this.db.run('CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))', (err2) => {
          if (err2) {
            reject(err2);
            return;
          }
          this.db.run(`
          CREATE TABLE IF NOT EXISTS purges(
            game_id varchar not null,
            last_save_id number not null,
            completed_time timestamp not null default (strftime('%s', 'now')),
            PRIMARY KEY (game_id)
          )`, (err3) => {
            if (err3) {
              reject(err3);
              return;
            }
            resolve();
          });
        });
      });
    });
  }

  getPlayerCount(gameId: GameId): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT players FROM games WHERE save_id = 0 AND game_id = ? LIMIT 1';

      this.db.get(sql, [gameId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(row.players);
        } else {
          reject(new Error(`unknown error loadign player count for ${gameId}`));
        }
      });
    });
  }

  getGames(): Promise<Array<GameId>> {
    return new Promise((resolve, reject) => {
      const sql: string = 'SELECT distinct game_id game_id FROM games';

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(new Error('Error in getGames: ' + err.message));
        } else {
          const allGames: Array<GameId> = [];
          rows.forEach((row) => {
            allGames.push(row.game_id);
          });
          resolve(allGames);
        }
      });
    });
  }

  loadCloneableGame(game_id: GameId): Promise<SerializedGame> {
    return new Promise((resolve, reject) => {
    // Retrieve first save from database
      this.db.get('SELECT game_id game_id, game game FROM games WHERE game_id = ? AND save_id = 0', [game_id], (err: Error | null, row: { game_id: GameId, game: any; }) => {
        if (err) {
          reject(err);
          return;
        }
        if (row?.game_id === undefined) {
          reject(new Error(`Game ${game_id} not found`));
          return;
        }

        try {
          const json = JSON.parse(row.game);
          resolve(json);
        } catch (exception) {
          console.error(`unable to load game ${game_id} at save point 0`, exception);
          const error = exception instanceof Error ? exception : new Error(String(exception));
          reject(error);
        }
      });
    });
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

  getGame(game_id: GameId): Promise<SerializedGame> {
    return new Promise((resolve, reject) => {
      // Retrieve last save from database
      this.db.get('SELECT game game FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT 1', [game_id], (err: Error | null, row: { game: any; }) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(row.game));
        }
      });
    });
  }

  // TODO(kberg): throw an error if two game ids exist.
  getGameId(id: PlayerId | SpectatorId): Promise<GameId> {
    // Default sql is for player id;
    let sql: string = 'SELECT game_id from games, json_each(games.game, \'$.players\') e where json_extract(e.value, \'$.id\') = ?';
    if (id.charAt(0) === 's') {
      sql = 'SELECT game_id from games where json_extract(games.game, \'$.spectatorId\') = ?';
    } else if (id.charAt(0) === 'p') {
      throw new Error(`id ${id} is neither a player id or spectator id`);
    }
    return new Promise((resolve, reject) => {
      this.db.get(sql, [id], (err: Error | null, row: { gameId: any; }) => {
        if (err) {
          reject(err);
        }
        resolve(row.gameId);
      });
    });
  }

  public getSaveIds(gameId: GameId): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      const allSaveIds: Array<number> = [];
      const sql: string = 'SELECT distinct save_id FROM games WHERE game_id = ?';
      this.db.all(sql, [gameId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows) {
          rows.forEach((row) => {
            allSaveIds.push(row.save_id);
          });
        }
        resolve(allSaveIds);
      });
    });
  }

  getGameVersion(game_id: GameId, save_id: number): Promise<SerializedGame> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT game game FROM games WHERE game_id = ? and save_id = ?',
        [game_id, save_id],
        (err: Error | null, row: { game: any; }) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(row.game));
          }
        });
    });
  }

  getMaxSaveId(game_id: GameId, cb: (err: Error | undefined, id: number | undefined) => void): void {
    this.db.get('SELECT MAX(save_id) AS save_id FROM games WHERE game_id = ?', [game_id], (err: Error | null, row: { save_id: number; }) => {
      if (err) {
        return cb(err ?? undefined, undefined);
      }
      cb(undefined, row.save_id);
    });
  }

  cleanGame(game_id: GameId): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getMaxSaveId(game_id, ((err, save_id) => {
        if (err) {
          reject(new Error('SQLite: cleanGame:' + err.message));
        }
        if (save_id === undefined) throw new Error('saveId is undefined for ' + game_id);
        // Purges isn't used yet
        this.runQuietly('INSERT into purges (game_id, last_save_id) values (?, ?)', [game_id, save_id]);
        // DELETE all saves except initial and last one
        this.db.run('DELETE FROM games WHERE game_id = ? AND save_id < ? AND save_id > 0', [game_id, save_id], (err) => {
          if (err) console.warn('SQLite: cleanGame1: ', err.message);
          // Flag game as finished
          this.db.run('UPDATE games SET status = \'finished\' WHERE game_id = ?', [game_id], async (err) => {
            if (err) console.warn('SQLite: cleanGame2: ', err.message);
            await this.purgeUnfinishedGames();
            resolve();
          });
        });
      }));
    });
  }

  async purgeUnfinishedGames(maxGameDays: string | undefined = process.env.MAX_GAME_DAYS): Promise<void> {
    // Purge unfinished games older than MAX_GAME_DAYS days. If this .env variable is not present, unfinished games will not be purged.
    if (maxGameDays) {
      const dateToSeconds = daysAgoToSeconds(maxGameDays, 0);
      return this.runQuietly(`DELETE FROM games WHERE created_time < ? and status = 'running'`, [dateToSeconds]);
    } else {
      return Promise.resolve();
    }
  }

  async restoreGame(game_id: GameId, save_id: number): Promise<SerializedGame> {
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

    // This must occur after the save.
    game.lastSaveId++;
  }

  deleteGameNbrSaves(game_id: GameId, rollbackCount: number): void {
    if (rollbackCount > 0) {
      this.runQuietly('DELETE FROM games WHERE rowid IN (SELECT rowid FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT ?)', [game_id, rollbackCount]);
    }
  }

  public stats(): Promise<{[key: string]: string | number}> {
    const size = this.filename === IN_MEMORY_SQLITE_PATH ? -1 : fs.statSync(this.filename).size;

    return Promise.resolve({
      type: 'SQLite',
      path: this.filename,
      size_bytes: size,
    });
  }

  // Run the given SQL but do not return errors.
  runQuietly(sql: string, params: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        sql, params,
        (err: Error | null) => {
          if (err) {
            console.error(err);
            console.error('for sql: ' + sql);
            if (this.throwQuietFailures) {
              reject(err);
              return;
            }
          } else {
            resolve();
          }
        },
      );
    });
  }
}
