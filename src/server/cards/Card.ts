import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardDiscount} from '../../common/cards/Types';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {CardResource} from '../../common/CardResource';
import {Tag} from '../../common/cards/Tag';
import {Player} from '../Player';
import {TRSource} from '../../common/cards/TRSource';
import {Units} from '../../common/Units';
import {CardRequirements} from './CardRequirements';
import {DynamicTRSource} from './ICard';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {CardRenderItemType} from '../../common/cards/render/CardRenderItemType';
import {IVictoryPoints} from '../../common/cards/IVictoryPoints';
import {IProjectCard} from './IProjectCard';
import {MoonExpansion} from '../moon/MoonExpansion';
import {PlayerInput} from '../PlayerInput';
import {isICorporationCard} from './corporation/ICorporationCard';
import {TileType} from '../../common/TileType';
import {Behavior} from '../behavior/Behavior';
import {getBehaviorExecutor} from '../behavior/BehaviorExecutor';

type ReserveUnits = Units & {deduct: boolean};
/* External representation of card properties. */
export interface StaticCardProperties {
  adjacencyBonus?: AdjacencyBonus;
  behavior?: Behavior | undefined;
  cardCost?: number;
  cardDiscount?: CardDiscount | Array<CardDiscount>;
  cardType: CardType;
  cost?: number;
  initialActionText?: string;
  metadata: ICardMetadata;
  requirements?: CardRequirements;
  name: CardName;
  reserveUnits?: Partial<ReserveUnits>,
  resourceType?: CardResource;
  startingMegaCredits?: number;
  tags?: Array<Tag>;
  tilesBuilt?: Array<TileType.MOON_HABITAT | TileType.MOON_MINE | TileType.MOON_ROAD>,
  tr?: TRSource | DynamicTRSource,
  victoryPoints?: number | 'special' | IVictoryPoints,
}

/*
 * Internal representation of card properties.
 */
type Properties = Omit<StaticCardProperties, 'reserveUnits'> & {
  reserveUnits?: ReserveUnits,
};

export const staticCardProperties = new Map<CardName, Properties>();

/**
 * Card is an implementation for most cards in the game, which provides one key features:
 *
 * 1. It stores key card properties into a static cache, which means that each instance of a card
 *    consumes very little memory.
 *
 * 2. It's key behavior is to provide a lot of the `canPlay` and `play` behavior currently
 *    in player.simpleCanPlay and player.simplePlay. These will eventually be removed and
 *    put right in here.
 *
 * In order to implement this default behavior, Card subclasses should ideally not
 * override `play` and `canPlay`. Instead, they should override `bespokeCanPlay` and
 * `bespokePlay`, which provide bespoke, or custom hand-crafted play and canPlay
 * behavior.
 *
 * If this seems counterintuitive, think about it this way: very little behavior should
 * be custom-written for each card, _no_ common behavior should be custom-written for
 * each card, either.
 */
export abstract class Card {
  private readonly properties: Properties;
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

      const p: Properties = {
        ...properties,
        reserveUnits: properties.reserveUnits === undefined ? undefined : {...Units.of(properties.reserveUnits), deduct: properties.reserveUnits.deduct ?? true},
      };
      staticCardProperties.set(properties.name, p);
      staticInstance = p;
    }
    this.properties = staticInstance;
  }
  public resourceCount = 0;
  public get adjacencyBonus() {
    return this.properties.adjacencyBonus;
  }
  public get behavior() {
    return this.properties.behavior;
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
  public get cardDiscount() {
    return this.properties.cardDiscount;
  }
  public get reserveUnits(): ReserveUnits {
    return this.properties.reserveUnits || {...Units.EMPTY, deduct: true};
  }
  public get tr(): TRSource | DynamicTRSource | undefined {
    return this.properties.tr;
  }
  public get victoryPoints(): number | 'special' | IVictoryPoints | undefined {
    return this.properties.victoryPoints;
  }
  public get tilesBuilt(): Array<TileType> {
    return this.properties.tilesBuilt || [];
  }
  public canPlay(player: Player) {
    if (this.requirements?.satisfies(player) === false) {
      return false;
    }
    if (this.behavior !== undefined && !getBehaviorExecutor().canExecute(this.behavior, player, this)) {
      return false;
    }
    return this.bespokeCanPlay(player);
  }

  public bespokeCanPlay(_player: Player): boolean {
    return true;
  }

  public play(player: Player) {
    if (!isICorporationCard(this) && this.reserveUnits.deduct === true) {
      const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
      player.deductUnits(adjustedReserveUnits);
    }
    if (this.behavior !== undefined) {
      getBehaviorExecutor().execute(this.behavior, player, this);
    }
    return this.bespokePlay(player);
  }

  public bespokePlay(_player: Player): PlayerInput | undefined {
    return undefined;
  }

  public onDiscard(player: Player): void {
    if (this.behavior !== undefined) {
      getBehaviorExecutor().onDiscard(this.behavior, player, this);
    }
    this.bespokeOnDiscard(player);
  }

  public bespokeOnDiscard(_player: Player): void {
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
        const count = player?.tags.count(tag, 'vps') ?? 0;
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
      units = player?.tags.count(Tag.JOVIAN, 'vps');
      break;
    case CardRenderItemType.MOON:
      units = player?.tags.count(Tag.MOON, 'vps');
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
