
import {Color} from '../Color';
import {Database} from './Database';
import {Game} from '../Game';
import {Player} from '../Player';

type LoadCallback = (game: Game | undefined) => void;
enum State { WAITING, LOADING, READY }

export class GameLoader {
    private state: State = State.WAITING;
    private readonly games = new Map<string, Game>();
    private readonly pendingGame = new Map<string, Array<LoadCallback>>();
    private readonly pendingPlayer = new Map<string, Array<LoadCallback>>();
    private readonly playerToGame = new Map<string, Game>();

    public start(cb = () => {}): void {
      switch (this.state) {
      case State.READY:
        console.warn('already loaded, ignoring');
        return;
      case State.LOADING:
        console.warn('already loading, ignoring');
        return;
      case State.WAITING:
        this.loadAllGames(cb);
      }
    }

    public addGame(game: Game): void {
      this.games.set(game.id, game);
      for (const player of game.getPlayers()) {
        this.playerToGame.set(player.id, game);
      }
    }

    public getLoadedGameIds(): Array<string> {
      return Array.from(this.games.keys());
    }

    public getGameByGameId(gameId: string, cb: LoadCallback): void {
      if (this.state === State.READY || this.games.has(gameId)) {
        cb(this.games.get(gameId));
        return;
      }
      const pendingGame = this.pendingGame.get(gameId);
      if (pendingGame !== undefined) {
        pendingGame.push(cb);
      } else {
        this.pendingGame.set(gameId, [cb]);
      }
    }

    public getGameByPlayerId(playerId: string, cb: LoadCallback): void {
      if (this.state === State.READY || this.playerToGame.has(playerId)) {
        cb(this.playerToGame.get(playerId));
        return;
      }
      const pendingPlayer = this.pendingPlayer.get(playerId);
      if (pendingPlayer !== undefined) {
        pendingPlayer.push(cb);
      } else {
        this.pendingPlayer.set(playerId, [cb]);
      }
    }

    private onGameLoaded(gameId: string, playerId: string): void {
      const pendingGames = this.pendingGame.get(gameId);
      if (pendingGames !== undefined) {
        for (const pendingGame of pendingGames) {
          pendingGame(this.games.get(gameId));
        }
        this.pendingGame.delete(gameId);
      }
      const pendingPlayers = this.pendingPlayer.get(playerId);
      if (pendingPlayers !== undefined) {
        for (const pendingPlayer of pendingPlayers) {
          pendingPlayer(this.playerToGame.get(playerId));
        }
        this.pendingPlayer.delete(playerId);
      }
    }

    private onAllGamesLoaded(): void {
      this.state = State.READY;

      // any pendingPlayer or pendingGame callbacks
      // are waiting for a train that is never coming
      // send them packing. call their callbacks with
      // undefined and remove from pending
      for (const pendingGame of Array.from(this.pendingGame.values())) {
        for (const cb of pendingGame) {
          cb(undefined);
        }
      }
      this.pendingGame.clear();
      for (const pendingPlayer of Array.from(this.pendingPlayer.values())) {
        for (const cb of pendingPlayer) {
          cb(undefined);
        }
      }
      this.pendingPlayer.clear();
    }

    private loadAllGames(cb = () => {}): void {
      this.state = State.LOADING;

      Database.getInstance().getGames((err, allGames) => {
        if (err) {
          console.error('error loading all games', err);
          this.onAllGamesLoaded();
          cb();
          return;
        }

        if (allGames.length === 0) {
          this.onAllGamesLoaded();
          cb();
        };

        let loaded = 0;
        allGames.forEach((game_id) => {
          const player = new Player('test', Color.BLUE, false, 0);
          const player2 = new Player('test2', Color.RED, false, 0);
          const gameToRebuild = new Game(game_id, [player, player2], player);
          Database.getInstance().restoreGameLastSave(
            game_id,
            gameToRebuild,
            (err) => {
              loaded++;
              if (err) {
                console.error(`unable to load game ${game_id}`, err);
              } else {
                console.log(`load game ${game_id}`);
                this.games.set(gameToRebuild.id, gameToRebuild);
                for (const player of gameToRebuild.getPlayers()) {
                  this.playerToGame.set(player.id, gameToRebuild);
                  this.onGameLoaded(gameToRebuild.id, player.id);
                }
              }
              if (loaded === allGames.length) {
                this.onAllGamesLoaded();
                cb();
              }
            },
          );
        });
      });
    }
}
