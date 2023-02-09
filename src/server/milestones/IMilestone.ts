import {MilestoneName} from '../../common/ma/MilestoneName';
import {Player} from '../Player';

export interface IMilestone {
    name: MilestoneName;
    description: string;
    canClaim: (player: Player) => boolean;
    getScore: (player: Player) => number;
}
