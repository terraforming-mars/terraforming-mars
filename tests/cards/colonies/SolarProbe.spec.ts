import { expect } from "chai";
import { SolarProbe } from "../../../src/cards/colonies/SolarProbe";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Research } from "../../../src/cards/Research";

describe("SolarProbe", function () {
    it("Should play", function () {
        const card = new SolarProbe();
        const card2 = new Research();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card2);
        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(player.cardsInHand).has.lengthOf(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});