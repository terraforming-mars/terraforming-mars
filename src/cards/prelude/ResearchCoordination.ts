
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class ResearchCoordination implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: string = "Research Coordination";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "After being played, when you perform an action, the wildcard tag counts as any tag of your choice.";
    public description: string = "";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
}
