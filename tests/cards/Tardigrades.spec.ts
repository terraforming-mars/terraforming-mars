
import { expect } from "chai";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("Tardigrades", function () {
    it("Should play", function () {
        const card = new Tardigrades();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 7);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(1);
    });
    it("Should act", function () {
        const card = new Tardigrades();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
});
