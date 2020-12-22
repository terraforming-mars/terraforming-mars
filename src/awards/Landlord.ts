import {IAward} from './IAward';
import {Player} from '../Player';
import {Game} from '../Game';
import {TileType} from '../TileType';

export class Landlord implements IAward {
    public name: string = 'Landlord';
    public description: string = 'Owning the most tiles in play'
    public getScore(player: Player, game: Game): number {
      return game.board.spaces.filter((space) => space.tile !== undefined && space.tile.tileType !== TileType.OCEAN && space.player === player.id).length;
    }
}
