import {CardType} from './CardType';
import {AndOptions} from '../inputs/AndOptions';
import {IProjectCard} from './IProjectCard';
import {ISpace} from '../boards/ISpace';
import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {Tags} from './Tags';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ResourceType} from '../ResourceType';
import {CardName} from '../CardName';
import {ICardMetadata} from './ICardMetadata';
import {StandardProjectCard} from './StandardProjectCard';
import {CardRequirements} from './CardRequirements';
import {GlobalParameter} from '../GlobalParameter';
import {BoardType} from '../boards/BoardType';
import {Units} from '../Units';

export interface IActionCard {
    action: (player: Player) => OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined;
    canAct: (player: Player) => boolean;
}

export function isIActionCard(object: any): object is IActionCard {
  return object !== undefined && object.canAct !== undefined && object.action !== undefined;
}

export interface IResourceCard {
    resourceCount: number;
    resourceType?: ResourceType;
}

export interface CardDiscount {
  tag?: Tags, // When absent, discount applies to all cards.
  amount: number
 }
export interface VictoryPoints {
    type: 'resource' | Tags,
    points: number,
    per: number,
  }

export namespace VictoryPoints {
  export function resource(points: number, per: number): VictoryPoints {
    return {type: 'resource', points, per};
  }
  export function tags(tag: Tags, points: number, per: number): VictoryPoints {
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
    cardDiscount?: CardDiscount;
    // parameter is a Morningstar Inc. special case.
    getRequirementBonus?: (player: Player, parameter: GlobalParameter) => number;
    victoryPoints?: number | 'special' | VictoryPoints,
    getVictoryPoints: (player: Player) => number;
    onCardPlayed?: (player: Player, card: IProjectCard) => OrOptions | void;
    onStandardProject?: (player: Player, projectType: StandardProjectCard) => void;
    onTilePlaced?: (cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) => void;
    onDiscard?: (player: Player) => void;
    cost?: number;
    cardType: CardType;
    requirements?: CardRequirements;
    metadata: ICardMetadata;
    warning?: string | Message;
    productionBox?: Units;
    produce?: (player: Player) => void;
    tr?: TRSource,
}

