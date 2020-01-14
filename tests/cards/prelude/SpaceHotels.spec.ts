
import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { SpaceHotels } from "../../../src/cards/prelude/SpaceHotels";

describe("SpaceHotels", function () {
    it("Can play", function () {
        const player = new Player("foo", Color.BLUE, false);
        const card = new SpaceHotels();
        expect(card.canPlay(player)).to.eq(false);
        player.playedCards.push(card, card);
        expect(card.canPlay(player)).to.eq(true);
    });
    it("Should play", function () {
        const player = new Player("foo", Color.BLUE, false);
        const card = new SpaceHotels();
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    });
});
