
import {Color} from '../Color';
import {Database} from './Database';
import {Game, GameId} from '../Game';
import {Player, PlayerId} from '../Player';

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

  // requests for game that are waiting to load
  private readonly gameRequests: Array<[GameId, LoadCallback]> = [];

  // requests for player that are waiting to load
  private readonly playerRequests: Array<[PlayerId, LoadCallback]> = [];

  private static instance?: GameLoader;

  public static getInstance(): GameLoader {
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

  /**
   * Determines if game is available in javascript
   * memory
   * @param {GameId} gameId id to check
   * @return {boolean} true iff game is available in memory
   */
  public has(gameId: GameId): boolean {
    return this.games.get(gameId) !== undefined;
  }

  /**
   * Removes game from javascript memory
   * if it is of a known id.
   * @param {GameId} gameId id to remove
   */
  public remove(gameId: GameId): void {
    if (this.games.has(gameId)) {
      this.games.set(gameId, undefined);
    }
  }

  public getLoadedGameIds(): Array<string> {
    return Array.from(this.games.keys());
  }

  public getByGameId(gameId: GameId, cb: LoadCallback): void {
    this.loadAllGames();
    if (this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (this.games.has(gameId) || this.state !== State.READY) {
      this.gameRequests.push([gameId, cb]);
      this.loadNextGame();
    } else {
      cb(undefined);
    }
  }

  public getByPlayerId(playerId: PlayerId, cb: LoadCallback): void {
    this.loadAllGames();
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

  private loadGame(gameId: GameId, cb: LoadCallback): void {
    if (this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (this.games.has(gameId) === false) {
      console.warn(`GameLoader:game id not found ${gameId}`);
      cb(undefined);
    } else {
      const player = new Player('test', Color.BLUE, false, 0);
      const player2 = new Player('test2', Color.RED, false, 0);
      const gameToRebuild = new Game(gameId, [player, player2], player);
      Database.getInstance().getGame(gameId, (err: any, serializedGame?) => {
        if (err || (serializedGame === undefined)) {
          console.error('GameLoader:loadGame', err);
          cb(undefined);
          return;
        }
        try {
          gameToRebuild.loadFromJSON(serializedGame);
        } catch (e) {
          console.error('GameLoader:loadGame', e);
          cb(undefined);
          return;
        }
        this.add(gameToRebuild);
        console.log(`GameLoader loaded game ${gameId} into memory from database`);
        cb(gameToRebuild);
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
    this.loadGame(gameId, cb);
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
        this.loadGame(gameToLoad[0], this.onGameLoaded(gameToLoad[1]));
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

  private allGamesLoaded(): void {
    this.state = State.READY;
    this.loadNextGame();
  }

  private loadAllGames(): void {
    if (this.state !== State.WAITING) {
      return;
    }
    this.state = State.LOADING;
    Database.getInstance().getGames((err, allGames) => {
      if (err) {
        console.error('error loading all games', err);
        this.allGamesLoaded();
        return;
      }

      if (allGames.length === 0) {
        this.allGamesLoaded();
        return;
      }

      let loaded = 0;
      allGames.forEach((gameId) => {
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
            if (loaded === allGames.length) {
              this.allGamesLoaded();
            }
          });
      });
    });
  }
}
