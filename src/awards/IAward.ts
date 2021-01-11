import {Player} from '../Player';

export interface IAward {
    name: string;
    description: string;
    getScore: (player: Player) => number;
}
