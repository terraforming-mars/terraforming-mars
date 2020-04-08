import { expect } from "chai";
import { MercurianAlloys } from "../../../src/cards/promo/MercurianAlloys";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("MercurianAlloys", function () {
    it("Can't play if not enough science tags available", function () {
        const card = new MercurianAlloys();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MercurianAlloys();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play(player);
        expect(play).to.eq(undefined);
        expect(player.titaniumValue).to.eq(4);
    });
});