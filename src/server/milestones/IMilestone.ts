import {Player} from '../Player';

export interface IMilestone {
    name: string;
    description: string;
    canClaim: (player: Player) => boolean;
    getScore: (player: Player) => number;
}
