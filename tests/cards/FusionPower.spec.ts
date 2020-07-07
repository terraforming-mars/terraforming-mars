import { expect } from "chai";
import { FusionPower } from "../../src/cards/FusionPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("FusionPower", function () {
    let card : FusionPower, player : Player;

    beforeEach(function() {
        card = new FusionPower();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(card, card);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    });
});
