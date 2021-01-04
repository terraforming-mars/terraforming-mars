import {Game} from '../../Game';
import {ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {OrOptions} from '../../inputs/OrOptions';

export interface CorporationCard extends ICard {
    initialActionText?: string;
    initialAction?: (player: Player, game: Game) => PlayerInput | undefined;
    startingMegaCredits: number;
    cardCost?: number;
    onCorpCardPlayed?: (
        player: Player,
        game: Game,
        card: CorporationCard
    ) => OrOptions | void;
    onProductionPhase?: (player: Player) => undefined;
    isDisabled?: boolean;
}
