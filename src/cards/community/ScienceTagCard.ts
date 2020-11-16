import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';

export class ScienceTagCard implements IProjectCard {
    public cost = 0;
    public tags = [Tags.SCIENCE];
    public name = CardName.SCIENCE_TAG_BLANK_CARD;
    public cardType = CardType.PROXY;

    public play() {
      return undefined;
    }
}
