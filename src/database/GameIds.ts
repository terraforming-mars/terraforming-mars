import {Database} from './Database';
import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {once} from 'events';
import {EventEmitter} from 'events';

export class GameIds extends EventEmitter {
  private loaded = false;
  private readonly games = new Map<GameId, Game | undefined>();
  private readonly participantIds = new Map<SpectatorId | PlayerId, GameId>();

  private async getInstance(gameId: GameId) : Promise<void> {
    const game = await Database.getInstance().getGame(gameId);
    console.log(`load game ${gameId} with ${game.spectatorId}`);
    if (this.games.get(gameId) === undefined) {
      this.games.set(gameId, undefined);
      if (game.spectatorId !== undefined) {
        this.participantIds.set(game.spectatorId, gameId);
      }
      for (const player of game.players) {
        this.participantIds.set(player.id, gameId);
      }
    }
  }

  private async getAllInstances(allGameIds: Array<GameId>) : Promise<void[]> {
    return Promise.all(allGameIds.map((x) => {
      return this.getInstance(x);
    }));
  }

  public async load(): Promise<void> {
    try {
      const allGameIds = await Database.getInstance().getGames();
      await this.getAllInstances(allGameIds);
    } catch (err) {
      console.error('error loading all games', err);
    }
    this.loaded = true;
    this.emit('loaded');
  }

  public async getGames(): Promise<{games:Map<GameId, Game | undefined>, participantIds:Map<SpectatorId | PlayerId, GameId>}> {
    if (!this.loaded) {
      await once(this, 'loaded');
    }
    return {games: this.games, participantIds: this.participantIds};
  }
}
