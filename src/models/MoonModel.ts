import {ISpace} from '../boards/ISpace';
import {Color} from '../Color';
import {Game} from '../Game';
import {MoonExpansion} from '../moon/MoonExpansion';
import {TileType} from '../TileType';
import {SpaceModel} from './SpaceModel';

export interface MoonModel {
  spaces: Array<SpaceModel>;
  colonyRate: number;
  miningRate: number;
  logisticsRate: number;
}

export namespace MoonModel {
  export function serialize(game: Game): MoonModel | undefined {
    return MoonExpansion.ifElseMoon(game, (moonData) => {
      return {
        logisticsRate: moonData.logisticRate,
        miningRate: moonData.miningRate,
        colonyRate: moonData.colonyRate,
        spaces: getSpaces(moonData.moon.spaces),
      };
    }, () => undefined);
  }


// TODO(kberg): remove these two functions.

// Oceans can't be owned so they shouldn't have a color associated with them
// Land claim can have a color on a space without a tile
function getColor(space: ISpace): Color | undefined {
  if (
    (space.tile === undefined || space.tile.tileType !== TileType.OCEAN) &&
    space.player !== undefined
  ) {
    return space.player.color;
  }
  return undefined;
}

function getSpaces(spaces: Array<ISpace>): Array<SpaceModel> {
  return spaces.map((space) => {
    return {
      x: space.x,
      y: space.y,
      id: space.id,
      bonus: space.bonus,
      spaceType: space.spaceType,
      tileType: space.tile && space.tile.tileType,
      color: getColor(space),
      highlight: undefined,
    };
  });
}
}
