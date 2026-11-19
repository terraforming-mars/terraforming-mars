import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {BoardName} from '../../../common/boards/BoardName';

export class Pioneer extends BaseMilestone {
  public readonly automaDescription = '4+ colonies (cubes on Space #7, #10 and Energy #8 each build a colony)';
  public readonly automaMapDescriptions = {
    [BoardName.UTOPIA_PLANITIA]: '4+ colonies',
  };
  constructor() {
    super(
      'Pioneer',
      'Have 4 colonies',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.getColoniesCount();
  }
}
