import {AwardName} from '../../common/ma/AwardName';
import {BoardName} from '../../common/boards/BoardName';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';

export interface IAward {
    name: AwardName;
    description: string;
    getScore(player: IPlayer): number;
    /** How MarsBot scores the award. */
    automaDescription?: string;
    /** The automa description for this award, when played on certain maps. */
    automaMapDescriptions?: Partial<Record<BoardName, string>>;
    /**
     * MarsBot's score.
     *
     * Only for awards where the automa rules differ from `getScore` for MarsBot's player.
     */
    marsBotScore?(bot: IMarsBot): number;
}
