import { expect } from "chai";
import { Recyclon } from "../../../src/cards/promo/Recyclon";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("Recyclon", function () {
    it("Should play", function () {
        const card = new Recyclon();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play(player);
        expect(play).is.undefined;
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(card.resourceCount).to.eq(1);       
    });
});