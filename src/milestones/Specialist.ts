import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";

export class Specialist implements IMilestone {
    public name: string = "Specialist";
    public description: string = "Requires that you have at least 10 in production of any resource"
    public getScore(player: Player, _game: Game): number {
        return Math.max(player.getProduction(Resources.MEGACREDITS),
                player.getProduction(Resources.STEEL),
                player.getProduction(Resources.TITANIUM),
                player.getProduction(Resources.PLANTS),
                player.getProduction(Resources.ENERGY),
                player.getProduction(Resources.HEAT));
    }
    public canClaim(player: Player, _game: Game): boolean {
        return player.getProduction(Resources.MEGACREDITS) > 9 
          || player.getProduction(Resources.STEEL) > 9
          || player.getProduction(Resources.TITANIUM) > 9
          || player.getProduction(Resources.PLANTS) > 9
          || player.getProduction(Resources.ENERGY) > 9
          || player.getProduction(Resources.HEAT) > 9;
    }   
}