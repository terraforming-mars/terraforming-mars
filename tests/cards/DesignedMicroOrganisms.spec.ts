
import { expect } from "chai";
import { DesignedMicroOrganisms } from "../../src/cards/DesignedMicroOrganisms";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("DesignedMicroOrganisms", function () {
    it("Should throw", function () {
        const card = new DesignedMicroOrganisms();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        expect(function () { card.play(player, game); }).to.throw("It must be -14C or colder");
    });
    it("Should play", function () {
        const card = new DesignedMicroOrganisms();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(2);
    });
});
