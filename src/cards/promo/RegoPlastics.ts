import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";

export class RegoPlastics implements IProjectCard {
    public name: CardName = CardName.REGO_PLASTICS;
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player) {
        player.steelValue++;
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }

}