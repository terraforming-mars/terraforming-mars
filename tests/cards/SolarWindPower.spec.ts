
import { expect } from "chai";
import { SolarWindPower } from "../../src/cards/SolarWindPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("SolarWindPower", function () {
    it("Should play", function () {
        const card = new SolarWindPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        expect(player.titanium).to.eq(2);
    });
});
