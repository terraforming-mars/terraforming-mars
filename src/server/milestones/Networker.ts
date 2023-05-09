import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Networker extends BaseMilestone {
  constructor() {
    super(
      'Networker',
      'Have placed 3 tiles adjacent to tiles that grant adjacency bonuses',
      3);
  }
  public getScore(player: Player): number {
    return player.game.aresData?.milestoneResults.find((e) => e.id === player.id)?.count || 0;
  }
}
