import {GameIdLedger, IGameLoader} from '../../src/database/IGameLoader';
import {Game} from '../../src/Game';
import {GameId, isGameId, PlayerId, SpectatorId} from '../../src/common/Types';

export class FakeGameLoader implements IGameLoader {
  private games: Map<GameId, Game> = new Map();
  add(game: Game): Promise<void> {
    this.games.set(game.id, game);
    return Promise.resolve();
  }
  async getIds(): Promise<Array<GameIdLedger>> {
    return Array.from(this.games.keys())
      .map((id) => {
        return {id: id, participants: []};
      });
  }
  public getGame(id: GameId | PlayerId | SpectatorId): Promise<Game | undefined> {
    if (isGameId(id)) return Promise.resolve(this.games.get(id));

    for (const game of Array.from(this.games.values())) {
      const matches = game.getPlayersInGenerationOrder().some((player) => player.id === id) || game.spectatorId === id;
      if (matches) return Promise.resolve(game);
    }
    return Promise.resolve(undefined);
  }
  restoreGameAt(_gameId: string, _saveId: number): Promise<Game> {
    throw new Error('Method not implemented.');
  }
}
