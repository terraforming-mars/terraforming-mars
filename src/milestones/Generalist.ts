import { IMilestone } from "./IMilestone";
import { Player } from "../Player";
import { Resources } from "../Resources";

export class Generalist implements IMilestone {
    public name: string = "Generalist";
    public description: string = "Requires that you have increased all 6 productions by at least 1 step"
    public getScore(player: Player): number {
        let score: number = 0;
        if (player.getProduction(Resources.MEGACREDITS) > 0) score++;
        if (player.getProduction(Resources.STEEL) > 0) score++;
        if (player.getProduction(Resources.TITANIUM) > 0) score++;
        if (player.getProduction(Resources.PLANTS) > 0) score++;
        if (player.getProduction(Resources.ENERGY) > 0) score++;
        if (player.getProduction(Resources.HEAT) > 0) score++;

        return score;
    }
    public canClaim(player: Player): boolean {
        return this.getScore(player) === 6;
    }   
}