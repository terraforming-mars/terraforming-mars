
import { expect } from "chai";
import { ArtificialLake } from "../../src/cards/ArtificialLake";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { SpaceType } from "../../src/SpaceType";
import { TileType } from "../../src/TileType";
import * as constants from '../../src/constants';

describe("ArtificialLake", function () {
    it("Can't play", function () {
        const card = new ArtificialLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ArtificialLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;
        expect(action instanceof SelectSpace).to.eq(true);
        action.availableSpaces.forEach((space) => {
            expect(space.spaceType).to.eq(SpaceType.LAND);
        });
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.OCEAN);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
    it("Does not suggest a place for an ocean if all oceans are already placed", function () {
        const card = new ArtificialLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("no_oceans_game", [player,player], player);

        // Set temperature level to fit requirements
        (game as any).temperature = -6;

        // Set oceans count to the max value
        for (const space of game.getSpaces(SpaceType.OCEAN)) {
            if (game.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
                game.addOceanTile(player, space.id)
            }
        }

        // Card is still playable to get VPs...
        expect(card.canPlay(player, game)).to.eq(true);

        // ...but an action to place ocean is not unavailable
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
});
