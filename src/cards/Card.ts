import {ICardMetadata} from './ICardMetadata';
import {CardName} from '../CardName';
import {CardType} from './CardType';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {ResourceType} from '../ResourceType';
import {Tags} from './Tags';
import {Player} from '../Player';
import {Units} from '../Units';
import {CardRequirements} from './CardRequirements';
import {CardDiscount, IResourceCard, TRSource} from './ICard';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {CardRenderItemType} from './render/CardRenderItemType';

export interface StaticCardProperties {
  adjacencyBonus?: IAdjacencyBonus;
  cardCost?: number;
  cardType: CardType;
  cost?: number;
  initialActionText?: string;
  metadata: ICardMetadata;
  requirements?: CardRequirements;
  name: CardName;
  resourceType?: ResourceType;
  startingMegaCredits?: number;
  tags?: Array<Tags>;
  productionBox?: Units;
  cardDiscount?: CardDiscount;
  reserveUnits?: Units,
  tr?: TRSource,
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
  public canPlay(_player: Player) {
    return true;
  }
  // player is optional to support historical tests.
  public getVictoryPoints(player?: Player): number {
    const vps = this.properties.metadata.victoryPoints;
    if (vps === undefined) {
      return 0;
    }
    if (!(vps instanceof CardRenderDynamicVictoryPoints)) {
      return vps;
    }

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
      units = (this as unknown as IResourceCard).resourceCount ?? 0;
      break;

    case 'jovian':
      units = player?.getTagCount(Tags.JOVIAN, true, false);
      break;
    case 'moon':
      units = player?.getTagCount(Tags.MOON, true, false);
      break;
    }

    if (units === undefined) {
      throw new Error('Not yet handled');
    }
    return vps.points * Math.floor(units / vps.target);
  }
}


// TEMPERATURE = 'temperature',
// OXYGEN = 'oxygen',
// OCEANS = 'oceans',
// PLANTS = 'plants',
// TR = 'tr',
// HEAT = 'heat',
// ENERGY = 'energy',
// TITANIUM = 'titanium',
// STEEL = 'steel',
// MEGACREDITS = 'megacredits',
// CARDS = 'cards',
// EVENT = 'event',
// SPACE = 'space',
// EARTH = 'earth',
// BUILDING = 'building',
// COLONIES = 'colonies',
// SCIENCE = 'science',
// TRADE = 'trade',
// TRADE_DISCOUNT = 'trade_discount',
// TRADE_FLEET = 'trade_fleet',
// PLACE_COLONY = 'place_colony',
// CHAIRMAN = 'chairman',
// PARTY_LEADERS = 'party_leaders',
// DELEGATES = 'delegates',
// INFLUENCE = 'influence',
// NO_TAGS ='no_tags',
// PRESERVATION = 'preservation',
// WILD = 'wild',
// FIGHTER = 'fighter',
// CAMPS = 'camps',
// DIVERSE_TAG = 'diverse_tag',
// CITY = 'city',
// GREENERY = 'greenery',
// PLATE = 'plate',
// TEXT = 'text',
// NBSP = 'nbsp',
// EMPTY_TILE = 'empty_tile',
// EMPTY_TILE_GOLDEN = 'empty_tile_golden',
// SELF_REPLICATING = 'self_replicating',
// MULTIPLIER_WHITE = 'multiplier_white',
// PROJECT_REQUIREMENTS = 'project_requirements',
// PRELUDE = 'prelude',
// AWARD = 'award',
// VP = 'vp',
// COMMUNITY = 'community',
// DISEASE = 'disease',
// MOON = 'moon',
// RESOURCE_CUBE = 'resource_cube',
// DATA_RESOURCE = 'data resource',
// MOON_COLONY = 'moon-colony',
// MOON_COLONY_RATE = 'moon-colony-rate',
// MOON_ROAD = 'moon-road',
// MOON_LOGISTICS_RATE = 'moon-logistics-rate',
// MOON_MINE = 'moon-mine',
// MOON_MINING_RATE = 'moon-mine-rate',
// SYNDICATE_FLEET = 'syndicate-fleet',
// MARS = 'mars',
