import {IAward} from './awards/IAward';
import {Player} from './Player';

export interface FundedAward {
    award: IAward;
    player: Player;
}

