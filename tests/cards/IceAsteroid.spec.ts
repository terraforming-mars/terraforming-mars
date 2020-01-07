
import { expect } from "chai";
import { IceAsteroid } from "../../src/cards/IceAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils";
import * as constants from "../../src/constants";

describe("IceAsteroid", function () {
    it("Can play", function () {
        const card = new IceAsteroid();
        expect(card.canPlay()).to.eq(true);
    });
    it("Should play", function () {
        const card = new IceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        const subAction = action!.cb(game.board.getAvailableSpacesForOcean(player)[0]);
        expect(subAction).not.to.eq(undefined);
        expect(game.board.getOceansOnBoard()).to.eq(1);
        subAction!.cb(game.board.getAvailableSpacesForOcean(player)[0]);
        expect(game.board.getOceansOnBoard()).to.eq(2);
    });
    it("Places no oceans", function () {
        const card = new IceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        maxOutOceans(player, game);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Places one ocean", function () {
        const card = new IceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        maxOutOceans(player, game, constants.MAX_OCEAN_TILES - 1);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        const subAction = action!.cb(game.board.getAvailableSpacesForOcean(player)[0]);
        expect(subAction).to.eq(undefined);
        expect(game.noOceansAvailable()).to.eq(true);
    });
});
