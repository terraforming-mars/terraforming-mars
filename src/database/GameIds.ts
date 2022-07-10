import {Database} from './Database';
import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {once} from 'events';
import {EventEmitter} from 'events';
import {Metrics} from '../server/metrics';

export class GameIds extends EventEmitter {
  private loaded = false;
  private readonly games = new Map<GameId, Game | undefined>();
  private readonly participantIds = new Map<SpectatorId | PlayerId, GameId>();

  private async getInstance(gameId: GameId) : Promise<void> {
    const game = await Database.getInstance().getGame(gameId);
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

  private async getAllInstances(allGameIds: Array<GameId>): Promise<void> {
    Metrics.INSTANCE.mark('game-ids-get-all-instances-started');
    const sliceSize = 1000;
    for (let i = 0; i < allGameIds.length; i += sliceSize) {
      const slice = allGameIds.slice(i, i + sliceSize);
      await Promise.all(slice.map((x) => this.getInstance(x))).then(() => {
        console.log(`Loaded ${i} to ${i + slice.length} of ${allGameIds.length}`);
      });
    }
    Metrics.INSTANCE.mark('game-ids-get-all-instances-finished');
  }

  public async load(): Promise<void> {
    try {
      const allGameIds = await Database.getInstance().getGameIds();
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
