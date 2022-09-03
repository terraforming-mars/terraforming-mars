import {IMilestone} from './IMilestone';
import {Player} from '../Player';

// TODO(kberg): write a test.
// TODO(kberg): use MilestoneCount (ref: https://github.com/bafolts/terraforming-mars/pull/1659#discussion_r508128583)
export class Networker implements IMilestone {
  public readonly name = 'Networker';
  public readonly description = 'Place three tiles adjacent to tiles that grants adjacency bonus';
  public getScore(player: Player): number {
    return player.game.aresData?.milestoneResults.find((e) => e.id === player.id)?.count || 0;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
