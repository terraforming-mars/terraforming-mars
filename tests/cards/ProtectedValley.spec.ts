
import { expect } from "chai";
import { ProtectedValley } from "../../src/cards/ProtectedValley";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("ProtectedValley", function () {
    it("Should play", function () {
        const card = new ProtectedValley();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
        expect(player.megaCreditProduction).to.eq(2);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
