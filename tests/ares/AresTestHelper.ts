import { expect } from "chai";
import { AresSpaceBonus } from "../../src/ares/AresSpaceBonus";
import { Game } from "../../src/Game";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";
import { SpaceBonus } from "../../src/SpaceBonus";
import { SpaceType } from "../../src/SpaceType";
import { TileType } from "../../src/TileType";
import { ISpace } from "../../src/ISpace";
import { setCustomGameOptions } from "../TestingUtils";

export const ARES_OPTIONS_NO_HAZARDS = setCustomGameOptions({
    aresExtension: true,
    aresHazards: false,
});

export const ARES_OPTIONS_WITH_HAZARDS = setCustomGameOptions({
    aresExtension: true,
    aresHazards: true,
});

export const ALL_ADJACENCY_BONUSES = [
    SpaceBonus.TITANIUM,
    SpaceBonus.STEEL,
    SpaceBonus.PLANT,
    SpaceBonus.DRAW_CARD,
    SpaceBonus.HEAT,
    AresSpaceBonus.ANIMAL,
    AresSpaceBonus.MEGACREDITS,
    AresSpaceBonus.MICROBE,
    AresSpaceBonus.POWER
]

export class AresTestHelper {

    // provides shared testing between Ecological Survey and Geological Survey
    public static testSurveyBonus(game: Game, player: Player, bonus: SpaceBonus | AresSpaceBonus, expectedMc: number) {
        // tile types in this test are irrelevant.
        var firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
        firstSpace.adjacency = { bonus: [ bonus ] };
        game.addTile(player, SpaceType.LAND, firstSpace, {tileType: TileType.RESTRICTED_AREA});

        expect(player.getResource(Resources.MEGACREDITS)).is.eq(0);
        var adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
        game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
        expect(player.getResource(Resources.MEGACREDITS)).is.eq(expectedMc);
    }

    public static addGreenery(game: Game, player: Player): ISpace {
        var space = game.board.getAvailableSpacesForGreenery(player)[0];
        game.addGreenery(player, space.id);
        return space;
    }

    public static addOcean(game: Game, player: Player): ISpace {
      var space = game.board.getAvailableSpacesForOcean(player)[0];
      game.addOceanTile(player, space.id);
      return space;
    }

    public static getHazards(game: Game): Array<ISpace> {
      return game.board.getSpaces(SpaceType.LAND).filter(space => space.tile?.hazard === true);
    }

    public static byTileType(spaces: Array<ISpace>): Map<number, Array<ISpace>> {
      // Got a better way to initialize this? LMK.
      var map: Map<number, Array<ISpace>> = new Map([
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
    
      spaces.forEach(space => {
        if (space.tile) {
          var tileType: TileType = space.tile.tileType;
          var e = map.get(tileType) || [];
          e.push(space);
          map.set(tileType, e);
        }
      })
      return map;
    }

}