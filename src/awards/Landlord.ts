import {IAward} from './IAward';
import {Player} from '../Player';
import {TileType, isHazardTileType} from '../common/TileType';
import {MoonExpansion} from '../moon/MoonExpansion';

export class Landlord implements IAward {
  public name: string = 'Landlord';
  public description: string = 'Owning the most tiles in play';
  public getScore(player: Player): number {
    const marsSpaces = player.game.board.spaces.filter(
      // Don't simplifiy this to "space.tile?.tileType !== TileType.OCEAN" because that will make
      // Land Claim a valid space for Landlord.
      (space) => space.tile !== undefined && isHazardTileType(space.tile.tileType) === false && space.tile.tileType !== TileType.OCEAN && space.player === player).length;

    const moonSpaces: number = MoonExpansion.ifElseMoon(player.game,
      (moonData) => moonData.moon.spaces.filter(
        (space) => space.tile !== undefined && space.player === player).length,
      () => 0);

    return marsSpaces + moonSpaces;
  }
}
