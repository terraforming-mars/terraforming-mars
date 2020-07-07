import { expect } from "chai";
import { RefugeeCamps } from "../../../src/cards/colonies/RefugeeCamps";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("RefugeeCamps", function () {
    let card : RefugeeCamps, player : Player;

    beforeEach(function() {
        card = new RefugeeCamps();
        player = new Player("test", Color.BLUE, false);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
        
        player.addResourceTo(card, 5);
        expect(card.getVictoryPoints()).to.eq(5);
    });

    it("Can't act", function () {
        player.setProduction(Resources.MEGACREDITS, -5);
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        expect(card.canAct(player)).to.eq(true);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
});