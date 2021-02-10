import {DbLoadCallback, IDatabase} from './IDatabase';
import {Game, GameId, GameOptions, Score} from '../Game';
import {IGameData} from './IDatabase';
import {SerializedGame} from '../SerializedGame';

import sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const dbFolder = path.resolve(__dirname, '../../../db');
const dbPath = path.resolve(__dirname, '../../../db/game.db');

export class SQLite implements IDatabase {
  private db: sqlite3.Database;

  constructor() {
    // Create the table that will store every saves if not exists
    if (!fs.existsSync(dbFolder)) {
      fs.mkdirSync(dbFolder);
    }
    this.db = new sqlite3.Database(dbPath);
    this.db.run('CREATE TABLE IF NOT EXISTS games(game_id varchar, players integer, save_id integer, game text, status text default \'running\', created_time timestamp default (strftime(\'%s\', \'now\')), PRIMARY KEY (game_id, save_id))');
    this.db.run('CREATE TABLE IF NOT EXISTS game_results(game_id varchar not null, seed_game_id varchar, players integer, generations integer, game_options text, scores text, PRIMARY KEY (game_id))');
  }

  getClonableGames(cb: (err: Error | undefined, allGames: Array<IGameData>) => void) {
    const allGames: Array<IGameData> = [];
    const sql = 'SELECT distinct game_id game_id, players players FROM games WHERE save_id = 0 order by game_id asc';

    this.db.all(sql, [], (err, rows) => {
      if (rows) {
        rows.forEach((row) => {
          const gameId: GameId = row.game_id;
          const playerCount: number = row.players;
          const gameData: IGameData = {
            gameId,
            playerCount,
          };
          allGames.push(gameData);
        });
        return cb(err ?? undefined, allGames);
      }
    });
  }

  getGames(cb: (err: Error | undefined, allGames: Array<GameId>) => void) {
    const allGames: Array<GameId> = [];
    const sql: string = 'SELECT distinct game_id game_id FROM games WHERE status = \'running\'';
    this.db.all(sql, [], (err, rows) => {
      if (rows) {
        rows.forEach((row) => {
          allGames.push(row.game_id);
        });
        return cb(err ?? undefined, allGames);
      }
    });
  }

  loadCloneableGame(game_id: GameId, cb: DbLoadCallback<SerializedGame>) {
    // Retrieve first save from database
    this.db.get('SELECT game_id game_id, game game FROM games WHERE game_id = ? AND save_id = 0', [game_id], (err: Error | null, row: { game_id: GameId, game: any; }) => {
      if (row.game_id === undefined) {
        return cb(new Error('Game not found'), undefined);
      }

      try {
        const json = JSON.parse(row.game);
        return cb(err ?? undefined, json);
      } catch (exception) {
        console.error(`unable to load game ${game_id} at save point 0`, exception);
        cb(exception, undefined);
        return;
      }
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

  getGame(game_id: GameId, cb: (err: Error | undefined, game?: SerializedGame) => void): void {
    // Retrieve last save from database
    this.db.get('SELECT game game FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT 1', [game_id], (err: Error | null, row: { game: any; }) => {
      if (err) {
        return cb(err ?? undefined);
      }
      cb(undefined, JSON.parse(row.game));
    });
  }

  getGameVersion(game_id: GameId, save_id: number, cb: DbLoadCallback<SerializedGame>): void {
    this.db.get('SELECT game game FROM games WHERE game_id = ? and save_id = ?', [game_id, save_id], (err: Error | null, row: { game: any; }) => {
      if (err) {
        return cb(err ?? undefined, undefined);
      }
      cb(undefined, JSON.parse(row.game));
    });
  }

  cleanSaves(game_id: GameId, save_id: number): void {
    // DELETE all saves except initial and last one
    this.db.run('DELETE FROM games WHERE game_id = ? AND save_id < ? AND save_id > 0', [game_id, save_id], function(err: Error | null) {
      if (err) {
        return console.warn(err.message);
      }
    });
    // Flag game as finished
    this.db.run('UPDATE games SET status = \'finished\' WHERE game_id = ?', [game_id], function(err: Error | null) {
      if (err) {
        return console.warn(err.message);
      }
    });
    this.purgeUnfinishedGames();
  }

  purgeUnfinishedGames(): void {
    // Purge unfinished games older than MAX_GAME_DAYS days. If this .env variable is not present, unfinished games will not be purged.
    if (process.env.MAX_GAME_DAYS) {
      this.db.run('DELETE FROM games WHERE created_time < strftime(\'%s\',date(\'now\', \'-? day\')) and status = \'running\'', [process.env.MAX_GAME_DAYS], function(err: Error | null) {
        if (err) {
          return console.warn(err.message);
        }
      });
    }
  }

  restoreGame(game_id: GameId, save_id: number, cb: DbLoadCallback<Game>): void {
    // Retrieve last save from database
    this.db.get('SELECT game game FROM games WHERE game_id = ? AND save_id = ? ORDER BY save_id DESC LIMIT 1', [game_id, save_id], (err: Error | null, row: { game: any; }) => {
      if (err) {
        console.error(err.message);
        cb(err, undefined);
        return;
      }
      try {
        const json = JSON.parse(row.game);
        const game = Game.deserialize(json);
        cb(undefined, game);
      } catch (err) {
        cb(err, undefined);
      }
    });
  }

  saveGame(game: Game): void {
    const gameJSON = game.toJSON();
    // Insert
    this.db.run(
      'INSERT INTO games (game_id, save_id, game, players) VALUES (?, ?, ?, ?) ON CONFLICT (game_id, save_id) DO UPDATE SET game = ?',
      [game.id, game.lastSaveId, gameJSON, game.getPlayers().length, gameJSON],
      (err: Error | null) => {
        if (err) {
          console.error(err.message);
          return;
        }
      },
    );

    // This must occur after the save.
    game.lastSaveId++;
  }

  deleteGameNbrSaves(game_id: GameId, rollbackCount: number): void {
    if (rollbackCount > 0) {
      this.db.run('DELETE FROM games WHERE rowid IN (SELECT rowid FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT ?)', [game_id, rollbackCount], function(err: Error | null) {
        if (err) {
          return console.warn(err.message);
        }
      });
    }
  }
}
