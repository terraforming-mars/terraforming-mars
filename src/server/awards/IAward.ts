import {AwardName} from '../../common/ma/AwardName';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '../automa/MarsBotCorpTypes';

export interface IAward {
    name: AwardName;
    description: string;
    getScore(player: IPlayer): number;
    /**
     * MarsBot's score, for the awards where the automa rules differ from getScore with
     * MarsBot's player. Most awards don't need it.
     */
    marsBotScore?(bot: IMarsBot): number;
}
