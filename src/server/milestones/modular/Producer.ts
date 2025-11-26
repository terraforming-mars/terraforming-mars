import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {sum} from '@/common/utils/utils';
import {Units} from '@/common/Units';

export class Producer extends BaseMilestone {
  constructor() {
    super(
      'Producer',
      'Have a combined total production of at least 16',
      16);
  }

  public getScore(player: IPlayer): number {
    return sum(Units.values(player.production.asUnits()));
  }
}
