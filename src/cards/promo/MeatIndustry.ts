import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class MeatIndustry implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MEAT_INDUSTRY;
    public cardType: CardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }
}