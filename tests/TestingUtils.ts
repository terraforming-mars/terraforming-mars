import { Player } from "../src/Player";
import { Game } from "../src/Game";
import * as constants from "../src/constants"
import { SpaceType } from "../src/SpaceType";

export const maxOutOceans = function(player: Player, game: Game, toValue: number = 0): void {
    if (toValue < 1) {
        toValue = constants.MAX_OCEAN_TILES;
    }
    
    for (const space of game.board.getSpaces(SpaceType.OCEAN)) {
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
