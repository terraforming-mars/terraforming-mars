import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {TileType} from '../../common/TileType';
import {isHazardTileType} from '../../common/AresTileType';
import {MoonExpansion} from '../moon/MoonExpansion';

export class Landlord implements IAward {
  public readonly name = 'Landlord';
  public readonly description = 'Own the most tiles';
  public getScore(player: IPlayer): number {
    const marsSpaces = player.game.board.spaces.filter(
      // Don't simplifiy this to "space.tile?.tileType !== TileType.OCEAN" because that will make
      // Land Claim a valid space for Landlord.
      (space) => space.tile !== undefined && isHazardTileType(space.tile.tileType) === false && space.tile.tileType !== TileType.OCEAN && space.player === player).length;

    const moonSpaces = MoonExpansion.ifElseMoon(player.game,
      (moonData) => moonData.moon.spaces.filter(
        (space) => space.tile !== undefined && space.player === player).length,
      () => 0);

    return marsSpaces + moonSpaces;
  }
}
