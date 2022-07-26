import {ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';

export interface ICorporationCard extends ICard {
    initialActionText?: string;
    initialAction?: (player: Player) => PlayerInput | undefined;
    startingMegaCredits: number;
    cardCost?: number;
    onCorpCardPlayed?: (player: Player, card: ICorporationCard) => PlayerInput | void;
    onProductionPhase?: (player: Player) => undefined;
    isDisabled?: boolean;
}
