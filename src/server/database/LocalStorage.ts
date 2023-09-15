import {GameIdLedger, IDatabase} from './IDatabase';
import {IGame, Score} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {GameId, ParticipantId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';

export class LocalStorage implements IDatabase {
  constructor() {
  }

  public initialize(): Promise<void> {
    console.log(`Starting local storage database`);
    return Promise.resolve();
  }

  saveGame(game: IGame): Promise<void> {
    console.log(`saving ${game.id} at position ${game.lastSaveId}`);
    this.saveSerializedGame(game.serialize());
    game.lastSaveId++;
    return Promise.resolve();
  }

  saveSerializedGame(serializedGame: SerializedGame): void {
    const text = JSON.stringify(serializedGame, null, 2);
    localStorage.setItem('game:' + serializedGame.id, text);
    localStorage.setItem('game:' + serializedGame.id + ':' + serializedGame.lastSaveId, text);
  }

  getGame(gameId: GameId): Promise<SerializedGame> {
    try {
      console.log(`Loading ${gameId}`);
      const text = localStorage.getItem('game:' + gameId);
      if (text === null) {
        throw new Error('game not found ' + gameId);
      }
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
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === null || key === 'game:' + gameId) {
        continue;
      }
      if (key.startsWith('game:' + gameId)) {
        const parts = key.split(':');
        results.push(Number(parts[2]));
      }
    }
    return Promise.resolve(results);
  }

  getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    try {
      console.log(`Loading ${gameId} at ${saveId}`);
      const text = localStorage.getItem('game:' + gameId + ':' + saveId);
      if (text === null) {
        throw new Error('game not found');
      }
      const serializedGame = JSON.parse(text.toString());
      return Promise.resolve(serializedGame);
    } catch (e) {
      console.log(e);
      return Promise.reject(new Error(`Game ${gameId} not found at save_id ${saveId}`));
    }
  }

  getPlayerCount(gameId: GameId): Promise<number> {
    const text = localStorage.getItem('game:' + gameId);
    if (text === null) {
      throw new Error('game not foudn ' + gameId);
    }
    const serializedGame = JSON.parse(text.toString()) as SerializedGame;
    return Promise.resolve(serializedGame.players.length);
  }

  loadCloneableGame(gameId: GameId): Promise<SerializedGame> {
    return this.getGameVersion(gameId, 0);
  }

  getGameIds(): Promise<Array<GameId>> {
    const gameIds: Array<GameId> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith('game:') && key.split(':').length === 2) {
        gameIds.push(key.substring('game:'.length) as `g${string}`);
      }
    }
    return Promise.resolve(gameIds);
  }

  saveGameResults(gameId: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void {
    const obj = {gameId, players, generations, gameOptions, scores};
    const text = JSON.stringify(obj, null, 2);
    localStorage.setItem('completed:' + gameId, text);
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
        localStorage.removeItem('game:' + gameId + ':' + version);
      }
    });
  }

  public stats(): Promise<{[key: string]: string | number}> {
    return Promise.resolve({
      type: 'Local Storage',
    });
  }

  public storeParticipants(_entry: GameIdLedger): Promise<void> {
    // Not necessary.
    return Promise.resolve();
  }

  public getParticipants(): Promise<Array<GameIdLedger>> {
    const gameIds: Array<GameIdLedger> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith('game:') && key.split(':').length === 2) {
        const text = localStorage.getItem(key);
        if (text === null) {
          continue;
        }
        const game: SerializedGame = JSON.parse(text.toString());
        const participantIds: Array<ParticipantId> = game.players.map((p) => p.id);
        if (game.spectatorId) participantIds.push(game.spectatorId);
        gameIds.push({gameId: game.id, participantIds});
      }
    }
    return Promise.resolve(gameIds);
  }
}
