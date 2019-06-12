
import { expect } from "chai";
import { TenMiningIndustries } from "../../src/cards/TenMiningIndustries";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("TenMiningIndustries", function () {
    it("Should play", function () {
        const card = new TenMiningIndustries();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(2);
        expect(player.megaCreditProduction).to.eq(2);
        player.playedCards.push(card);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(1);
    });
});
