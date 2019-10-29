import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";

export class Thermalist implements IAward {
    public name: string = "Thermalist";
    public getScore(player: Player, _game: Game): number {
        return player.heat;
    }   
}