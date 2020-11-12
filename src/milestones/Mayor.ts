import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Game} from '../Game';

export class Mayor implements IMilestone {
    public name: string = 'Mayor';
    public description: string = 'Owning at least 3 city tiles'
    public getScore(player: Player, game: Game): number {
      return player.getCitiesCount(game);
    }
    public canClaim(player: Player, game: Game): boolean {
      return this.getScore(player, game) >= 3;
    }
}
