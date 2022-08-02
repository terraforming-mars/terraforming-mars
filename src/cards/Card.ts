import {ICardMetadata} from '../common/cards/ICardMetadata';
import {CardName} from '../common/cards/CardName';
import {CardType} from '../common/cards/CardType';
import {ICardDiscount} from '../common/cards/Types';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {CardResource} from '../common/CardResource';
import {Tags} from '../common/cards/Tags';
import {Player} from '../Player';
import {Units} from '../common/Units';
import {CardRequirements} from './CardRequirements';
import {TRSource} from './ICard';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {CardRenderItemType} from '../common/cards/render/CardRenderItemType';
import {IVictoryPoints} from '../common/cards/IVictoryPoints';
import {IProjectCard} from './IProjectCard';

export interface StaticCardProperties {
  adjacencyBonus?: IAdjacencyBonus;
  cardCost?: number;
  cardType: CardType;
  cost?: number;
  initialActionText?: string;
  metadata: ICardMetadata;
  requirements?: CardRequirements;
  name: CardName;
  resourceType?: CardResource;
  startingMegaCredits?: number;
  tags?: Array<Tags>;
  productionBox?: Units;
  cardDiscount?: ICardDiscount | Array<ICardDiscount>;
  reserveUnits?: Units,
  tr?: TRSource,
  victoryPoints?: number | 'special' | IVictoryPoints,
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
      // TODO(kberg): apply these changes in CardVictoryPoints.vue and remove this conditional altogether.
      Card.autopopulateMetadataVictoryPoints(properties);

      staticCardProperties.set(properties.name, properties);
      staticInstance = properties;
    }
    this.properties = staticInstance;
  }
  public resourceCount = 0;
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
  public get tr(): TRSource {
    return this.properties.tr || {};
  }
  public get victoryPoints(): number | 'special' | IVictoryPoints | undefined {
    return this.properties.victoryPoints;
  }
  public canPlay(_player: Player) {
    return true;
  }

  // player is optional to support historical tests.
  public getVictoryPoints(player?: Player): number {
    const vp1 = this.properties.victoryPoints;
    if (vp1 === 'special') {
      throw new Error('When victoryPoints is \'special\', override getVictoryPoints');
    }
    if (vp1 !== undefined) {
      if (typeof(vp1) === 'number') {
        return vp1;
      }
      if (vp1.type === 'resource') {
        return vp1.points * Math.floor(this.resourceCount / vp1.per);
      } else {
        const tag = vp1.type;
        const count = player?.getTagCount(tag, 'vps') ?? 0;
        return vp1.points * Math.floor(count / vp1.per);
      }
    }

    const vps = this.properties.metadata.victoryPoints;
    if (vps === undefined) {
      return 0;
    }

    if (typeof(vps) === 'number') return vps;

    if (vps.targetOneOrMore === true || vps.anyPlayer === true) {
      throw new Error('Not yet handled');
    }

    let units: number | undefined = 0;

    switch (vps.item?.type) {
    case CardRenderItemType.MICROBES:
    case CardRenderItemType.ANIMALS:
    case CardRenderItemType.FIGHTER:
    case CardRenderItemType.FLOATERS:
    case CardRenderItemType.ASTEROIDS:
    case CardRenderItemType.PRESERVATION:
    case CardRenderItemType.DATA_RESOURCE:
    case CardRenderItemType.RESOURCE_CUBE:
    case CardRenderItemType.SCIENCE:
    case CardRenderItemType.CAMPS:
      units = this.resourceCount ?? 0;
      break;

    case CardRenderItemType.JOVIAN:
      units = player?.getTagCount(Tags.JOVIAN, 'vps');
      break;
    case CardRenderItemType.MOON:
      units = player?.getTagCount(Tags.MOON, 'vps');
      break;
    }

    if (units === undefined) {
      throw new Error('Not yet handled');
    }
    return vps.points * Math.floor(units / vps.target);
  }

  private static autopopulateMetadataVictoryPoints(properties: StaticCardProperties) {
    const vps = properties.victoryPoints;
    if (vps === undefined) {
      return;
    }

    if (vps === 'special') {
      if (properties.metadata.victoryPoints === undefined) {
        throw new Error('When card.victoryPoints is \'special\', metadata.vp and getVictoryPoints must be supplied');
      }
      return;
    } else {
      if (properties.metadata.victoryPoints !== undefined) {
        throw new Error('card.victoryPoints and metadata.victoryPoints cannot be on the same card');
      }
    }

    if (typeof(vps) === 'number') {
      properties.metadata.victoryPoints = vps;
      return;
    }
    if (vps.type === 'resource') {
      if (properties.resourceType === undefined) {
        throw new Error('When defining a card-resource based VP, resourceType must be defined.');
      }
      properties.metadata.victoryPoints = CardRenderDynamicVictoryPoints.resource(properties.resourceType, vps.points, vps.per);
      return;
    } else {
      properties.metadata.victoryPoints = CardRenderDynamicVictoryPoints.tag(vps.type, vps.points, vps.per);
    }
  }

  public getCardDiscount(_player?: Player, card?: IProjectCard): number {
    if (this.cardDiscount === undefined) {
      return 0;
    }
    let sum = 0;
    const discounts = Array.isArray(this.cardDiscount) ? this.cardDiscount : [this.cardDiscount];
    for (const discount of discounts) {
      if (discount.tag === undefined) {
        sum += discount.amount;
      } else {
        const tags = card?.tags.filter((tag) => tag === discount.tag).length ?? 0;
        if (discount.per !== 'card') {
          sum += discount.amount * tags;
        } else if (tags > 0) {
          sum += discount.amount;
        }
      }
    }
    return sum;
  }
}
