import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";

export class Miner implements IAward {
    public name: string = "Miner";
    public getScore(player: Player, _game: Game): number {
        return player.steel + player.titanium;
    }   
}