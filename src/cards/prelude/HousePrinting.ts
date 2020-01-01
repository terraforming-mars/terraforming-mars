
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from '../../Resources';

export class HousePrinting implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "House Printing";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }

    public play(player: Player) {
        player.setProduction(Resources.STEEL);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
