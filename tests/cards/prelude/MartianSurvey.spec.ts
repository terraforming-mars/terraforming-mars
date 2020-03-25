
import { expect } from "chai";
import { MartianSurvey } from "../../../src/cards/prelude/MartianSurvey";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("MartianSurvey", function () {
    it("Can play", function () {
        const card = new MartianSurvey();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(true);
        game.increaseOxygenLevel(player, 2);
        game.increaseOxygenLevel(player, 2);
        game.increaseOxygenLevel(player, 1);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MartianSurvey();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(player.cardsInHand.length).to.eq(2);
    });
});
