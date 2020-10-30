import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class MeatIndustry implements IProjectCard {
    public cost = 5;
    public tags = [Tags.STEEL];
    public name = CardName.MEAT_INDUSTRY;
    public cardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }
}