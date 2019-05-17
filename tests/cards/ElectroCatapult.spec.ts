
import { expect } from "chai";
import { ElectroCatapult } from "../../src/cards/ElectroCatapult";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("ElectroCatapult", function () {
    it("Can't play", function () {
        const card = new ElectroCatapult();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        game.increaseOxygenLevel(player, 2); // 8
        game.increaseOxygenLevel(player, 1); // 9
        expect(game.getOxygenLevel()).to.eq(9);
        expect(card.canPlay(player, game)).to.eq(false); 
    });
    it("Should play", function () {
        const card = new ElectroCatapult();
        const player = new Player("test", Color.BLUE, false);
        player.energyProduction = 1;
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(0);
        expect(player.victoryPoints).to.eq(1);
    });
    it("Should act", function () {
        const card = new ElectroCatapult();
        const player = new Player("test", Color.BLUE, false);
        player.plants = 1;
        player.steel = 1;
        const action = card.action(player);
        expect(action).not.to.eq(undefined);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action!.options.length).to.eq(2);
        action!.options[0].cb();
        expect(player.plants).to.eq(0);
        expect(player.megaCredits).to.eq(7);
        action!.options[1].cb();
        expect(player.steel).to.eq(0);
        expect(player.megaCredits).to.eq(14);
    });
});
