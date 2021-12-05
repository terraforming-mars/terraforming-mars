import {IAward} from './IAward';
import {Player} from '../Player';
import {isHazardTileType} from '../TileType';

export class DesertSettler implements IAward {
    public name: string = 'Desert Settler';
    public description: string = 'Most tiles south of the equator (the four bottom rows)'
    public getScore(player: Player): number {
      return player.game.board.spaces
        .filter((space) => space.player !== undefined &&
            space.player === player &&
            space.tile !== undefined &&
            isHazardTileType(space.tile.tileType) === false &&
            space.y >= 5 && space.y <= 8).length;
    }
}
