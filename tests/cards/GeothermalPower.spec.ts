
import { expect } from "chai";
import { GeothermalPower } from "../../src/cards/GeothermalPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GeothermalPower", function () {
    it("Should play", function () {
        const card = new GeothermalPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(2);
    });
});
