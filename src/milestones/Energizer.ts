import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";

export class Energizer implements IMilestone {
    public name: string = "Energizer";
    public description: string = "Requires that you have 6 energy production"
    public getScore(player: Player, _game: Game): number {
        return player.getProduction(Resources.ENERGY);
    }
    public canClaim(player: Player, _game: Game): boolean {
        return this.getScore(player, _game) >= 6;
    }   
}