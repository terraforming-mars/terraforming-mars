import {IGameLoader} from '../../src/database/IGameLoader';
import {Game} from '../../src/Game';

export class FakeGameLoader implements IGameLoader {
  private games: Map<string, Game> = new Map();
  add(game: Game): void {
    this.games.set(game.id, game);
  }
  getLoadedGameIds(): string[] {
    return Array.from(this.games.keys());
  }
  getByGameId(gameId: string, _bypassCache: boolean, cb: (game: Game | undefined) => void): void {
    cb(this.games.get(gameId));
  }
  getByPlayerId(playerId: string, cb: (game: Game | undefined) => void): void {
    let found = false;
    this.games.forEach((game) => {
      if (found === true) {
        return;
      }
      game.getPlayers().forEach((player) => {
        if (found === true) {
          return;
        }
        if (player.id === playerId) {
          cb(game);
          found = true;
        }
      });
    });
    if (found === false) {
      cb(undefined);
    }
  }
  restoreGameAt(_gameId: string, _saveId: number, _cb: (game: Game | undefined) => void): void {
    throw new Error('Method not implemented.');
  }
}
