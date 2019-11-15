
import { expect } from "chai";
import { AsteroidMining } from "../../src/cards/AsteroidMining";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";

describe("AsteroidMining", function () {
    it("Should play", function () {
        const card = new AsteroidMining();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(2);
    });
});
