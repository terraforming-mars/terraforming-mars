import {DbLoadCallback, IDatabase} from './IDatabase';
import {Game, GameOptions, Score} from '../Game';
import {GameId} from '../common/Types';
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

  getGameVersion(_game_id: GameId, _save_id: number): Promise<SerializedGame> {
    throw new Error('Not implemented');
  }

  getPlayerCount(gameId: GameId, cb: (err: Error | undefined, playerCount: number | undefined) => void) {
    this.getGames().then((gameIds) => {
      const found = gameIds.find((gId) => gId === gameId && fs.existsSync(this._historyFilename(gameId, 0)));
      if (found === undefined) {
        cb(new Error('not found'), undefined);
        return;
      }
      const text = fs.readFileSync(this._historyFilename(gameId, 0));
      const serializedGame = JSON.parse(text) as SerializedGame;
      cb(new Error('not found'), serializedGame.players.length);
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

  getGames(): Promise<Array<GameId>> {
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
    return Promise.resolve(gameIds);
  }

  restoreReferenceGame(_gameId: GameId, cb: DbLoadCallback<Game>) {
    cb(new Error('Does not work'), undefined);
  }

  saveGameResults(_gameId: GameId, _players: number, _generations: number, _gameOptions: GameOptions, _scores: Array<Score>): void {
    // Not implemented
  }

  cleanSaves(_gameId: GameId): void {
    // Not implemented here.
  }

  purgeUnfinishedGames(): void {
    // Not implemented.
  }

  restoreGame(gameId: GameId, saveId: number, cb: DbLoadCallback<Game>): void {
    fs.copyFileSync(this._historyFilename(gameId, saveId), this._filename(gameId));
    this.getGame(gameId, (err, serializedGame) => {
      if (err) {
        cb(err, undefined);
      } else {
        const game = Game.deserialize(serializedGame!);
        cb(err, game);
      }
    });
  }

  deleteGameNbrSaves(_gameId: GameId, _rollbackCount: number): void {
    console.error('deleting old saves not implemented.');
  }

  public stats(): Promise<{[key: string]: string | number}> {
    return Promise.resolve({
      type: 'Local Filesystem',
      path: dbFolder.toString(),
      history_path: historyFolder.toString(),
    });
  }
}
