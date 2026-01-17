import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {GlobalParameter} from '@/common/GlobalParameter';

export class Hydrologist extends BaseMilestone {
  constructor() {
    super(
      'Hydrologist',
      'Have placed 4 oceans.',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.globalParameterSteps[GlobalParameter.OCEANS];
  }
}
