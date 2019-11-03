import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "../cards/Tags";

export class Scientist implements IAward {
    public name: string = "Scientist";
    public getScore(player: Player, _game: Game): number {
        return player.getTagCount(Tags.SCIENCE);
    }   
}