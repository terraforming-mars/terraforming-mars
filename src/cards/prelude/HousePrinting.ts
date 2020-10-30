import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class HousePrinting implements IProjectCard {
    public cost = 10;
    public tags = [Tags.STEEL];
    public name = CardName.HOUSE_PRINTING;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.addProduction(Resources.STEEL);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
