import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from './IProjectCard';
import {ISpace} from '../boards/ISpace';
import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {CardRequirements} from './CardRequirements';
import {GlobalParameter} from '../../common/GlobalParameter';
import {BoardType} from '../boards/BoardType';
import {CardDiscount} from '../../common/cards/Types';
import {IVictoryPoints} from '../../common/cards/IVictoryPoints';
import {TileType} from '../../common/TileType';
import {Behavior} from '../behavior/Behavior';
import {TRSource} from '../../common/cards/TRSource';

export interface IHasCheckLoops {
    getCheckLoops(): number;
}

export function isIHasCheckLoops(object: any): object is IHasCheckLoops {
  return object.getCheckLoops !== undefined;
}

export namespace VictoryPoints {
  export function resource(points: number, per: number): IVictoryPoints {
    return {type: 'resource', points, per};
  }
  export function tags(tag: Tag, points: number, per: number): IVictoryPoints {
    return {type: tag, points, per};
  }
}

export type DynamicTRSource = (player: Player) => TRSource;

export interface ICard {
    name: CardName;
    tags: Array<Tag>;
    play: (player: Player) => PlayerInput | undefined;
    getCardDiscount?: (player: Player, card: IProjectCard) => number;
    cardDiscount?: CardDiscount | Array<CardDiscount>;
    // parameter is a Morningstar Inc. special case.
    getRequirementBonus?: (player: Player, parameter: GlobalParameter) => number;
    victoryPoints?: number | 'special' | IVictoryPoints,
    getVictoryPoints: (player: Player) => number;
    onCardPlayed?: (player: Player, card: IProjectCard) => PlayerInput | undefined | void;
    onStandardProject?: (player: Player, project: ICard) => void;
    onTilePlaced?: (cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) => void;
    onDiscard?: (player: Player) => void;
    /**
     * Called when anybody gains TR
     *
     * @param player the player gaining TR
     * @param cardOwner the owner of this card
     * @param steps the number of steps gained
     */
    onIncreaseTerraformRating?(player: Player, cardOwner: Player, steps: number): void;

    /**
     * Optional callback when a resource is added to this card.
     *
     * @param player the player whose turn it is. Expected to be the player that owns this card.
     * @param playedCard the card that received resources. Can be itself, but
     * for cards like Meat Industry, `playedCard` is the destination card.
     * @param count the number of resources added to `card`
     */
    onResourceAdded?: (player: Player, playedCard: ICard, count: number) => void;

    /** Used with IProjectCard only, I think. */
    cost?: number;
    cardType: CardType;
    requirements?: CardRequirements;
    metadata: ICardMetadata;
    warning?: string | Message;
    behavior?: Behavior,
    produce?: (player: Player) => void;
    tr?: TRSource | DynamicTRSource;
    resourceCount: number;
    resourceType?: CardResource;
    /** Currently used for The Moon, but can be expanded to encompass other tile-placing cards. */
    tilesBuilt?: Array<TileType>;
}

export interface IActionCard {
  action: (player: Player) => PlayerInput | undefined;
  canAct: (player: Player) => boolean;
}

export function isIActionCard(object: any): object is IActionCard {
  return object !== undefined && object.canAct !== undefined && object.action !== undefined;
}
