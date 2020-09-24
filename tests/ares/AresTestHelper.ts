import { expect } from "chai";
import { AresSpaceBonus } from "../../src/ares/AresSpaceBonus";
import { BoardName } from "../../src/BoardName";
import { Game, GameOptions } from "../../src/Game";
import { Player } from "../../src/Player";
import { Resources } from "../../src/Resources";
import { SpaceBonus } from "../../src/SpaceBonus";
import { SpaceType } from "../../src/SpaceType";
import { TileType } from "../../src/TileType";
import { ISpace } from "../../src/ISpace";

export const ARES_GAME_OPTIONS: GameOptions = {

    aresExtension: true,
    aresHazards: false,

    draftVariant: false,
    initialDraftVariant: false,
    corporateEra: true,
    randomMA: false,
    preludeExtension: false,
    venusNextExtension: false,
    coloniesExtension: false,
    turmoilExtension: false,
    boardName: BoardName.ORIGINAL,
    showOtherPlayersVP: false,
    customCorporationsList: [],
    customColoniesList: [],
    cardsBlackList: [],
    solarPhaseOption: false,
    shuffleMapOption: false,
    promoCardsOption: false,
    undoOption: false,
    fastModeOption: false,
    removeNegativeGlobalEventsOption: false,
    startingCorporations: 2,
    includeVenusMA: true,
    soloTR: false,
    clonedGamedId: undefined
  };

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
  }