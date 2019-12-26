
import { expect } from "chai";
import { ColonizerTrainingCamp } from "../../src/cards/ColonizerTrainingCamp";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("ColonizerTrainingCamp", function () {
    it("Can't play", function () {
        const card = new ColonizerTrainingCamp();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(game.getOxygenLevel()).to.eq(6);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ColonizerTrainingCamp();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2); 
    });
});
