
import { expect } from "chai";
import { IndustrialMicrobes } from "../../src/cards/IndustrialMicrobes";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("IndustrialMicrobes", function () {
    it("Should play", function () {
        const card = new IndustrialMicrobes();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        expect(player.steelProduction).to.eq(1);
    });
});
