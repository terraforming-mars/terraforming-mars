import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class Banker implements IAward {
    public name: string = "Banker";
    public description: string = "Having the highest MC production"
    public getScore(player: Player, _game: Game): number {
        return player.getProduction(Resources.MEGACREDITS);
    }   
}