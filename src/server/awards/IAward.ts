import {AwardName} from '../../common/ma/AwardName';
import {IPlayer} from '../IPlayer';

export interface IAward {
    name: AwardName;
    description: string;
    getScore(player: IPlayer): number;
}
