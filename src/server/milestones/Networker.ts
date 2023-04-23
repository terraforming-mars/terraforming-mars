import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Networker extends BaseMilestone {
  constructor() {
    super(
      'Networker',
      'Place three tiles adjacent to tiles that grants adjacency bonus',
      3);
  }
  public getScore(player: Player): number {
    return player.game.aresData?.milestoneResults.find((e) => e.id === player.id)?.count || 0;
  }
}
