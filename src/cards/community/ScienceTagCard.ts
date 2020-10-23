import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { CardName } from '../../CardName';

export class ScienceTagCard implements IProjectCard {
    public cost: number = 0;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.SCIENCE_TAG_BLANK_CARD;
    public cardType: CardType = CardType.PROXY;

    public play() {
      return undefined;
    }
}
