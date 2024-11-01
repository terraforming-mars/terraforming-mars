import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Briber extends BaseMilestone {
  constructor() {
    super(
      'Briber',
      'To get this Milestone, pay 12 MC, in addition to the normal claim cost of 8 MC (so, 20 MC in total)',
      0,
    );
  }

  public getScore(_player: IPlayer): number {
    // Which value should be provided here? 20, 0?
    return 0;
  }
}
