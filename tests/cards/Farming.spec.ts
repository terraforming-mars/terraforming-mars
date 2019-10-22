
import { expect } from "chai";
import { Farming } from "../../src/cards/Farming";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Farming", function () {
    it("Can't play", function () {
        const card = new Farming();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Farming();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.plantProduction).to.eq(2);
        expect(player.plants).to.eq(2);
    });
});
