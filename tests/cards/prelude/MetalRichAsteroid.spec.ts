
import { expect } from "chai";
import { MetalRichAsteroid } from "../../../src/cards/prelude/MetalRichAsteroid";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("Metal-RichAsteroid", function () {
    it("Should play", function () {
        const card = new MetalRichAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(player.titanium).to.eq(4);
        expect(player.steel).to.eq(4);
        expect(game.getTemperature()).to.equal(-28);
    });
});
