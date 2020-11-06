
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class TectonicStressPower implements IProjectCard {
    public cost = 18;
     public tags = [Tags.ENERGY, Tags.STEEL];
    public name = CardName.TECTONIC_STRESS_POWER;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2;
    }
    public play(player: Player) {
        if (player.getTagCount(Tags.SCIENCE) < 2) {
            throw "Requires 2 science tags";
        }
        player.addProduction(Resources.ENERGY,3);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
