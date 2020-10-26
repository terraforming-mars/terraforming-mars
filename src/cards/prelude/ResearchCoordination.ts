import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";

export class ResearchCoordination implements IProjectCard {
    public cost: number = 4;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: CardName = CardName.RESEARCH_COORDINATION;

    public play() {
        return undefined;
    }
}
