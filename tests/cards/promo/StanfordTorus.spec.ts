import { expect } from "chai";
import { StanfordTorus } from "../../../src/cards/promo/StanfordTorus";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("StanfordTorus", function () {
    it("Should play", function () {
        const card = new StanfordTorus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        expect(card.play(player, game)).to.eq(undefined);
        expect(game.getCitiesInPlay()).to.eq(1);
    });
    it("Should give victory points", function () {
        const card = new StanfordTorus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        expect(card.play(player, game)).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});