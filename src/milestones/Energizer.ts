import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";

export class Energizer implements IMilestone {
    public name: string = "Energizer";
    public description: string = "Eequires that you have 6 energy production"
    public canClaim(player: Player, _game: Game): boolean {
        return player.getProduction(Resources.ENERGY) >= 6;
    }   
}