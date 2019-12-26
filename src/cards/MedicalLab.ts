
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MedicalLab implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Medical Lab";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction += Math.floor((player.getTagCount(Tags.STEEL) + 1) / 2);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
