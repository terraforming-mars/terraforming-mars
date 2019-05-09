
import { expect } from "chai";
import { WaterImportFromEuropa } from "../../src/cards/WaterImportFromEuropa";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";

describe("WaterImportFromEuropa", function () {
    it("Should throw", function () {
        const card = new WaterImportFromEuropa();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function() { card.action(player, game); }).to.throw("you do not have enough to pay for this action");
    });
    it("Should play", function () {
        const card = new WaterImportFromEuropa();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.onGameEnd.length).to.eq(1);
        player.playedCards.push(card);
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(1);
    });
    it("Should act", function () {
        const card = new WaterImportFromEuropa();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.titanium = 1;
        player.megaCredits = 11;
        const action = card.action(player, game) as AndOptions;
        expect(action).not.to.eq(undefined);
        action.options[1].cb(game.getAvailableSpacesForOcean(player)[0]);
        action.options[0].cb({ steel: 0, heat: 0, titanium: 1, megaCredits: 9 });
        action.cb();
        expect(game.getOceansOnBoard()).to.eq(1);
        expect(player.titanium).to.eq(0);
        expect(player.megaCredits).to.eq(2);
    });
});
