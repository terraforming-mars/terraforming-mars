import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from './IProjectCard';
import {Space} from '../boards/Space';
import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {ICardMetadata} from '../../common/cards/ICardMetadata';
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

export type DynamicTRSource = (player: IPlayer) => TRSource;

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
   * The +/- bonus applied to global parameter requirements, e.g. Adaptation Technology.
   *
   * `parameter` describes which global parameter is being tested. As of now it only applies
   * to Morningstar Inc.
   */
  getRequirementBonus?(player: IPlayer, parameter: GlobalParameter): number;
  victoryPoints?: number | 'special' | IVictoryPoints,
  getVictoryPoints(player: IPlayer): number;
  /** Called when cards are played. However, if this is a corp, it'll be called when opponents play cards, too. */
  onCardPlayed?(player: IPlayer, card: IProjectCard): PlayerInput | undefined | void;
  onCardPlayedFromAnyPlayer?(thisCardOwner: IPlayer, playedCardOwner: IPlayer, card: IProjectCard): PlayerInput | undefined;
  onStandardProject?(player: IPlayer, project: ICard): void;
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
   * @param cardOwner the player who owns THIS CARD.
   * @param space the space that was just identified.
   */
  onIdentification?(identifyingPlayer: IPlayer, cardOwner: IPlayer, space: Space): void;

  /**
   * Optional callback when any player excavates a space.
   *
   * @param player the player performing the excavation action
   * @param space the space that was just excavated.
   */
  onExcavation?(player: IPlayer, space: Space): void;

  cost?: number; /** Used with IProjectCard and PreludeCard. */
  type: CardType;
  requirements: Array<CardRequirementDescriptor>;
  metadata: ICardMetadata;
  warning?: string | Message;
  behavior?: Behavior,
  produce?(player: IPlayer): void;
  tr?: TRSource | DynamicTRSource;
  resourceCount: number;
  resourceType?: CardResource;
  /** Currently used for The Moon, but can be expanded to encompass other tile-placing cards. */
  tilesBuilt?: Array<TileType>;
  isDisabled?: boolean; // For Pharmacy Union and CEO cards.
  /**
   * Extra data that the game will serialize and deserialize along with the card.
   *
   * ONLY store plain JSON data. Classes, objects, functions, will all be incorrectly serialized.
   */
  data?: JSONValue;
}

export interface IActionCard {
  action(player: IPlayer): PlayerInput | undefined;
  canAct(player: IPlayer): boolean;
}

export function isIActionCard(object: any): object is IActionCard {
  return object !== undefined && object.canAct !== undefined && object.action !== undefined;
}
