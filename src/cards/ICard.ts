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
import {CardMetadata} from './CardMetadata';
import {StandardProjectCard} from './StandardProjectCard';

export interface IActionCard {
    action: (player: Player) => OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined;
    canAct: (player: Player) => boolean;
}

export interface IResourceCard {
    resourceCount: number;
}

export interface ICard {
    name: CardName;
    tags: Array<Tags>;
    play: (player: Player) => PlayerInput | undefined;
    action?: (player: Player) => OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined;
    canAct?: (player: Player) => boolean;
    getCardDiscount?: (player: Player, card: IProjectCard) => number;
    getRequirementBonus?: (player: Player, venusOnly?: boolean) => number;
    getVictoryPoints?: (player: Player) => number;
    onCardPlayed?: (player: Player, card: IProjectCard) => OrOptions | void;
    onStandardProject?: (player: Player, projectType: StandardProjectCard) => void;
    onTilePlaced?: (player: Player, space: ISpace) => void;
    onDiscard?: (player: Player) => void;
    resourceType?: ResourceType;
    resourceCount?: number;
    cost?: number;
    cardType: CardType;
    metadata: CardMetadata;
    warning?: string | Message;
}

