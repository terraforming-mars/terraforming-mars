import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {BaseMilestone} from './IMilestone';
import {MilestoneName} from '@/common/ma/MilestoneName';

/**
 * A milestone that is achieved by having a certain number of specific tags.
 */
export class TagBasedMilestone extends BaseMilestone {
  constructor(name: MilestoneName, description: string, threshold: number, private readonly tags: Tag[]) {
    super(name, description, threshold);
  }

  public getScore(player: IPlayer): number {
    return player.tags.multipleCount(this.tags, 'milestone');
  }
}
