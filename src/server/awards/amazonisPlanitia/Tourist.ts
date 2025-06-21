import {MoonExpansion} from '../../moon/MoonExpansion';
import {RedTourismWave} from '../../cards/turmoil/RedTourismWave';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Board} from '../../boards/Board';

export class Tourist implements IAward {
  public readonly name = 'Tourist';
  public readonly description = 'Have the most empty spaces adjacent to your tiles';

  public getScore(player: IPlayer): number {
    const spacesOnMars = RedTourismWave.getAdjacentEmptySpacesCount(player);
    const spacesOnTheMoon: number = MoonExpansion.ifElseMoon(player.game,
      (moonData) => {
        const moon = moonData.moon;
        return moon.spaces.filter((space) => {
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
      },
      () => 0);

    return spacesOnMars + spacesOnTheMoon;
  }
}
