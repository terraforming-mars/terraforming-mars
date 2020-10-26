
import { expect } from "chai";
import { LagrangeObservatory } from "../../src/cards/LagrangeObservatory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("LagrangeObservatory", function () {
    it("Should play", function () {
        const card = new LagrangeObservatory();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(player.cardsInHand).has.lengthOf(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
