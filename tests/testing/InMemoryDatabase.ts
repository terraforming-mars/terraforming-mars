import {IGame, Score} from '../../src/server/IGame';
import {GameOptions} from '../../src/server/GameOptions';
import {SerializedGame} from '../../src/server/SerializedGame';
import {GameIdLedger, IDatabase} from '../../src/server/database/IDatabase';
import {GameId, ParticipantId} from '../../src/common/Types';

export class InMemoryDatabase implements IDatabase {
  public data: Map<GameId, Array<SerializedGame>> = new Map();
  protected completedGames: Map<GameId, Date> = new Map();

  initialize(): Promise<unknown> {
    return Promise.resolve();
  }

  async getGame(gameId: GameId): Promise<SerializedGame> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      throw new Error('not found');
    } else {
      const game = row[row.length -1];
      return game!;
    }
  }
  async getGameId(id: ParticipantId): Promise<GameId> {
    // Direct copy of LocalFilesystem. :D
    const participants = await this.getParticipants();
    for (const entry of participants) {
      if (entry.participantIds.includes(id)) {
        return entry.gameId;
      }
    }
    throw new Error(`participant id ${id} not found`);
  }
  getSaveIds(gameId: GameId): Promise<number[]> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      return Promise.reject(new Error('not found'));
    } else {
      const result: Array<number | undefined> =
        row!.map((value, idx) => value !== undefined ? idx : undefined);
      return Promise.resolve(result.filter((result) => result !== undefined) as Array<number>);
    }
  }
  getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame> {
    const row = this.data.get(gameId);
    if (row === undefined || row.length === 0) {
      return Promise.reject(new Error(`Game ${gameId} not found`));
    }
    const serializedGame = row[saveId];
    if (serializedGame === undefined) {
      return Promise.reject(new Error(`Game ${gameId} not found`));
    }
    return Promise.resolve(serializedGame);
  }
  getGameIds(): Promise<GameId[]> {
    return Promise.resolve(Array.from(this.data.keys()));
  }
  async getPlayerCount(gameId: GameId): Promise<number> {
    const game = await this.getGame(gameId);
    return game.players.length;
  }
  saveGame(game: IGame): Promise<void> {
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
  loadCloneableGame(gameId: GameId): Promise<SerializedGame> {
    return this.getGameVersion(gameId, 0);
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
    return Promise.resolve({
      type: 'InMemoryDatabase',
    });
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
