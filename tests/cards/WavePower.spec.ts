
import { expect } from "chai";
import { WavePower } from "../../src/cards/WavePower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("WavePower", function () {
    it("Can't play", function () {
        const card = new WavePower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new WavePower();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(1);
    });
});
