
import { expect } from "chai";
import { MassConverter } from "../../src/cards/MassConverter";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TollStation } from "../../src/cards/TollStation";

describe("MassConverter", function () {
    it("Can't play", function () {
        const card = new MassConverter();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MassConverter();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card, card, card, card);
        expect(card.play(player)).to.eq(undefined);
        expect(player.energyProduction).to.eq(6);
        expect(card.getCardDiscount(player, game, card)).to.eq(0);
        expect(card.getCardDiscount(player, game, new TollStation())).to.eq(2);
    });
});
