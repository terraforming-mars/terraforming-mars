
import { expect } from "chai";
import { EccentricSponsor } from "../../../src/cards/prelude/EccentricSponsor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("EccentricSponsor", function () {
    it("Gets card discount", function () {
        const card = new EccentricSponsor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.getCardDiscount(player, game)).to.eq(0);
        player.generationPlayed.set(card.name, 1);
        player.playedCards.push(card);
        expect(card.getCardDiscount(player, game)).to.eq(25);
    });
    it("Should play", function () {
        const card = new EccentricSponsor();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
});
