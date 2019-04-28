
import { expect } from "chai";
import { Bushes } from "../../src/cards/Bushes";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Bushes", function () {
    it("Can't play", function () {
        const card = new Bushes();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Bushes();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.plantProduction).to.eq(2);
        expect(player.plants).to.eq(2);
    });
});
