import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";

export class Cultivator implements IAward {
    public name: string = "Cultivator";
    public description: string = "Most greenery tiles"
    public getScore(player: Player, game: Game): number {
        return game.getSpaceCount(TileType.GREENERY, player);
    }   
}
