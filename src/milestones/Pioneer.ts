import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Pioneer implements IMilestone {
    public name: string = 'Pioneer';
    public description: string = 'Requires that you have 3 colonies in play'
    public getScore(player: Player): number {
      return player.getColoniesCount();
    }
    public canClaim(player: Player): boolean {
      return this.getScore(player) >= 3;
    }
}
