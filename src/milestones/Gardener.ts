import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Game} from '../Game';
import {TileType} from '../TileType';

export class Gardener implements IMilestone {
    public name: string = 'Gardener';
    public description: string = 'Owning at least 3 greenery tiles'
    public getScore(player: Player, game: Game): number {
      return game.getSpaceCount(TileType.GREENERY, player);
    }
    public canClaim(player: Player, game: Game): boolean {
      return this.getScore(player, game) >= 3;
    }
}
