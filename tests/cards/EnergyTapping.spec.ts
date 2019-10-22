
import { expect } from "chai";
import { EnergyTapping } from "../../src/cards/EnergyTapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("EnergyTapping", function () {
    it("Should throw", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        //expect(action).not.to.eq(undefined);
        if (action !== undefined) {        
            expect(action instanceof SelectPlayer).to.eq(true);
            expect(function () { action.cb(player); }).to.throw("Selected player has no energy production");
        }
    });
    it("Should play", function () {
        const card = new EnergyTapping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        //expect(action).not.to.eq(undefined);
        if (action !== undefined) {
            expect(action instanceof SelectPlayer).to.eq(true);
            player.energyProduction = 1;
            action.cb(player);
            expect(player.energyProduction).to.eq(1);
            expect(player.victoryPoints).to.eq(-1);
        }
    });
});
