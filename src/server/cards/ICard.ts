import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from './IProjectCard';
import {Space} from '../boards/Space';
import {PlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {CardMetadata} from '../../common/cards/CardMetadata';
import {GlobalParameter} from '../../common/GlobalParameter';
import {BoardType} from '../boards/BoardType';
import {CardDiscount} from '../../common/cards/Types';
import {IVictoryPoints} from '../../common/cards/IVictoryPoints';
import {TileType} from '../../common/TileType';
import {Behavior} from '../behavior/Behavior';
import {TRSource} from '../../common/cards/TRSource';
import {CardRequirementDescriptor} from '../../common/cards/CardRequirementDescriptor';
import {OneOrArray} from '../../common/utils/types';
import {JSONValue} from '../../common/Types';
import {IStandardProjectCard} from './IStandardProjectCard';
import {Warning} from '../../common/cards/Warning';
import {Resource} from '../../common/Resource';
import {Units} from '../../common/Units';

/*
 * Represents a card which has an action that itself allows a player
 * to replay a card. Those cards can evaluate card playability recursively.
 * which consumes the entire call stack.
 *
 * Cards like that keep track of the number of times they're called as a
 * loop check.
 */
export interface IHasCheckLoops {
  getCheckLoops(): number;
}

export function isIHasCheckLoops(object: any): object is IHasCheckLoops {
  return object.getCheckLoops !== undefined;
}

/** Defines how ICard.getVictoryPoints works. */
export type GetVictoryPointsContext = 'default' | 'projectWorkshop';

// TODO(kberg): Move this out of ICard.
export type IdentificationTrigger = 'normal' | 'excavation' | 'tile';

export interface ICard {
  name: CardName;
  tags: Array<Tag>;
  play(player: IPlayer): PlayerInput | undefined;
  /**
   * Describes the M€ discount `player` could apply to playing `card`.
   *
   * If the discount code is simple, consider using `cardDiscount` instead.
   */
  getCardDiscount?(player: IPlayer, card: IProjectCard): number;
  /**
   * Describes type of discount this card applies to other cards.
   *
   * Achieves the same thing as `getCardDiscount` but for the simplest, most common use cases.
   *
   * Having descriptions this simple also makes it easier to render its discount in the UI.
   */
  cardDiscount?: OneOrArray<CardDiscount>;
  /**
   * Describes the M€ discount `player` could apply to playing `card`.
   */
  getStandardProjectDiscount?(player: IPlayer, card: IStandardProjectCard): number;

  /**
   * The +/- bonus applied to global parameter requirements, e.g. Adaptation Technology.
   *
   * `parameter` describes which global parameter is being tested.
   *
   * NB: Instances of `Card` allow using a JSON object to describe the global parameter bonus,
   * see `globalParameterRequirementBonus` for more information.
   */
  getGlobalParameterRequirementBonus(player: IPlayer, parameter: GlobalParameter): number;
  victoryPoints?: number | 'special' | IVictoryPoints,
  getVictoryPoints(player: IPlayer, context?: GetVictoryPointsContext): number;
  /** Returns any dynamic influence value */
  getInfluenceBonus?: (player: IPlayer) => number;
  /** Called when cards are played. However, if this is a corp, it'll be called when opponents play cards, too. */
  onCardPlayed?(player: IPlayer, card: ICard): PlayerInput | undefined | void;
  onCardPlayedFromAnyPlayer?(thisCardOwner: IPlayer, playedCardOwner: IPlayer, card: IProjectCard): PlayerInput | undefined;
  onStandardProject?(player: IPlayer, project: IStandardProjectCard): void;
  onTilePlaced?(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType): void;
  onDiscard?(player: IPlayer): void;
  /**
   * Called when anybody gains TR
   *
   * @param player the player gaining TR
   * @param cardOwner the owner of this card
   * @param steps the number of steps gained
   */
  onIncreaseTerraformRating?(player: IPlayer, cardOwner: IPlayer, steps: number): void;
  onGlobalParameterIncrease?(player: IPlayer, parameter: GlobalParameter, steps: number): void;

  /**
   * Optional callback when a resource is added to this card.
   *
   * @param player the player whose turn it is. Expected to be the player that owns this card.
   * @param playedCard the card that received resources. Can be itself, but
   * for cards like Meat Industry, `playedCard` is the destination card.
   * @param count the number of resources added to `card`
   */
  onResourceAdded?(player: IPlayer, playedCard: ICard, count: number): void;

  /**
   * Optional callback when any player identifies a space.
   *
   * @param identifyingPlayer the player performing the identification action
   *   or undefined if added by a neutral player.
   * @param cardOwner the player who owns THIS CARD.
   * @param space the space that was just identified.
   * @param trigger what triggered the identification.
   */
  onIdentification?(identifyingPlayer: IPlayer | undefined, cardOwner: IPlayer, space: Space, trigger: IdentificationTrigger): void;

  /**
   * Optional callback when any player excavates a space.
   *
   * @param player the player performing the excavation action
   * @param space the space that was just excavated.
   */
  onExcavation?(player: IPlayer, space: Space): void;

  /**
   * Callback when `player` gains (or loses) production.
   *
  * @param player the card owner.
   */
  onProductionGain?(player: IPlayer, resource: Resource, amount: number): void;
  /**
   * Callback during the production phase. Used to reset between generations.
   *
   * @param player the card owner.
   */
  onProductionPhase?(player: IPlayer): void;

  /**
   * Callback when ANY player adds a colony.
   *
   * @param player the player adding a colony.
   * @param cardOwner the player who owns this card.
   */
  onColonyAdded?(player: IPlayer, cardOwner: IPlayer): void;

  /** Callback when THIS player adds a colony to Leavitt. */
  onColonyAddedToLeavitt?(player: IPlayer): void;

  cost?: number; /** Used with IProjectCard and PreludeCard. */
  type: CardType;
  requirements: Array<CardRequirementDescriptor>;
  metadata: CardMetadata;

  /**
   * Per-instance state-specific warnings about this card's action.
   */
  warnings: Set<Warning>;

  behavior?: Behavior,

  /**
   * Returns the contents of the card's production box.
   *
   * Use with Robotic Workforce and Cyberia Systems.
   *
   * Prefer this to `produce` and prefer `behavior` to this.
   */
  productionBox?(player: IPlayer): Units;

  /**
   * Applies the production change for the card's production box.
   *
   * Use with Robotic Workforce and Cyberia Systems.
   * (Special case for Small Open Pit Mine.)
   *
   * Prefer both `productionBox` and `behavior` over this.
   */
  produce?(player: IPlayer): void;

  /** Terraform Rating predicted when this card is played */
  tr?: TRSource;
  /** Terraform Rating predicted when this card is played */
  computeTr?(player: IPlayer): TRSource;

  resourceCount: number;
  resourceType?: CardResource;
  protectedResources?: boolean;
  /** Indicates the tile built, which can be used in a variety of useful ways. */
  tilesBuilt: ReadonlyArray<TileType>;
  /** For Pharmacy Union, the card is effectively out of the game.. CEO uses it to ensure it can't be retriggered.  */
  isDisabled?: boolean;
  /**
   * Extra data that the game will serialize and deserialize along with the card.
   *
   * ONLY store plain JSON data. Classes, objects, functions, will all be incorrectly serialized.
   */
  data?: JSONValue;

  /** The generation the card was activated. Used for Duncan and Underworld cards. */
  // TODO(kberg): move to json?
  generationUsed?: number;
}

export interface IActionCard {
  action(player: IPlayer): PlayerInput | undefined;
  canAct(player: IPlayer): boolean;
}

export function isIActionCard(object: any): object is IActionCard {
  return object !== undefined && object.canAct !== undefined && object.action !== undefined;
}
