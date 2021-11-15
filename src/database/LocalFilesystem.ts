import {DbLoadCallback, IDatabase} from './IDatabase';
import {Game, GameId, GameOptions, Score} from '../Game';
import {IGameData} from './IDatabase';
import {SerializedGame} from '../SerializedGame';
import {Dirent} from 'fs';

const path = require('path');
const fs = require('fs');
const dbFolder = path.resolve(process.cwd(), './db/files');
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

  async initialize(): Promise<void> {

  }

  _filename(gameId: string): string {
    return path.resolve(dbFolder, `${gameId}.json`);
  }

  _historyFilename(gameId: string, saveId: number) {
    const saveIdString = saveId.toString().padStart(5, '0');
    return path.resolve(historyFolder, `${gameId}-${saveIdString}.json`);
  }

  saveGame(game: Game): Promise<void> {
    console.log(`saving ${game.id} at position ${game.lastSaveId}`);
    this.saveSerializedGame(game.serialize());
    game.lastSaveId++;
    return Promise.resolve();
  }

  saveSerializedGame(serializedGame: SerializedGame): void {
    const text = JSON.stringify(serializedGame, null, 2);
    fs.writeFileSync(this._filename(serializedGame.id), text);
    fs.writeFileSync(this._historyFilename(serializedGame.id, serializedGame.lastSaveId), text);
  }

  getGame(game_id: GameId, cb: (err: Error | undefined, game?: SerializedGame) => void): void {
    try {
      console.log(`Loading ${game_id}`);
      const text = fs.readFileSync(this._filename(game_id));
      const serializedGame = JSON.parse(text);
      cb(undefined, serializedGame);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      cb(error, undefined);
    }
  }

  getGameId(_playerId: string, _cb: (err: Error | undefined, gameId?: GameId) => void): void {
    throw new Error('Not implemented');
  }

  getGameVersion(_game_id: GameId, _save_id: number, _cb: DbLoadCallback<SerializedGame>): void {
    throw new Error('Not implemented');
  }

  getClonableGames(cb: (err: Error | undefined, allGames: Array<IGameData>) => void) {
    this.getGames((err, gameIds) => {
      const filtered = gameIds.filter((gameId) => fs.existsSync(this._historyFilename(gameId, 0)));
      const gameData = filtered.map((gameId) => {
        const text = fs.readFileSync(this._historyFilename(gameId, 0));
        const serializedGame = JSON.parse(text) as SerializedGame;
        return {gameId: gameId, playerCount: serializedGame.players.length};
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
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      cb(error, undefined);
    }
  }

  getGames(cb: (err: Error | undefined, allGames: Array<GameId>) => void) {
    const gameIds: Array<GameId> = [];

    // TODO(kberg): use readdir since this is expected to be async anyway.
    fs.readdirSync(dbFolder, {withFileTypes: true}).forEach((dirent: Dirent) => {
      if (!dirent.isFile()) {
        return;
      }
      const re = /(.*).json/;
      const result = dirent.name.match(re);
      if (result === null) {
        return;
      }
      gameIds.push(result[1]);
    });
    cb(undefined, gameIds);
  }

  restoreReferenceGame(_gameId: GameId, cb: DbLoadCallback<Game>) {
    cb(new Error('Does not work'), undefined);
  }

  saveGameResults(_gameId: GameId, _players: number, _generations: number, _gameOptions: GameOptions, _scores: Array<Score>): void {
    // Not implemented
  }

  cleanSaves(_gameId: GameId, _save_id: number): void {
    // Not implemented here.
  }

  purgeUnfinishedGames(): void {
    // Not implemented.
  }

  restoreGame(_gameId: GameId, _save_id: number, _cb: DbLoadCallback<Game>): void {
    throw new Error('Undo not yet implemented');
  }

  deleteGameNbrSaves(_gameId: GameId, _rollbackCount: number): void {
    throw new Error('Rollback not yet implemented');
  }
}
