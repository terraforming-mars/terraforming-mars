import {Database} from './Database';
import {Game, GameId, SpectatorId} from '../Game';
import {PlayerId} from '../Player';

type LoadCallback = (game: Game | undefined) => void;

enum State {
  /**
   * No id has been requested
   */
  WAITING,
  /**
   * Running query and populating ids
   */
  LOADING,
  /**
   * ids populated from database
   */
  READY
}

/**
 * Loads games from javascript memory or database
 * Loads games from database sequentially as needed
 */
export class GameLoader {
  private state = State.WAITING;

  // indicates if game is being loaded from database
  private loadingGame = false;

  // games available in javascript memory, undefined represents game
  // in database not yet loaded
  private readonly games = new Map<GameId, Game | undefined>();

  // player ids which we know exist mapped to game id
  private readonly playerIds = new Map<PlayerId, GameId>();

  // spectator ids which we know exist mapped to game id
  private readonly spectatorIds = new Map<SpectatorId, GameId>();

  // requests for game that are waiting to load
  private readonly gameRequests: Array<() => void> = [];

  // requests for player that are waiting to load
  private readonly entityRequests: Array<() => void> = [];

  private static instance?: GameLoader;

  private constructor() {}

  public static getInstance(): GameLoader {
    if (GameLoader.instance === undefined) {
      GameLoader.instance = new GameLoader();
    }
    return GameLoader.instance;
  }

  public add(game: Game): void {
    this.games.set(game.id, game);
    if (game.spectatorId !== undefined) {
      this.spectatorIds.set(game.spectatorId, game.id);
    }
    for (const player of game.getPlayers()) {
      this.playerIds.set(player.id, game.id);
    }
  }

  public getLoadedGameIds(): Array<string> {
    return Array.from(this.games.keys());
  }

  /**
   * Gets a game from javascript memory or pulls from database if needed.
   * @param {GameId} gameId the id of the game to retrieve
   * @param {boolean} bypassCache always pull from database
   * @param {LoadCallback} cb called with game when available
   */
  public getByGameId(gameId: GameId, bypassCache: boolean, cb: LoadCallback): void {
    this.loadAllGameIds();
    if (bypassCache === false && this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (this.games.has(gameId) || this.state !== State.READY) {
      this.gameRequests.push(() => {
        this.loadGame(gameId, bypassCache, this.onGameLoaded(cb));
      });
      this.loadNextGame();
    } else {
      cb(undefined);
    }
  }

  private getByEntityId<T>(id: T, map: Map<T, GameId>, cb: LoadCallback): void {
    this.loadAllGameIds();
    const gameId = map.get(id);
    if (gameId !== undefined && this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (gameId !== undefined || this.state !== State.READY) {
      this.entityRequests.push(() => {
        this.loadEntity(id, map, this.onGameLoaded(cb));
      });
      this.loadNextGame();
    } else {
      cb(undefined);
    }
  }

  public getByPlayerId(playerId: PlayerId, cb: LoadCallback): void {
    this.getByEntityId(playerId, this.playerIds, cb);
  }

  public getBySpectatorId(spectatorId: SpectatorId, cb: LoadCallback): void {
    this.getByEntityId(spectatorId, this.spectatorIds, cb);
  }

  public restoreGameAt(gameId: GameId, saveId: number, cb: LoadCallback): void {
    try {
      Database.getInstance().restoreGame(gameId, saveId, (err, game) => {
        if (game !== undefined) {
          Database.getInstance().deleteGameNbrSaves(gameId, 1);
          this.add(game);
          cb(game);
        } else {
          console.log(err);
          cb(undefined);
        }
      });
    } catch (error) {
      console.log(error);
      cb(undefined);
    }
  }

  private loadGame(gameId: GameId, bypassCache: boolean, cb: LoadCallback): void {
    this.loadingGame = true;
    if (bypassCache === false && this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (this.games.has(gameId) === false) {
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
  }

  private loadEntity<T>(id: T, map: Map<T, GameId>, cb: LoadCallback): void {
    const gameId = map.get(id);
    this.loadingGame = true;
    if (gameId === undefined) {
      console.warn(`GameLoader:id not found ${id}`);
      cb(undefined);
      return;
    }
    if (this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
      return;
    }
    this.loadGame(gameId, false, cb);
  }

  private onGameLoaded(cb: LoadCallback) {
    return (game: Game | undefined) => {
      cb(game);
      this.loadingGame = false;
      this.loadNextGame();
    };
  }

  private loadNextGame(): void {
    if (this.state === State.READY && this.loadingGame === false) {
      const gameRequest = this.gameRequests.shift();
      if (gameRequest !== undefined) {
        gameRequest();
        return;
      }
      const entityRequest = this.entityRequests.shift();
      if (entityRequest !== undefined) {
        entityRequest();
        return;
      }
    }
  }

  private allGameIdsLoaded(): void {
    this.state = State.READY;
    this.loadNextGame();
  }

  private loadAllGameIds(): void {
    if (this.state !== State.WAITING) {
      return;
    }
    this.state = State.LOADING;
    Database.getInstance().getGames((err, allGameIds) => {
      if (err) {
        console.error('error loading all games', err);
        this.allGameIdsLoaded();
        return;
      }

      if (allGameIds.length === 0) {
        this.allGameIdsLoaded();
        return;
      }

      let loaded = 0;
      allGameIds.forEach((gameId) => {
        Database.getInstance().getGame(
          gameId,
          (err, game) => {
            loaded++;
            if (err || (game === undefined)) {
              console.error(`unable to load game ${gameId}`, err);
            } else {
              console.log(`load game ${gameId} with ${game.spectatorId}`);
              if (this.games.get(gameId) === undefined) {
                this.games.set(gameId, undefined);
                if (game.spectatorId !== undefined) {
                  this.spectatorIds.set(game.spectatorId, gameId);
                }
                for (const player of game.players) {
                  this.playerIds.set(player.id, gameId);
                }
              }
            }
            if (loaded === allGameIds.length) {
              this.allGameIdsLoaded();
            }
          });
      });
    });
  }
}
