import {Database} from './Database';
import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {GameIdLedger, IGameLoader} from './IGameLoader';
import {GameIds} from './GameIds';
import {MultiMap} from 'mnemonist';

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

  public async getLoadedGameIds(): Promise<Array<GameIdLedger>> {
    const d = await this.idsContainer.getGames();
    const map = new MultiMap<GameId, SpectatorId | PlayerId>();
    d.participantIds.forEach((gameId, participantId) => map.set(gameId, participantId));
    const arry: Array<[GameId, Array<PlayerId | SpectatorId>]> = Array.from(map.associations());
    return arry.map(([id, participants]) => ({id: id, participants: participants}));
  }

  public async getByGameId(gameId: GameId, bypassCache: boolean): Promise<Game | undefined> {
    const d = await this.idsContainer.getGames();
    if (bypassCache === false && d.games.get(gameId) !== undefined) {
      return d.games.get(gameId);
    } else if (d.games.has(gameId)) {
      return this.loadGameAsync(gameId, bypassCache);
    } else {
      return undefined;
    }
  }

  public async getByParticipantId(id: PlayerId | SpectatorId): Promise<Game | undefined> {
    const d = await this.idsContainer.getGames();
    const gameId = d.participantIds.get(id);
    if (gameId !== undefined && d.games.get(gameId) !== undefined) {
      return d.games.get(gameId);
    } else if (gameId !== undefined) {
      return this.loadParticipant(id);
    } else {
      return undefined;
    }
  }

  public async restoreGameAt(gameId: GameId, saveId: number): Promise<Game> {
    const serializedGame = await Database.getInstance().restoreGame(gameId, saveId);
    const game = Game.deserialize(serializedGame);
    // TODO(kberg): make deleteGameNbrSaves return a promise.
    await Database.getInstance().deleteGameNbrSaves(gameId, 1);
    this.add(game);
    game.undoCount++;
    return game;
  }

  private async loadGameAsync(gameId: GameId, bypassCache: boolean): Promise<Game | undefined> {
    const d = await this.idsContainer.getGames();
    if (bypassCache === false) {
      const game = d.games.get(gameId);
      if (game !== undefined) {
        return game;
      }
    }
    return new Promise((resolve) => {
      Database.getInstance().getGame(gameId, (err: any, serializedGame?) => {
        if (err) {
          console.error('loadGameAsync ' + err);
          resolve(undefined);
          return;
        }
        if (serializedGame === undefined) {
          console.error(`loadGameAsync: game ${gameId} not found`);
          resolve(undefined);
          return;
        }
        try {
          const game = Game.deserialize(serializedGame);
          this.add(game);
          console.log(`GameLoader loaded game ${gameId} into memory from database`);
          resolve(game);
        } catch (e) {
          console.error('GameLoader:loadGame', e);
          resolve(undefined);
        }
      });
    });
  }

  private async loadParticipant(id: PlayerId | SpectatorId): Promise<Game | undefined> {
    const d = await this.idsContainer.getGames();
    const gameId = d.participantIds.get(id);
    if (gameId === undefined) {
      return undefined;
    }
    const game = d.games.get(gameId);
    if (game !== undefined) {
      return game;
    }
    return this.loadGameAsync(gameId, false);
  }
}
