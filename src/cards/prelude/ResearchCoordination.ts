import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";

export class ResearchCoordination implements IProjectCard {
    public cost = 4;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.WILDCARD];
    public name = CardName.RESEARCH_COORDINATION;

    public play() {
        return undefined;
    }
}
