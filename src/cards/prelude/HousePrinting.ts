import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class HousePrinting implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.HOUSE_PRINTING;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
        player.addProduction(Resources.STEEL);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
