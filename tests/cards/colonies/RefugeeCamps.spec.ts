import { expect } from "chai";
import { RefugeeCamps } from "../../../src/cards/colonies/RefugeeCamps";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("RefugeeCamps", function () {
    it("Should act", function () {
        const card = new RefugeeCamps();
        const player = new Player("test", Color.BLUE, false);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
    it("Should play", function () {
        const card = new RefugeeCamps();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play();
        expect(action).to.eq(undefined);
        
        player.addResourceTo(card, 5);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(5);
    });
});