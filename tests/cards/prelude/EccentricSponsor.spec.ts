import { expect } from "chai";
import { EccentricSponsor } from "../../../src/cards/prelude/EccentricSponsor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("EccentricSponsor", function () {
    let card : EccentricSponsor, player : Player, game : Game;

    beforeEach(function() {
        card = new EccentricSponsor();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Gets card discount", function () {
        expect(card.getCardDiscount(player, game)).to.eq(0);
        player.lastCardPlayed = card;
        expect(card.getCardDiscount(player, game)).to.eq(25);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });
});
