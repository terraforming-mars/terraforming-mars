import {expect} from 'chai';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {IPlayer} from '../../src/server/IPlayer';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TileType} from '../../src/common/TileType';
import {Space} from '../../src/server/boards/Space';
import {AresHandler} from '../../src/server/ares/AresHandler';

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
  // provides shared testing between Ecological Survey and Geological Survey
  public static testSurveyBonus(player: IPlayer, bonus: SpaceBonus, expectedMc: number) {
    // tile types in this test are irrelevant.
    const firstSpace = player.game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [bonus]};
    player.game.addTile(player, firstSpace, {tileType: TileType.RESTRICTED_AREA});

    expect(player.megaCredits).is.eq(0);
    const adjacentSpace = player.game.board.getAdjacentSpaces(firstSpace)[0];
    player.game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    expect(player.megaCredits).is.eq(expectedMc);
  }

  public static getHazards(player: IPlayer): Array<Space> {
    return player.game.board.getSpaces(SpaceType.LAND, player).filter((space) => AresHandler.hasHazardTile(space));
  }

  public static byTileType(spaces: Array<Space>): Map<number, Array<Space>> {
    // Got a better way to initialize this? LMK.
    const map: Map<number, Array<Space>> = new Map([
      [TileType.GREENERY, []],
      [TileType.OCEAN, []],
      [TileType.CITY, []],

      [TileType.CAPITAL, []],
      [TileType.COMMERCIAL_DISTRICT, []],
      [TileType.ECOLOGICAL_ZONE, []],
      [TileType.INDUSTRIAL_CENTER, []],
      [TileType.LAVA_FLOWS, []],
      [TileType.MINING_AREA, []],
      [TileType.MINING_RIGHTS, []],
      [TileType.MOHOLE_AREA, []],
      [TileType.NATURAL_PRESERVE, []],
      [TileType.NUCLEAR_ZONE, []],
      [TileType.RESTRICTED_AREA, []],

      [TileType.DEIMOS_DOWN, []],
      [TileType.GREAT_DAM, []],
      [TileType.MAGNETIC_FIELD_GENERATORS, []],

      [TileType.BIOFERTILIZER_FACILITY, []],
      [TileType.METALLIC_ASTEROID, []],
      [TileType.SOLAR_FARM, []],
      [TileType.OCEAN_CITY, []],
      [TileType.OCEAN_FARM, []],
      [TileType.OCEAN_SANCTUARY, []],
      [TileType.DUST_STORM_MILD, []],
      [TileType.DUST_STORM_SEVERE, []],
      [TileType.EROSION_MILD, []],
      [TileType.EROSION_SEVERE, []],
      [TileType.MINING_STEEL_BONUS, []],
      [TileType.MINING_TITANIUM_BONUS, []],
    ]);

    spaces.forEach((space) => {
      if (space.tile) {
        const tileType: TileType = space.tile.tileType;
        const e = map.get(tileType) || [];
        e.push(space);
        map.set(tileType, e);
      }
    });
    return map;
  }
}
