import {ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {OrOptions} from '../../inputs/OrOptions';

export interface ICorporationCard extends ICard {
    initialActionText?: string;
    initialAction?: (player: Player) => PlayerInput | undefined;
    startingMegaCredits: number;
    cardCost?: number;
    onCorpCardPlayed?: (
        player: Player,
        card: ICorporationCard
    ) => OrOptions | void;
    onProductionPhase?: (player: Player) => undefined;
    isDisabled?: boolean;
}
