
import { expect } from "chai";
import { NitrophilicMoss } from "../../src/cards/NitrophilicMoss";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("NitrophilicMoss", function () {
    it("Should throw", function () {
        const card = new NitrophilicMoss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires 3 ocean tiles");
        const oceans = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 3; i++) {
            game.addOceanTile(player, oceans[i].id);
        }
        expect(function () { card.play(player, game); }).to.throw("Must have 2 plants");
    });
    it("Should play", function () {
        const card = new NitrophilicMoss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const oceans = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 3; i++) {
            game.addOceanTile(player, oceans[i].id);
        }
        player.plants = 2;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(0);
        expect(player.plantProduction).to.eq(2);
    });
});
