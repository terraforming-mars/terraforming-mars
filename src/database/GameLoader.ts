import {Database} from './Database';
import {Game, GameId, SpectatorId} from '../Game';
import {PlayerId} from '../Player';
import {IGameLoader} from './IGameLoader';
import {GameIds} from './GameIds';
import {MultiMap} from 'mnemonist';

type LoadCallback = (game: Game | undefined) => void;
type ListLoadCallback = (list: Array<{id: GameId, participants: Array<SpectatorId | PlayerId>}> | undefined) => void;

/**
 * Loads games from javascript memory or database
 * Loads games from database sequentially as needed
 */
export class GameLoader implements IGameLoader {
  private static instance?: GameLoader;

  private idsContainer = new GameIds();

  private constructor() {
    this.idsContainer.load();
  }

  public reset(): void {
    this.idsContainer = new GameIds();
    this.idsContainer.load();
  }

  public static getInstance(): IGameLoader {
    if (GameLoader.instance === undefined) {
      GameLoader.instance = new GameLoader();
    }
    return GameLoader.instance;
  }

  public add(game: Game): void {
    this.idsContainer.getGames().then( (d) => {
      d.games.set(game.id, game);
      if (game.spectatorId !== undefined) {
        d.participantIds.set(game.spectatorId, game.id);
      }
      for (const player of game.getPlayers()) {
        d.participantIds.set(player.id, game.id);
      }
    });
  }

  public getLoadedGameIds(cb: ListLoadCallback): void {
    this.idsContainer.getGames().then( (d) => {
      const map = new MultiMap<GameId, SpectatorId | PlayerId>();
      d.participantIds.forEach((gameId, participantId) => map.set(gameId, participantId));
      const arry: Array<[string, Array<string>]> = Array.from(map.associations());
      cb(arry.map(([id, participants]) => ({id: id, participants: participants})));
    });
  }

  public getByGameId(gameId: GameId, bypassCache: boolean, cb: LoadCallback): void {
    this.idsContainer.getGames().then( (d) => {
      if (bypassCache === false && d.games.get(gameId) !== undefined) {
        cb(d.games.get(gameId));
      } else if (d.games.has(gameId)) {
        this.loadGame(gameId, bypassCache, cb);
      } else {
        cb(undefined);
      }
    });
  }

  private getByParticipantId(id: PlayerId | SpectatorId, cb: LoadCallback): void {
    this.idsContainer.getGames().then( (d) => {
      const gameId = d.participantIds.get(id);
      if (gameId !== undefined && d.games.get(gameId) !== undefined) {
        cb(d.games.get(gameId));
      } else if (gameId !== undefined) {
        this.loadParticipant(id, cb);
      } else {
        cb(undefined);
      }
    });
  }

  public getByPlayerId(playerId: PlayerId, cb: LoadCallback): void {
    this.getByParticipantId(playerId, cb);
  }

  public getBySpectatorId(spectatorId: SpectatorId, cb: LoadCallback): void {
    this.getByParticipantId(spectatorId, cb);
  }

  public restoreGameAt(gameId: GameId, saveId: number, cb: LoadCallback): void {
    try {
      Database.getInstance().restoreGame(gameId, saveId, (err, game) => {
        if (err) {
          console.error('error while restoring game', err);
          cb(undefined);
        } else if (game !== undefined) {
          Database.getInstance().deleteGameNbrSaves(gameId, 1);
          this.add(game);
          game.undoCount++;
          cb(game);
        } else {
          console.error('game not found while restoring game', err);
          cb(undefined);
        }
      });
    } catch (error) {
      console.log(error);
      cb(undefined);
    }
  }

  private loadGame(gameId: GameId, bypassCache: boolean, cb: LoadCallback): void {
    this.idsContainer.getGames().then( (d) => {
      if (bypassCache === false && d.games.get(gameId) !== undefined) {
        cb(d.games.get(gameId));
      } else if (d.games.has(gameId) === false) {
        console.warn(`GameLoader:game id not found ${gameId}`);
        cb(undefined);
      } else {
        Database.getInstance().getGame(gameId, (err: any, serializedGame?) => {
          if (err || (serializedGame === undefined)) {
            console.error('GameLoader:loadGame', err);
            cb(undefined);
            return;
          }
          try {
            const game = Game.deserialize(serializedGame);
            this.add(game);
            console.log(`GameLoader loaded game ${gameId} into memory from database`);
            cb(game);
          } catch (e) {
            console.error('GameLoader:loadGame', e);
            cb(undefined);
            return;
          }
        });
      }
    });
  }

  private loadParticipant(id: PlayerId | SpectatorId, cb: LoadCallback): void {
    this.idsContainer.getGames().then( (d) => {
      const gameId = d.participantIds.get(id);
      if (gameId === undefined) {
        console.warn(`GameLoader:id not found ${id}`);
        cb(undefined);
        return;
      }
      if (d.games.get(gameId) !== undefined) {
        cb(d.games.get(gameId));
        return;
      }
      this.loadGame(gameId, false, cb);
    });
  }
}
