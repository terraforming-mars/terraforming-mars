import {IAward} from './IAward';
import {Player} from '../Player';
import {TileType} from '../TileType';

// TODO(kberg): Landlord should take into account The Moon.
export class Landlord implements IAward {
    public name: string = 'Landlord';
    public description: string = 'Owning the most tiles in play'
    public getScore(player: Player): number {
      return player.game.board.spaces.filter((space) => space.tile !== undefined && space.tile.tileType !== TileType.OCEAN && space.player === player).length;
    }
}
