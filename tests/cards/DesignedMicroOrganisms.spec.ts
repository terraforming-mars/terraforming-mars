
import { expect } from "chai";
import { DesignedMicroOrganisms } from "../../src/cards/DesignedMicroOrganisms";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("DesignedMicroOrganisms", function () {
    it("Can't play", function () {
        const card = new DesignedMicroOrganisms();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new DesignedMicroOrganisms();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(2);
    });
});
