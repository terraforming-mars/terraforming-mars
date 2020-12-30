
import {CardMetadata} from './CardMetadata';
import {CardName} from '../CardName';
import {CardType} from './CardType';
import {Tags} from './Tags';

/**
 * Utility function to pull the static instance
 * of a class.
 * @param {Card} instance of a card
 * @return {Object} static instance of card
 */
function staticInstance(instance: Card) {
  return Object.getPrototypeOf(instance).constructor;
}

interface StaticCardProperties {
  cardType: CardType;
  initialActionText?: string;
  metadata: CardMetadata;
  name: CardName;
  startingMegaCredits?: number;
  tags?: Array<Tags>;
}

export abstract class Card {
  constructor(properties: StaticCardProperties) {
    const instance = staticInstance(this);
    if (instance.properties === undefined) {
      instance.properties = properties;
    }
  }
  public get cardType() {
    return staticInstance(this).properties.cardType;
  }
  public get initialActionText() {
    return staticInstance(this).properties.initialActionText;
  }
  public get metadata() {
    return staticInstance(this).properties.metadata;
  }
  public get name() {
    return staticInstance(this).properties.name;
  }
  public get startingMegaCredits() {
    return staticInstance(this).properties.startingMegaCredits;
  }
  public get tags() {
    return staticInstance(this).properties.tags;
  }
}
