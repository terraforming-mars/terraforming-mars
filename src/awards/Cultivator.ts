import {IAward} from './IAward';
import {Player} from '../Player';
import {TileType} from '../TileType';

export class Cultivator implements IAward {
    public name: string = 'Cultivator';
    public description: string = 'Most greenery tiles'
    public getScore(player: Player): number {
      return player.game.getSpaceCount(TileType.GREENERY, player);
    }
}
