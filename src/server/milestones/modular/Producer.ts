import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {sum} from '../../../common/utils/utils';
import {Units} from '../../../common/Units';

export class Producer extends BaseMilestone {
  public readonly automaDescription = '3+ tracks (except Venus) ≥ 16';
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
