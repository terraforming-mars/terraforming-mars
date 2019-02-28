
import { expect } from "chai";
import { AsteroidMining } from "../../src/cards/AsteroidMining";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AsteroidMining", function () {
    it("Should play", function () {
        const card = new AsteroidMining();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(2);
    });
});
