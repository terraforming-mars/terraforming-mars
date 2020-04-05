
import { expect } from "chai";
import { Hackers } from "../../src/cards/Hackers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';

describe("Hackers", function () {
    it("Can't play", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(true);
    });
});
