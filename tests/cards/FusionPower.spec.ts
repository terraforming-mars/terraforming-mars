
import { expect } from "chai";
import { FusionPower } from "../../src/cards/FusionPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("FusionPower", function () {
    it("Can't play", function () {
        const card = new FusionPower();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new FusionPower();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card, card);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(3);
    });
});
