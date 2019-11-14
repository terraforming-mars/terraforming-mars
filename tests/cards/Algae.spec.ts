
import { expect } from "chai";
import { Algae } from "../../src/cards/Algae";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Algae", function () {
    it("Can't play", function () {
        const card = new Algae();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Algae();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.plants).to.eq(1);
        expect(player.plantProduction).to.eq(2);
    });
});
