import {RedTourismWave} from '@/server/cards/turmoil/RedTourismWave';
import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';
import {SpaceType} from '@/common/boards/SpaceType';
import {Board} from '@/server/boards/Board';

export class Tourist implements IAward {
  public readonly name = 'Tourist';
  public readonly description = 'Have the most empty spaces adjacent to your tiles';

  public getScore(player: IPlayer): number {
    const spacesOnMars = RedTourismWave.getAdjacentEmptySpacesCount(player);
    if (!player.game.moonData) {
      return spacesOnMars;
    }
    const moon = player.game.moonData.moon;
    const spacesOnTheMoon = moon.spaces.filter((space) => {
      if (space.spaceType === SpaceType.COLONY) {
        return false;
      }
      if (Board.hasRealTile(space)) {
        return false;
      }
      return moon.getAdjacentSpaces(space).some((adj) => {
        return adj.tile !== undefined && adj.player === player;
      });
    }).length;

    return spacesOnMars + spacesOnTheMoon;
  }
}
