import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from './IProjectCard';
import {ISpace} from '../boards/ISpace';
import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {Tags} from '../../common/cards/Tags';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {ICardMetadata} from '../../common/cards/ICardMetadata';
import {StandardProjectCard} from './StandardProjectCard';
import {CardRequirements} from './CardRequirements';
import {GlobalParameter} from '../../common/GlobalParameter';
import {BoardType} from '../boards/BoardType';
import {Units} from '../../common/Units';
import {CardDiscount} from '../../common/cards/Types';
import {IVictoryPoints} from '../../common/cards/IVictoryPoints';

export interface IActionCard {
    action: (player: Player) => PlayerInput | undefined;
    canAct: (player: Player) => boolean;
}

export function isIActionCard(object: any): object is IActionCard {
  return object !== undefined && object.canAct !== undefined && object.action !== undefined;
}

export interface IResourceCard {
    resourceCount: number;
    resourceType?: CardResource;
}

export namespace VictoryPoints {
  export function resource(points: number, per: number): IVictoryPoints {
    return {type: 'resource', points, per};
  }
  export function tags(tag: Tags, points: number, per: number): IVictoryPoints {
    return {type: tag, points, per};
  }
}

// TRSource represents the ways an action will gain TR. This is used exclusively to compute
// tax when Reds are in power.
export interface TRSource {
    oxygen?: number,
    temperature?: number,
    oceans?: number,
    tr?: number,
    venus?: number
    moonColony?: number,
    moonMining?: number,
    moonLogistics?: number,
  }

export interface ICard extends Partial<IActionCard>, IResourceCard {
    name: CardName;
    tags: Array<Tags>;
    play: (player: Player) => PlayerInput | undefined;
    getCardDiscount?: (player: Player, card: IProjectCard) => number;
    cardDiscount?: CardDiscount | Array<CardDiscount>;
    // parameter is a Morningstar Inc. special case.
    getRequirementBonus?: (player: Player, parameter: GlobalParameter) => number;
    victoryPoints?: number | 'special' | IVictoryPoints,
    getVictoryPoints: (player: Player) => number;
    onCardPlayed?: (player: Player, card: IProjectCard) => PlayerInput | undefined | void;
    onStandardProject?: (player: Player, projectType: StandardProjectCard) => void;
    onTilePlaced?: (cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) => void;
    onDiscard?: (player: Player) => void;

    /**
     * Optional callback when a resource is added to this card.
     *
     * @param player the player whose turn it is. Expected to be the player that owns this card.
     * @param playedCard the card that received resources. Can be itself, but
     * for cards like Meat Industry, `playedCard` is the destination card.
     * @param count the number of resources added to `card`
     */
    onResourceAdded?: (player: Player, playedCard: ICard, count: number) => void;

    cost?: number;
    cardType: CardType;
    requirements?: CardRequirements;
    metadata: ICardMetadata;
    warning?: string | Message;
    productionBox?: Units;
    produce?: (player: Player) => void;
    tr?: TRSource,
}

