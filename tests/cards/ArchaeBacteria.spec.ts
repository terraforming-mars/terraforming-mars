
import { expect } from "chai";
import { ArchaeBacteria } from "../../src/cards/ArchaeBacteria";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("ArchaeBacteria", function () {
    it("Can't play", function () {
        const card = new ArchaeBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ArchaeBacteria();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});
