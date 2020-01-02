import { expect } from "chai";
import { Celestic } from "../../../src/cards/venusNext/Celestic";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("Celestic", function () {
    it("Should play", function () {
        const card = new Celestic();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play();
        expect(play).to.eq(undefined);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        player.addResourceTo(card, 4);
        expect(card.getVictoryPoints(player)).to.eq(1);
    });
});