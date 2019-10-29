import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";

export class Banker implements IAward {
    public name: string = "Banker";
    public getScore(player: Player, _game: Game): number {
        return player.megaCreditProduction;
    }   
}