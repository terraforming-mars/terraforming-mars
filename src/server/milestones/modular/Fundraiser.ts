import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {BoardName} from '../../../common/boards/BoardName';

export class Fundraiser extends BaseMilestone {
  public readonly automaDescription = 'Event track ≥ 8';
  public readonly automaMapDescriptions = {
    [BoardName.TERRA_CIMMERIA_NOVA]: 'Event track ≥ 10',
  };
  constructor() {
    super(
      'Fundraiser',
      'Have 12 M€ production',
      12);
  }
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }
}
