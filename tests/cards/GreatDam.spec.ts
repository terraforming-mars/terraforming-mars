
import { expect } from "chai";
import { GreatDam } from "../../src/cards/GreatDam";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("GreatDam", function () {
    it("Can't play", function () {
        const card = new GreatDam();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new GreatDam();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
    });
});
