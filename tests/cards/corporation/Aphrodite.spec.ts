import { expect } from "chai";
import { Aphrodite } from "../../../src/cards/venusNext/Aphrodite";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("Aphrodite", function () {
    it("Should play", function () {
        const card = new Aphrodite();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(1);
        game.increaseVenusScaleLevel(player,2);
        expect(player.megaCredits).to.eq(51);
    });
});