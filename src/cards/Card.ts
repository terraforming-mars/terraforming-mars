
import {CardMetadata} from './CardMetadata';
import {CardName} from '../CardName';
import {CardType} from './CardType';
import {Tags} from './Tags';

interface StaticCardProperties {
  cardType: CardType;
  initialActionText?: string;
  metadata: CardMetadata;
  name: CardName;
  startingMegaCredits?: number;
  tags?: Array<Tags>;
}

export abstract class Card {
  private readonly properties: StaticCardProperties;
  constructor(properties: StaticCardProperties) {
    const staticInstance = Object.getPrototypeOf(this).constructor;
    if (staticInstance.properties === undefined) {
      if (properties.cardType === CardType.CORPORATION && properties.startingMegaCredits === undefined) {
        throw new Error('must define startingMegaCredits for corporation cards');
      }
      staticInstance.properties = properties;
    }
    this.properties = staticInstance.properties;
  }
  public get cardType() {
    return this.properties.cardType;
  }
  public get initialActionText() {
    return this.properties.initialActionText;
  }
  public get metadata() {
    return this.properties.metadata;
  }
  public get name() {
    return this.properties.name;
  }
  public get startingMegaCredits() {
    return this.properties.startingMegaCredits || 0;
  }
  public get tags() {
    return this.properties.tags || [];
  }
}
