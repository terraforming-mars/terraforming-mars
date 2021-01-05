import {DbLoadCallback, IDatabase} from './IDatabase';
import {Game, GameId, GameOptions, Score} from '../Game';
import {IGameData} from './IDatabase';
import {SerializedGame} from '../SerializedGame';
import {Dirent} from 'fs';

const path = require('path');
const fs = require('fs');
const dbFolder = path.resolve(__dirname, '../../../db/files');
const historyFolder = path.resolve(dbFolder, 'history');

export class Localfilesystem implements IDatabase {
  constructor() {
    console.log(`Starting local database at ${dbFolder}`);
    if (!fs.existsSync(dbFolder)) {
      fs.mkdirSync(dbFolder);
    }
    if (!fs.existsSync(historyFolder)) {
      fs.mkdirSync(historyFolder);
    }
  }

  _filename(gameId: string): string {
    return path.resolve(dbFolder, `game-${gameId}.json`);
  }

  _historyFilename(gameId: string, saveId: number) {
    const saveIdString = saveId.toString().padStart(5, '0');
    return path.resolve(historyFolder, `game-${gameId}-${saveIdString}.json`);
  }

  saveGame(game: Game): void {
    console.log(`saving ${game.id} at position ${game.lastSaveId}`);
    const text = JSON.stringify(game.serialize(), null, 2);
    fs.writeFileSync(this._filename(game.id), text);
    fs.writeFileSync(this._historyFilename(game.id, game.lastSaveId), text);

    // This must occur after the save.
    game.lastSaveId++;
  }

  getGame(game_id: GameId, cb: (err: any, game?: SerializedGame) => void): void {
    try {
      console.log(`Loading ${game_id}`);
      const text = fs.readFileSync(this._filename(game_id));
      const serializedGame = JSON.parse(text);
      cb(undefined, serializedGame);
    } catch (err) {
      cb(err, undefined);
    }
  }
  getClonableGames(cb: (err: any, allGames: Array<IGameData>) => void) {
    this.getGames((err, gameIds) => {
      const filtered = gameIds.filter((gameId) => fs.existsSync(this._historyFilename(gameId, 0)));
      const gameData = filtered.map((gameId) => {
        const text = fs.readFileSync(this._historyFilename(gameId, 0));
        const serializedGame = JSON.parse(text) as SerializedGame;
        return {gameId: gameId, playerCount: serializedGame.players.length} as IGameData;
      });
      cb(err, gameData);
    });
  }

  loadCloneableGame(game_id: GameId, cb: DbLoadCallback<SerializedGame>) {
    try {
      console.log(`Loading ${game_id} at save point 0`);
      const text = fs.readFileSync(this._historyFilename(game_id, 0));
      const serializedGame = JSON.parse(text);
      cb(undefined, serializedGame);
    } catch (err) {
      cb(err, undefined);
    }
  }

  getGames(cb: (err: any, allGames: Array<GameId>) => void) {
    const gameIds: Array<GameId> = [];

    // TODO(kberg): use readdir since this is expected to be async anyway.
    fs.readdirSync(dbFolder, {withFileTypes: true}).forEach((dirent: Dirent) => {
      if (!dirent.isFile()) {
        return;
      }
      const re = /game-(.*).json/;
      const result = dirent.name.match(re);
      if (result === null) {
        return;
      }
      gameIds.push(result[1]);
    });
    cb(undefined, gameIds);
  }

  restoreReferenceGame(_gameId: GameId, cb: DbLoadCallback<Game>) {
    cb('Does not work', undefined);
  }

  saveGameResults(_game_id: GameId, _players: number, _generations: number, _gameOptions: GameOptions, _scores: Array<Score>): void {
    // Not implemented
  }

  cleanSaves(_game_id: GameId, _save_id: number): void {
    // Not implemented here.
  }

  restoreGame(_game_id: GameId, _save_id: number, _cb: DbLoadCallback<Game>): void {
    throw new Error('Undo not yet implemented');
  }

  deleteGameNbrSaves(_game_id: GameId, _rollbackCount: number): void {
    throw new Error('Rollback not yet implemented');
  }
}
