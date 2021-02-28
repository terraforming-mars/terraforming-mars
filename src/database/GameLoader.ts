import {Database} from './Database';
import {Game, GameId} from '../Game';
import {PlayerId} from '../Player';
import {IGameLoader} from './IGameLoader';

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
export class GameLoader implements IGameLoader {
  private state = State.WAITING;

  // indicates if game is being loaded from database
  private loadingGame = false;

  // games available in javascript memory, undefined represents game
  // in database not yet loaded
  private readonly games = new Map<GameId, Game | undefined>();

  // player ids which we know exist mapped to game id
  private readonly playerIds = new Map<PlayerId, GameId>();

  // requests for game that are waiting to load
  private readonly gameRequests: Array<[GameId, boolean, LoadCallback]> = [];

  // requests for player that are waiting to load
  private readonly playerRequests: Array<[PlayerId, LoadCallback]> = [];

  private static instance?: GameLoader;

  private constructor() {}

  public static getInstance(): IGameLoader {
    if (GameLoader.instance === undefined) {
      GameLoader.instance = new GameLoader();
    }
    return GameLoader.instance;
  }

  public add(game: Game): void {
    this.games.set(game.id, game);
    for (const player of game.getPlayers()) {
      this.playerIds.set(player.id, game.id);
    }
  }

  public getLoadedGameIds(): Array<string> {
    return Array.from(this.games.keys());
  }

  public getByGameId(gameId: GameId, bypassCache: boolean, cb: LoadCallback): void {
    this.loadAllGameIds();
    if (bypassCache === false && this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (this.games.has(gameId) || this.state !== State.READY) {
      this.gameRequests.push([gameId, bypassCache, cb]);
      this.loadNextGame();
    } else {
      cb(undefined);
    }
  }

  public getByPlayerId(playerId: PlayerId, cb: LoadCallback): void {
    this.loadAllGameIds();
    const gameId = this.playerIds.get(playerId);

    if (gameId !== undefined && this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (gameId !== undefined || this.state !== State.READY) {
      this.playerRequests.push([playerId, cb]);
      this.loadNextGame();
    } else {
      cb(undefined);
    }
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

  private loadPlayer(playerId: PlayerId, cb: LoadCallback): void {
    const gameId = this.playerIds.get(playerId);
    if (gameId === undefined) {
      console.warn(`GameLoader:player id not found ${playerId}`);
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
      const gameToLoad = this.gameRequests.shift();
      if (gameToLoad !== undefined) {
        this.loadingGame = true;
        this.loadGame(gameToLoad[0], gameToLoad[1], this.onGameLoaded(gameToLoad[2]));
        return;
      }
      const playerToLoad = this.playerRequests.shift();
      if (playerToLoad !== undefined) {
        this.loadingGame = true;
        this.loadPlayer(playerToLoad[0], this.onGameLoaded(playerToLoad[1]));
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
              console.log(`load game ${gameId}`);
              if (this.games.get(gameId) === undefined) {
                this.games.set(gameId, undefined);
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
