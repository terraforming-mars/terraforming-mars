import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {ICardMetadata} from '../ICardMetadata';

export class ScienceTagCard implements IProjectCard {
  public get cost() {
    return 0;
  }
  public get tags() {
    return [Tags.SCIENCE];
  }
  public get name() {
    return CardName.SCIENCE_TAG_BLANK_CARD;
  }
  public get cardType() {
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
