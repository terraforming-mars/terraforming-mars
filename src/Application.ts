
import { Game } from "./Game";

export class Application {
    private games: Array<Game> = [];
    public getGameById(gameId: string): Game {
        const foundGames = this.games.filter((game) => game.id === gameId);
        if (foundGames.length === 0) {
            throw "Game not found";
        }
        return foundGames[0];
    }
}

