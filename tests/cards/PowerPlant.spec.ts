
import { expect } from "chai";
import { PowerPlant } from "../../src/cards/PowerPlant";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PowerPlant", function () {
    it("Should play", function () {
        const card = new PowerPlant();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.play(player, game)).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
    });
});
