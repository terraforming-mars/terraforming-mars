import {Database} from './Database';
import {Game, GameId, SpectatorId} from '../Game';
import {PlayerId} from '../Player';
import {once} from 'events';
import {EventEmitter} from 'events';

export class GameIds extends EventEmitter {
  private loaded = false;
  private readonly games = new Map<GameId, Game | undefined>();
  private readonly participantIds = new Map<SpectatorId | PlayerId, GameId>();
  private getInstance(gameId: GameId) : Promise<void> {
    return new Promise<void>((resolve) => {
      Database.getInstance().getGame(
        gameId,
        (err, game) => {
          if (err || (game === undefined)) {
            console.error(`unable to load game ${gameId}`, err);
          } else {
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
          resolve();
        });
    });
  }

  private async getAllInstances(allGameIds: Array<GameId>) : Promise<void[]> {
    return Promise.all(allGameIds.map((x) => {
      return this.getInstance(x);
    }));
  }

  public load() : void {
    Database.getInstance().getGames((err, allGameIds) => {
      if (err) {
        console.error('error loading all games', err);
        this.loaded = true;
        this.emit('loaded');
        return;
      }
      this.getAllInstances(allGameIds).then(() =>{
        this.loaded = true;
        this.emit('loaded');
      });
    });
  }

  public async getGames(): Promise<{games:Map<GameId, Game | undefined>, participantIds:Map<SpectatorId | PlayerId, GameId>}> {
    if (!this.loaded) {
      await once(this, 'loaded');
    }
    return {games: this.games, participantIds: this.participantIds};
  }
}
