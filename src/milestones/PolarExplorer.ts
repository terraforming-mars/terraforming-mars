import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {isHazardTileType} from '../TileType';

export class PolarExplorer implements IMilestone {
    public name: string = 'Polar Explorer';
    public description: string = 'Requires that you have 3 tiles on the two bottom rows'
    public getScore(player: Player): number {
      return player.game.board.spaces
        .filter((space) => space.player !== undefined &&
        space.player === player &&
        space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        space.y >= 7 && space.y <= 8).length;
    }
    public canClaim(player: Player): boolean {
      return this.getScore(player) >= 3;
    }
}

