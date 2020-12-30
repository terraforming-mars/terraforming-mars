import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';

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
  public get metadata(): CardMetadata {
    throw new Error('ScienceTagCard is a proxy card, not a real card. Should not render');
  }
  public play() {
    return undefined;
  }
}
