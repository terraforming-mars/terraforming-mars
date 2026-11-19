import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';

export class SpaceBaron implements IAward {
  public readonly name = 'Space Baron';
  public readonly description = 'Have the most space tags in play';
  public readonly automaDescription = 'Space track';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SPACE, 'award');
  }
}
