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
  getByParticipantIdAsync(id: PlayerId | SpectatorId): Promise<Game> {
    return new Promise((resolve, reject) => {
      this.getByParticipantId(id, (game) => {
        if (game !== undefined) {
          resolve(game);
        } else {
          reject(new Error('not found'));
        }
      });
    });
  }
  getByParticipantId(id: PlayerId | SpectatorId, cb: (game: Game | undefined) => void): void {
    for (const game of Array.from(this.games.values())) {
      for (const player of game.getPlayersInGenerationOrder()) {
        if (player.id === id) {
          cb(game);
          return;
        }
      }
      if (game.spectatorId === id) {
        cb(game);
        return;
      }
    }
    cb(undefined);
  }
  restoreGameAt(_gameId: string, _saveId: number): Promise<Game> {
    throw new Error('Method not implemented.');
  }
}
