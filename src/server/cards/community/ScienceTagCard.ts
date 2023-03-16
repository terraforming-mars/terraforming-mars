import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';

export class ScienceTagCard implements IProjectCard {
  public get cost() {
    return 0;
  }
  public get tags() {
    return [Tag.SCIENCE];
  }
  public get name() {
    return CardName.SCIENCE_TAG_BLANK_CARD;
  }
  public get cardType() {
    return CardType.PROXY;
  }
  public get type() {
    return CardType.PROXY;
  }
  public canPlay() {
    return false;
  }
  public get metadata(): ICardMetadata {
    throw new Error('ScienceTagCard is a proxy card, not a real card. Should not render');
  }
  public play() {
    return undefined;
  }
  public get resourceCount() {
    return 0;
  }
  public getVictoryPoints() {
    return 0;
  }
}
