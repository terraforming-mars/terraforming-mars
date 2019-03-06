
import { expect } from "chai";
import { FusionPower } from "../../src/cards/FusionPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("FusionPower", function () {
    it("Should throw", function () {
        const card = new FusionPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 2 power tags");
    });
    it("Should play", function () {
        const card = new FusionPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(3);
    });
});
