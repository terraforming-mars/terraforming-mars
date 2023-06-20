import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardDiscount} from '../../common/cards/Types';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {CardResource} from '../../common/CardResource';
import {Tag} from '../../common/cards/Tag';
import {IPlayer} from '../IPlayer';
import {TRSource} from '../../common/cards/TRSource';
import {Units} from '../../common/Units';
import {CardRequirements} from './requirements/CardRequirements';
import {DynamicTRSource} from './ICard';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {CardRenderItemType} from '../../common/cards/render/CardRenderItemType';
import {IVictoryPoints} from '../../common/cards/IVictoryPoints';
import {IProjectCard} from './IProjectCard';
import {MoonExpansion} from '../moon/MoonExpansion';
import {PlayerInput} from '../PlayerInput';
import {TileType} from '../../common/TileType';
import {Behavior} from '../behavior/Behavior';
import {getBehaviorExecutor} from '../behavior/BehaviorExecutor';
import {Counter} from '../behavior/Counter';
import {PartialField} from '../../common/utils/types';

const NO_COST_CARD_TYPES: ReadonlyArray<CardType> = [
  CardType.CORPORATION,
  CardType.PRELUDE,
  CardType.CEO,
  CardType.STANDARD_ACTION,
] as const;

type FirstActionBehavior = Behavior & {text: string};

/*
 * Internal representation of card properties.
 */
type Properties = {
  /** @deprecated use behavior */
  adjacencyBonus?: AdjacencyBonus;
  behavior?: Behavior | undefined;
  cardCost?: number;
  cardDiscount?: CardDiscount | Array<CardDiscount>;
  type: CardType;
  cost?: number;
  initialActionText?: string;
  firstAction?: FirstActionBehavior;
  metadata: ICardMetadata;
  requirements?: CardRequirements;
  name: CardName;
  reserveUnits?: Units,
  resourceType?: CardResource;
  startingMegaCredits?: number;
  tags?: Array<Tag>;
  tilesBuilt?: Array<TileType.MOON_HABITAT | TileType.MOON_MINE | TileType.MOON_ROAD>,
  tr?: TRSource | DynamicTRSource,
  victoryPoints?: number | 'special' | IVictoryPoints,
}

/* External representation of card properties. */
export type StaticCardProperties = PartialField<Properties, 'reserveUnits'>;

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
      if (properties.type === CardType.CORPORATION && properties.startingMegaCredits === undefined) {
        throw new Error('must define startingMegaCredits for corporation cards');
      }
      if (properties.cost === undefined) {
        if (NO_COST_CARD_TYPES.includes(properties.type) === false) {
          throw new Error(`${properties.name} must have a cost property`);
        }
      }
      try {
        // TODO(kberg): apply these changes in CardVictoryPoints.vue and remove this conditional altogether.
        Card.autopopulateMetadataVictoryPoints(properties);

        validateBehavior(properties.behavior);
        validateBehavior(properties.firstAction);
      } catch (e) {
        throw new Error(`Cannot validate ${properties.name}: ${e}`);
      }

      const p: Properties = {
        ...properties,
        reserveUnits: properties.reserveUnits === undefined ? undefined : Units.of(properties.reserveUnits),
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
  public get type() {
    return this.properties.type;
  }
  public get cost() {
    return this.properties.cost === undefined ? 0 : this.properties.cost;
  }
  public get initialActionText() {
    return this.properties.initialActionText || this.properties.firstAction?.text;
  }
  public get firstAction() {
    return this.properties.firstAction;
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
  public get reserveUnits(): Units {
    return this.properties.reserveUnits || Units.EMPTY;
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
  public canPlay(player: IPlayer): boolean {
    //
    // Is this block necessary?
    const satisfied = this.requirements?.satisfies(player);
    if (satisfied === false) {
      return false;
    }
    // It's repeated at Player.simpleCanPlay.
    //

    if (this.behavior !== undefined && !getBehaviorExecutor().canExecute(this.behavior, player, this)) {
      return false;
    }
    return this.bespokeCanPlay(player);
  }

  public bespokeCanPlay(_player: IPlayer): boolean {
    return true;
  }

  public play(player: IPlayer): PlayerInput | undefined {
    player.stock.deductUnits(MoonExpansion.adjustedReserveCosts(player, this));
    if (this.behavior !== undefined) {
      getBehaviorExecutor().execute(this.behavior, player, this);
    }
    return this.bespokePlay(player);
  }

  public bespokePlay(_player: IPlayer): PlayerInput | undefined {
    return undefined;
  }

  public onDiscard(player: IPlayer): void {
    if (this.behavior !== undefined) {
      getBehaviorExecutor().onDiscard(this.behavior, player, this);
    }
    this.bespokeOnDiscard(player);
  }

  public bespokeOnDiscard(_player: IPlayer): void {
  }

  public getVictoryPoints(player: IPlayer): number {
    const vp = this.properties.victoryPoints;
    if (typeof(vp) === 'number') {
      return vp;
    }
    if (typeof(vp) === 'object') {
      return new Counter(player, this).count(vp as IVictoryPoints, 'vps');
    }
    if (vp === 'special') {
      throw new Error('When victoryPoints is \'special\', override getVictoryPoints');
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
      units = player?.tags.count(Tag.JOVIAN, 'raw');
      break;
    case CardRenderItemType.MOON:
      units = player?.tags.count(Tag.MOON, 'raw');
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
    const each = vps.each ?? 1;
    const per = vps.per ?? 1;
    if (vps.resourcesHere !== undefined) {
      if (properties.resourceType === undefined) {
        throw new Error('When defining a card-resource based VP, resourceType must be defined.');
      }
      properties.metadata.victoryPoints = CardRenderDynamicVictoryPoints.resource(properties.resourceType, each, per);
      return;
    } else if (vps.tag !== undefined) {
      properties.metadata.victoryPoints = CardRenderDynamicVictoryPoints.tag(vps.tag, each, per);
    } else if (vps.cities !== undefined) {
      properties.metadata.victoryPoints = CardRenderDynamicVictoryPoints.cities(each, per, vps.all);
    } else if (vps.colonies !== undefined) {
      properties.metadata.victoryPoints = CardRenderDynamicVictoryPoints.colonies(each, per, vps.all);
    } else if (vps.moon !== undefined) {
      if (vps.moon.road !== undefined) {
        // vps.per is ignored
        properties.metadata.victoryPoints = CardRenderDynamicVictoryPoints.moonRoadTile(each, vps.all);
      } else {
        throw new Error('moon defined, but no valid sub-object defined');
      }
    } else {
      throw new Error('Unknown VPs defined');
    }
  }

  public getCardDiscount(_player?: IPlayer, card?: IProjectCard): number {
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

export function validateBehavior(behavior: Behavior | undefined) : void {
  function validate(condition: boolean, error: string) {
    if (condition === false) {
      throw new Error(error);
    }
  }
  if (behavior === undefined) {
    return;
  }
  if (behavior.spend) {
    if (behavior.spend.megacredits ?? behavior.spend.heat) {
      validate(behavior.tr === undefined, 'spend.megacredits and spend.heat are not yet compatible with tr');
      validate(behavior.global === undefined, 'spend.megacredits and spend.heat are not yet compatible with global');
      validate(behavior.moon?.habitatRate === undefined, 'spend.megacredits and spend.heat are not yet compatible with moon.habitatRate');
      validate(behavior.moon?.logisticsRate === undefined, 'spend.megacredits and spend.heat are not yet compatible with moon.logisticsRate');
      validate(behavior.moon?.miningRate === undefined, 'spend.megacredits and spend.heat are not yet compatible with moon.miningRate');
    }
  }
}
