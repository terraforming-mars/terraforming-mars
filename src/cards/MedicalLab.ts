
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class MedicalLab implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Medical Lab";

    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS, Math.floor((player.getTagCount(Tags.STEEL) + 1) / 2));
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
