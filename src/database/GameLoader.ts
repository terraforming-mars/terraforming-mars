import {Database} from './Database';
import {Game, GameId, SpectatorId} from '../Game';
import {PlayerId} from '../Player';
import {IGameLoader} from './IGameLoader';
import {MultiMap} from 'mnemonist';

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

type GameIdCallback = () => void;

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
  private readonly onGameIdsLoaded: Array<GameIdCallback> = [];

  // participant ids which we know exist mapped to game id
  private readonly participantIds = new Map<SpectatorId | PlayerId, GameId>();

  private static readonly instance = new GameLoader();

  private constructor() {}

  public reset(): void {
    this.games.clear();
    this.participantIds.clear();
    this.state = State.WAITING;
    this.loadingGame = false;
    if (this.onGameIdsLoaded.length > 0) {
      throw new Error('can not reset with pending callbacks');
    }
  }

  public static getInstance(): IGameLoader {
    return GameLoader.instance;
  }

  public add(game: Game): void {
    this.games.set(game.id, game);
    if (game.spectatorId !== undefined) {
      this.participantIds.set(game.spectatorId, game.id);
    }
    for (const player of game.getPlayers()) {
      this.participantIds.set(player.id, game.id);
    }
  }

  public getLoadedGameIds(): Array<{id: GameId, participants: Array<SpectatorId | PlayerId>}> {
    const map = new MultiMap<GameId, SpectatorId | PlayerId>();

    this.participantIds.forEach((gameId, participantId) => map.set(gameId, participantId));
    const arry: Array<[string, Array<string>]> = Array.from(map.associations());
    return arry.map(([id, participants]) => ({id: id, participants: participants}));
  }

  public getByGameId(gameId: GameId, bypassCache: boolean, cb: LoadCallback): void {
    this.loadAllGameIds();
    if (bypassCache === false && this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (this.games.has(gameId) || this.state !== State.READY) {
      this.onGameIdsLoaded.unshift(() => {
        this.loadGame(gameId, bypassCache, this.onGameLoaded(cb));
      });
      this.runGameIdLoadedCallback();
    } else {
      cb(undefined);
    }
  }

  private getByParticipantId(id: PlayerId | SpectatorId, cb: LoadCallback): void {
    this.loadAllGameIds();
    const gameId = this.participantIds.get(id);
    if (gameId !== undefined && this.games.get(gameId) !== undefined) {
      cb(this.games.get(gameId));
    } else if (gameId !== undefined || this.state !== State.READY) {
      this.onGameIdsLoaded.push(() => {
        this.loadParticipant(id, this.onGameLoaded(cb));
      });
      this.runGameIdLoadedCallback();
    } else {
      cb(undefined);
    }
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

  private loadParticipant(id: PlayerId | SpectatorId, cb: LoadCallback): void {
    const gameId = this.participantIds.get(id);
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
      this.runGameIdLoadedCallback();
    };
  }

  private runGameIdLoadedCallback(): void {
    if (this.state === State.READY && this.loadingGame === false) {
      const callback = this.onGameIdsLoaded.shift();
      if (callback !== undefined) {
        callback();
      }
    }
  }

  private allGameIdsLoaded(): void {
    this.state = State.READY;
    this.runGameIdLoadedCallback();
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
                  this.participantIds.set(game.spectatorId, gameId);
                }
                for (const player of game.players) {
                  this.participantIds.set(player.id, gameId);
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
