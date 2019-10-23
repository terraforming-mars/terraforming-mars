
import { expect } from "chai";
import { MicroMills } from "../../src/cards/MicroMills";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("MicroMills", function () {
    it("Should play", function () {
        const card = new MicroMills();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.heatProduction).to.eq(1);
    });
});
