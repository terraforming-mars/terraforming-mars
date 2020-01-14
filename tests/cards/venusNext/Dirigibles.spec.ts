
import { expect } from "chai";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Dirigibles", function () {
    it("Should play", function () {
        const card = new Dirigibles();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new Dirigibles();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
});