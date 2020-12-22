import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Game} from '../Game';

export class PolarExplorer implements IMilestone {
    public name: string = 'Polar Explorer';
    public description: string = 'Requires that you have 3 tiles on the two bottom rows'
    public getScore(player: Player, game: Game): number {
      return game.board.spaces
        .filter((space) => space.player === player.id &&
        space.tile !== undefined &&
        space.y >= 7 && space.y <= 8).length;
    }
    public canClaim(player: Player, game: Game): boolean {
      return this.getScore(player, game) >= 3;
    }
}

