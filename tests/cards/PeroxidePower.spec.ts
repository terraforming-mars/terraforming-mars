
import { expect } from "chai";
import { PeroxidePower } from "../../src/cards/PeroxidePower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PeroxidePower", function () {
    it("Should play", function () {
        const card = new PeroxidePower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(-1);
        expect(player.energyProduction).to.eq(2);
    });
});
