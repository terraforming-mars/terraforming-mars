import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";

// TODO(kberg): write a test.
export class Entrepeneur implements IAward {
    public name: string = "Entrepeneur";
    public description: string = "Most tiles that grant adjacency bonuses"
    public getScore(player: Player, game: Game): number {
        return game.board.spaces
          .filter((space) => (
              space.player !== undefined
              && space.player === player
              && space.adjacency
              && space.adjacency.bonus.length > 0)).length;
    }   
}