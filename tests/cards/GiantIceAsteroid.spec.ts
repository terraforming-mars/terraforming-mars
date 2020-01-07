
import { expect } from "chai";
import { GiantIceAsteroid } from "../../src/cards/GiantIceAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { ProtectedHabitats } from "../../src/cards/ProtectedHabitats";
import { maxOutOceans } from "../TestingUtils";

describe("GiantIceAsteroid", function () {
    it("Can play", function () {
        const card = new GiantIceAsteroid();
        expect(card.canPlay()).to.eq(true);
    });
    it("Should play", function () {
        const card = new GiantIceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);
        player2.plants = 6;
        player3.plants = 16;

        const action = card.play(player, game) as AndOptions;
        expect(action).not.to.eq(undefined);
        expect(action instanceof AndOptions).to.eq(true);
        action.options[0].cb(player2);
        expect(player2.plants).to.eq(0);
        action.options[1].cb(game.board.getAvailableSpacesForOcean(player)[0]);
        action.options[2].cb(game.board.getAvailableSpacesForOcean(player)[1]);
        expect(game.board.getOceansOnBoard()).to.eq(2);
        action.cb();
        expect(game.getTemperature()).to.eq(-26);
    });

    it("Provides no actions if nothing to do", function () {
        const card = new GiantIceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);
        player2.plants = 6;
        player3.plants = 16;
        player3.playedCards.push(new ProtectedHabitats());

        maxOutOceans(player3, game);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(game.board.getOceansOnBoard()).to.eq(9);
        expect(game.getTemperature()).to.eq(-26);
    });
});

