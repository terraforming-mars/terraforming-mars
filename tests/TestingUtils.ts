import { Player } from "../src/Player";
import { Game, GameOptions } from "../src/Game";
import * as constants from "../src/constants"
import { SpaceType } from "../src/SpaceType";
import { BoardName } from "../src/BoardName";

export const maxOutOceans = function(player: Player, game: Game, toValue: number = 0): void {
    if (toValue < 1) {
        toValue = constants.MAX_OCEAN_TILES;
    }
    
    for (const space of game.board.getSpaces(SpaceType.OCEAN, player)) {
        if (space.tile !== undefined) continue;
        if (game.board.getOceansOnBoard() >= toValue) break;
        game.addOceanTile(player, space.id)
    }
};

export const resetBoard = function(game: Game): void {
    game.board.spaces.forEach((space) => {
        space.player = undefined;
        space.tile = undefined;
    });
};

export const setCustomGameOptions = function(options: object = {}): GameOptions {
    const defaultOptions = {
        draftVariant: false,
        initialDraftVariant: false,
        corporateEra: true,
        randomMA: false,
        preludeExtension: false,
        venusNextExtension: true,
        coloniesExtension: false,
        turmoilExtension: true,
        boardName: BoardName.ORIGINAL,
        showOtherPlayersVP: false,
        customCorporationsList: [],
        solarPhaseOption: false,
        shuffleMapOption: false,
        promoCardsOption: false,
        undoOption: false,
        startingCorporations: 2,
        includeVenusMA: true,
        soloTR: false,
        clonedGamedId: undefined
      };
      
    return Object.assign(defaultOptions, options) as GameOptions;
}
