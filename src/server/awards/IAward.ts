import {AwardName} from '../../common/ma/AwardName';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

export interface IAward {
    name: AwardName;
    description: string;
    getScore(player: IPlayer): number;
    /**
     * MarsBot's score.
     *
     * Only for awards where the automa rules differ from `getScore` for MarsBot's player.
     */
    marsBotScore?(bot: IMarsBot): number;
}
