
import { expect } from "chai";
import { Cartel } from "../../src/cards/Cartel";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("Cartel", function () {
    it("Should play", function () { 
        const card = new Cartel();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(1);
        player.playedCards.push(card);
        card.play(player);
        expect(player.megaCreditProduction).to.eq(3);
    });
});
