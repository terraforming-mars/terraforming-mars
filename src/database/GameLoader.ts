import {Database} from './Database';
import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
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

  public async getByParticipantIdAsync(id: PlayerId | SpectatorId): Promise<Game> {
    const d = await this.idsContainer.getGames();
    const gameId = d.participantIds.get(id);
    if (gameId === undefined) {
      return Promise.reject(new Error('Not found'));
    }
    const game = d.games.get(gameId);
    if (game !== undefined) {
      return game;
    } else {
      return this.loadParticipantAsync(id);
    }
  }

  public getByParticipantId(id: PlayerId | SpectatorId, cb: LoadCallback): void {
    this.idsContainer.getGames().then((d) => {
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

  public async restoreGameAt(gameId: GameId, saveId: number): Promise<Game> {
    const game = await Database.getInstance().restoreGame(gameId, saveId);
    // TODO(kberg): make deleteGameNbrSaves a promise.
    await Database.getInstance().deleteGameNbrSaves(gameId, 1);
    this.add(game);
    game.undoCount++;
    return game;
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

  private async loadGameAsync(gameId: GameId, bypassCache: boolean): Promise<Game> {
    const d = await this.idsContainer.getGames();
    const game = d.games.get(gameId);
    if (bypassCache === false && game !== undefined) {
      return game;
    } else if (game === undefined) {
      return Promise.reject(new Error(`GameLoader:game id not found ${gameId}`));
    }
    return new Promise((resolve, reject) => {
      Database.getInstance().getGame(gameId, (err: any, serializedGame?) => {
        if (err) {
          reject(err);
          return;
        }
        if (serializedGame === undefined) {
          reject(new Error('game not defined'));
          return;
        }
        try {
          const game = Game.deserialize(serializedGame);
          this.add(game);
          console.log(`GameLoader loaded game ${gameId} into memory from database`);
          resolve(game);
        } catch (e) {
          console.error('GameLoader:loadGame', e);
          reject(e);
          return;
        }
      });
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

  private async loadParticipantAsync(id: PlayerId | SpectatorId): Promise<Game> {
    const d = await this.idsContainer.getGames();
    const gameId = d.participantIds.get(id);
    if (gameId === undefined) {
      return Promise.reject(new Error(`GameLoader:id not found ${id}`));
    }
    const game = d.games.get(gameId);
    if (game !== undefined) {
      return game;
    }
    return this.loadGameAsync(gameId, false);
  }
}
