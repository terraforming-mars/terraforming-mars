import { expect } from "chai";
import { PhysicsComplex } from "../../src/cards/PhysicsComplex";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("PhysicsComplex", function () {
    let card : PhysicsComplex, player : Player;

    beforeEach(function() {
        card = new PhysicsComplex();
        player = new Player("test", Color.BLUE, false);
    });

    it("Can't act", function () {
        card.play();
        player.energy = 5;
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        player.energy = 6;
        expect(card.canAct(player)).to.eq(true);

        card.action(player);
        expect(player.energy).to.eq(0);
        expect(card.resourceCount).to.eq(1);
    });
});
