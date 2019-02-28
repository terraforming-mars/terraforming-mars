
import { expect } from "chai";
import { ArcticAlgae } from "../../src/cards/ArcticAlgae";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ArcticAlgae", function () {
    it("Should throw while playing", function () {
        const card = new ArcticAlgae();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 1); // -10
        expect(function () { card.play(player, game); }).to.throw("It must be -12C or colder to play");
    });
    it("Should play", function () {
        const card = new ArcticAlgae();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(player.plants).to.eq(1);
        game.addOceanTile(player, game.getAvailableSpacesForOcean(player)[0].id);
        expect(player.plants).to.eq(3); 
    });
});
