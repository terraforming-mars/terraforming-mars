import { expect } from "chai";
import { Hackers } from "../../src/cards/Hackers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("Hackers", function () {
    let card : Hackers, player : Player;

    beforeEach(function() {
        card = new Hackers();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(true);
    });
});
