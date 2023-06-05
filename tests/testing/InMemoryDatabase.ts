import {Game, Score} from '../../src/server/Game';
import {GameOptions} from '../../src/server/GameOptions';
import {SerializedGame} from '../../src/server/SerializedGame';
import {GameIdLedger, IDatabase} from '../../src/server/database/IDatabase';
import {GameId, ParticipantId} from '../../src/common/Types';

export class InMemoryDatabase implements IDatabase {
  public data: Map<GameId, Array<SerializedGame>> = new Map();
  private completedGames: Map<GameId, Date> = new Map();

  initialize(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async getGame(gameId: GameId): Promise<SerializedGame> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      throw new Error('not found');
    } else {
      const game = row[row.length -1];
      return game;
    }
  }
  getGameId(_id: ParticipantId): Promise<GameId> {
    throw new Error('Method not implemented.');
  }
  getSaveIds(gameId: GameId): Promise<number[]> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      return Promise.reject(new Error('not found'));
    } else {
      return Promise.resolve([...Array(row?.length).keys()]);
    }
  }
  getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      return Promise.reject(new Error('not found'));
    }
    const serializedGame = row[saveId];
    if (serializedGame === undefined) {
      return Promise.reject(new Error('not found'));
    }
    return Promise.resolve(serializedGame);
  }
  getGameIds(): Promise<GameId[]> {
    return Promise.resolve(Array.from(this.data.keys()));
  }
  getPlayerCount(_gameId: GameId): Promise<number> {
    throw new Error('Method not implemented.');
  }
  saveGame(game: Game): Promise<void> {
    const gameId = game.id;
    const row = this.data.get(gameId) || [];
    this.data.set(gameId, row);
    while (row.length < game.lastSaveId) {
      row.push();
    }
    row[game.lastSaveId] = game.serialize();
    game.lastSaveId++;
    return Promise.resolve();
  }
  saveGameResults(_gameId: GameId, _players: number, _generations: number, _gameOptions: GameOptions, _scores: Score[]): void {
    throw new Error('Method not implemented.');
  }
  loadCloneableGame(_gameId: GameId): Promise<SerializedGame> {
    throw new Error('Method not implemented.');
  }
  deleteGameNbrSaves(gameId: GameId, rollbackCount: number): Promise<void> {
    const row = this.data.get(gameId);
    if (row === undefined) {
      throw new Error('Game not found ' + gameId);
    }
    row.splice(row.length - rollbackCount, rollbackCount);

    return Promise.resolve();
  }
  markFinished(gameId: GameId): Promise<void> {
    this.completedGames.set(gameId, new Date());
    return Promise.resolve();
  }
  purgeUnfinishedGames(): Promise<Array<GameId>> {
    const keys = [...this.data.keys()];
    for (const key of keys) {
      this.data.delete(key);
    }
    return Promise.resolve(keys);
  }
  compressCompletedGames(): Promise<unknown> {
    return Promise.resolve();
  }
  stats(): Promise<{[ key: string ]: string | number;}> {
    throw new Error('Method not implemented.');
  }
  storeParticipants() {
    return Promise.resolve();
  }
  async getParticipants(): Promise<Array<GameIdLedger>> {
    const entries: Array<GameIdLedger> = [];
    this.data.forEach((games, gameId) => {
      const firstSave = games[0];
      const participantIds: Array<ParticipantId> = firstSave.players.map((p) => p.id);
      if (firstSave.spectatorId) participantIds.push(firstSave.spectatorId);
      entries.push({gameId, participantIds});
    });
    return entries;
  }
}
