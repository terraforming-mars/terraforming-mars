import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {IPlayer} from '../../src/server/IPlayer';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TileType} from '../../src/common/TileType';
import {Space} from '../../src/server/boards/Space';
import {AresHandler} from '../../src/server/ares/AresHandler';
import {MultiMap} from 'mnemonist';

export const ALL_ADJACENCY_BONUSES = [
  SpaceBonus.TITANIUM,
  SpaceBonus.STEEL,
  SpaceBonus.PLANT,
  SpaceBonus.DRAW_CARD,
  SpaceBonus.HEAT,
  SpaceBonus.ANIMAL,
  SpaceBonus.MEGACREDITS,
  SpaceBonus.MICROBE,
  SpaceBonus.ENERGY,
];

export class AresTestHelper {
  public static getHazards(player: IPlayer): Array<Space> {
    return player.game.board.getSpaces(SpaceType.LAND, player).filter((space) => AresHandler.hasHazardTile(space));
  }

  public static byTileType(spaces: Array<Space>): MultiMap<TileType, Space> {
    const map = new MultiMap<TileType, Space>();
    spaces.forEach((space) => {
      if (space.tile) {
        map.set(space.tile.tileType, space);
      }
    });
    return map;
  }
}
