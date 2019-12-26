
import { expect } from "chai";
import { PhysicsComplex } from "../../src/cards/PhysicsComplex";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("PhysicsComplex", function () {
    it("Can't act", function () {
        const card = new PhysicsComplex();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new PhysicsComplex();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 4);
        expect(card.getVictoryPoints(player)).to.eq(8);
    });
    it("Should act", function () {
        const card = new PhysicsComplex();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        player.energy = 6;
        const action = card.action(player);
        expect(player.energy).to.eq(0);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        expect(action).to.eq(undefined);
    });
});
