
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
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
}
