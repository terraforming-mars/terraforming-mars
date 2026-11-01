import {AwardName} from '../../common/ma/AwardName';
import {BoardName} from '../../common/boards/BoardName';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

export interface IAward {
    name: AwardName;
    description: string;
    getScore(player: IPlayer): number;
    /**
     * How MarsBot scores the award.
     *
     * Only for awards MarsBot plays against.
     */
    automaDescription?: string;
    /**
     * Where a game that plays a map's own award set words the rule differently from
     * `automaDescription`, the wording for that map.
     */
    automaMapDescriptions?: Partial<Record<BoardName, string>>;
    /**
     * MarsBot's score.
     *
     * Only for awards where the automa rules differ from `getScore` for MarsBot's player.
     */
    marsBotScore?(bot: IMarsBot): number;
}
