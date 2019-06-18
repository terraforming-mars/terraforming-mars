
import { expect } from "chai";
import { SecurityFleet } from "../../src/cards/SecurityFleet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("SecurityFleet", function () {
    it("Can't act", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 5);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(5);
    });
    it("Should act", function () {
        const card = new SecurityFleet();
        const player = new Player("test", Color.BLUE, false);
        player.titanium = 1;
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.titanium).to.eq(0);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
});
