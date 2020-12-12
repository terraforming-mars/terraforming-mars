
import {Color} from '../Color';
import {Database} from './Database';
import {Game, GameId} from '../Game';
import {Player, PlayerId} from '../Player';

type LoadCallback = (game: Game | undefined) => void;

enum State {
  /**
   * No game id or player id has shown up which
   * has required looking in the database.
   */
  WAITING,
  /**
   * Running query and populating knownGameIds and knownPlayerIds
   */
  LOADING,
  /**
   * knownGameIds and knownPlayerIds populated from database
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

  // games available in javascript memory
  private readonly games = new Map<GameId, Game>();

  // players available in javascript memory
  private readonly playerToGame = new Map<PlayerId, Game>();

  // game ids which we know exist
  private readonly knownGameIds = new Set<GameId>();

  // player ids which we know exist mapped to game id
  private readonly knownPlayerIds = new Map<PlayerId, GameId>();

  // requests for game that are waiting to load
  private readonly pendingGame: Array<[GameId, LoadCallback]> = [];

  // requests for player that are waiting to load
  private readonly pendingPlayer: Array<[PlayerId, LoadCallback]> = [];

  public add(game: Game): void {
    this.games.set(game.id, game);
    this.knownGameIds.add(game.id);
    for (const player of game.getPlayers()) {
      this.playerToGame.set(player.id, game);
      this.knownPlayerIds.set(player.id, game.id);
    }
  }

  public getLoadedGameIds(): Array<string> {
    return Array.from(this.knownGameIds.keys());
  }

  public getGameByGameId(gameId: string, cb: LoadCallback): void {
    this.loadAllGames();
    if (this.games.has(gameId)) {
      cb(this.games.get(gameId));
    } else if (this.knownGameIds.has(gameId) || this.state !== State.READY) {
      this.pendingGame.push([gameId, cb]);
      this.loadNextGame();
    } else {
      cb(undefined);
    }
  }

  public getGameByPlayerId(playerId: string, cb: LoadCallback): void {
    this.loadAllGames();
    if (this.playerToGame.has(playerId)) {
      cb(this.playerToGame.get(playerId));
    } else if (this.knownPlayerIds.has(playerId) || this.state !== State.READY) {
      this.pendingPlayer.push([playerId, cb]);
      this.loadNextGame();
    } else {
      cb(undefined);
    }
  }

  private loadGame(gameId: string, cb: LoadCallback): void {
    if (this.games.has(gameId)) {
      cb(this.games.get(gameId));
    } else if (this.knownGameIds.has(gameId) === false) {
      console.warn(`GameLoader:game id not found ${gameId}`);
      cb(undefined);
    } else {
      const player = new Player('test', Color.BLUE, false, 0);
      const player2 = new Player('test2', Color.RED, false, 0);
      const gameToRebuild = new Game(gameId, [player, player2], player);
      Database.getInstance().getGame(gameId, (err: any, serializedGame?) => {
        if (err || serializedGame === undefined) {
          console.error('GameLoader:loadGame', err);
          cb(undefined);
          return;
        }
        try {
          gameToRebuild.loadFromJSON(serializedGame);
          this.add(gameToRebuild);
          console.log(`GameLoader loaded game ${gameId} into memory from database`);
          cb(gameToRebuild);
        } catch (e) {
          console.error('GameLoader:loadGame', err);
          cb(undefined);
        }
      });
    }
  }

  private loadPlayer(playerId: string, cb: LoadCallback): void {
    if (this.playerToGame.has(playerId)) {
      cb(this.playerToGame.get(playerId));
      return;
    }
    const gameId = this.knownPlayerIds.get(playerId);
    if (gameId !== undefined) {
      this.loadGame(gameId, cb);
    } else {
      console.warn(`GameLoader:player id not found ${playerId}`);
      cb(undefined);
    }
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
      const gameToLoad = this.pendingGame.shift();
      if (gameToLoad !== undefined) {
        this.loadingGame = true;
        this.loadGame(gameToLoad[0], this.onGameLoaded(gameToLoad[1]));
        return;
      }
      const playerToLoad = this.pendingPlayer.shift();
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
            if (err || game === undefined) {
              console.error(`unable to load game ${gameId}`, err);
            } else {
              console.log(`load game ${gameId}`);
              this.knownGameIds.add(gameId);
              for (const player of game.players) {
                this.knownPlayerIds.set(player.id, gameId);
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
