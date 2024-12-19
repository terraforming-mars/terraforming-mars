import {IPlayer} from '../IPlayer';
import {BaseMilestone} from './IMilestone';

export class Purifier extends BaseMilestone {
  constructor() {
    super(
      'Purifier',
      'Have removed at least 3 hazard tiles (excluding WGT)',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.game.aresData?.milestoneResults.find((e) => e.id === player.id)?.purifierCount || 0;
  }
}
