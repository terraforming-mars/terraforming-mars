
import { expect } from "chai";
import { ArtificialLake } from "../../src/cards/ArtificialLake";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { SpaceType } from "../../src/SpaceType";
import { TileType } from "../../src/TileType";

describe("ArtificialLake", function () {
    it("Can't play", function () {
        const card = new ArtificialLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ArtificialLake();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.availableSpaces.forEach((space) => {
            expect(space.spaceType).to.eq(SpaceType.LAND);
        });
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.OCEAN);
        expect(player.victoryPoints).to.eq(1);
    });
});
