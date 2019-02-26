
import { expect } from "chai";
import { AerobrakedAmmoniaAsteroid } from "../../src/cards/AerobrakedAmmoniaAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Ants } from "../../src/cards/Ants";

describe("AerobrakedAmmoniaAsteroid", function () {
    it("Should play", function () {
        const card = new AerobrakedAmmoniaAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(player.heatProduction).to.eq(3);
        expect(player.plantProduction).to.eq(1);
        expect(action).not.to.eq(undefined);
        const selectedCard = new Ants();
        action.cb([selectedCard]);
        expect(selectedCard.microbes).to.eq(2);
    });
});
