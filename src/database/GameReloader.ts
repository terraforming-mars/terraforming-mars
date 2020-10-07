
import { Color } from "../Color";
import { Database } from "./Database";
import { Game } from "../Game";
import { Player } from "../Player";

export class GameReloader {
    private loadedGames = false;
    private loadingGames = false;
    private readonly games = new Map<string, Game>();
    private readonly pendingGame = new Map<string, Array<(game: Game | undefined) => void>>();
    private readonly pendingPlayer = new Map<string, Array<(game: Game | undefined) => void>>();
    private readonly playersToGame = new Map<string, Game>();

    public start(): void {
        if (this.loadedGames === true) {
            console.warn("already loaded, ignoring");
        } else if (this.loadingGames === true) {
            console.warn("already loading, ignoring");
            return;
        }
        this.loadingGames = true;
        this.loadAllGames();
    }

    public addGame(game: Game): void {
        this.games.set(game.id, game);
        for (const player of game.getPlayers()) {
            this.playersToGame.set(player.id, game);
        }
    }

    public getGameIds(): Array<string> {
        return Array.from(this.games.keys());
    }

    public getByGameId(gameId: string, cb: (game: Game | undefined) => void): void {
        if (this.loadedGames === true) {
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

    public getByPlayerId(playerId: string, cb: (game: Game | undefined) => void): void {
        if (this.loadedGames === true) {
            cb(this.playersToGame.get(playerId));
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
                pendingPlayer(this.playersToGame.get(playerId));
            }
            this.pendingPlayer.delete(playerId);
        }
    }

    private onAllGamesLoaded(): void {
        // TODO any pendingPlayer or pendingGame callbacks
        // are waiting for a train that is never coming
        // send them packing. call their callbacks with
        // undefined and remove from pending
        this.loadingGames = false;
        this.loadedGames = true;
    }

    private loadAllGames(): void {
        Database.getInstance().getGames((err, allGames) => {
            if (err) {
                console.error("error loading all games", err);
                this.onAllGamesLoaded();
                return;
            }
            let loaded = 0;
            allGames.forEach((game_id) => {
                const player = new Player("test", Color.BLUE, false, 0);
                const player2 = new Player("test2", Color.RED, false, 0);
                const gameToRebuild = new Game(game_id, [player, player2], player);
                Database.getInstance().restoreGameLastSave(
                    game_id,
                    gameToRebuild,
                    (err) => {
                        loaded++;
                        if (err) {
                            console.error(`unable to load game ${game_id}`, err);
                            return;
                        }
                        console.log(`load game ${game_id}`);
                        this.games.set(gameToRebuild.id, gameToRebuild);
                        for (const player of gameToRebuild.getPlayers()) {
                            this.playersToGame.set(player.id, gameToRebuild);
                            this.onGameLoaded(gameToRebuild.id, player.id);
                        }
                        if (loaded === allGames.length) {
                            this.onAllGamesLoaded();
                        }
                    }
                );
            });
        });
    }
}
