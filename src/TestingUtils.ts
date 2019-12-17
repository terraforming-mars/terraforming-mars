import { Player } from "./Player";
import { Game } from "./Game";
import * as constants from "./constants"
import { SpaceType } from "./SpaceType";


export const maxOutOceans = function(player: Player, game: Game): void {
    for (const space of game.getSpaces(SpaceType.OCEAN)) {
        if (game.getOceansOnBoard() >= constants.MAX_OCEAN_TILES) break;
        game.addOceanTile(player, space.id)
    }
};