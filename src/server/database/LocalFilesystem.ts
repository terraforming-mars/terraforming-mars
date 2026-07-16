import {GameIdLedger, IDatabase} from './IDatabase';
import {IGame, Score} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {GameId, isGameId, ParticipantId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';
import {Dirent, existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync} from 'fs';
import {Session, SessionId} from '../auth/Session';
import {toID} from '../../common/utils/utils';

const path = require('path');
const defaultDbFolder = path.resolve(process.cwd(), './db/files');

export class LocalFilesystem implements IDatabase {
  protected readonly dbFolder: string;
  private readonly historyFolder: string;
  private readonly completedFolder: string;
  private readonly sessionsFolder: string;
  public static quiet: boolean = false;

  constructor(dbFolder: string = defaultDbFolder) {
    this.dbFolder = dbFolder;
    this.historyFolder = path.resolve(dbFolder, 'history');
    this.completedFolder = path.resolve(dbFolder, 'completed');
    this.sessionsFolder = path.resolve(dbFolder, 'sessions');
  }

  public initialize(): Promise<void> {
    console.log(`Starting local database at ${this.dbFolder}`);
    const dirs = [this.dbFolder, this.historyFolder, this.completedFolder, this.sessionsFolder];
    for (const folder of dirs) {
      if (!existsSync(folder)) {
        mkdirSync(folder);
      }
    }
    return Promise.resolve();
  }

  private filename(gameId: GameId): string {
    return path.resolve(this.dbFolder, `${gameId}.json`);
  }

  private historyFilename(gameId: GameId, saveId: number) {
    const saveIdString = saveId.toString().padStart(5, '0');
    return path.resolve(this.historyFolder, `${gameId}-${saveIdString}.json`);
  }

  private completedFilename(gameId: GameId) {
    return path.resolve(this.completedFolder, `${gameId}.json`);
  }

  private sessionFilename(sessionId: SessionId) {
    return path.resolve(this.sessionsFolder, `${sessionId}.json`);
  }

  saveGame(game: IGame): Promise<void> {
    console.log(`saving ${game.id} at position ${game.lastSaveId}`);
    this.saveSerializedGame(game.serialize());
    game.lastSaveId++;
    return Promise.resolve();
  }

  saveSerializedGame(serializedGame: SerializedGame): void {
    const text = JSON.stringify(serializedGame, null, 2);
    writeFileSync(this.filename(serializedGame.id), text);
    writeFileSync(this.historyFilename(serializedGame.id, serializedGame.lastSaveId), text);
  }

  getGame(gameId: GameId): Promise<SerializedGame> {
    try {
      console.log(`Loading ${gameId}`);
      const text = readFileSync(this.filename(gameId));
      const serializedGame = JSON.parse(text.toString());
      return Promise.resolve(serializedGame);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      throw error;
    }
  }

  async getGameId(participantId: ParticipantId): Promise<GameId> {
    const participants = await this.getParticipants();
    for (const entry of participants) {
      if (entry.participantIds.includes(participantId)) {
        return entry.gameId;
      }
    }
    throw new Error(`participant id ${participantId} not found`);
  }

  getSaveIds(gameId: GameId): Promise<Array<number>> {
    const results: Array<number> = [];
    const entries = readdirSync(this.historyFolder, {withFileTypes: true});
    for (const dirent of entries) {
      if (dirent.name.startsWith(gameId + '-') && dirent.isFile()) {
        const match = dirent.name.match(/(.*)-(.*).json/);
        if (match !== null) {
          const saveIdAsString = match[2];
          results.push(Number(saveIdAsString));
        }
      }
    }
    return Promise.resolve(results);
  }

  getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    try {
      if (!LocalFilesystem.quiet) console.log(`Loading ${gameId} at ${saveId}`);
      const text = readFileSync(this.historyFilename(gameId, saveId));
      const serializedGame = JSON.parse(text.toString());
      return Promise.resolve(serializedGame);
    } catch (e) {
      console.log(e);
      return Promise.reject(new Error(`Game ${gameId} not found at save_id ${saveId}`));
    }
  }

  async getPlayerCount(gameId: GameId): Promise<number> {
    const gameIds = await this.getGameIds();
    const found = gameIds.find((gId) => gId === gameId && existsSync(this.historyFilename(gameId, 0)));
    if (found === undefined) {
      throw new Error(`${gameId} not found`);
    }
    const text = readFileSync(this.historyFilename(gameId, 0));
    const serializedGame = JSON.parse(text.toString()) as SerializedGame;
    return serializedGame.players.length;
  }

  getGameIds(): Promise<Array<GameId>> {
    const gameIds: Array<GameId> = [];

    readdirSync(this.dbFolder, {withFileTypes: true}).forEach((dirent: Dirent) => {
      const gameId = this.asGameId(dirent);
      if (gameId !== undefined) {
        gameIds.push(gameId);
      }
    });
    return Promise.resolve(gameIds);
  }

  saveGameResults(gameId: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    const obj = {gameId, players, generations, gameOptions, scores};
    const text = JSON.stringify(obj, null, 2);
    writeFileSync(this.completedFilename(gameId), text);
  }

  markFinished(_gameId: GameId): Promise<void> {
    // Not implemented here.
    return Promise.resolve();
  }

  purgeUnfinishedGames(): Promise<Array<GameId>> {
    // Not implemented.
    return Promise.resolve([]);
  }

  compressCompletedGames(): Promise<unknown> {
    // Not implemented.
    return Promise.resolve();
  }

  deleteGameNbrSaves(gameId: GameId, rollbackCount: number): Promise<void> {
    if (rollbackCount <= 0) {
      console.error(`invalid rollback count for ${gameId}: ${rollbackCount}`);
      // Should this be an error?
      return Promise.resolve();
    }

    return this.getSaveIds(gameId).then((saveIds) => {
      const versionsToDelete = saveIds.slice(-rollbackCount);
      for (const version of versionsToDelete) {
        this.deleteVersion(gameId, version);
      }
      return undefined;
    });
  }

  public stats(): Promise<{[key: string]: string | number}> {
    return Promise.resolve({
      type: 'Local Filesystem',
      path: this.dbFolder.toString(),
      history_path: this.historyFolder.toString(),
    });
  }

  public storeParticipants(_entry: GameIdLedger): Promise<void> {
    // Not necessary.
    return Promise.resolve();
  }

  private asGameId(dirent: Dirent): GameId | undefined {
    if (!dirent.isFile()) return undefined;
    const re = /(.*).json/;
    const result = dirent.name.match(re);
    if (result === null) return undefined;
    return isGameId(result[1]) ? result[1] : undefined;
  }

  public getParticipants(): Promise<Array<GameIdLedger>> {
    const gameIds: Array<GameIdLedger> = [];
    const entries = readdirSync(this.dbFolder, {withFileTypes: true});
    for (const dirent of entries) {
      const gameId = this.asGameId(dirent);
      if (gameId !== undefined) {
        try {
          const text = readFileSync(this.filename(gameId));
          const game: SerializedGame = JSON.parse(text.toString());
          const participantIds: Array<ParticipantId> = game.players.map(toID);
          if (game.spectatorId) participantIds.push(game.spectatorId);
          gameIds.push({gameId, participantIds});
        } catch (e) {
          console.error(`While reading ${gameId} `, e);
        }
      }
    }
    return Promise.resolve(gameIds);
  }

  createSession(session: Session): Promise<void> {
    const text = JSON.stringify(session, null, 2);
    writeFileSync(this.sessionFilename(session.id), text);
    return Promise.resolve();
  }
  deleteSession(sessionId: SessionId): Promise<void> {
    unlinkSync(this.sessionFilename(sessionId));
    return Promise.resolve();
  }
  getSessions(): Promise<Array<Session>> {
    const sessions: Array<Session> = [];
    const now = Date.now();
    const entries = readdirSync(this.sessionsFolder, {withFileTypes: true});
    for (const dirent of entries) {
      if (dirent.isFile() && dirent.name.endsWith('.json')) {
        try {
          const text = readFileSync(this.sessionsFolder + '/' + dirent.name);
          const session: Session = JSON.parse(text.toString());
          if (session.expirationTimeMillis > now) {
            sessions.push(session);
          }
        } catch (e) {
          console.error(`While reading ${dirent.name} `, e);
        }
      }
    }
    return Promise.resolve(sessions);
  }

  private deleteVersion(gameId: GameId, version: number) {
    unlinkSync(this.historyFilename(gameId, version));
  }
}
