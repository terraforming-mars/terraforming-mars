
import { expect } from "chai";
import { HousePrinting } from "../../../src/cards/prelude/HousePrinting";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("HousePrinting", function () {
    it("Can play", function () {
        const card = new HousePrinting();
        expect(card.canPlay()).to.eq(true);
    });
    it("Should play", function () {
        const card = new HousePrinting();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
        expect(player.steelProduction).to.eq(1);
    });
});
