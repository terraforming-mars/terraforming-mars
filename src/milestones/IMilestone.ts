import {Player} from '../Player';
import {Game} from '../Game';

export interface IMilestone {
    name: string;
    description: string;
    canClaim: (player: Player, game: Game) => boolean;
    getScore: (player: Player, _game: Game) => number;
}
