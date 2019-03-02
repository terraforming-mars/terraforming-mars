
import { expect } from "chai";
import { ColonizerTrainingCamp } from "../../src/cards/ColonizerTrainingCamp";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ColonizerTrainingCamp", function () {
    it("Should throw", function () {
        const card = new ColonizerTrainingCamp();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(game.getOxygenLevel()).to.eq(6);
        expect(function () { card.play(player, game); }).to.throw("Oxygen must be 5% or less.");
    });
    it("Should play", function () {
        const card = new ColonizerTrainingCamp();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(2); 
    });
});
