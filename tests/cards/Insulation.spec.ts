
import { expect } from "chai";
import { Insulation } from "../../src/cards/Insulation";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Insulation", function () {
    it("Should play", function () {
        const card = new Insulation();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.heatProduction = 1;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(1);
        expect(player.heatProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(1);
    });
});
