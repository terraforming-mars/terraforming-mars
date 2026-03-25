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
import {CountableVictoryPoints} from '../../common/cards/CountableVictoryPoints';
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
import {SerializedCard} from '../SerializedCard';

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

export interface ICard {
  readonly name: CardName;
  readonly tags: ReadonlyArray<Tag>;
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
  victoryPoints?: number | 'special' | CountableVictoryPoints,
  getVictoryPoints(player: IPlayer, context?: GetVictoryPointsContext): number;
  /** Returns any dynamic influence value */
  getInfluenceBonus?: (player: IPlayer) => number;
  /** Called when cards are played. Corps have a different callback */
  onCardPlayed?(player: IPlayer, card: ICard): PlayerInput | undefined | void;
  onCardPlayedByAnyPlayer?(thisCardOwner: IPlayer, card: ICard, activePlayer: IPlayer): PlayerInput | undefined | void;
  onCardPlayedFromAnyPlayer?: never;
  onStandardProject?(player: IPlayer, project: IStandardProjectCard): void;
  onTilePlaced?(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType): void;
  onDiscard?(player: IPlayer): void;
  /**
   * Called when anybody gains TR
   *
   * @param cardOwner the owner of this card
   * @param player the player gaining TR
   * @param steps the number of steps gained
   */
  onIncreaseTerraformRatingByAnyPlayer?(cardOwner: IPlayer, player: IPlayer, steps: number): void;
  onIncreaseTerraformRating?: never;
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
   * @param cardOwner the player who owns THIS CARD.
   * @param identifyingPlayer the player performing the identification action,
   *        or undefined if it is the neutral player (game setup or global event.)
   * @param space the space that was just identified.
   */
  onIdentificationByAnyPlayer?(cardOwner: IPlayer, identifyingPlayer: IPlayer | undefined, space: Space): void;
  onIdentification?: never;

  /**
   * Optional callback when this card owner claims an underground resource.
   *
   * @param player the player performing the claim.
   * @param space the space that was excavated.
   */
  onClaim?(player: IPlayer, isExcavate: boolean, space: Space | undefined): void;

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
   * @param cardOwner the player who owns this card.
   * @param colonyOwner the player adding a colony.
   */
  onColonyAddedByAnyPlayer?(cardOwner: IPlayer, colonyOwner: IPlayer): void;
  onColonyAdded?: never;

  onNonCardTagAdded?(player: IPlayer, tag: Tag): void;

  readonly cost?: number; /** Used with IProjectCard and PreludeCard. */
  readonly type: CardType;
  readonly requirements: ReadonlyArray<CardRequirementDescriptor>;
  readonly metadata: CardMetadata;

  /**
   * Per-instance state-specific warnings about this card's action.
   * This is ephemeral data that gets reset between evaluations.
   * It is not serialized.
   *
   * See: IProjectCard.additionalProjectCosts
   */
  readonly warnings: Set<Warning>;

  readonly behavior?: Behavior,

  /**
   * Returns the contents of the card's production box.
   *
   * Use with Robotic Workforce and Cyberia Systems.
   *
   * Prefer this to `produce`.
   * Prefer `behavior` to this.
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

  /**
   * Additional custom serialization for this card.
   */
  serialize?(serialized: SerializedCard): void;
  /**
   * Additional custom deserialization for this card.
   */
  deserialize?(serialized: SerializedCard): void;

  /** The generation the card was activated. Used for Duncan and Underworld cards. */
  generationUsed?: number;
}

export interface IActionCard {
  action(player: IPlayer): PlayerInput | undefined;
  canAct(player: IPlayer): boolean;
}

export function isIActionCard(object: any): object is IActionCard {
  return object !== undefined && object.canAct !== undefined && object.action !== undefined;
}
