import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Networker extends BaseMilestone {
  constructor() {
    super(
      'Networker',
      'Have placed 3 tiles adjacent to tiles that grant adjacency bonuses',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.game.aresData?.milestoneResults.find((e) => e.id === player.id)?.networkerCount || 0;
  }
}
