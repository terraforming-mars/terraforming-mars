
import { expect } from "chai";
import { TenMiningIndustries } from "../../src/cards/TenMiningIndustries";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TenMiningIndustries", function () {
    it("Should play", function () {
        const card = new TenMiningIndustries();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(2);
        expect(player.megaCreditProduction).to.eq(2);
        expect(game.onGameEnd.length).to.eq(1);
        player.playedCards.push(card);
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(1);
    });
});
