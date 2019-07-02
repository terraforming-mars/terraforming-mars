
import { expect } from "chai";
import { BeamFromAThoriumAsteroid } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("BeamFromAThoriumAsteroid", function () {
    it("Should throw", function () {
        const card = new BeamFromAThoriumAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires a jovian tag");
    });
    it("Should play", function () {
        const card = new BeamFromAThoriumAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        expect(player.heatProduction).to.eq(3);
        expect(player.energyProduction).to.eq(3);
    });
});
