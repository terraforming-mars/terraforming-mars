import {Database} from './Database';
import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {once} from 'events';
import {EventEmitter} from 'events';
import * as prometheus from 'prom-client';

const start = new prometheus.Gauge({
  name: 'game_ids_get_all_instances_started',
  help: 'Time getAllInstances started',
  registers: [prometheus.register],
});
const end = new prometheus.Gauge({
  name: 'game_ids_get_all_instances_finished',
  help: 'Time getAllInstances finished',
  registers: [prometheus.register],
});

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
    start.set(Date.now());

    const sliceSize = 1000;
    for (let i = 0; i < allGameIds.length; i += sliceSize) {
      const slice = allGameIds.slice(i, i + sliceSize);
      await Promise.all(slice.map((x) => this.getInstance(x))).then(() => {
        console.log(`Loaded ${i} to ${i + slice.length} of ${allGameIds.length}`);
      });
    }
    end.set(Date.now());
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
