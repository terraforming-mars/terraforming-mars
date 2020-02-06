
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";

export class ResearchCoordination implements IProjectCard {
    public cost: number = 4;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: string = "Research Coordination";

    public play() {
        return undefined;
    }
}
