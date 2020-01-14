import { expect } from "chai";
import { VenusianInsects } from "../../../src/cards/venusNext/VenusianInsects";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("VenusianInsects", function () {
    it("Should play", function () {
        const card = new VenusianInsects();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 7);
        expect(card.getVictoryPoints(player)).to.eq(3);
    });
    it("Should act", function () {
        const card = new VenusianInsects();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
});
