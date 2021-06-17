import {CardMetadata} from './CardMetadata';
import {CardName} from '../CardName';
import {CardType} from './CardType';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {ResourceType} from '../ResourceType';
import {Tags} from './Tags';
import {Player} from '../Player';
import {Units} from '../Units';
import {CardRequirements} from './CardRequirements';
import {CardDiscount} from './ICard';

export interface StaticCardProperties {
  adjacencyBonus?: IAdjacencyBonus;
  cardCost?: number;
  cardType: CardType;
  cost?: number;
  initialActionText?: string;
  metadata: CardMetadata;
  requirements?: CardRequirements;
  name: CardName;
  resourceType?: ResourceType;
  startingMegaCredits?: number;
  tags?: Array<Tags>;
  productionBox?: Units;
  cardDiscount?: CardDiscount;
  reserveUnits?: Units,
}

export const staticCardProperties = new Map<CardName, StaticCardProperties>();

export abstract class Card {
  private readonly properties: StaticCardProperties;
  constructor(properties: StaticCardProperties) {
    let staticInstance = staticCardProperties.get(properties.name);
    if (staticInstance === undefined) {
      if (properties.cardType === CardType.CORPORATION && properties.startingMegaCredits === undefined) {
        throw new Error('must define startingMegaCredits for corporation cards');
      }
      if (properties.cost === undefined) {
        if ([CardType.CORPORATION, CardType.PRELUDE, CardType.STANDARD_ACTION].includes(properties.cardType) === false) {
          throw new Error(`${properties.name} must have a cost property`);
        }
      }
      staticCardProperties.set(properties.name, properties);
      staticInstance = properties;
    }
    this.properties = staticInstance;
  }
  public get adjacencyBonus() {
    return this.properties.adjacencyBonus;
  }
  public get cardCost() {
    return this.properties.cardCost;
  }
  public get cardType() {
    return this.properties.cardType;
  }
  public get cost() {
    return this.properties.cost === undefined ? 0 : this.properties.cost;
  }
  public get initialActionText() {
    return this.properties.initialActionText;
  }
  public get metadata() {
    return this.properties.metadata;
  }
  public get requirements() {
    return this.properties.requirements;
  }
  public get name() {
    return this.properties.name;
  }
  public get resourceType() {
    return this.properties.resourceType;
  }
  public get startingMegaCredits() {
    return this.properties.startingMegaCredits === undefined ? 0 : this.properties.startingMegaCredits;
  }
  public get tags() {
    return this.properties.tags === undefined ? [] : this.properties.tags;
  }
  public get productionBox(): Units {
    return this.properties.productionBox || Units.EMPTY;
  }
  public get cardDiscount() {
    return this.properties.cardDiscount;
  }
  public get reserveUnits(): Units {
    return this.properties.reserveUnits || Units.EMPTY;
  }
  public canPlay(player: Player) {
    if (this.properties.requirements === undefined) {
      return true;
    }
    return this.properties.requirements.satisfies(player);
  }
}
