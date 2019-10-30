
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MedicalLab implements IProjectCard {
    public cost: number = 13;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Medical Lab";
    public text: string = "Increase your mega credit production 1 step for every 2 building tags you have, including this. Gain 1 victory point.";
    public description: string = "Providing health care for the public can be lucrative, as well as noble.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += Math.floor((player.getTagCount(Tags.STEEL) + 1) / 2);
        player.victoryPoints++;
        return undefined;
    }
}
