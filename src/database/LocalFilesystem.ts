import {IDatabase} from './IDatabase';
import {Game, GameOptions, Score} from '../Game';
import {GameId, isGameId} from '../common/Types';
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

  getGame(game_id: GameId): Promise<SerializedGame> {
    try {
      console.log(`Loading ${game_id}`);
      const text = fs.readFileSync(this._filename(game_id));
      const serializedGame = JSON.parse(text);
      return Promise.resolve(serializedGame);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      throw error;
    }
  }

  getGameId(_playerId: string): Promise<GameId> {
    throw new Error('Not implemented');
  }

  getSaveIds(gameId: GameId): Promise<Array<number>> {
    const re = /(.*)-(.*).json/;
    const results = fs.readdirSync(historyFolder, {withFileTypes: true})
      .filter((dirent: Dirent) => dirent.name.startsWith(gameId + '-'))
      .filter((dirent: Dirent) => dirent.isFile())
      .map((dirent: Dirent) => dirent.name.match(re))
      .filter((result: RegExpMatchArray) => result !== null)
      .map((result: RegExpMatchArray) => result[2]);
    return Promise.resolve(results);
  }

  getGameVersion(_game_id: GameId, _save_id: number): Promise<SerializedGame> {
    throw new Error('Not implemented');
  }

  async getPlayerCount(gameId: GameId): Promise<number> {
    const gameIds = await this.getGames();
    const found = gameIds.find((gId) => gId === gameId && fs.existsSync(this._historyFilename(gameId, 0)));
    if (found === undefined) {
      throw new Error(`${gameId} not found`);
    }
    const text = fs.readFileSync(this._historyFilename(gameId, 0));
    const serializedGame = JSON.parse(text) as SerializedGame;
    return serializedGame.players.length;
  }

  loadCloneableGame(game_id: GameId): Promise<SerializedGame> {
    try {
      console.log(`Loading ${game_id} at save point 0`);
      const text = fs.readFileSync(this._historyFilename(game_id, 0));
      const serializedGame = JSON.parse(text);
      return Promise.resolve(serializedGame);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return Promise.reject(error);
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
      if (isGameId(result[1])) {
        gameIds.push(result[1]);
      }
    });
    return Promise.resolve(gameIds);
  }

  restoreReferenceGame(_gameId: GameId): Promise<Game> {
    throw new Error('Does not work');
  }

  saveGameResults(_gameId: GameId, _players: number, _generations: number, _gameOptions: GameOptions, _scores: Array<Score>): void {
    // Not implemented
  }

  cleanGame(_gameId: GameId): Promise<void> {
    // Not implemented here.
    return Promise.resolve();
  }

  purgeUnfinishedGames(): void {
    // Not implemented.
  }

  async restoreGame(gameId: GameId, saveId: number): Promise<SerializedGame> {
    await fs.copyFile(this._historyFilename(gameId, saveId), this._filename(gameId));
    return this.getGame(gameId);
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
