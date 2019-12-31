
import { expect } from "chai";
import { MethaneFromTitan } from "../../src/cards/MethaneFromTitan";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("MethaneFromTitan", function () {
    it("Should throw", function () {
        const card = new MethaneFromTitan();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MethaneFromTitan();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseOxygenLevel(player, 2); // 2
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
        expect(player.plantProduction).to.eq(2);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
    });
});
