import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {GlobalParameter} from '../../../common/GlobalParameter';

export class Thawer extends BaseMilestone {
  constructor() {
    super(
      'Thawer',
      'Have raised the temperature 5 steps.',
      5);
  }

  public getScore(player: IPlayer): number {
    return player.globalParameterSteps[GlobalParameter.TEMPERATURE];
  }
}
