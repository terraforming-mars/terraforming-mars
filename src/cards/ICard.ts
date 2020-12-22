import {CardType} from './CardType';
import {AndOptions} from '../inputs/AndOptions';
import {IProjectCard} from '../cards/IProjectCard';
import {ISpace} from '../ISpace';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {Game} from '../Game';
import {Tags} from './Tags';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {StandardProjectType} from '../StandardProjectType';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ResourceType} from '../ResourceType';
import {CardName} from '../CardName';
import {CardMetadata} from '../cards/CardMetadata';

export interface IActionCard {
    action: (player: Player, game: Game) => OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined;
    canAct: (player: Player, game: Game) => boolean;
}

export interface IResourceCard {
    resourceType: ResourceType;
    resourceCount: number;
}

export interface ICard {
    name: CardName;
    tags: Array<Tags>;
    play: (player: Player, game: Game) => PlayerInput | undefined;
    action?: (player: Player, game: Game) => OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined;
    canAct?: (player: Player, game: Game) => boolean;
    getCardDiscount?: (player: Player, game: Game, card: IProjectCard) => number;
    getRequirementBonus?: (player: Player, game: Game, venusOnly?: boolean) => number;
    getVictoryPoints?: (player: Player, game: Game) => number;
    onCardPlayed?: (player: Player, game: Game, card: IProjectCard) => OrOptions | void;
    onStandardProject?: (player: Player, projectType: StandardProjectType) => void;
    onTilePlaced?: (player: Player, space: ISpace, game: Game) => void;
    onDiscard?: (player: Player) => void;
    resourceType?: ResourceType;
    resourceCount?: number;
    cost?: number;
    cardType: CardType;
    metadata?: CardMetadata;
    warning?: string;
}
