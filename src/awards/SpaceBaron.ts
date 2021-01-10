import {IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class SpaceBaron implements IAward {
    public name: string = 'Space Baron';
    public description: string = 'Most space tags (event cards do not count)'
    public getScore(player: Player): number {
      return player.getTagCount(Tags.SPACE, false, false);
    }
}
