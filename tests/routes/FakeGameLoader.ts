import {IGameLoader} from '../../src/database/IGameLoader';
import {Game} from '../../src/Game';
import {PlayerId, GameId, SpectatorId} from '../../src/common/Types';

export class FakeGameLoader implements IGameLoader {
  private games: Map<string, Game> = new Map();
  add(game: Game): void {
    this.games.set(game.id, game);
  }
  getLoadedGameIds(cb: (list: Array<{id: GameId, participants: Array<SpectatorId | PlayerId>}> | undefined) => void) {
    cb(Array.from(this.games.keys())
      .map((id) => {
        return {id: id, participants: []};
      }));
  }
  getByGameId(gameId: string, _bypassCache: boolean, cb: (game: Game | undefined) => void): void {
    cb(this.games.get(gameId));
  }
  async getByParticipantId(id: PlayerId | SpectatorId): Promise<Game | undefined> {
    for (const game of Array.from(this.games.values())) {
      for (const player of game.getPlayersInGenerationOrder()) {
        if (player.id === id) {
          return game;
        }
      }
      if (game.spectatorId === id) {
        return game;
      }
    }
    return undefined;
  }
  restoreGameAt(_gameId: string, _saveId: number): Promise<Game> {
    throw new Error('Method not implemented.');
  }
}
