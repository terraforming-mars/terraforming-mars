import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";

export class DesertSettler implements IAward {
    public name: string = "Desert Settler";
    public description: string = "Most tiles south of the equator (the four bottom rows)"
    public getScore(player: Player, game: Game): number {
        return game.board.spaces
          .filter((space) => space.player !== undefined 
            && space.player === player
            && space.tile !== undefined
            && space.y >= 5 && space.y <= 8).length;
    }   
}