
import { expect } from "chai";
import { MassConverter } from "../../src/cards/MassConverter";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TollStation } from "../../src/cards/TollStation";

describe("MassConverter", function () {
    it("Should throw", function () {
        const card = new MassConverter();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 5 science tags.");
    });
    it("Should play", function () {
        const card = new MassConverter();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card, card, card, card);
        expect(card.play(player, game)).to.eq(undefined);
        expect(player.energyProduction).to.eq(6);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](card)).to.eq(0);
        expect(player.cardDiscounts[0](new TollStation())).to.eq(2);
    });
});
