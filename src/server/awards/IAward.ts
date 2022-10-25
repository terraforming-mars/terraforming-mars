import {AwardName} from '../../common/ma/AwardName';
import {Player} from '../Player';

export interface IAward {
    name: AwardName;
    description: string;
    getScore: (player: Player) => number;
}
