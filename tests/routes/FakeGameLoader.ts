import {IGameLoader} from '../../src/database/IGameLoader';
import {Game} from '../../src/Game';

export class FakeGameLoader implements IGameLoader {
  private games: Map<string, Game> = new Map();
  add(game: Game): void {
    this.games.set(game.id, game);
  }
  getLoadedGameIds() {
    return Array.from(this.games.keys())
      .map((id) => {
        return {id: id, participants: []};
      });
  }
  getByGameId(gameId: string, _bypassCache: boolean, cb: (game: Game | undefined) => void): void {
    cb(this.games.get(gameId));
  }
  getByPlayerId(playerId: string, cb: (game: Game | undefined) => void): void {
    for (const game of Array.from(this.games.values())) {
      for (const player of game.getPlayers()) {
        if (player.id === playerId) {
          cb(game);
          return;
        }
      }
    }
    cb(undefined);
  }
  getBySpectatorId(_spectatorId: string, _cb: (game: Game | undefined) => void): void {
    throw new Error('Method not implemented.');
  }
  restoreGameAt(_gameId: string, _saveId: number, _cb: (game: Game | undefined) => void): void {
    throw new Error('Method not implemented.');
  }
}
