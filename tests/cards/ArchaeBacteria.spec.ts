
import { expect } from "chai";
import { ArchaeBacteria } from "../../src/cards/ArchaeBacteria";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ArchaeBacteria", function () {
    it("Should throw while playing", function () {
        const card = new ArchaeBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        expect(function () { card.play(player, game); }).to.throw("It must be -18C or colder.");
    });
    it("Should play", function () {
        const card = new ArchaeBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(player.plantProduction).to.eq(1);
    });
});
